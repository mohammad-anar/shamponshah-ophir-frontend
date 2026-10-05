"use client";

import { useState } from "react";
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
  ChevronRight,
  Clock,
  Star
} from "lucide-react";

interface Conversation {
  id: string;
  vendorName: string;
  vendorAvatar: string;
  serviceCategory: string;
  rating: number;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  online: boolean;
  eventContext: string;
  orderStatus?: string;
}

interface Message {
  id: string;
  sender: "user" | "vendor";
  text: string;
  time: string;
  attachment?: {
    name: string;
    size: string;
    type: "pdf" | "image";
  };
  isOffer?: {
    title: string;
    amount: number;
    milestones: number;
    status: "Pending" | "Accepted";
  };
}

const mockConversations: Conversation[] = [
  {
    id: "c1",
    vendorName: "Windy City Sound DJ",
    vendorAvatar: "WC",
    serviceCategory: "Wedding & Party DJ",
    rating: 4.9,
    lastMessage: "I've uploaded the customized playlist and timeline for the reception!",
    lastTime: "10:42 AM",
    unreadCount: 2,
    online: true,
    eventContext: "Emily & David's Golden Ophir Wedding",
    orderStatus: "Active (#ORD-8821)",
  },
  {
    id: "c2",
    vendorName: "Lumina Cinematic Films",
    vendorAvatar: "LC",
    serviceCategory: "4K Drone & Cinema",
    rating: 5.0,
    lastMessage: "Our drone pilot permit has been approved for the lakefront ceremony.",
    lastTime: "Yesterday",
    unreadCount: 0,
    online: false,
    eventContext: "Emily & David's Golden Ophir Wedding",
    orderStatus: "Active (#ORD-8819)",
  },
  {
    id: "c3",
    vendorName: "Velvet Bloom Florals",
    vendorAvatar: "VB",
    serviceCategory: "Floral Arch & Tablescapes",
    rating: 4.85,
    lastMessage: "Here is the floral color swatch palette you requested.",
    lastTime: "Oct 2",
    unreadCount: 0,
    online: true,
    eventContext: "Emily & David's Golden Ophir Wedding",
    orderStatus: "Quote Sent",
  },
  {
    id: "c4",
    vendorName: "Gourmet Bites Catering",
    vendorAvatar: "GB",
    serviceCategory: "Artisan Plated Catering",
    rating: 4.95,
    lastMessage: "Menu tasting is scheduled for this Friday at 3 PM.",
    lastTime: "Sep 29",
    unreadCount: 0,
    online: false,
    eventContext: "Mom's 60th Surprise Gala",
    orderStatus: "Planning",
  }
];

const mockMessages: Message[] = [
  {
    id: "m1",
    sender: "vendor",
    text: "Hi Emily! Thanks for booking Windy City Sound for your celebration on November 15th.",
    time: "10:30 AM",
  },
  {
    id: "m2",
    sender: "user",
    text: "Hello! We are so excited. We wanted to make sure you have our first dance song and the jazz cocktail hour set list.",
    time: "10:34 AM",
  },
  {
    id: "m3",
    sender: "vendor",
    text: "Absolutely! I put together the full 5-hour breakdown including sound check and wireless lapel mics for the vows.",
    time: "10:38 AM",
    attachment: {
      name: "WindyCity_Audio_RunSheet_Nov15.pdf",
      size: "2.4 MB",
      type: "pdf",
    },
  },
  {
    id: "m4",
    sender: "vendor",
    text: "I've uploaded the customized playlist and timeline for the reception!",
    time: "10:42 AM",
    isOffer: {
      title: "Premium Sound & Wireless Mic Add-on",
      amount: 450,
      milestones: 2,
      status: "Pending",
    },
  },
];

export default function UserMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConv, setActiveConv] = useState<Conversation>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputMessage("");
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
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-brand-primary text-xs font-bold">
              3 Unread
            </span>
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
          {filteredConversations.map((conv) => {
            const isActive = activeConv.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                  isActive ? "bg-[#EDE9FE] border-l-4 border-brand-primary" : "hover:bg-slate-50 bg-white"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {conv.vendorAvatar}
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

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/50">
                    <span className="text-[10px] text-indigo-700 font-semibold truncate max-w-[160px]">
                      {conv.orderStatus || conv.eventContext}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#0F0C3B] text-white text-[10px] font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Active Chat Studio */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top Active Chat Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {activeConv.vendorAvatar}
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
                <span className="text-emerald-600 font-medium">Ophir Verified Escrow</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="px-4 py-2 bg-[#F8F9FD] border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <span>All communications and payments are protected by <strong>Ophir Escrow Vault</strong>.</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">End-to-end encrypted</span>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-[#FAFBFF]">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mb-1">
                      {activeConv.vendorAvatar}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-2 shadow-xs ${
                      isUser
                        ? "bg-[#0F0C3B] text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>

                    {/* Attachment preview if exists */}
                    {m.attachment && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-primary" />
                          <div>
                            <p className="font-bold text-[11px] truncate max-w-[180px]">{m.attachment.name}</p>
                            <p className="text-[10px] text-slate-400">{m.attachment.size}</p>
                          </div>
                        </div>
                        <button className="text-[11px] text-brand-primary font-bold hover:underline">
                          Download
                        </button>
                      </div>
                    )}

                    {/* Custom Offer Box if exists */}
                    {m.isOffer && (
                      <div className="p-3 bg-[#F8F9FD] border border-indigo-100 rounded-xl space-y-2 text-slate-800 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary">Custom Milestone Offer</span>
                          <span className="text-xs font-black text-[#0F0C3B]">${m.isOffer.amount}</span>
                        </div>
                        <p className="font-bold text-xs">{m.isOffer.title}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                          <span className="text-slate-500">{m.isOffer.milestones} Escrow Milestones</span>
                          <button 
                            onClick={() => alert("Opening Escrow checkout for " + m.isOffer?.title)}
                            className="px-3 py-1 bg-brand-primary text-white rounded-lg font-bold hover:bg-indigo-700"
                          >
                            Review & Fund Escrow
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {m.time} {isUser && <CheckCheck className="w-3 h-3 text-brand-primary" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type your message to vendor..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#F8F9FD] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
            />

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 hidden sm:block"
            >
              <Smile className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
