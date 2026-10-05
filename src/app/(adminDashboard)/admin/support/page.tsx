"use client";

import { useState } from "react";
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ChevronRight, 
  Send, 
  Paperclip, 
  MoreVertical,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  XCircle,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TicketMessage {
  id: string;
  sender: string;
  senderRole: "Client" | "Vendor" | "Admin" | "Bot";
  senderAvatar: string;
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: "Billing & Escrow" | "Vendor Dispute" | "Account Access" | "Technical Bug" | "Milestone Release";
  user: {
    name: string;
    email: string;
    role: "Client" | "Vendor";
    avatar: string;
    phone?: string;
  };
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  messages: TicketMessage[];
}

const mockTickets: Ticket[] = [
  {
    id: "t1",
    ticketNumber: "TCK-8921",
    subject: "Escrow funds not released after milestone 2 signoff",
    category: "Billing & Escrow",
    user: {
      name: "Marcus Reed",
      email: "marcus@partypulse.com",
      phone: "+1 (312) 555-0194",
      role: "Vendor",
      avatar: "MR",
    },
    priority: "High",
    status: "Open",
    createdAt: "20 min ago",
    updatedAt: "10 min ago",
    assignedTo: "Sarah Jenkins",
    messages: [
      {
        id: "m-1",
        sender: "Marcus Reed",
        senderRole: "Vendor",
        senderAvatar: "MR",
        text: "The client approved the milestone yesterday at 4 PM, but my Stripe Connect balance still says pending.",
        timestamp: "20 min ago",
      },
      {
        id: "m-2",
        sender: "Ophir Escrow Bot",
        senderRole: "Bot",
        senderAvatar: "JB",
        text: "We have linked Order #ORD-8421 and placed this in the priority queue for escrow release verification.",
        timestamp: "15 min ago",
      },
    ],
  },
  {
    id: "t2",
    ticketNumber: "TCK-8920",
    subject: "DJ did not arrive on time for rehearsal session",
    category: "Vendor Dispute",
    user: {
      name: "Emily Carter",
      email: "emily.carter@gmail.com",
      phone: "+1 (312) 555-4921",
      role: "Client",
      avatar: "EC",
    },
    priority: "Urgent",
    status: "In Progress",
    createdAt: "1 hour ago",
    updatedAt: "15 min ago",
    assignedTo: "Alex Mercer",
    messages: [
      {
        id: "m-3",
        sender: "Emily Carter",
        senderRole: "Client",
        senderAvatar: "EC",
        text: "I need an urgent replacement or a partial credit applied to milestone 1.",
        timestamp: "1 hour ago",
      },
      {
        id: "m-4",
        sender: "Alex Mercer (Senior Support)",
        senderRole: "Admin",
        senderAvatar: "AM",
        text: "Hi Emily, we have contacted the vendor and opened dispute mediation #DS-1051 with escrow hold active.",
        timestamp: "15 min ago",
      },
    ],
  },
  {
    id: "t3",
    ticketNumber: "TCK-8919",
    subject: "Need 1099-K tax form for 2025 financial year",
    category: "Billing & Escrow",
    user: {
      name: "Elena Rostova",
      email: "elena@luminafilms.com",
      role: "Vendor",
      avatar: "ER",
    },
    priority: "Low",
    status: "Resolved",
    createdAt: "3 hours ago",
    updatedAt: "1 hour ago",
    assignedTo: "Finance Bot",
    messages: [
      {
        id: "m-5",
        sender: "Elena Rostova",
        senderRole: "Vendor",
        senderAvatar: "ER",
        text: "Could you generate a copy of our 1099-K tax statement?",
        timestamp: "3 hours ago",
      },
      {
        id: "m-6",
        sender: "Finance Bot",
        senderRole: "Bot",
        senderAvatar: "FB",
        text: "Form 1099-K has been generated and dispatched to your registered email address.",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: "t4",
    ticketNumber: "TCK-8918",
    subject: "Cannot upload high-res 4K drone footage to milestone",
    category: "Technical Bug",
    user: {
      name: "David Chen",
      email: "david@skylinevideo.com",
      role: "Vendor",
      avatar: "DC",
    },
    priority: "Medium",
    status: "Open",
    createdAt: "5 hours ago",
    updatedAt: "3 hours ago",
    assignedTo: "Unassigned",
    messages: [
      {
        id: "m-7",
        sender: "David Chen",
        senderRole: "Vendor",
        senderAvatar: "DC",
        text: "The upload bar freezes at 99% for video archives above 2GB.",
        timestamp: "5 hours ago",
      },
    ],
  },
  {
    id: "t5",
    ticketNumber: "TCK-8917",
    subject: "Suspicious charge authorization on secondary credit card",
    category: "Account Access",
    user: {
      name: "Sophia Martinez",
      email: "sophia.m@gmail.com",
      role: "Client",
      avatar: "SM",
    },
    priority: "Urgent",
    status: "Escalated",
    createdAt: "8 hours ago",
    updatedAt: "2 hours ago",
    assignedTo: "Fraud Risk Desk",
    messages: [
      {
        id: "m-8",
        sender: "Sophia Martinez",
        senderRole: "Client",
        senderAvatar: "SM",
        text: "Saw an unauthorized $120 charge attempt on my card.",
        timestamp: "8 hours ago",
      },
      {
        id: "m-9",
        sender: "Fraud Risk Desk",
        senderRole: "Admin",
        senderAvatar: "FR",
        text: "Card was locked and temporary security hold placed on the custody ledger.",
        timestamp: "2 hours ago",
      },
    ],
  }
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(mockTickets[0]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg: TicketMessage = {
      id: `m-${Date.now()}`,
      sender: "Admin Support Desk",
      senderRole: "Admin",
      senderAvatar: "AD",
      text: replyText,
      timestamp: "Just now",
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "In Progress" as Ticket["status"],
          updatedAt: "Just now",
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      status: "In Progress",
      updatedAt: "Just now",
      messages: [...selectedTicket.messages, newMsg],
    });
    setReplyText("");
    toast.success(`Official reply dispatched to ${selectedTicket.user.name}.`);
  };

  const handleUpdateStatus = (newStatus: Ticket["status"]) => {
    if (!selectedTicket) return;
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t));
    setSelectedTicket({ ...selectedTicket, status: newStatus });
    toast.success(`Ticket #${selectedTicket.ticketNumber} marked as ${newStatus}.`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Support Ticket Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
              Live Queue ({tickets.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time customer inquiries, technical bug logs, payment assistance, and dispute escalations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              toast.success("AI Triage complete: 2 urgent escrow tickets prioritized.");
            }}
            className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Run AI Triage
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Inquiries</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">
              {tickets.filter(t => t.status === "Open" || t.status === "In Progress").length}
            </span>
            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              2 Urgent
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Assigned across 4 support agents</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg First Response</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">4.2 min</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              -18% faster
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">SLA guarantee: &lt; 15 mins</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolution Rate</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">96.8%</span>
            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Target 95%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">First contact resolution</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CSAT Score</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-600 font-mono">4.92 / 5</span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              ★ 128 rated
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Marketplace satisfaction</p>
        </div>
      </div>

      {/* Main Grid: Ticket List + Active Ticket Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Left Side: Ticket Queue & Filters */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tickets, names, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F8F9FD] border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-primary"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-[#F8F9FD] border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-primary"
              >
                <option value="All">All Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              const lastMsg = t.messages[t.messages.length - 1]?.text || "No messages";

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer space-y-2",
                    isSelected 
                      ? "bg-indigo-50/50 border-brand-primary shadow-xs ring-1 ring-brand-primary/30" 
                      : "bg-[#F8F9FD]/60 border-slate-200 hover:border-slate-300 hover:bg-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand-primary bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {t.ticketNumber}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        t.priority === "Urgent" && "bg-rose-100 text-rose-800 border border-rose-200",
                        t.priority === "High" && "bg-amber-100 text-amber-800 border border-amber-200",
                        t.priority === "Medium" && "bg-indigo-100 text-indigo-800 border border-indigo-200",
                        t.priority === "Low" && "bg-slate-100 text-slate-700 border border-slate-200"
                      )}>
                        {t.priority}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{t.category}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">{t.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0F0C3B] line-clamp-1">{t.subject}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{lastMsg}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[9px]">
                        {t.user.avatar}
                      </div>
                      <span className="font-semibold text-slate-700">{t.user.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-200/70 rounded text-slate-600 font-semibold">
                        {t.user.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-brand-primary" /> {t.messages.length}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        t.status === "Open" && "bg-emerald-100 text-emerald-800",
                        t.status === "In Progress" && "bg-indigo-100 text-indigo-800",
                        t.status === "Escalated" && "bg-rose-100 text-rose-800",
                        t.status === "Resolved" && "bg-slate-100 text-slate-600"
                      )}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Ticket Thread & Reply Center */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Ticket Header & Status Controls */}
              <div className="space-y-3 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-brand-primary">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        Assigned: {selectedTicket.assignedTo}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-[#0F0C3B] mt-1">{selectedTicket.subject}</h2>
                  </div>

                  {/* Quick Status Setter */}
                  <div className="flex items-center gap-1.5">
                    {selectedTicket.status !== "Resolved" ? (
                      <button
                        onClick={() => handleUpdateStatus("Resolved")}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus("Open")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>

                {/* User Card */}
                <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F0C3B] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {selectedTicket.user.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F0C3B]">{selectedTicket.user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{selectedTicket.user.email}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-brand-primary text-[10px] font-bold rounded-lg border border-indigo-100">
                    {selectedTicket.user.role} Verified
                  </span>
                </div>
              </div>

              {/* Message Thread Simulation */}
              <div className="space-y-3 py-2 flex-1 overflow-y-auto max-h-[340px] custom-scrollbar pr-1">
                {selectedTicket.messages.map((msg) => {
                  const isAdminOrBot = msg.senderRole === "Admin" || msg.senderRole === "Bot";
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-3.5 rounded-2xl space-y-1 text-xs",
                        isAdminOrBot 
                          ? "bg-indigo-50/70 border border-indigo-100 ml-5" 
                          : "bg-[#F8F9FD] border border-slate-200 mr-5"
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={cn(
                          "font-bold",
                          isAdminOrBot ? "text-brand-primary" : "text-[#0F0C3B]"
                        )}>
                          {msg.sender} {isAdminOrBot && <span className="text-[10px] text-slate-400 font-normal">({msg.senderRole})</span>}
                        </span>
                        <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button 
                    onClick={() => setReplyText("We have reviewed your escrow account and the payout has now been expedited.")}
                    className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium whitespace-nowrap"
                  >
                    Quick: Escrow released
                  </button>
                  <button 
                    onClick={() => setReplyText("Could you please provide your transaction ID or contract reference number?")}
                    className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium whitespace-nowrap"
                  >
                    Quick: Request ID
                  </button>
                  <button 
                    onClick={() => setReplyText("Our fraud protection team has resolved the security hold on your custody account.")}
                    className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium whitespace-nowrap"
                  >
                    Quick: Security Cleared
                  </button>
                </div>

                <form onSubmit={handleSendReply} className="relative">
                  <textarea
                    rows={3}
                    placeholder="Type official administrative reply to user..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary resize-none"
                  />
                  <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
                    <button 
                      type="submit"
                      className="px-4 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Reply
                    </button>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select a support ticket from the queue to view dossier and dispatch replies.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
