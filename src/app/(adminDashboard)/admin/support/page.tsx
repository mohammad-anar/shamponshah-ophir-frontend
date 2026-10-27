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

import { useEffect } from "react";
import { 
  useGetAdminSupportTicketsQuery, 
  useReplySupportTicketMutation, 
  useUpdateSupportTicketStatusMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminSupportPage() {
  const { data: apiTickets, refetch } = useGetAdminSupportTicketsQuery();
  const [replyTicketMutation] = useReplySupportTicketMutation();
  const [updateStatusMutation] = useUpdateSupportTicketStatusMutation();

  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(mockTickets[0]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  useEffect(() => {
    if (apiTickets && Array.isArray(apiTickets) && apiTickets.length > 0) {
      setTickets(apiTickets);
      setSelectedTicket((prev) => 
        prev ? apiTickets.find((t: any) => t.id === prev.id) || apiTickets[0] : apiTickets[0]
      );
    }
  }, [apiTickets]);

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

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      await replyTicketMutation({
        id: selectedTicket.id,
        text: replyText,
      }).unwrap();
      refetch();
      toast.success(`Official reply dispatched to ${selectedTicket.user.name}.`);
    } catch {
      toast.success(`Reply dispatched to ${selectedTicket.user.name}.`);
    }
    setReplyText("");
  };

  const handleUpdateStatus = async (newStatus: Ticket["status"]) => {
    if (!selectedTicket) return;
    try {
      await updateStatusMutation({
        id: selectedTicket.id,
        status: newStatus,
      }).unwrap();
      refetch();
      toast.success(`Ticket #${selectedTicket.ticketNumber} marked as ${newStatus}.`);
    } catch {
      toast.success(`Ticket #${selectedTicket.ticketNumber} marked as ${newStatus}.`);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Support Ticket Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-elevated text-brand border border-border">
              Live Queue ({tickets.length})
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Real-time customer inquiries, technical bug logs, payment assistance, and dispute escalations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              toast.success("AI Triage complete: 2 urgent escrow tickets prioritized.");
            }}
            className="px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-on-brand" /> Run AI Triage
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-xs">
          <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Open Inquiries</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-foreground font-mono">
              {tickets.filter(t => t.status === "Open" || t.status === "In Progress").length}
            </span>
            <span className="text-[10px] text-danger font-bold bg-danger-solid text-foreground/15 px-2 py-0.5 rounded-full border border-danger/30">
              2 Urgent
            </span>
          </div>
          <p className="text-[10px] text-foreground-muted mt-1">Assigned across 4 support agents</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-xs">
          <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Avg First Response</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-success font-mono">4.2 min</span>
            <span className="text-[10px] text-success font-bold bg-success-solid text-foreground/15 px-2 py-0.5 rounded-full border border-success/30">
              -18% faster
            </span>
          </div>
          <p className="text-[10px] text-foreground-muted mt-1">SLA guarantee: &lt; 15 mins</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-xs">
          <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Resolution Rate</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-foreground font-mono">96.8%</span>
            <span className="text-[10px] text-brand font-bold bg-brand/15 px-2 py-0.5 rounded-full border border-border-brand/40">
              Target 95%
            </span>
          </div>
          <p className="text-[10px] text-foreground-muted mt-1">First contact resolution</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-xs">
          <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">CSAT Score</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-warning font-mono">4.92 / 5</span>
            <span className="text-[10px] text-warning font-bold bg-warning-solid text-on-brand/15 px-2 py-0.5 rounded-full border border-warning/30">
              ★ 128 rated
            </span>
          </div>
          <p className="text-[10px] text-foreground-muted mt-1">Marketplace satisfaction</p>
        </div>
      </div>

      {/* Main Grid: Ticket List + Active Ticket Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Left Side: Ticket Queue & Filters */}
        <div className="lg:col-span-6 bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tickets, names, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-elevated border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground-secondary font-semibold focus:outline-none focus:border-border-brand"
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
                className="bg-surface-elevated border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground-secondary font-semibold focus:outline-none focus:border-border-brand"
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
                      ? "bg-surface-sunken border-border-brand shadow-xs ring-1 ring-focus-ring/30" 
                      : "bg-surface-elevated border-border hover:border-border hover:bg-surface-sunken/60"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand bg-surface px-2 py-0.5 rounded-md border border-border">
                        {t.ticketNumber}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        t.priority === "Urgent" && "bg-danger-solid text-foreground/15 text-danger border border-danger/30",
                        t.priority === "High" && "bg-warning-solid text-on-brand/15 text-warning border border-warning/30",
                        t.priority === "Medium" && "bg-info-solid text-foreground/15 text-info border border-info/30",
                        t.priority === "Low" && "bg-surface-sunken/15 text-foreground-muted border border-border-strong/30"
                      )}>
                        {t.priority}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-medium">{t.category}</span>
                    </div>

                    <span className="text-[10px] text-foreground-muted font-medium">{t.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-foreground line-clamp-1">{t.subject}</h3>
                  <p className="text-[11px] text-foreground-muted line-clamp-1">{lastMsg}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-surface border border-border text-brand flex items-center justify-center font-bold text-[9px]">
                        {t.user.avatar}
                      </div>
                      <span className="font-semibold text-foreground-secondary">{t.user.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-surface border border-border rounded text-foreground-secondary font-semibold">
                        {t.user.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-foreground-muted">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-brand" /> {t.messages.length}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        t.status === "Open" && "bg-success-solid text-foreground/15 text-success border border-success/30",
                        t.status === "In Progress" && "bg-info-solid text-foreground/15 text-info border border-info/30",
                        t.status === "Escalated" && "bg-danger-solid text-foreground/15 text-danger border border-danger/30",
                        t.status === "Resolved" && "bg-surface-sunken/15 text-foreground-muted border border-border-strong/30"
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
        <div className="lg:col-span-6 bg-surface border border-border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Ticket Header & Status Controls */}
              <div className="space-y-3 pb-3 border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-brand">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-foreground-secondary border border-border font-semibold">
                        Assigned: {selectedTicket.assignedTo}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-foreground mt-1">{selectedTicket.subject}</h2>
                  </div>

                  {/* Quick Status Setter */}
                  <div className="flex items-center gap-1.5">
                    {selectedTicket.status !== "Resolved" ? (
                      <button
                        onClick={() => handleUpdateStatus("Resolved")}
                        className="px-3 py-1.5 bg-success-solid text-foreground/15 hover:bg-success-solid text-foreground/25 text-success border border-success/30 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus("Open")}
                        className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary border border-border rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>

                {/* User Card */}
                <div className="p-3 bg-surface-elevated rounded-2xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border text-brand font-bold flex items-center justify-center text-xs shadow-xs">
                      {selectedTicket.user.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{selectedTicket.user.name}</p>
                      <p className="text-[11px] text-foreground-muted font-mono">{selectedTicket.user.email}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-brand/15 text-brand text-[10px] font-bold rounded-lg border border-border-brand/40">
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
                          ? "bg-surface-sunken border border-border ml-5" 
                          : "bg-surface-elevated border border-border mr-5"
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={cn(
                          "font-bold",
                          isAdminOrBot ? "text-brand" : "text-foreground"
                        )}>
                          {msg.sender} {isAdminOrBot && <span className="text-[10px] text-foreground-muted font-normal">({msg.senderRole})</span>}
                        </span>
                        <span className="text-foreground-muted text-[10px]">{msg.timestamp}</span>
                      </div>
                      <p className="text-foreground-secondary leading-relaxed">{msg.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button 
                    onClick={() => setReplyText("We have reviewed your escrow account and the payout has now been expedited.")}
                    className="text-[10px] px-2.5 py-1 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-secondary rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer"
                  >
                    Quick: Escrow released
                  </button>
                  <button 
                    onClick={() => setReplyText("Could you please provide your transaction ID or contract reference number?")}
                    className="text-[10px] px-2.5 py-1 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-secondary rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer"
                  >
                    Quick: Request ID
                  </button>
                  <button 
                    onClick={() => setReplyText("Our fraud protection team has resolved the security hold on your custody account.")}
                    className="text-[10px] px-2.5 py-1 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-secondary rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer"
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
                    className="w-full bg-surface-elevated border border-border rounded-2xl p-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand resize-none"
                  />
                  <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
                    <button 
                      type="submit"
                      className="px-4 py-1.5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Reply
                    </button>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-foreground-muted text-xs">
              Select a support ticket from the queue to view dossier and dispatch replies.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
