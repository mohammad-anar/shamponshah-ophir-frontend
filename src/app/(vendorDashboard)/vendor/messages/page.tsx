"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  DollarSign, 
  Sparkles,
  PlusCircle,
  Clock,
  UserCheck,
  Wifi,
  Loader2,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetUserConversationsQuery, 
  useGetConversationMessagesQuery, 
  useLazyGetConversationMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation
} from "@/redux/service/messages/messagesApi";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { useAppSelector } from "@/redux/hooks/hooks";
import SendOfferModal from "@/components/vendor/SendOfferModal";

interface ClientConv {
  id: string;
  orderId?: string;
  clientId?: string;
  clientUserId?: string;
  clientName: string;
  clientAvatar: string;
  eventName: string;
  eventDate: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  online: boolean;
  budget: string;
  orderStatus?: string;
}

interface Message {
  id: string;
  sender: "vendor" | "client";
  text: string;
  time: string;
  attachment?: {
    name: string;
    size: string;
  };
  isOffer?: {
    title: string;
    amount: number;
    milestones: number;
    status: string;
  };
}

function VendorMessagesContent() {
  const searchParams = useSearchParams();
  const queryClientId = searchParams?.get("userId") || searchParams?.get("clientId") || searchParams?.get("clientUserId");
  const queryClientName = searchParams?.get("name") || searchParams?.get("clientName");
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

  const [conversations, setConversations] = useState<ClientConv[]>([]);
  const [activeConv, setActiveConv] = useState<ClientConv | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

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

  // Reset state when user logs out or switches accounts
  useEffect(() => {
    if (prevUserIdRef.current && prevUserIdRef.current !== currentUserId) {
      setActiveConv(null);
      setConversations([]);
      setMessages([]);
      setPage(1);
      setHasMore(false);
      hasInitiatedRef.current = false;
      refetchConversations();
    }
    prevUserIdRef.current = currentUserId || null;
  }, [currentUserId, refetchConversations]);

  // 1. Connect to Socket.IO
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
      setIsSocketConnected(true);
      if (activeConv?.id) {
        socketInstance.emit("join_conversation", { conversationId: activeConv.id });
      }
    });

    socketInstance.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socketInstance.on("new_message", (incoming: any) => {
      if (activeConv?.id && incoming.conversationId === activeConv.id) {
        setMessages((prev) => {
          // If this message already exists by id, ignore duplicate
          if (prev.some((m) => m.id === incoming.id)) return prev;

          const isMe =
            incoming.isMe === true ||
            (currentUserId && incoming.senderId === currentUserId) ||
            incoming.sender === "vendor" ||
            incoming.senderName === "You";

          // If this was sent by me, reconcile with existing optimistic temp message or avoid duplicate
          if (isMe) {
            const tempIdx = prev.findIndex(
              (m) => (m.id.startsWith("temp-") || m.id.startsWith("m-") || m.text === incoming.content)
            );
            if (tempIdx !== -1) {
              const updated = [...prev];
              updated[tempIdx] = {
                ...updated[tempIdx],
                id: incoming.id,
                time: incoming.time || updated[tempIdx].time,
              };
              return updated;
            }
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && (lastMsg.text === incoming.content || lastMsg.id === incoming.id)) {
              return prev;
            }
          }

          return [
            ...prev,
            {
              id: incoming.id || `m-${Date.now()}`,
              sender: isMe ? "vendor" : "client",
              text: incoming.content,
              time: incoming.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ];
        });

        shouldAutoScrollRef.current = true;
        requestAnimationFrame(() => {
          scrollToBottom("smooth");
        });
        refetchConversations();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [activeConv?.id, currentUserId, currentToken, refetchConversations]);

  // 2. Join room on active conversation change
  useEffect(() => {
    if (socket && isSocketConnected && activeConv?.id) {
      socket.emit("join_conversation", { conversationId: activeConv.id });
    }
  }, [socket, isSocketConnected, activeConv?.id]);

  // 3. Map real conversations from API
  useEffect(() => {
    const rawConvs = (apiConversations as any)?.data || (Array.isArray(apiConversations) ? apiConversations : []);
    if (Array.isArray(rawConvs)) {
      const mapped: ClientConv[] = rawConvs.map((c: any) => {
        const peer = c.peer || c.otherParticipant || {};
        const clientName = peer.name || peer.businessName || "Verified Client";
        const clientAvatar = peer.avatarUrl || clientName.slice(0, 2).toUpperCase();

        return {
          id: c.id,
          orderId: c.orderId,
          clientId: peer.id,
          clientUserId: peer.id,
          clientName,
          clientAvatar,
          eventName: c.order?.gig?.title || c.order?.job?.title || "Event Milestone Engagement",
          eventDate: c.order?.eventDate ? new Date(c.order.eventDate).toLocaleDateString() : "Active Engagement",
          budget: c.order?.grandTotal
            ? `$${Number(c.order.grandTotal).toLocaleString()}`
            : c.order?.subtotal
            ? `$${Number(c.order.subtotal).toLocaleString()}`
            : "$800 - $1,500",
          lastMessage: c.lastMessage?.content || "Conversation opened",
          lastTime: c.lastMessage?.createdAt
            ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : c.updatedAt
            ? new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Today",
          unreadCount: c.unreadCount || 0,
          online: true,
          orderStatus: c.orderId ? `Order #${c.orderId.slice(-6).toUpperCase()} Active` : undefined,
        };
      });

      setConversations(mapped);

      // Handle query parameters (conv, userId, orderId)
      if (queryConvId) {
        const found = mapped.find((item) => item.id === queryConvId);
        if (found) {
          setActiveConv(found);
          return;
        }
      }

      if (queryClientId || queryOrderId) {
        const found = mapped.find((item) => {
          if (queryOrderId && item.orderId === queryOrderId) return true;
          if (queryClientId && (item.clientId === queryClientId || item.clientUserId === queryClientId)) return true;
          return false;
        });

        if (found) {
          setActiveConv(found);
          return;
        }
      }

      if (!activeConv && mapped.length > 0) {
        setActiveConv(mapped[0]);
      }
    }
  }, [apiConversations, queryConvId, queryClientId, queryOrderId]);

  // 4. If vendor arrives with userId or orderId and conversation doesn't exist yet, initiate it!
  useEffect(() => {
    if (!queryClientId && !queryOrderId) return;
    if (hasInitiatedRef.current) return;

    // Check if it already exists in loaded conversations
    const found = conversations.find((item) => {
      if (queryOrderId && item.orderId === queryOrderId) return true;
      if (queryClientId && (item.clientId === queryClientId || item.clientUserId === queryClientId)) return true;
      return false;
    });

    if (!found && (queryClientId || queryOrderId)) {
      hasInitiatedRef.current = true;
      startConversationMutation({
        recipientUserId: queryClientId || undefined,
        orderId: queryOrderId || undefined,
        initialMessage: queryClientName
          ? `Hello ${queryClientName}! I am connecting with you regarding your event requirements.`
          : `Hello! I am connecting with you regarding your event requirements.`,
      })
        .unwrap()
        .then((newConvRes: any) => {
          refetchConversations();
          const conv = newConvRes?.data || newConvRes;
          if (conv?.id) {
            const peer = conv.participants?.find((p: any) => p.userId !== currentUser?.userId)?.user || {};
            const clientName = peer.clientProfile?.displayName || queryClientName || "Verified Client";
            const createdConv: ClientConv = {
              id: conv.id,
              orderId: conv.orderId || queryOrderId || undefined,
              clientId: peer.id || queryClientId,
              clientUserId: peer.id || queryClientId,
              clientName,
              clientAvatar: (clientName || "CL").slice(0, 2).toUpperCase(),
              eventName: "Milestone Collaboration",
              eventDate: "Upcoming",
              budget: "$800 - $1,500",
              lastMessage: "Conversation initiated",
              lastTime: "Just now",
              unreadCount: 0,
              online: true,
              orderStatus: conv.orderId ? `Order #${conv.orderId.slice(-6).toUpperCase()} Active` : undefined,
            };
            setActiveConv(createdConv);
          }
        })
        .catch((err: any) => {
          console.error("Failed to start new conversation:", err);
        });
    }
  }, [queryClientId, queryOrderId, queryClientName, conversations, currentUser?.userId, startConversationMutation, refetchConversations]);

  // 5. Query messages for active conversation
  const { data: convMessagesData, refetch: refetchMessages } = useGetConversationMessagesQuery(
    activeConv?.id ? { conversationId: activeConv.id, page: 1, limit: 20 } : "",
    {
      skip: !activeConv?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (!convMessagesData) return;
    const raw = (convMessagesData as any)?.data || convMessagesData;
    const rawMsgs = Array.isArray(raw) ? raw : (raw?.messages || []);
    const more = raw?.hasMore ?? false;

    setHasMore(more);
    setPage(raw?.page || 1);

    if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
      const mapped: Message[] = rawMsgs.map((m: any) => {
        const isVendor =
          m.isMe !== undefined
            ? m.isMe
            : currentUserId
            ? m.senderId === currentUserId
            : m.sender?.role === "VENDOR";

        return {
          id: m.id,
          sender: isVendor ? "vendor" : "client",
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      });
      setMessages(mapped);
      shouldAutoScrollRef.current = true;
    } else {
      setMessages([]);
    }
  }, [convMessagesData, currentUserId]);

  // Auto-scroll to bottom by default on initial message load or conversation switch
  useEffect(() => {
    if (messages.length > 0 && shouldAutoScrollRef.current) {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, activeConv?.id]);

  // Reverse scroll pagination handler
  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    shouldAutoScrollRef.current = isNearBottom;

    if (container.scrollTop <= 40 && !isLoadingOlder && hasMore && activeConv?.id) {
      setIsLoadingOlder(true);
      const nextPage = page + 1;
      const prevScrollHeight = container.scrollHeight;

      try {
        const res = await fetchMoreMessages({
          conversationId: activeConv.id,
          page: nextPage,
          limit: 20,
        }).unwrap();

        const raw = res?.data || res;
        const olderList = Array.isArray(raw) ? raw : (raw?.messages || []);
        const nextHasMore = raw?.hasMore ?? false;

        if (olderList.length > 0) {
          const mappedOlder: Message[] = olderList.map((m: any) => {
            const isVendor =
              m.isMe !== undefined
                ? m.isMe
                : currentUserId
                ? m.senderId === currentUserId
                : m.sender?.role === "VENDOR";

            return {
              id: m.id,
              sender: isVendor ? "vendor" : "client",
              text: m.content,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          });

          setMessages((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueOlder = mappedOlder.filter((item) => !existingIds.has(item.id));
            return [...uniqueOlder, ...prev];
          });

          setPage(nextPage);
          setHasMore(nextHasMore);

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

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv?.id) return;

    const sentText = inputMessage.trim();
    setInputMessage("");

    const tempId = `m-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: Message = {
      id: tempId,
      sender: "vendor",
      text: sentText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    shouldAutoScrollRef.current = true;
    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });

    try {
      const res = await sendMessageMutation({
        conversationId: activeConv.id,
        content: sentText,
      }).unwrap();

      if (res?.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: res.id } : m))
        );
      }
      refetchConversations();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  const handleOfferSent = (offer: any) => {
    const offerMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "vendor",
      text: `Submitted official custom milestone offer: ${offer.title}`,
      time: "Just now",
      isOffer: {
        title: offer.title,
        amount: offer.price,
        milestones: 2,
        status: "Sent to Client",
      },
    };
    setMessages((prev) => [...prev, offerMsg]);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row bg-[#121418] border border-[#26282E] rounded-2xl shadow-xl overflow-hidden">
      {/* Left Sidebar: Client Conversations */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#26282E] flex flex-col bg-[#121418]">
        <div className="p-4 border-b border-[#26282E] bg-[#121418]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold text-white">Client Messages</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSocketConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isSocketConnected ? "Socket Live" : "Connecting"}
              </span>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16181F] border border-[#26282E] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C] focus:bg-[#1A1D24] transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#26282E] custom-scrollbar">
          {isConvLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#DFB76C]" />
              <span className="text-xs">Loading conversations...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="font-bold text-slate-300 text-xs">No active conversations</p>
              <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                When clients message you or order your services, conversations will appear here.
              </p>
              <Link
                href="/vendor/orders"
                className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-[#16181F] border border-[#26282E] text-[#DFB76C] text-xs font-bold hover:bg-[#1E222B] transition-colors"
              >
                Go to Orders
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isActive ? "bg-[#1A1D24] border-l-4 border-l-[#DFB76C]" : "hover:bg-[#16181F] bg-[#121418]"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-900 border border-[#26282E] text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
                      {conv.clientAvatar.startsWith("http") ? (
                        <img src={conv.clientAvatar} alt={conv.clientName} className="w-full h-full object-cover" />
                      ) : (
                        conv.clientAvatar
                      )}
                    </div>
                    {conv.online && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#121418] absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white truncate">{conv.clientName}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{conv.lastTime}</span>
                    </div>

                    <p className="text-[11px] text-[#DFB76C] truncate mt-0.5 font-semibold">{conv.eventName}</p>
                    <p className="text-xs text-slate-300 truncate mt-1">{conv.lastMessage}</p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#26282E] text-[10px] text-slate-400">
                      <span>Budget: <strong className="text-white">{conv.budget}</strong></span>
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#DFB76C] text-[#0B0C0E] font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Side: Active Chat Studio */}
      <div className="flex-1 flex flex-col bg-[#0B0C0E]">
        {activeConv ? (
          <>
            {/* Active Header */}
            <div className="p-4 border-b border-[#26282E] flex items-center justify-between bg-[#121418]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-900 border border-[#26282E] text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden">
                  {activeConv.clientAvatar.startsWith("http") ? (
                    <img src={activeConv.clientAvatar} alt={activeConv.clientName} className="w-full h-full object-cover" />
                  ) : (
                    activeConv.clientAvatar
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">{activeConv.clientName}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#1A1D24] border border-[#DFB76C]/30 text-[#DFB76C] text-[10px] font-bold">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>{activeConv.eventName}</span>
                    <span>&bull;</span>
                    <span className="text-slate-300 font-bold">{activeConv.eventDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#0B0C0E]" /> Create Custom Offer
                </button>
                {activeConv.orderId && (
                  <Link
                    href={`/vendor/orders`}
                    className="p-2 rounded-lg border border-[#26282E] text-slate-400 hover:text-white hover:bg-[#16181F]"
                    title="View Linked Order"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#DFB76C]" />
                  </Link>
                )}
              </div>
            </div>

            {/* Escrow 100% Payout Notice */}
            <div className="px-4 py-2 bg-[#16181F] border-b border-[#26282E] flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Vendors keep <strong className="text-white">100% of price</strong>. Guaranteed payout upon client milestone approval.</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Socket.IO Real-time Room</span>
            </div>

            {/* Message Stream with Reverse Scroll Pagination */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-[#0B0C0E]"
            >
              {/* Older messages loading indicator */}
              {isLoadingOlder && (
                <div className="py-2 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-[#DFB76C]" />
                  <span>Loading previous messages...</span>
                </div>
              )}

              {hasMore && !isLoadingOlder && (
                <div className="text-center py-1">
                  <button
                    onClick={handleScroll}
                    className="text-[11px] font-semibold text-[#DFB76C] hover:underline bg-[#16181F] px-3 py-1 rounded-full border border-[#26282E]"
                  >
                    Scroll up to load previous messages
                  </button>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-2">
                  <Sparkles className="w-8 h-8 text-[#DFB76C]" />
                  <p className="font-bold text-white text-sm">Conversation Started</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Send your first message to discuss deliverables, quotes, and timeline with {activeConv.clientName}.
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isVendor = m.sender === "vendor";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isVendor ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
                        {!isVendor && (
                          <div className="w-7 h-7 rounded-full bg-purple-900 border border-[#26282E] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mb-1">
                            {activeConv.clientAvatar}
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs space-y-2 shadow-xs ${
                            isVendor
                              ? "bg-[#1E222B] text-white border border-[#DFB76C]/30 rounded-br-xs"
                              : "bg-[#16181F] text-slate-200 border border-[#26282E] rounded-bl-xs"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                          {m.isOffer && (
                            <div className="p-3 bg-[#121418] text-white rounded-xl space-y-2 border border-[#DFB76C]/40 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFB76C]">Custom Offer Sent</span>
                                <span className="text-xs font-black text-white">${m.isOffer.amount}</span>
                              </div>
                              <p className="font-bold text-xs">{m.isOffer.title}</p>
                              <p className="text-[10px] text-slate-400">Status: {m.isOffer.status}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                        {m.time} {isVendor && <CheckCheck className="w-3 h-3 text-[#DFB76C]" />}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-[#26282E] bg-[#121418]">
              {showEmojiPicker && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-[#16181F] border border-[#26282E] rounded-xl overflow-x-auto">
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
                  className="p-2 text-slate-400 hover:text-[#DFB76C] rounded-lg hover:bg-[#16181F] cursor-pointer disabled:opacity-50"
                >
                  {isUploadingAttachment ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#DFB76C]" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="text"
                  placeholder={`Reply to ${activeConv.clientName}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#16181F] border border-[#26282E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C] focus:bg-[#1A1D24] transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Insert celebratory emoji"
                  className="p-2 text-slate-400 hover:text-[#DFB76C] rounded-lg hover:bg-[#16181F] hidden sm:block cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] disabled:opacity-40 text-[#0B0C0E] rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#0B0C0E]" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#0B0C0E]">
            <div className="w-14 h-14 rounded-2xl bg-[#16181F] text-[#DFB76C] border border-[#26282E] flex items-center justify-center">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-white">No Conversation Selected</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Select a conversation from the sidebar or click "Message" on any active order to start chatting live via Socket.IO.
            </p>
            <Link
              href="/vendor/orders"
              className="px-4 py-2 bg-[#DFB76C] text-[#0B0C0E] rounded-xl text-xs font-bold hover:bg-[#ECC870] transition-colors shadow-sm cursor-pointer"
            >
              Browse Orders
            </Link>
          </div>
        )}
      </div>

      {/* Send Offer Modal */}
      {activeConv && (
        <SendOfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          jobTitle={`${activeConv.eventName} - Custom Service`}
          clientName={activeConv.clientName}
          onOfferSent={handleOfferSent}
        />
      )}
    </div>
  );
}

export default function VendorMessagesPage() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-400 text-xs">Loading conversations...</div>}>
      <VendorMessagesContent />
    </Suspense>
  );
}
