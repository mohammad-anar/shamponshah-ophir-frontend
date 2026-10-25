"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { 
  X, 
  Send, 
  Paperclip, 
  CheckCheck, 
  ExternalLink, 
  Loader2, 
  Wifi, 
  WifiOff, 
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetConversationMessagesQuery, 
  useSendMessageMutation, 
  useStartConversationMutation 
} from "@/redux/service/messages/messagesApi";

interface OrderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  currentUserId?: string;
}

interface ChatMessage {
  id: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  time?: string;
  isMe: boolean;
}

export default function OrderChatModal({
  isOpen,
  onClose,
  order,
  currentUserId,
}: OrderChatModalProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const [startConversation] = useStartConversationMutation();
  const [sendMessageApi, { isLoading: isSending }] = useSendMessageMutation();

  const { data: convMessagesData, refetch: refetchMessages } = useGetConversationMessagesQuery(
    conversationId as string,
    { skip: !conversationId }
  );

  const clientName =
    order?.clientProfile?.displayName ||
    order?.clientProfile?.user?.name ||
    order?.client ||
    "Client";

  const clientUserId =
    order?.clientProfile?.userId ||
    order?.clientProfile?.user?.id ||
    order?.clientUserId;

  const orderTitle =
    order?.service ||
    order?.job?.title ||
    order?.gig?.title ||
    order?.notes ||
    "Order Discussion";

  const orderNumberStr =
    order?.orderNumber || (order?.id ? order.id.slice(-6).toUpperCase() : "ORDER");

  // 1. Establish or resolve conversation ID for this order & client
  useEffect(() => {
    if (!isOpen || !order) return;

    let isMounted = true;
    hasStartedRef.current = true;
    setIsInitializing(true);

    const initConversation = async () => {
      try {
        const payload: any = {
          orderId: order.id,
          recipientUserId: clientUserId || order.clientProfileId || undefined,
        };

        const res = await startConversation(payload).unwrap();
        const conv = res?.data || res;
        if (isMounted && conv?.id) {
          setConversationId(conv.id);
        }
      } catch (err: any) {
        console.warn("Could not start order conversation automatically:", err);
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    initConversation();

    return () => {
      isMounted = false;
    };
  }, [isOpen, order?.id, clientUserId, startConversation]);

  // 2. Connect to Socket.IO and subscribe to conversation room
  useEffect(() => {
    if (!isOpen || !conversationId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1";
    const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL || apiUrl.replace(/\/api\/v1\/?$/, "");

    const socketInstance: Socket = io(socketBase, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      socketInstance.emit("join_conversation", { conversationId });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("new_message", (incoming: any) => {
      if (incoming.conversationId === conversationId || !incoming.conversationId) {
        setMessages((prev) => {
          // Avoid duplicate if message already exists
          if (prev.some((m) => m.id === incoming.id)) return prev;

          const isMe =
            incoming.senderId === currentUserId ||
            incoming.senderName === "You" ||
            incoming.isMe === true;

          return [
            ...prev,
            {
              id: incoming.id || `msg-${Date.now()}`,
              senderId: incoming.senderId,
              senderName: incoming.senderName || (isMe ? "You" : clientName),
              senderAvatar: incoming.senderAvatar,
              content: incoming.content,
              createdAt: incoming.createdAt || new Date().toISOString(),
              time:
                incoming.time ||
                new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isMe,
            },
          ];
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit("leave_conversation", { conversationId });
      socketInstance.disconnect();
    };
  }, [isOpen, conversationId, currentUserId, clientName]);

  // 3. Sync initial messages loaded from REST API
  useEffect(() => {
    if (convMessagesData) {
      const raw = Array.isArray(convMessagesData)
        ? convMessagesData
        : convMessagesData?.data || [];

      if (Array.isArray(raw)) {
        const parsed: ChatMessage[] = raw.map((m: any) => {
          const isMe =
            m.isMe !== undefined
              ? m.isMe
              : m.senderId === currentUserId;

          return {
            id: m.id,
            senderId: m.senderId,
            senderName: isMe ? "You" : (m.senderName || clientName),
            senderAvatar: m.senderAvatar,
            content: m.content,
            createdAt: m.createdAt,
            time: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe,
          };
        });

        setMessages(parsed);
      }
    }
  }, [convMessagesData, currentUserId, clientName]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message send
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || !conversationId) return;

    setInputValue("");

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      senderId: currentUserId,
      senderName: "You",
      content: text,
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      // 1. Send via REST for persistent storage
      const res = await sendMessageApi({
        conversationId,
        content: text,
      }).unwrap();

      // 2. Emit via socket for real-time broadcast
      if (socket && isConnected) {
        socket.emit("send_message", {
          conversationId,
          content: text,
          senderId: currentUserId,
          senderName: "You",
          time: optimisticMsg.time,
        });
      }

      // Replace temp message id with real id if returned
      if (res?.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: res.id } : m))
        );
      }
    } catch (err: any) {
      toast.error("Failed to deliver message. Retrying...");
      refetchMessages();
    }
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl h-[85vh] max-h-[680px] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#0F0C3B] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-[#0F0C3B] font-extrabold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
              {clientName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white truncate">{clientName}</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-amber-300">
                  #{orderNumberStr}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="truncate">{orderTitle}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {isConnected ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-300 font-medium">Socket Live</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-slate-300">Connecting</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {conversationId && (
              <Link
                href={`/vendor/messages?userId=${clientUserId || ''}&orderId=${order?.id || ''}&conv=${conversationId || ''}`}
                target="_blank"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Open in full screen messenger"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Details Context Bar */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <ShoppingBag className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              Order #{orderNumberStr}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">
              Escrow Total:{" "}
              <strong className="text-emerald-700">
                ${Number(order?.subtotal || order?.grandTotal || order?.totalAmount?.replace(/[^0-9.]/g, "") || 0).toFixed(2)}
              </strong>
            </span>
          </div>

          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0",
              order?.status === "COMPLETED"
                ? "bg-emerald-100 text-emerald-800"
                : order?.status === "DISPUTED"
                ? "bg-rose-100 text-rose-800"
                : "bg-blue-100 text-blue-800"
            )}
          >
            {order?.status?.replace("_", " ") || "ACTIVE"}
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FD]">
          {isInitializing ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
              <span className="text-xs font-semibold">Connecting real-time socket room...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-2 py-12">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs text-brand-primary">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-bold text-slate-700 text-sm">Real-time Order Chat</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Direct instant messaging with <strong>{clientName}</strong> for deliverables, revisions, and milestone updates.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-2 max-w-sm">
                {[
                  "Hi! Working on your event deliverables.",
                  "Proof of completion uploaded for review.",
                  "Do you need any custom adjustments?",
                ].map((quick, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(quick)}
                    className="text-[11px] bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 transition-colors cursor-pointer"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  m.isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <span className="text-[10px] text-slate-400 px-1 mb-0.5">
                  {m.isMe ? "You" : clientName} • {m.time}
                </span>
                <div
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs break-words",
                    m.isMe
                      ? "bg-[#0F0C3B] text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Bar */}
        <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">Quick:</span>
          {[
            "Milestone work ready for review!",
            "Thank you! Please release payment.",
            "Files sent via Google Drive.",
          ].map((quick, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickReply(quick)}
              className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${clientName} about Order #${orderNumberStr}...`}
            className="flex-1 bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-[#18124E] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
