"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  ShieldAlert, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Flag, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Send, 
  ExternalLink,
  HelpCircle,
  Pin,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewItem {
  id: string;
  orderId: string;
  client: string;
  clientAvatar: string;
  clientEmail: string;
  vendor: string;
  vendorAvatar: string;
  occasion: string;
  rating: number;
  comment: string;
  status: "VERIFIED_PURCHASE" | "UNDER_MODERATION" | "FLAGGED_DISPUTE" | "HIDDEN";
  isPinned: boolean;
  date: string;
  flagReason?: string;
  vendorReply?: {
    text: string;
    date: string;
  };
  adminNotes?: string[];
}

const initialReviews: ReviewItem[] = [
  {
    id: "REV-441",
    orderId: "ORD-8421",
    client: "Elena Rostova",
    clientAvatar: "ER",
    clientEmail: "elena.rostova@example.com",
    vendor: "Party Pulse Events (Marcus Reed)",
    vendorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    occasion: "Corporate Gala 2026",
    rating: 5,
    comment: "Marcus was phenomenal at our corporate launch! Kept energy high without being overpowering. Audio setup was seamless and all wireless mics worked flawlessly throughout our executive presentations.",
    status: "VERIFIED_PURCHASE",
    isPinned: true,
    date: "Oct 02, 2026",
    vendorReply: {
      text: "Thank you so much Elena! It was an honor coordinating audio for your corporate celebration.",
      date: "Oct 03, 2026",
    },
    adminNotes: ["Verified booking payment #TXN-7741. High quality photo evidence attached."],
  },
  {
    id: "REV-440",
    orderId: "ORD-8419",
    client: "Brian Kensington",
    clientAvatar: "BK",
    clientEmail: "brian.k@example.com",
    vendor: "Party Pulse Events (Marcus Reed)",
    vendorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    occasion: "Kids 7th Birthday Party",
    rating: 5,
    comment: "Arrived 45 minutes early, flawless sound setup, and the kids danced non-stop to the freeze-dance games. Will definitely rehire for next year!",
    status: "VERIFIED_PURCHASE",
    isPinned: false,
    date: "Sep 28, 2026",
  },
  {
    id: "REV-439",
    orderId: "ORD-8399",
    client: "Anonymous User (Reported)",
    clientAvatar: "AU",
    clientEmail: "user.flagged@example.com",
    vendor: "Windy City Sound LLC",
    vendorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    occasion: "Private Wedding Reception",
    rating: 1,
    comment: "Vendor arrived late and equipment cut out during speeches. Demanding full refund immediately.",
    status: "FLAGGED_DISPUTE",
    isPinned: false,
    date: "Oct 01, 2026",
    flagReason: "Flagged review under active moderation due to open escrow dispute #DS-1051. Vendor submitted timecard logs.",
    adminNotes: ["Currently reviewing venue surveillance and escrow dispute evidence before publishing."],
  },
  {
    id: "REV-438",
    orderId: "ORD-8380",
    client: "Sarah Jenkins",
    clientAvatar: "SJ",
    clientEmail: "sarah.jenkins@example.com",
    vendor: "Bloom Studio Chicago",
    vendorAvatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    occasion: "Milestone 40th Birthday",
    rating: 5,
    comment: "The pastel balloon garland and shimmer wall was the centerpiece of our entire event! Every guest took photos in front of it.",
    status: "VERIFIED_PURCHASE",
    isPinned: false,
    date: "Sep 25, 2026",
  },
  {
    id: "REV-437",
    orderId: "ORD-8370",
    client: "David Miller",
    clientAvatar: "DM",
    clientEmail: "david.miller@example.com",
    vendor: "Chef Marcus (Sweet Delights)",
    vendorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    occasion: "Golden Ophir Anniversary",
    rating: 4,
    comment: "The 3-tier sculpted fondant cake tasted delicious! Delivery was delayed by 20 minutes due to Chicago expressway traffic, but cake was intact and refrigerated.",
    status: "UNDER_MODERATION",
    isPinned: false,
    date: "Sep 20, 2026",
    flagReason: "Vendor requested moderation audit on traffic clause exemption in contract.",
  },
];

