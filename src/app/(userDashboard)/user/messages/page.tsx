"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  CheckCheck, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Star,
  MessageSquare,
  Users2,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetUserConversationsQuery, 
  useGetConversationMessagesQuery, 
  useLazyGetConversationMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} from "@/redux/service/messages/messagesApi";
import { useGetMeQuery } from "@/redux/service/auth/authApi";

import { useAppSelector } from "@/redux/hooks/hooks";

interface ConversationItem {
  id: string;
  orderId?: string;
  vendorId?: string;
  vendorUserId?: string;
  vendorName: string;
  vendorAvatar: string;
  serviceCategory: string;
  rating: number;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  online: boolean;
  orderStatus?: string;
}

interface MessageItem {
  id: string;
  sender: "user" | "vendor";
  text: string;
  time: string;
  isMe?: boolean;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const queryVendorId = searchParams?.get("userId") || searchParams?.get("vendorId") || searchParams?.get("vendorUserId");
  const queryVendorName = searchParams?.get("vendorName") || searchParams?.get("name");
  const queryCategory = searchParams?.get("category");
  const queryOrderId = searchParams?.get("orderId");
  const queryConvId = searchParams?.get("conv");

  const currentUser = useAppSelector((state) => state.auth?.user);
  const currentToken = useAppSelector((state) => state.auth?.accessToken);
  const { data: meData } = useGetMeQuery();
  const currentUserId =
    currentUser?.userId ||
    (currentUser as any)?.id ||
    (currentUser as any)?.sub ||
    (meData as any)?.id ||
    (meData as any)?.data?.id;

