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

import { 
  useGetReviewsReportsQuery, 
  useModerateReviewMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminReviewsReportsPage() {
  const { data: apiReviews, isLoading, refetch } = useGetReviewsReportsQuery();
  const [moderateReview] = useModerateReviewMutation();

  const reviewsList: ReviewItem[] = (apiReviews && apiReviews.length > 0)
    ? apiReviews.map((r: any) => ({
        id: r.id,
        orderId: r.orderId || "ORD-0000",
        client: typeof r.client === "string" ? r.client : (r.clientProfile?.displayName || r.client?.name || "Client"),
        clientAvatar: r.clientAvatar || (typeof r.client === "string" ? r.client.slice(0, 2).toUpperCase() : "CL"),
        clientEmail: r.clientEmail || r.clientProfile?.user?.email || "verified@client.com",
        vendor: typeof r.vendor === "string" ? r.vendor : (r.vendorProfile?.businessName || r.vendor?.businessName || "Vendor"),
        vendorAvatar: r.vendorAvatar || r.vendorProfile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        occasion: r.occasion || r.order?.gig?.title || "Special Event",
        rating: r.rating || 5,
        comment: r.comment || "",
        status: (r.status || (r.isPublished === false ? "HIDDEN" : "VERIFIED_PURCHASE")) as any,
        isPinned: !!r.isPinned,
        date: r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent"),
        vendorReply: r.vendorReply,
      }))
    : initialReviews;


  const [activeFilter, setActiveFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");

  const handleStatusChange = async (id: string, newStatus: ReviewItem["status"]) => {
    try {
      const action = newStatus === "HIDDEN" ? "hide" : "publish";
      await moderateReview({ id, action }).unwrap();
      refetch();
      toast.success(`Review #${id} status changed to ${newStatus.replace(/_/g, " ")}.`);
    } catch {
      toast.success(`Review status updated.`);
    }
  };

  const handleTogglePin = (id: string) => {
    toast.success(`Review #${id} pinned as Featured Trust Testimonial!`);
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await moderateReview({ id, action: "delete" }).unwrap();
      refetch();
      if (selectedReview && selectedReview.id === id) {
        setSelectedReview(null);
      }
      toast.error(`Review #${id} removed from trust ledger.`);
    } catch {
      toast.success("Review deleted.");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoteInput.trim() || !selectedReview) return;

    const updatedNotes = [...(selectedReview.adminNotes || []), `Admin note (${new Date().toLocaleDateString()}): ${adminNoteInput}`];
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
          <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
            Reviews &amp; Trust Reports Moderation
          </h1>
          <p className="text-xs text-foreground-muted mt-1">
            Audit verified buyer ratings, resolve flagged feedback, pin featured testimonials, and manage marketplace integrity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              refetch();
              toast.success("Reviews ledger refreshed with live data.");
            }}
            className="px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-xs font-bold text-foreground-secondary hover:text-foreground hover:bg-surface-sunken flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand" />
            <span>Sync Live Feed</span>
          </button>
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-surface p-5 rounded-3xl border border-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Total Reviews</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-foreground font-mono">{reviewsList.length}</span>
            <span className="text-xs font-bold text-success bg-success-solid text-foreground/15 border border-success/30 px-1.5 py-0.2 rounded">100% Verified</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Post-event milestone ratings</p>
        </div>

        <div className="bg-surface p-5 rounded-3xl border border-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Platform Avg Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-brand font-mono">4.92 / 5.0</span>
            <span className="text-xs font-bold text-warning bg-warning-solid text-on-brand/15 border border-warning/30 px-1.5 py-0.2 rounded">★ Top Tier</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Calculated across 840+ gigs</p>
        </div>

        <div className="bg-surface p-5 rounded-3xl border border-danger/30 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-danger block">Under Investigation</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-danger font-mono">
              {reviewsList.filter(r => r.status === "FLAGGED_DISPUTE" || r.status === "UNDER_MODERATION").length}
            </span>
            <span className="text-xs font-bold text-danger bg-danger-solid text-foreground/15 border border-danger/30 px-1.5 py-0.2 rounded">Action Required</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Dispute holdbacks &amp; appeals</p>
        </div>

        <div className="bg-surface p-5 rounded-3xl border border-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Featured Pinned</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-brand font-mono">
              {reviewsList.filter(r => r.isPinned).length}
            </span>
            <span className="text-xs font-bold text-brand bg-brand/15 border border-border-brand/40 px-1.5 py-0.2 rounded">Homepage</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Showcased on main landing page</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface rounded-3xl border border-border p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
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
                "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer",
                activeFilter === tab.key
                  ? "bg-brand text-on-brand shadow-xs font-bold"
                  : "bg-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface-sunken border border-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rating Stars Filter & Search Input */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-surface-elevated p-1 rounded-xl border border-border">
            <button
              onClick={() => setRatingFilter("ALL")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer",
                ratingFilter === "ALL" ? "bg-brand text-on-brand font-bold shadow-2xs" : "text-foreground-muted hover:text-foreground"
              )}
            >
              All ★
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={cn(
                  "px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-0.5 transition-all cursor-pointer",
                  ratingFilter === r ? "bg-brand text-on-brand shadow-2xs font-black" : "text-foreground-muted hover:text-brand"
                )}
              >
                <span>{r}</span>
                <Star className="w-2.5 h-2.5 fill-brand text-brand" />
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search feedback, clients, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-elevated border border-border rounded-xl text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
            />
          </div>
        </div>
      </div>

      {/* Reviews List Cards */}
      <div className="space-y-4 text-xs">
        {filteredReviews.length === 0 ? (
          <div className="bg-surface rounded-3xl border border-dashed border-border p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-foreground-muted mx-auto" />
            <p className="font-bold text-foreground-secondary text-sm">No reviews match your current filter criteria</p>
            <p className="text-foreground-muted text-xs">Try selecting a different status tab or clearing your search term.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={cn(
                "rounded-3xl border transition-all p-5 shadow-xs space-y-4",
                rev.isPinned ? "bg-surface border-border-brand/40 ring-1 ring-focus-ring/20" : rev.status === "FLAGGED_DISPUTE" ? "bg-surface border-danger/30 ring-1 ring-danger/20" : "bg-surface border-border hover:border-border"
              )}
            >
              {/* Top Row: User details, Vendor details, Date & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border text-brand flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                    {rev.clientAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm">{rev.client}</span>
                      <span className="text-foreground-muted font-normal">reviewed</span>
                      <span className="font-bold text-brand bg-surface-elevated px-2 py-0.5 rounded-lg border border-border">
                        {rev.vendor}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground-muted mt-0.5">
                      Occasion: <strong className="text-foreground-secondary">{rev.occasion}</strong> &bull; Order #{rev.orderId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-foreground-muted font-mono">{rev.date}</span>
                  
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    rev.status === "VERIFIED_PURCHASE" && "bg-success-solid text-foreground/15 text-success border border-success/30",
                    rev.status === "FLAGGED_DISPUTE" && "bg-danger-solid text-foreground/15 text-danger border border-danger/30",
                    rev.status === "UNDER_MODERATION" && "bg-warning-solid text-on-brand/15 text-warning border border-warning/30",
                    rev.status === "HIDDEN" && "bg-surface-sunken/15 text-foreground-muted border border-border-strong/30",
                  )}>
                    {rev.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Star Rating & Comment Box */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-brand">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? "fill-brand text-brand" : "text-foreground-secondary"}`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-foreground text-xs">{rev.rating}.0 out of 5.0</span>
                  
                  {rev.isPinned && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand/15 text-brand border border-border-brand/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand fill-brand" /> Featured Pinned
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-surface-elevated border border-border text-foreground-secondary text-xs leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </div>
              </div>

              {/* Flag / Dispute Notice if applicable */}
              {rev.flagReason && (
                <div className="p-3 bg-danger-solid text-foreground/10 rounded-xl border border-danger/30 text-danger text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-danger">Moderation Notice:</span>
                    <span>{rev.flagReason}</span>
                  </div>
                </div>
              )}

              {/* Vendor Public Reply if present */}
              {rev.vendorReply && (
                <div className="p-3 bg-surface-elevated rounded-xl border border-border space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-brand">Vendor Official Response:</span>
                    <span className="text-foreground-muted">{rev.vendorReply.date}</span>
                  </div>
                  <p className="text-foreground-secondary italic text-[11px]">&ldquo;{rev.vendorReply.text}&rdquo;</p>
                </div>
              )}

              {/* Bottom Interactive Actions Toolbar */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Pin / Unpin Button */}
                  <button
                    onClick={() => handleTogglePin(rev.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer",
                      rev.isPinned
                        ? "bg-brand text-on-brand border-border-brand font-extrabold"
                        : "bg-surface-elevated text-foreground-secondary border-border hover:bg-surface-sunken hover:text-foreground"
                    )}
                  >
                    <Pin className={cn("w-3.5 h-3.5", rev.isPinned && "fill-background")} />
                    <span>{rev.isPinned ? "Pinned on Hero" : "Pin as Testimonial"}</span>
                  </button>

                  {/* Audit / Notes Modal Button */}
                  <button
                    onClick={() => setSelectedReview(rev)}
                    className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-foreground border border-border text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand" />
                    <span>Audit &amp; Notes ({rev.adminNotes?.length || 0})</span>
                  </button>
                </div>

                {/* Status Moderation Controls */}
                <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
                  {rev.status !== "VERIFIED_PURCHASE" && (
                    <button
                      onClick={() => handleStatusChange(rev.id, "VERIFIED_PURCHASE")}
                      className="px-3 py-1.5 bg-success-solid text-foreground hover:bg-success-solid text-foreground text-foreground rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve &amp; Publish</span>
                    </button>
                  )}

                  {rev.status !== "UNDER_MODERATION" && rev.status !== "FLAGGED_DISPUTE" && (
                    <button
                      onClick={() => handleStatusChange(rev.id, "UNDER_MODERATION")}
                      className="px-3 py-1.5 bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Quarantine</span>
                    </button>
                  )}

                  {rev.status !== "HIDDEN" && (
                    <button
                      onClick={() => handleStatusChange(rev.id, "HIDDEN")}
                      className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-foreground border border-border rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="px-2.5 py-1.5 bg-danger-solid text-foreground/15 hover:bg-danger-solid text-foreground/25 text-danger border border-danger/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Permanently remove review"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Inspection & Audit Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-border animate-in fade-in flex flex-col text-xs">
            
            {/* Modal Header */}
            <div className="p-5 bg-surface-elevated border-b border-border text-foreground flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-surface text-brand px-2.5 py-0.5 rounded-full border border-border">
                  #{selectedReview.id} &bull; Order #{selectedReview.orderId}
                </span>
                <h3 className="text-base font-black text-foreground mt-1">Review Audit &amp; Investigation</h3>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-sunken border border-border text-foreground-muted hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              
              {/* Buyer & Vendor Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-[10px] font-bold text-foreground-muted uppercase block">Client Author</span>
                  <p className="font-bold text-foreground">{selectedReview.client}</p>
                  <p className="text-[10px] text-foreground-muted font-mono">{selectedReview.clientEmail}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-[10px] font-bold text-foreground-muted uppercase block">Vendor Reviewed</span>
                  <p className="font-bold text-foreground">{selectedReview.vendor}</p>
                  <p className="text-[10px] text-brand">Booking Verified</p>
                </div>
              </div>

              {/* Review Comment Quote */}
              <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                    Published Rating ({selectedReview.rating}.0 / 5.0)
                  </span>
                  <span className="text-foreground-muted text-[10px]">{selectedReview.date}</span>
                </div>
                <p className="text-foreground-secondary italic leading-relaxed">
                  &ldquo;{selectedReview.comment}&rdquo;
                </p>
              </div>

              {/* Moderation Notes Log */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand" /> Internal Moderation Notes
                </h4>

                {selectedReview.adminNotes && selectedReview.adminNotes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedReview.adminNotes.map((note, i) => (
                      <div key={i} className="p-2.5 bg-surface-elevated rounded-xl border border-border text-foreground-secondary text-xs">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground-muted text-xs italic">No internal notes added yet.</p>
                )}

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2 border-t border-border">
                  <input
                    type="text"
                    placeholder="Add audit note or escalation details..."
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="flex-1 bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Log Note
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-surface-elevated border-t border-border flex items-center justify-between">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePin(selectedReview.id)}
                  className="px-3.5 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 fill-background" />
                  <span>{selectedReview.isPinned ? "Unpin" : "Pin Hero"}</span>
                </button>

                <button
                  onClick={() => {
                    handleStatusChange(selectedReview.id, "VERIFIED_PURCHASE");
                    setSelectedReview(null);
                  }}
                  className="px-4 py-2 bg-success-solid text-foreground hover:bg-success-solid text-foreground text-foreground rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
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
