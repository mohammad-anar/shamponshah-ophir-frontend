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
  PlusCircle,
  Clock,
  UserCheck
} from "lucide-react";
import SendOfferModal from "@/components/vendor/SendOfferModal";

interface ClientConv {
  id: string;
  clientName: string;
  clientAvatar: string;
  eventName: string;
  eventDate: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  online: boolean;
  budget: string;
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

const mockClientConvs: ClientConv[] = [
  {
    id: "c1",
    clientName: "Emily Carter",
    clientAvatar: "EC",
    eventName: "Emily & David's Golden Ophir Wedding",
    eventDate: "Nov 15, 2025",
    lastMessage: "We loved the sample playlist! Could you add 2 wireless mics for the vows?",
    lastTime: "10:45 AM",
    unreadCount: 1,
    online: true,
    budget: "$1,200 - $1,600",
  },
  {
    id: "c2",
    clientName: "Robert Sterling",
    clientAvatar: "RS",
    eventName: "Apex Ventures Annual Gala",
    eventDate: "Dec 08, 2025",
    lastMessage: "Can you provide acoustic background music during the cocktail hour?",
    lastTime: "Yesterday",
    unreadCount: 0,
    online: false,
    budget: "$2,500 - $3,000",
  },
  {
    id: "c3",
    clientName: "Samantha Miller",
    clientAvatar: "SM",
    eventName: "Miller Sweet 16 Celebration",
    eventDate: "Jan 18, 2026",
    lastMessage: "Thank you for the proposal! We will review with the committee tonight.",
    lastTime: "Sep 29",
    unreadCount: 0,
    online: false,
    budget: "$900 - $1,100",
  }
];

const mockVendorMessages: Message[] = [
  {
    id: "m1",
    sender: "client",
    text: "Hi Marcus! We saw your 5.0 rated DJ gigs on Ophir and loved your wedding mixes.",
    time: "10:30 AM",
  },
  {
    id: "m2",
    sender: "vendor",
    text: "Hi Emily! Thank you so much for reaching out. November 15th is currently open on our calendar. I'd love to play for your celebration!",
    time: "10:35 AM",
  },
  {
    id: "m3",
    sender: "client",
    text: "We loved the sample playlist! Could you add 2 wireless mics for the vows?",
    time: "10:45 AM",
  }
];

export default function VendorMessagesPage() {
  const [conversations, setConversations] = useState<ClientConv[]>(mockClientConvs);
  const [activeConv, setActiveConv] = useState<ClientConv>(mockClientConvs[0]);
  const [messages, setMessages] = useState<Message[]>(mockVendorMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "vendor",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputMessage("");
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
      }
    };
    setMessages([...messages, offerMsg]);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Left Sidebar: Client Conversations */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-[#F8F9FD]">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold text-[#0F0C3B]">Vendor Inquiries</h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
              1 Unread
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {conversations.map((conv) => {
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {conv.clientAvatar}
                  </div>
                  {conv.online && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#0F0C3B] truncate">{conv.clientName}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">{conv.lastTime}</span>
                  </div>

                  <p className="text-[11px] text-brand-primary truncate mt-0.5 font-semibold">{conv.eventName}</p>
                  <p className="text-xs text-slate-600 truncate mt-1">{conv.lastMessage}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/50 text-[10px] text-slate-500">
                    <span>Budget: <strong className="text-slate-800">{conv.budget}</strong></span>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">
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
        {/* Active Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {activeConv.clientAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#0F0C3B]">{activeConv.clientName}</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-brand-primary text-[10px] font-bold">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>{activeConv.eventName}</span>
                <span>&bull;</span>
                <span className="text-slate-700 font-bold">{activeConv.eventDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> Create Custom Offer
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Escrow 100% Payout Notice */}
        <div className="px-4 py-2 bg-[#F8F9FD] border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Vendors keep <strong>100% of price</strong>. Guaranteed payout upon client milestone approval.</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Auto-disbursed to Stripe</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-[#FAFBFF]">
          {messages.map((m) => {
            const isVendor = m.sender === "vendor";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isVendor ? "items-end" : "items-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
                  {!isVendor && (
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mb-1">
                      {activeConv.clientAvatar}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-2 shadow-xs ${
                      isVendor
                        ? "bg-[#0F0C3B] text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>

                    {m.isOffer && (
                      <div className="p-3 bg-[#18124E] text-white rounded-xl space-y-2 border border-white/10 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Custom Offer Sent</span>
                          <span className="text-xs font-black">${m.isOffer.amount}</span>
                        </div>
                        <p className="font-bold text-xs">{m.isOffer.title}</p>
                        <p className="text-[10px] text-indigo-200">Status: {m.isOffer.status}</p>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {m.time} {isVendor && <CheckCheck className="w-3 h-3 text-brand-primary" />}
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
              placeholder="Reply to client..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#F8F9FD] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white"
            />

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

      {/* Send Offer Modal */}
      <SendOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        jobTitle={`${activeConv.eventName} - Custom Audio & Lighting Service`}
        clientName={activeConv.clientName}
        onOfferSent={handleOfferSent}
      />
    </div>
  );
}