  const { data: apiConversations, isLoading: isConvLoading, refetch: refetchConversations } = useGetUserConversationsQuery(
    currentUserId || undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [startConversationMutation] = useStartConversationMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [fetchMoreMessages, { isFetching: isFetchingOlder }] = useLazyGetConversationMessagesQuery();

  const [selectedConvId, setSelectedConvId] = useState<string | null>(queryConvId || null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAttachment(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4005/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setInputMessage((prev) => (prev ? `${prev} ${data.url}` : data.url));
        toast.success("Attachment uploaded! Click Send to deliver.");
      } else {
        toast.error("Failed to upload attachment");
      }
    } catch {
      toast.error("Failed to upload attachment file");
    } finally {
      setIsUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const hasInitiatedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevUserIdRef = useRef<string | null>(currentUserId || null);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // Reset chat completely when user logs out or switches accounts
  useEffect(() => {
    if (prevUserIdRef.current && prevUserIdRef.current !== currentUserId) {
      setSelectedConvId(null);
      setMessages([]);
      setPage(1);
      setHasMore(false);
      hasInitiatedRef.current = false;
      refetchConversations();
    }
    prevUserIdRef.current = currentUserId || null;
  }, [currentUserId, refetchConversations]);

  // Parse conversations from API
  const rawList = Array.isArray(apiConversations) ? apiConversations : (apiConversations?.data || []);
  const conversations: ConversationItem[] = rawList.map((c: any) => {
    const peer = c.peer || c.otherParticipant || {};
    const peerName = peer.name || peer.businessName || "Vendor Partner";
    const peerAvatar = peer.avatarUrl || (peerName || "VP").slice(0, 2).toUpperCase();

    return {
      id: c.id,
      orderId: c.orderId,
      vendorId: peer.vendorProfileId || peer.id,
      vendorUserId: peer.id,
      vendorName: peerName,
      vendorAvatar: peerAvatar,
      serviceCategory: c.order?.gig?.title || c.order?.job?.title || queryCategory || "Milestone Event Service",
      rating: 5.0,
      lastMessage: c.lastMessage?.content || "Conversation initiated",
      lastTime: c.lastMessage?.createdAt
        ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unreadCount: c.unreadCount || 0,
      online: true,
      orderStatus: c.orderId ? `Order #${c.orderId.slice(-6).toUpperCase()} Active` : undefined,
    };
  });

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;

  // Initialize socket.io connection
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1";
    const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL || apiUrl.replace(/\/api\/v1\/?$/, "");

    const socketInstance: Socket = io(socketBase, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: { token: currentToken },
    });

    socketInstance.on("connect", () => {
      setSocketConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setSocketConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentToken]);

  // Handle URL query parameters to select or start real conversation with vendor
  useEffect(() => {
    if (!queryVendorId && !queryVendorName && !queryConvId && !queryOrderId) {
      if (conversations.length > 0 && !selectedConvId) {
        setSelectedConvId(conversations[0].id);
      }
      return;
    }

    if (queryConvId) {
      setSelectedConvId(queryConvId);
      return;
    }

    // Check if conversation already exists in loaded list
    const found = conversations.find((c) => {
      if (queryOrderId && c.orderId === queryOrderId) return true;
      if (queryVendorId && (c.vendorId === queryVendorId || c.vendorUserId === queryVendorId)) return true;
      if (queryVendorName && c.vendorName.toLowerCase().includes(queryVendorName.toLowerCase())) return true;
      return false;
    });

    if (found) {
      setSelectedConvId(found.id);
    } else if (!hasInitiatedRef.current && (queryVendorId || queryOrderId)) {
      hasInitiatedRef.current = true;
      startConversationMutation({
        recipientUserId: queryVendorId || undefined,
        orderId: queryOrderId || undefined,
        initialMessage: queryVendorName
          ? `Hi ${queryVendorName}! I am connecting with you regarding event services.`
          : `Hi! I am connecting with you regarding event services.`,
      })
        .unwrap()
        .then((newConv: any) => {
          refetchConversations();
          const conv = newConv?.data || newConv;
          if (conv?.id) {
            setSelectedConvId(conv.id);
          }
        })
        .catch((err) => {
          console.error("Failed to start conversation:", err);
        });
    }
  }, [queryVendorId, queryVendorName, queryConvId, queryOrderId, conversations.length]);

  // Join current conversation room on socket & listen for incoming real-time messages
  useEffect(() => {
    if (!socket || !selectedConvId) return;

    socket.emit("join_conversation", { conversationId: selectedConvId });

    const onNewMessage = (msg: any) => {
      if (msg.conversationId === selectedConvId) {
        setMessages((prev) => {
          // If this message already exists by id, ignore duplicate
          if (prev.some((m) => m.id === msg.id)) return prev;

          const isMe =
            msg.isMe === true ||
            (currentUserId && msg.senderId === currentUserId) ||
            msg.sender === "user" ||
            msg.senderName === "You";

          // If this was sent by me, reconcile with existing optimistic temp message or avoid duplicate
          if (isMe) {
            const tempIdx = prev.findIndex(
              (m) => (m.id.startsWith("temp-") || m.id.startsWith("m-") || m.text === msg.content)
            );
            if (tempIdx !== -1) {
              const updated = [...prev];
              updated[tempIdx] = {
                ...updated[tempIdx],
                id: msg.id,
                time: msg.time || updated[tempIdx].time,
              };
              return updated;
            }
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && (lastMsg.text === msg.content || lastMsg.id === msg.id)) {
              return prev;
            }
          }

          return [
            ...prev,
            {
              id: msg.id,
              sender: isMe ? "user" : "vendor",
              text: msg.content,
              time: msg.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isMe,
              senderId: msg.senderId,
              senderName: msg.senderName,
              senderAvatar: msg.senderAvatar,
            },
          ];
        });

        shouldAutoScrollRef.current = true;
        requestAnimationFrame(() => {
          scrollToBottom("smooth");
        });
        refetchConversations();
      }
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.emit("leave_conversation", { conversationId: selectedConvId });
      socket.off("new_message", onNewMessage);
    };
  }, [socket, selectedConvId, currentUserId, refetchConversations]);

  // Reset pagination when selected conversation changes
  useEffect(() => {
    setPage(1);
    setHasMore(false);
    shouldAutoScrollRef.current = true;
  }, [selectedConvId]);

