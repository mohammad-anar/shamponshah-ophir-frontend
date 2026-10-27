"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Loader2,
  Lock,
  Wifi,
  WifiOff,
  AlertCircle,
  FileText,
  Maximize2,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import {
  useGetOrderMessagesQuery,
  useSendOrderMessageMutation,
  useMarkOrderMessagesReadMutation,
} from "@/redux/service/messages/messagesApi";

interface OrderChatProps {
  order: any;
  className?: string;
}

interface ChatAttachment {
  url: string;
  relativeUrl?: string;
  filename?: string;
  originalName?: string;
  fileType: "IMAGE" | "VIDEO" | "FILE";
  size?: number;
}

interface MessageItem {
  id: string;
  orderId: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  content: string;
  attachments?: string[];
  isRead?: boolean;
  createdAt: string;
  time?: string;
}

export default function OrderChat({ order, className }: OrderChatProps) {
  const orderId = order?.id;
  const isOrderActive =
    order?.status &&
    !["PENDING_PAYMENT", "CANCELLED"].includes(order.status);
  const isPendingPayment = order?.status === "PENDING_PAYMENT";
  const isCancelled = order?.status === "CANCELLED";

  const { data: meData } = useGetMeQuery();
  const me = (meData as any)?.data || meData;
  const currentUserId = me?.id;
  const currentUserRole = me?.role;

  // Socket state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  // Messages & pagination state
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Input & attachments state
  const [inputValue, setInputValue] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [peerTypingName, setPeerTypingName] = useState<string | null>(null);

  // Media preview modal
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: "IMAGE" | "VIDEO" } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Redux API queries & mutations
  const { data: initialMessagesData, isLoading: isQueryLoading, refetch: refetchMessages } =
    useGetOrderMessagesQuery(
      { orderId, page: 1, limit: 30 },
      { skip: !orderId || !isOrderActive }
    );

  const [sendOrderMessageMutation, { isLoading: isSendingApi }] = useSendOrderMessageMutation();
  const [markOrderMessagesReadMutation] = useMarkOrderMessagesReadMutation();

  // Peer details calculation
  const isClient = currentUserRole === "CLIENT" || order?.clientProfile?.userId === currentUserId;
  const peerName = isClient
    ? order?.vendorProfile?.businessName || order?.vendorProfile?.user?.name || "Verified Artisan"
    : order?.clientProfile?.displayName || order?.clientProfile?.user?.name || "Event Client";
  const peerAvatar = isClient
    ? order?.vendorProfile?.avatarUrl
    : order?.clientProfile?.avatarUrl;
  const peerRole = isClient ? "Vendor Artisan" : "Event Client";

  // ── Sync initial DB messages ──────────────────────────────────
  useEffect(() => {
    if (initialMessagesData) {
      const incoming = initialMessagesData?.messages || initialMessagesData?.data?.messages || [];
      const pagination = initialMessagesData?.pagination || initialMessagesData?.data?.pagination;
      setMessages(incoming);
      setHasMore(Boolean(pagination?.hasMore));
      setPage(1);
    }
  }, [initialMessagesData]);

  // ── Auto scroll to bottom ───────────────────────────────────
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length, scrollToBottom]);

  // ── Socket.IO Connection & Room Authorization ───────────────
  useEffect(() => {
    if (!orderId || !isOrderActive) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1";
    const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL || apiUrl.replace(/\/api\/v1\/?$/, "");

    const token =
      Cookies.get("accessToken") ||
      Cookies.get("token") ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : "");

    const socketInstance: Socket = io(socketBase, {
      transports: ["websocket", "polling"],
      auth: { token },
      query: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setSocketError(null);
      // Join order chat room with authorization check on server
      socketInstance.emit("join_order_chat", { orderId, token });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("order_chat_error", (err: any) => {
      setSocketError(err?.message || "Failed to connect to order chat room");
      toast.error(err?.message || "Chat access denied");
    });

    socketInstance.on("joined_order_chat", (payload: any) => {
      setIsConnected(true);
      setSocketError(null);
    });

    // Realtime message incoming
    socketInstance.on("new_order_message", (incomingMsg: MessageItem) => {
      if (incomingMsg.orderId === orderId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === incomingMsg.id)) return prev;
          return [...prev, incomingMsg];
        });

        // If message is from peer, auto mark as read
        if (incomingMsg.senderId !== currentUserId) {
          socketInstance.emit("mark_order_messages_read", { orderId, token });
          markOrderMessagesReadMutation({ orderId }).catch(() => null);
        }
      }
    });

    // Realtime typing indicator
    socketInstance.on("user_typing", (data: { orderId: string; userId: string; userName?: string; isTyping: boolean }) => {
      if (data.orderId === orderId && data.userId !== currentUserId) {
        if (data.isTyping) {
          setPeerTypingName(data.userName || peerName);
        } else {
          setPeerTypingName(null);
        }
      }
    });

    // Realtime read indicator
    socketInstance.on("order_messages_read", (data: { orderId: string; readerId: string }) => {
      if (data.orderId === orderId && data.readerId !== currentUserId) {
        setMessages((prev) =>
          prev.map((m) => (m.senderId === currentUserId ? { ...m, isRead: true } : m))
        );
      }
    });

    // Realtime order status updates (deliver, complete, revision)
    socketInstance.on("order_status_updated", (data: any) => {
      if (data.orderId === orderId) {
        if (data.status === "DELIVERED") {
          toast.success("Order Delivered!", {
            description: "Work and deliverables have been submitted for client review.",
          });
        } else if (data.status === "COMPLETED") {
          toast.success("Order Completed!", {
            description: "Delivery accepted! 7-day security clearing period active.",
          });
        } else if (data.status === "REVISION_REQUESTED") {
          toast.warning("Revision Requested", {
            description: `Client requested modifications: ${data.revisionReason || "Please see order details."}`,
          });
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("order_status_updated", { detail: data }));
        }
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit("leave_order_chat", { orderId });
      socketInstance.disconnect();
    };
  }, [orderId, isOrderActive, currentUserId, peerName, markOrderMessagesReadMutation]);

  // ── Pagination: Load Earlier Messages ───────────────────────
  const handleLoadEarlier = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const oldestMessage = messages[0];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1";
      const token =
        Cookies.get("accessToken") ||
        Cookies.get("token") ||
        (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "");

      const res = await fetch(
        `${apiUrl}/orders/${orderId}/messages?page=${nextPage}&limit=20${
          oldestMessage?.createdAt ? `&before=${encodeURIComponent(oldestMessage.createdAt)}` : ""
        }`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const earlierMessages = data?.messages || data?.data?.messages || [];
        const pagination = data?.pagination || data?.data?.pagination;

        if (earlierMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const filteredNew = earlierMessages.filter((m: MessageItem) => !existingIds.has(m.id));
            return [...filteredNew, ...prev];
          });
          setPage(nextPage);
        }
        setHasMore(Boolean(pagination?.hasMore));
      }
    } catch (err) {
      toast.error("Failed to load earlier messages");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ── Typing broadcast ────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    if (socket && isConnected) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing_start", {
          orderId,
          userName: me?.name || me?.clientProfile?.displayName || me?.vendorProfile?.businessName || "Participant",
        });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing_stop", { orderId });
      }, 2000);
    }
  };

  // ── Secure File Upload (Images & Videos) ─────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File is too large. Maximum allowed size is 50MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate type
    const mime = file.type.toLowerCase();
    const isImage = mime.startsWith("image/");
    const isVideo = mime.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Invalid file type. Please upload images (JPG, PNG, WebP, GIF) or videos (MP4, WebM, MOV).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1";
      const token =
        Cookies.get("accessToken") ||
        Cookies.get("token") ||
        (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "");

      const res = await fetch(`${apiUrl}/upload/chat`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Upload failed");
      }

      const uploadedUrl = data.url || `${apiUrl.replace(/\/api\/v1\/?$/, "")}${data.relativeUrl}`;
      const attachment: ChatAttachment = {
        url: uploadedUrl,
        relativeUrl: data.relativeUrl,
        filename: data.filename,
        originalName: data.originalName || file.name,
        fileType: isVideo ? "VIDEO" : "IMAGE",
        size: file.size,
      };

      setPendingAttachments((prev) => [...prev, attachment]);
      toast.success(`${isVideo ? "Video" : "Image"} uploaded & attached`);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Send Message ────────────────────────────────────────────
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed && pendingAttachments.length === 0) return;

    const attachmentUrls = pendingAttachments.map((a) => a.url);

    // Stop typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    if (socket && isConnected) {
      socket.emit("typing_stop", { orderId });
    }

    // Optimistic payload
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg: MessageItem = {
      id: optimisticId,
      orderId,
      senderId: currentUserId || "me",
      senderName: me?.name || me?.clientProfile?.displayName || me?.vendorProfile?.businessName || "You",
      senderRole: currentUserRole,
      content: trimmed,
      attachments: attachmentUrls,
      isRead: false,
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputValue("");
    setPendingAttachments([]);
    scrollToBottom(true);

    try {
      // Send via socket first if connected, otherwise fallback to REST API
      if (socket && isConnected) {
        socket.emit("send_order_message", {
          orderId,
          content: trimmed,
          attachments: attachmentUrls,
        });
      } else {
        await sendOrderMessageMutation({
          orderId,
          content: trimmed,
          attachments: attachmentUrls,
        }).unwrap();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to send message");
      // Remove optimistic message if failed
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    }
  };

  // ── Helper to detect file type from attachment URL ──────────
  const getAttachmentType = (url: string): "IMAGE" | "VIDEO" => {
    const clean = url.split("?")[0].toLowerCase();
    if (clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".mov") || clean.endsWith(".mkv")) {
      return "VIDEO";
    }
    return "IMAGE";
  };

  // ── RENDER: LOCKED / UNPAID STATE ───────────────────────────
  if (isPendingPayment) {
    return (
      <div className={cn("p-8 rounded-2xl border border-warning/30 bg-surface-elevated text-center space-y-4 shadow-xl", className)}>
        <div className="w-14 h-14 rounded-2xl bg-warning-solid text-on-brand/10 border border-warning/30 text-warning flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="font-bold text-base text-foreground">Order Chat Locked</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Direct communication unlocks as soon as order payment is completed and held in the secure Ophir Escrow Vault.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warning-solid text-on-brand/10 border border-warning/30 text-warning text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Payment Required to Chat</span>
        </div>
      </div>
    );
  }

  // ── RENDER: CANCELLED STATE ─────────────────────────────────
  if (isCancelled) {
    return (
      <div className={cn("p-8 rounded-2xl border border-danger/30 bg-surface-elevated text-center space-y-3 shadow-xl", className)}>
        <div className="w-12 h-12 rounded-xl bg-danger-solid text-foreground/10 text-danger flex items-center justify-center mx-auto">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm text-foreground">Order Closed</h3>
        <p className="text-xs text-foreground-muted max-w-sm mx-auto">
          This order contract has been cancelled. Order chat history is archived.
        </p>
      </div>
    );
  }

  // ── RENDER: ACTIVE ORDER CHAT ───────────────────────────────
  return (
    <div className={cn("flex flex-col h-[650px] bg-background border border-border rounded-2xl overflow-hidden shadow-2xl relative", className)}>
      {/* ── Media Lightbox Modal ── */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewMedia(null)}
        >
          <button
            onClick={() => setPreviewMedia(null)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-surface/10 text-foreground hover:bg-surface/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            {previewMedia.type === "IMAGE" ? (
              <img
                src={previewMedia.url}
                alt="Enlarged Attachment"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
            ) : (
              <video
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl bg-background"
              >
                <source src={previewMedia.url} />
                Your browser does not support video playback.
              </video>
            )}
          </div>
        </div>
      )}

      {/* ── Chat Header ── */}
      <div className="px-5 py-4 bg-surface-sunken border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-active/80 flex items-center justify-center text-foreground font-black text-sm shadow-md">
              {peerAvatar ? (
                <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                peerName.charAt(0).toUpperCase()
              )}
            </div>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-border",
                isConnected ? "bg-success-solid text-foreground" : "bg-surface-sunken"
              )}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">{peerName}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-info-solid text-foreground/15 text-info border border-info/30">
                {peerRole}
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted mt-0.5 flex items-center gap-1.5">
              <span>Order #{order?.orderNumber || order?.id?.slice(-6).toUpperCase()}</span>
              <span>•</span>
              <span className="text-warning/90 font-medium">Room order:{orderId}</span>
            </p>
          </div>
        </div>

        {/* Socket status indicator */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
              isConnected
                ? "bg-success-solid text-foreground/10 text-success border-success/30"
                : "bg-danger-solid text-foreground/10 text-danger border-danger/30"
            )}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>Live Socket</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Reconnecting</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {socketError && (
        <div className="px-4 py-2 bg-danger-solid text-foreground/10 border-b border-danger/30 text-danger text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{socketError}</span>
        </div>
      )}

      {/* ── Messages Feed ── */}
      <div
        ref={chatScrollContainerRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-background to-surface"
      >
        {/* Load Earlier Messages Button */}
        {hasMore && (
          <div className="text-center pt-1 pb-2">
            <button
              type="button"
              onClick={handleLoadEarlier}
              disabled={isLoadingMore}
              className="px-4 py-1.5 rounded-full bg-surface/5 hover:bg-surface/10 text-foreground-muted hover:text-foreground text-xs font-medium border border-border transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoadingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Load earlier messages</span>
            </button>
          </div>
        )}

        {isQueryLoading && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-foreground-muted gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-warning" />
            <p className="text-xs">Loading order messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-foreground-muted text-center space-y-2 py-16">
            <div className="w-12 h-12 rounded-2xl bg-surface/5 border border-border flex items-center justify-center text-foreground-muted">
              <Send className="w-5 h-5 opacity-60" />
            </div>
            <h4 className="font-bold text-sm text-foreground-secondary">Order Chat Initialized</h4>
            <p className="text-xs text-foreground-muted max-w-xs">
              This private encrypted socket room is restricted to the client, vendor, and platform mediation. Send your first message or media attachment below.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            const hasAttachments = Array.isArray(msg.attachments) && msg.attachments.length > 0;

            return (
              <div
                key={msg.id || idx}
                className={cn("flex flex-col gap-1 max-w-[82%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
              >
                {/* Sender info */}
                {!isMe && (
                  <span className="text-[10px] font-semibold text-foreground-muted px-1">
                    {msg.senderName} • {msg.senderRole || "Artisan"}
                  </span>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    "p-3.5 rounded-2xl shadow-md text-xs leading-relaxed space-y-2 relative break-words",
                    isMe
                      ? "bg-gradient-to-br from-brand to-brand-active text-on-brand font-medium rounded-tr-xs"
                      : "bg-surface-elevated text-foreground-secondary border border-border rounded-tl-xs"
                  )}
                >
                  {/* Content Text */}
                  {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                  {/* Attachments Preview (Images / Videos) */}
                  {hasAttachments && (
                    <div className="space-y-2 pt-1">
                      {msg.attachments!.map((attUrl, attIdx) => {
                        const fileType = getAttachmentType(attUrl);

                        if (fileType === "IMAGE") {
                          return (
                            <div
                              key={attIdx}
                              onClick={() => setPreviewMedia({ url: attUrl, type: "IMAGE" })}
                              className="relative group rounded-xl overflow-hidden border border-border bg-background/40 cursor-pointer max-w-sm"
                            >
                              <img
                                src={attUrl}
                                alt="Attachment"
                                className="w-full max-h-56 object-cover hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-foreground">
                                <Maximize2 className="w-5 h-5" />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={attIdx}
                            className="rounded-xl overflow-hidden border border-border bg-background/60 max-w-sm"
                          >
                            <video
                              controls
                              preload="metadata"
                              className="w-full max-h-56 rounded-xl bg-background"
                            >
                              <source src={attUrl} />
                              Your browser does not support video playback.
                            </video>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Timestamp & Read Receipt */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-[9px] font-medium pt-0.5",
                      isMe ? "text-info justify-end" : "text-foreground-muted justify-start"
                    )}
                  >
                    <span>{msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {isMe && (
                      <span title={msg.isRead ? "Read by peer" : "Delivered"}>
                        {msg.isRead ? (
                          <CheckCheck className="w-3.5 h-3.5 text-warning" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-info" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Realtime Typing Indicator ── */}
      {peerTypingName && (
        <div className="px-5 py-1.5 bg-[#101118] border-t border-border-strong/5 text-[11px] text-warning flex items-center gap-2 animate-in fade-in">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-solid text-on-brand animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-warning-solid text-on-brand animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-warning-solid text-on-brand animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
          <span>{peerTypingName} is typing...</span>
        </div>
      )}

      {/* ── Pending Attachments Bar ── */}
      {pendingAttachments.length > 0 && (
        <div className="px-5 py-2.5 bg-[#12131d] border-t border-border flex items-center gap-2 overflow-x-auto">
          {pendingAttachments.map((att, idx) => (
            <div
              key={idx}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/10 border border-border-strong/15 text-xs text-foreground"
            >
              {att.fileType === "IMAGE" ? (
                <ImageIcon className="w-4 h-4 text-warning" />
              ) : (
                <VideoIcon className="w-4 h-4 text-info" />
              )}
              <span className="max-w-[140px] truncate text-[11px] font-medium">{att.originalName}</span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="p-1 rounded-full hover:bg-surface/20 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Chat Input Footer ── */}
      <form onSubmit={handleSendMessage} className="p-3 bg-surface-sunken border-t border-border flex items-center gap-2">
        {/* Hidden File Input for Image & Video */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/x-matroska"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Attach Image or Video (Max 50MB)"
          className="w-10 h-10 rounded-xl bg-surface/5 hover:bg-surface/10 border border-border flex items-center justify-center text-foreground-secondary hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-warning" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </button>

        {/* Message Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Message ${peerName}...`}
          className="flex-1 bg-surface/5 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-info/30 focus:ring-1 focus:ring-focus-ring/50 transition-all font-medium"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSendingApi || (!inputValue.trim() && pendingAttachments.length === 0)}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-brand to-brand-active hover:from-brand hover:to-brand-active text-on-brand font-bold flex items-center justify-center shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {isSendingApi ? (
            <Loader2 className="w-4 h-4 animate-spin text-on-brand" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