export default function AdminReviewsReportsPage() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(initialReviews);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");

  const handleStatusChange = (id: string, newStatus: ReviewItem["status"]) => {
    setReviewsList(reviewsList.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview({ ...selectedReview, status: newStatus });
    }
    toast.success(`Review #${id} status changed to ${newStatus.replace(/_/g, " ")}.`);
  };

  const handleTogglePin = (id: string) => {
    setReviewsList(reviewsList.map(r => {
      if (r.id === id) {
        const next = !r.isPinned;
        toast.success(next ? `Review #${id} pinned as Featured Trust Testimonial!` : `Review #${id} unpinned.`);
        return { ...r, isPinned: next };
      }
      return r;
    }));
  };

  const handleDeleteReview = (id: string) => {
    setReviewsList(reviewsList.filter(r => r.id !== id));
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview(null);
    }
    toast.error(`Review #${id} permanently purged from trust ledger.`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoteInput.trim() || !selectedReview) return;

    const updatedNotes = [...(selectedReview.adminNotes || []), `Admin note (${new Date().toLocaleDateString()}): ${adminNoteInput}`];
    
    setReviewsList(reviewsList.map(r => r.id === selectedReview.id ? { ...r, adminNotes: updatedNotes } : r));
    setSelectedReview({ ...selectedReview, adminNotes: updatedNotes });
    setAdminNoteInput("");
    toast.success("Moderation note logged.");
  };

  const filteredReviews = reviewsList.filter((rev) => {
    const matchesStatus = 
      activeFilter === "ALL" || 
      rev.status === activeFilter ||
      (activeFilter === "PINNED" && rev.isPinned);

    const matchesRating = ratingFilter === "ALL" || rev.rating === ratingFilter;

    const matchesSearch = 
      rev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.occasion.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesRating && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
            Reviews &amp; Trust Reports Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit verified buyer ratings, resolve flagged feedback, pin featured testimonials, and manage marketplace integrity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setReviewsList(initialReviews);
              toast.success("Reviews ledger refreshed with live data.");
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
            <span>Sync Live Feed</span>
          </button>
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Reviews</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">{reviewsList.length}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">100% Verified</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Post-event milestone ratings</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Platform Avg Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600 font-mono">4.92 / 5.0</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">★ Top Tier</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Calculated across 840+ gigs</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-xs bg-rose-50/20">
          <span className="text-[10px] uppercase font-bold text-rose-900 block">Under Investigation</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-700 font-mono">
              {reviewsList.filter(r => r.status === "FLAGGED_DISPUTE" || r.status === "UNDER_MODERATION").length}
            </span>
            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded">Action Required</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dispute holdbacks &amp; appeals</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Featured Pinned</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-brand-primary font-mono">
              {reviewsList.filter(r => r.isPinned).length}
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">Homepage</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Showcased on main landing page</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: "ALL", label: `All (${reviewsList.length})` },
            { key: "VERIFIED_PURCHASE", label: "Verified" },
            { key: "FLAGGED_DISPUTE", label: "Flagged / Dispute" },
            { key: "UNDER_MODERATION", label: "Under Review" },
            { key: "PINNED", label: "Pinned ★" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                activeFilter === tab.key
                  ? "bg-[#0F0C3B] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rating Stars Filter & Search Input */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setRatingFilter("ALL")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all",
                ratingFilter === "ALL" ? "bg-white text-[#0F0C3B] shadow-2xs" : "text-slate-500 hover:text-slate-900"
              )}
            >
              All ★
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={cn(
                  "px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-0.5 transition-all",
                  ratingFilter === r ? "bg-white text-amber-600 shadow-2xs font-black" : "text-slate-500 hover:text-amber-600"
                )}
              >
                <span>{r}</span>
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search feedback, clients, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8F9FD] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Reviews List Cards */}
      <div className="space-y-4 text-xs">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">No reviews match your current filter criteria</p>
            <p className="text-slate-400 text-xs">Try selecting a different status tab or clearing your search term.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={cn(
                "bg-white rounded-3xl border transition-all p-5 shadow-xs space-y-4",
                rev.isPinned ? "border-brand-primary/50 ring-2 ring-indigo-100 bg-indigo-50/10" : "border-slate-200 hover:border-slate-300",
                rev.status === "FLAGGED_DISPUTE" && "border-rose-300 bg-rose-50/10"
              )}
            >
              {/* Top Row: User details, Vendor details, Date & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                    {rev.clientAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0F0C3B] text-sm">{rev.client}</span>
                      <span className="text-slate-400 font-normal">reviewed</span>
                      <span className="font-bold text-brand-primary bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        {rev.vendor}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Occasion: <strong className="text-slate-700">{rev.occasion}</strong> &bull; Order #{rev.orderId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                  
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    rev.status === "VERIFIED_PURCHASE" && "bg-emerald-100 text-emerald-800 border border-emerald-200",
                    rev.status === "FLAGGED_DISPUTE" && "bg-rose-100 text-rose-800 border border-rose-200",
                    rev.status === "UNDER_MODERATION" && "bg-amber-100 text-amber-800 border border-amber-200",
                    rev.status === "HIDDEN" && "bg-slate-100 text-slate-700 border border-slate-200",
                  )}>
                    {rev.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Star Rating & Comment Box */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-[#0F0C3B] text-xs">{rev.rating}.0 out of 5.0</span>
                  
                  {rev.isPinned && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" /> Featured Pinned
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200/80 text-slate-700 text-xs leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </div>
              </div>

              {/* Flag / Dispute Notice if applicable */}
              {rev.flagReason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Moderation Notice:</span>
                    <span>{rev.flagReason}</span>
                  </div>
                </div>
              )}

              {/* Vendor Public Reply if present */}
              {rev.vendorReply && (
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#0F0C3B]">Vendor Official Response:</span>
                    <span className="text-slate-400">{rev.vendorReply.date}</span>
                  </div>
                  <p className="text-slate-700 italic text-[11px]">&ldquo;{rev.vendorReply.text}&rdquo;</p>
                </div>
              )}

              {/* Bottom Interactive Actions Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Pin / Unpin Button */}
                  <button
                    onClick={() => handleTogglePin(rev.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs",
                      rev.isPinned
                        ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Pin className={cn("w-3.5 h-3.5", rev.isPinned && "fill-white")} />
                    <span>{rev.isPinned ? "Pinned on Hero" : "Pin as Testimonial"}</span>
                  </button>

                  {/* Audit / Notes Modal Button */}
                  <button
                    onClick={() => setSelectedReview(rev)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Audit &amp; Notes ({rev.adminNotes?.length || 0})</span>
                  </button>
                </div>

                {/* Status Moderation Controls */}
                <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
                  {rev.status !== "VERIFIED_PURCHASE" && (
                    <button
                      onClick={() => handleStatusChange(rev.id, "VERIFIED_PURCHASE")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve &amp; Publish</span>
                    </button>
                  )}

                  {rev.status !== "UNDER_MODERATION" && rev.status !== "FLAGGED_DISPUTE" && (
                    <button
                      onClick={() => handleStatusChange(rev.id, "UNDER_MODERATION")}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Quarantine</span>
                    </button>
                  )}

                  {rev.status !== "HIDDEN" && (
                    <button
                      onClick={() => handleStatusChange(rev.id, "HIDDEN")}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    title="Permanently remove review"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Inspection & Audit Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in flex flex-col text-xs">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0F0C3B] to-[#1E175E] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                  #{selectedReview.id} &bull; Order #{selectedReview.orderId}
                </span>
                <h3 className="text-base font-black text-white mt-1">Review Audit &amp; Investigation</h3>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              
              {/* Buyer & Vendor Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Client Author</span>
                  <p className="font-bold text-[#0F0C3B]">{selectedReview.client}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{selectedReview.clientEmail}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Vendor Reviewed</span>
                  <p className="font-bold text-[#0F0C3B]">{selectedReview.vendor}</p>
                  <p className="text-[10px] text-slate-500">Booking Verified</p>
                </div>
              </div>

              {/* Review Comment Quote */}
              <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Published Rating ({selectedReview.rating}.0 / 5.0)
                  </span>
                  <span className="text-slate-400 text-[10px]">{selectedReview.date}</span>
                </div>
                <p className="text-slate-800 italic leading-relaxed">
                  &ldquo;{selectedReview.comment}&rdquo;
                </p>
              </div>

              {/* Moderation Notes Log */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#0F0C3B] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-primary" /> Internal Moderation Notes
                </h4>

                {selectedReview.adminNotes && selectedReview.adminNotes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedReview.adminNotes.map((note, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">No internal notes added yet.</p>
                )}

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Add audit note or escalation details..."
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="flex-1 bg-[#F8F9FD] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold transition-all shadow-2xs flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Log Note
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePin(selectedReview.id)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Pin className="w-3.5 h-3.5 fill-white" />
                  <span>{selectedReview.isPinned ? "Unpin" : "Pin Hero"}</span>
                </button>

                <button
                  onClick={() => {
                    handleStatusChange(selectedReview.id, "VERIFIED_PURCHASE");
                    setSelectedReview(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