  // Fetch initial page 1 messages for the selected conversation from backend
  const { data: convMessagesData } = useGetConversationMessagesQuery(
    selectedConvId ? { conversationId: selectedConvId, page: 1, limit: 20 } : "",
    {
      skip: !selectedConvId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Sync initial loaded messages into state
  useEffect(() => {
    if (!convMessagesData) return;
    const raw = convMessagesData?.data || convMessagesData;
    const list = Array.isArray(raw) ? raw : (raw?.messages || []);
    const more = raw?.hasMore ?? false;

    setHasMore(more);
    setPage(raw?.page || 1);

    if (list.length > 0) {
      const mapped: MessageItem[] = list.map((m: any) => {
        const isMe =
          m.isMe === true ||
          (currentUserId && m.senderId === currentUserId) ||
          m.sender === "user";

        return {
          id: m.id,
          sender: (isMe ? "user" : "vendor") as "user" | "vendor",
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          senderName: m.senderName,
          senderAvatar: m.senderAvatar,
          isMe,
          senderId: m.senderId,
        };
      });
      setMessages(mapped);
      shouldAutoScrollRef.current = true;
    } else {
      setMessages([]);
    }
  }, [convMessagesData, currentUserId]);

  // Reverse scroll pagination handler: fetches older messages when scrolling to top
  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Keep auto-scroll enabled if user is near bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    shouldAutoScrollRef.current = isNearBottom;

    // Trigger when user scrolls near top (scrollTop <= 40px)
    if (container.scrollTop <= 40 && !isLoadingOlder && hasMore && selectedConvId) {
      setIsLoadingOlder(true);
      const nextPage = page + 1;
      const prevScrollHeight = container.scrollHeight;

      try {
        const res = await fetchMoreMessages({
          conversationId: selectedConvId,
          page: nextPage,
          limit: 20,
        }).unwrap();

        const raw = res?.data || res;
        const olderList = Array.isArray(raw) ? raw : (raw?.messages || []);
        const nextHasMore = raw?.hasMore ?? false;

        if (olderList.length > 0) {
          const mappedOlder: MessageItem[] = olderList.map((m: any) => {
            const isMe =
              m.isMe === true ||
              (currentUserId && m.senderId === currentUserId) ||
              m.sender === "user";

            return {
              id: m.id,
              sender: (isMe ? "user" : "vendor") as "user" | "vendor",
              text: m.content,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              senderName: m.senderName,
              senderAvatar: m.senderAvatar,
              isMe,
              senderId: m.senderId,
            };
          });

          setMessages((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueOlder = mappedOlder.filter((item) => !existingIds.has(item.id));
            return [...uniqueOlder, ...prev];
          });

          setPage(nextPage);
          setHasMore(nextHasMore);

          // Restore exact scroll position so user view does not jump
          requestAnimationFrame(() => {
            if (chatContainerRef.current) {
              const newScrollHeight = chatContainerRef.current.scrollHeight;
              chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
            }
          });
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load older messages", err);
      } finally {
        setIsLoadingOlder(false);
      }
    }
  };

  // Auto-scroll to bottom by default on initial message load or conversation switch
  useEffect(() => {
    if (messages.length > 0 && shouldAutoScrollRef.current) {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, selectedConvId]);

  // Send message through backend API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConvId) return;

    const sentText = inputMessage.trim();
    setInputMessage("");

    const tempId = `temp-${Date.now()}`;
    const msgTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: MessageItem = {
      id: tempId,
      sender: "user",
      text: sentText,
      time: msgTime,
      isMe: true,
      senderId: currentUserId,
    };

    setMessages((prev) => [...prev, newMsg]);
    shouldAutoScrollRef.current = true;
    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });

    try {
      const res = await sendMessageMutation({
        conversationId: selectedConvId,
        content: sentText,
      }).unwrap();

      if (res?.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: res.id } : m))
        );
      }
      refetchConversations();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message to vendor");
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-[#F8F9FD]">
        {/* Header Search */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold text-[#0F0C3B]">Messages</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${socketConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {socketConnected ? "Live Socket" : "Connecting"}
              </span>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600">No Conversations Yet</p>
              <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
                Select a service from your Orders or browse vendors to initiate chat.
              </p>
              <Link
                href="/user/orders"
                className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-brand-primary text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                Go to Orders
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = (selectedConvId || activeConv?.id) === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isActive
                      ? "bg-white border-l-4 border-l-brand-primary shadow-xs"
                      : "hover:bg-slate-100/60"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-xs overflow-hidden">
                      {conv.vendorAvatar.startsWith("http") ? (
                        <img src={conv.vendorAvatar} alt={conv.vendorName} className="w-full h-full object-cover" />
                      ) : (
                        conv.vendorAvatar
                      )}
                    </div>
                    {conv.online && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#0F0C3B] truncate">{conv.vendorName}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{conv.lastTime}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{conv.serviceCategory}</p>
                    <p className="text-xs text-slate-600 truncate mt-1">{conv.lastMessage}</p>

                    {conv.orderStatus && (
                      <div className="mt-2 pt-1 border-t border-slate-100/50">
                        <span className="text-[10px] text-indigo-700 font-bold truncate block">
                          {conv.orderStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Side: Active Chat Studio */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConv ? (
          <>
            {/* Top Active Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden">
                    {activeConv.vendorAvatar.startsWith("http") ? (
                      <img src={activeConv.vendorAvatar} alt={activeConv.vendorName} className="w-full h-full object-cover" />
                    ) : (
                      activeConv.vendorAvatar
                    )}
                  </div>
                  {activeConv.online && (
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[#0F0C3B]">{activeConv.vendorName}</h2>
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="ml-1">{activeConv.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span>{activeConv.serviceCategory}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-600 font-medium">Ophir Verified Vendor</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Security Banner */}
            <div className="px-4 py-2 bg-[#F8F9FD] border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span>
                  Direct conversation with <strong>{activeConv.vendorName}</strong>. Protected by Ophir Payment Protection.
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Encrypted Channel</span>
            </div>

            {/* Chat Messages Stream with Reverse Scroll Pagination */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-[#FAFBFF]"
            >
              {/* Older messages loading indicator */}
              {isLoadingOlder && (
                <div className="py-2 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                  <span>Loading previous messages...</span>
                </div>
              )}

              {hasMore && !isLoadingOlder && (
                <div className="text-center py-1">
                  <button
                    onClick={handleScroll}
                    className="text-[11px] font-semibold text-brand-primary hover:underline bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-100"
                  >
                    Scroll up to load previous messages
                  </button>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No Messages in this Conversation Yet</p>
                  <p className="text-[11px] text-slate-400">
                    Send your first message below to collaborate directly with {activeConv.vendorName}.
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isUser =
                    m.isMe === true ||
                    (currentUserId && m.senderId === currentUserId) ||
                    m.sender === "user";

                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex flex-col w-full",
                        isUser ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-end gap-2 max-w-[85%] md:max-w-[70%]",
                          isUser ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mb-1 overflow-hidden">
                            {activeConv.vendorAvatar.startsWith("http") ? (
                              <img src={activeConv.vendorAvatar} alt={activeConv.vendorName} className="w-full h-full object-cover" />
                            ) : (
                              activeConv.vendorAvatar
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "p-3.5 rounded-2xl text-xs space-y-1 shadow-xs",
                            isUser
                              ? "bg-[#0F0C3B] text-white rounded-br-xs ml-auto"
                              : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs mr-auto"
                          )}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1",
                          isUser ? "justify-end text-right" : "justify-start text-left"
                        )}
                      >
                        {m.time} {isUser && <CheckCheck className="w-3 h-3 text-brand-primary" />}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-slate-200 bg-white">
              {showEmojiPicker && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-[#F8F9FD] border border-slate-200 rounded-xl overflow-x-auto">
                  {["🥂", "✨", "🎉", "💍", "💐", "🙏", "😊", "❤️"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputMessage((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAttachmentUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAttachment}
                  title="Attach photo or document"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  {isUploadingAttachment ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="text"
                  placeholder={`Type message to ${activeConv.vendorName}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#F8F9FD] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                />

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Insert celebratory emoji"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 hidden sm:block cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F0C3B]">Select a conversation</h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Choose an vendor from the list on the left to start collaborating on your event.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center text-xs text-slate-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
          <span>Loading chat studio...</span>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
