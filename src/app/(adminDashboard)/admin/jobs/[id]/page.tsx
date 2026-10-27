"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Send, 
  MessageSquare, 
  ExternalLink,
  Award,
  Sparkles,
  ChevronRight,
  UserCheck,
  Check,
  Building,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetAdminJobByIdQuery, useAwardJobBidMutation } from "@/redux/service/admin/adminApi";

interface VendorBid {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  rating: number;
  reviewsCount: number;
  tier: string;
  bidAmount: number;
  deliveryTime: string;
  pitch: string;
  submittedAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

interface JobDetailData {
  id: string;
  title: string;
  category: string;
  occasion: string;
  status: "OPEN_BIDDING" | "AWARDED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  biddingDeadline: string;
  budgetMin: number;
  budgetMax: number;
  guestCount: number;
  location: string;
  venueName: string;
  eventDate: string;
  eventTime: string;
  description: string;
  requirements: string[];
  client: {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    location: string;
    totalEventsHosted: number;
    memberSince: string;
    isVerified: boolean;
  };
  bids: VendorBid[];
  adminNotes: { id: string; author: string; text: string; date: string }[];
}

const mockJobsDatabase: Record<string, JobDetailData> = {
  "JOB-8492": {
    id: "JOB-8492",
    title: "High-Energy DJ & Emcee for Emma's 5th Birthday Party",
    category: "Music & Entertainment",
    occasion: "Kids Birthday Party",
    status: "OPEN_BIDDING",
    createdAt: "Oct 3, 2026",
    biddingDeadline: "48 hours remaining (Oct 7, 2026)",
    budgetMin: 400,
    budgetMax: 600,
    guestCount: 45,
    location: "Lincoln Park, Chicago, IL",
    venueName: "Lincoln Park Conservatory Garden Room",
    eventDate: "Nov 14, 2026",
    eventTime: "2:00 PM – 5:30 PM (3.5 Hours)",
    description: `We are looking for a lively, kid-friendly DJ who can play upbeat Disney/pop soundtracks, conduct interactive musical freeze-dance games for 4 to 6 year olds, and provide a wireless microphone for birthday toasts and cake cutting. The venue has sound restrictions so clean, controllable sound equipment is required.`,
    requirements: [
      "Kid-friendly playlist curation (Disney, Kidz Bop, Upbeat Pop)",
      "Interactive games coordination (Freeze dance, Limbo, Simon Says)",
      "Wireless microphone for parent speeches and announcements",
      "Compact sound system suitable for 50-person indoor garden room",
      "Full setup completed 45 minutes prior to guest arrival",
    ],
    client: {
      id: "C-101",
      name: "Emily Carter",
      avatar: "EC",
      email: "emily.carter@example.com",
      phone: "+1 (312) 555-0194",
      location: "Lincoln Park, Chicago, IL",
      totalEventsHosted: 3,
      memberSince: "Jan 2024",
      isVerified: true,
    },
    bids: [
      {
        id: "BID-1",
        vendorId: "V-101",
        vendorName: "Party Pulse Events (Marcus Reed)",
        vendorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        rating: 4.95,
        reviewsCount: 142,
        tier: "Elite Level 2 Vendor",
        bidAmount: 480,
        deliveryTime: "3.5 Hours Performance",
        pitch: "Hi Emily! I specialize in high-energy family and kids celebrations. I'll bring two wireless mics, colorful safe LED wash lights, and lead interactive games like freeze dance. Fully insured and ready!",
        submittedAt: "Yesterday at 3:15 PM",
        status: "PENDING",
      },
      {
        id: "BID-2",
        vendorId: "V-105",
        vendorName: "SoundWave Pro DJs",
        vendorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 4.8,
        reviewsCount: 76,
        tier: "Verified Partner",
        bidAmount: 450,
        deliveryTime: "3.5 Hours Performance",
        pitch: "We can provide a great sound system with customized kids playlist and microphone. All cables will be safely taped down.",
        submittedAt: "Oct 4 at 10:00 AM",
        status: "PENDING",
      },
      {
        id: "BID-3",
        vendorId: "V-108",
        vendorName: "Groove Masters Chicago",
        vendorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        rating: 4.9,
        reviewsCount: 110,
        tier: "Top Rated Vendor",
        bidAmount: 550,
        deliveryTime: "4 Hours Performance",
        pitch: "Includes custom party props, glow sticks for all kids, wireless mics, and emcee coordination.",
        submittedAt: "Oct 4 at 1:45 PM",
        status: "PENDING",
      },
    ],
    adminNotes: [
      {
        id: "n-1",
        author: "Admin (Moderation)",
        text: "Job RFP verified and approved for vendor bidding. Budget aligns with marketplace averages.",
        date: "Oct 3, 2026",
      },
    ],
  },
  "JOB-8490": {
    id: "JOB-8490",
    title: "Full-Day Wedding DJ with wireless mic setup",
    category: "Music & Entertainment",
    occasion: "Wedding Reception",
    status: "OPEN_BIDDING",
    createdAt: "Oct 2, 2026",
    biddingDeadline: "5 days remaining",
    budgetMin: 800,
    budgetMax: 1500,
    guestCount: 120,
    location: "Naperville, IL",
    venueName: "Meson Sabika Estate",
    eventDate: "Oct 24, 2026",
    eventTime: "4:00 PM – 11:00 PM (7 Hours)",
    description: `Need an experienced wedding DJ & MC for both outdoor patio ceremony and indoor Spanish villa reception. Sound switching between zones and wireless lapel mics for the officiant required.`,
    requirements: [
      "Separate sound setup for outdoor ceremony & reception hall",
      "Wireless lapel mic for officiant + handheld mic for toasts",
      "Intelligent dance lighting package",
      "Coordination with wedding planner for entrance timing",
    ],
    client: {
      id: "C-102",
      name: "Sarah Jenkins",
      avatar: "SJ",
      email: "sarah.jenkins@example.com",
      phone: "+1 (630) 555-0812",
      location: "Naperville, IL",
      totalEventsHosted: 1,
      memberSince: "Jun 2024",
      isVerified: true,
    },
    bids: [
      {
        id: "BID-4",
        vendorId: "V-101",
        vendorName: "Party Pulse Events (Marcus Reed)",
        vendorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        rating: 4.95,
        reviewsCount: 142,
        tier: "Elite Level 2 Vendor",
        bidAmount: 1200,
        deliveryTime: "7 Hours Full Day",
        pitch: "Full dual-zone sound system with ceremony lapel mic and computerized dance floor wash lighting.",
        submittedAt: "Oct 3 at 11:00 AM",
        status: "PENDING",
      },
    ],
    adminNotes: [
      {
        id: "n-2",
        author: "Admin",
        text: "Client verified phone and payment method on file.",
        date: "Oct 2, 2026",
      },
    ],
  },
  "JOB-8488": {
    id: "JOB-8488",
    title: "Corporate Holiday Mixer DJ & Ambient Lighting",
    category: "Corporate Events",
    occasion: "Corporate Holiday Party",
    status: "OPEN_BIDDING",
    createdAt: "Sep 28, 2026",
    biddingDeadline: "12 days remaining",
    budgetMin: 500,
    budgetMax: 900,
    guestCount: 85,
    location: "The Loop, Chicago, IL",
    venueName: "Mid-America Club 80th Floor",
    eventDate: "Dec 04, 2026",
    eventTime: "6:00 PM – 10:00 PM (4 Hours)",
    description: `Sophisticated holiday celebration with lounge, Motown, and classic cocktail music transitioning into modern dance hits. COI required for skyscraper freight elevator access.`,
    requirements: [
      "Certificate of Insurance ($2M) naming building management",
      "Load-in via freight elevator by 4:30 PM",
      "Corporate-appropriate announcements and raffle coordination",
    ],
    client: {
      id: "C-103",
      name: "TechForward Group (Loop)",
      avatar: "TF",
      email: "events@techforward.io",
      phone: "+1 (312) 555-7733",
      location: "Chicago, IL",
      totalEventsHosted: 5,
      memberSince: "Nov 2023",
      isVerified: true,
    },
    bids: [],
    adminNotes: [],
  },
};

export default function AdminJobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const jobId = resolvedParams.id;

  const { data: apiJob, isLoading } = useGetAdminJobByIdQuery(jobId);
  const [awardJobBidMutation] = useAwardJobBidMutation();
  const [localNotes, setLocalNotes] = useState<{ id: string; author: string; text: string; date: string }[]>([]);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const initialJob = mockJobsDatabase[jobId] || mockJobsDatabase["JOB-8492"];

  const job: JobDetailData = apiJob ? {
    id: apiJob.id,
    title: apiJob.title,
    category: apiJob.category?.name || "Celebration Service",
    occasion: apiJob.occasion || "Celebration",
    status: (localStatus || apiJob.status || "OPEN_BIDDING") as any,
    createdAt: apiJob.createdAt ? new Date(apiJob.createdAt).toLocaleDateString() : "Recently",
    biddingDeadline: apiJob.biddingDeadline ? new Date(apiJob.biddingDeadline).toLocaleDateString() : "Open RFP",
    budgetMin: Number(apiJob.budgetMin || 0),
    budgetMax: Number(apiJob.budgetMax || 0),
    guestCount: apiJob.guestCount || 0,
    location: apiJob.location || "Chicago, IL",
    venueName: apiJob.location || "Private Venue",
    eventDate: apiJob.eventDate ? new Date(apiJob.eventDate).toLocaleDateString() : "Upcoming",
    eventTime: apiJob.duration || "Scheduled duration",
    description: apiJob.description || "",
    requirements: apiJob.specialRequests ? [apiJob.specialRequests] : [
      "Custom deliverables as agreed with buyer",
      "Full on-site or digital coordination",
      "Setup completed prior to celebration arrival"
    ],
    client: {
      id: apiJob.clientProfileId || "C-1",
      name: apiJob.clientProfile?.displayName || "Event Host",
      avatar: (apiJob.clientProfile?.displayName || "EH").substring(0, 2).toUpperCase(),
      email: apiJob.clientProfile?.user?.email || "buyer@marketplace.com",
      phone: "+1 (312) 555-0199",
      location: apiJob.location || "Chicago, IL",
      totalEventsHosted: 1,
      memberSince: apiJob.clientProfile?.user?.createdAt ? new Date(apiJob.clientProfile.user.createdAt).getFullYear().toString() : "2026",
      isVerified: true,
    },
    bids: (apiJob.offers || []).map((o: any) => ({
      id: o.id,
      vendorId: o.vendorProfileId,
      vendorName: o.vendorProfile?.businessName || "Vendor Vendor",
      vendorAvatar: o.vendorProfile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      rating: Number(o.vendorProfile?.rating || 5.0),
      reviewsCount: 12,
      tier: o.vendorProfile?.tier || "PRO Vendor",
      bidAmount: Number(o.price || 0),
      deliveryTime: o.estimatedHours || "Agreed Schedule",
      pitch: o.message || "Custom bid offer submitted.",
      submittedAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent",
      status: o.status || "PENDING",
    })),
    adminNotes: [...localNotes, ...(initialJob?.adminNotes || [])],
  } : {
    ...initialJob,
    id: jobId,
    status: (localStatus || initialJob?.status || "OPEN_BIDDING") as any,
    adminNotes: [...localNotes, ...(initialJob?.adminNotes || [])],
  };

  const [newNote, setNewNote] = useState("");

  const handleStatusChange = (newStatus: JobDetailData["status"]) => {
    setLocalStatus(newStatus);
    toast.success(`Job #${job.id} status updated to ${newStatus}.`);
  };

  const handleAwardBid = async (bid: VendorBid) => {
    try {
      await awardJobBidMutation({ jobId, offerId: bid.id }).unwrap();
      setLocalStatus("AWARDED");
      toast.success(`Job awarded to ${bid.vendorName}! Escrow hold initialized.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to award bid contract");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteItem = {
      id: `n-${Date.now()}`,
      author: "Admin (You)",
      text: newNote,
      date: "Just now",
    };

    setLocalNotes(prev => [noteItem, ...prev]);
    setNewNote("");
    toast.success("Internal audit note appended.");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className="p-2.5 rounded-xl bg-surface-elevated border border-border hover:bg-surface-sunken text-foreground-secondary transition-colors shadow-2xs flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                Job RFP &amp; Bids Audit
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-surface-elevated text-brand border border-border">
                #{job.id}
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase",
                  job.status === "OPEN_BIDDING"
                    ? "bg-info-solid text-foreground/15 text-info border border-info/30"
                    : job.status === "AWARDED"
                    ? "bg-success-solid text-foreground/15 text-success border border-success/30"
                    : "bg-surface-sunken/15 text-foreground-muted border border-border-strong/30"
                )}
              >
                {job.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">
              Category: <span className="font-semibold text-foreground-secondary">{job.category}</span> &bull; Occasion: <span className="font-semibold text-foreground-secondary">{job.occasion}</span> &bull; Posted {job.createdAt}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {job.status === "OPEN_BIDDING" && (
            <button
              onClick={() => handleStatusChange("AWARDED")}
              className="px-3.5 py-2 rounded-xl bg-success-solid text-foreground hover:bg-success-solid text-foreground text-foreground text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark as Awarded
            </button>
          )}

          {job.status !== "CANCELLED" && (
            <button
              onClick={() => handleStatusChange("CANCELLED")}
              className="px-3.5 py-2 rounded-xl bg-danger-solid text-foreground hover:bg-danger-solid text-foreground text-foreground text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Cancel RFP
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Job Specs, Requirements, Vendor Bids) / Right 1 Col (Client info, Escrow, Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Overview Card */}
          <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-brand/15 text-brand border border-border-brand/40 text-[11px] font-bold">
                  {job.category}
                </span>
                <span className="text-xs text-brand font-bold bg-surface-elevated px-2.5 py-1 rounded-full border border-border flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand" />
                  {job.biddingDeadline}
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-black text-foreground mt-2">
                {job.title}
              </h2>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-surface-elevated rounded-2xl border border-border">
              <div>
                <span className="text-foreground-muted text-[10px] uppercase font-bold block">Budget Range</span>
                <span className="text-base font-black text-brand font-mono mt-0.5 block">
                  ${job.budgetMin} – ${job.budgetMax}
                </span>
              </div>
              <div>
                <span className="text-foreground-muted text-[10px] uppercase font-bold block">Event Date</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">{job.eventDate}</span>
                <span className="text-[10px] text-foreground-muted">{job.eventTime}</span>
              </div>
              <div>
                <span className="text-foreground-muted text-[10px] uppercase font-bold block">Guest Count</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand" /> {job.guestCount} Guests
                </span>
              </div>
              <div>
                <span className="text-foreground-muted text-[10px] uppercase font-bold block">Location</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block line-clamp-1">{job.venueName}</span>
                <span className="text-[10px] text-foreground-muted line-clamp-1">{job.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Event Overview &amp; Client Description
              </h3>
              <p className="text-foreground-secondary leading-relaxed text-xs">
                {job.description}
              </p>
            </div>

            {/* Inclusions / Scope Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand" /> Specific Requirements &amp; Deliverables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-surface-elevated border border-border">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary leading-snug">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vendor Proposals & Bids Table */}
          <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand" /> Vendor Proposals &amp; Bids Received ({job.bids.length})
                </h3>
                <p className="text-xs text-foreground-muted">
                  Inspect vendor quotes, proposal messages, ratings, and award contracts on behalf of buyers.
                </p>
              </div>
            </div>

            {job.bids.length === 0 ? (
              <div className="p-8 text-center bg-surface-elevated rounded-2xl border border-dashed border-border">
                <Briefcase className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
                <p className="text-foreground-secondary font-bold">No vendor bids placed yet</p>
                <p className="text-foreground-muted text-xs mt-0.5">Job is currently distributed to verified marketplace vendors.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {job.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={cn(
                      "p-4 rounded-2xl border transition-all space-y-3",
                      bid.status === "ACCEPTED"
                        ? "bg-success-soft text-success border-success/30 shadow-xs"
                        : "bg-surface-elevated border-border hover:border-border-brand/40"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Vendor Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-xs flex-shrink-0">
                          <img src={bid.vendorAvatar} alt={bid.vendorName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground text-xs sm:text-sm">{bid.vendorName}</h4>
                            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-brand/15 text-brand border border-border-brand/40">
                              {bid.tier}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-foreground-muted mt-0.5">
                            <span className="flex items-center text-brand font-bold">
                              <Star className="w-3 h-3 fill-brand mr-0.5" />
                              {bid.rating} ({bid.reviewsCount})
                            </span>
                            <span>&bull;</span>
                            <span>Submitted {bid.submittedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bid Quote & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-foreground-muted uppercase font-bold block">Bid Quote</span>
                          <span className="text-base sm:text-lg font-black text-brand font-mono">${bid.bidAmount}</span>
                          <span className="text-[10px] text-foreground-muted block">{bid.deliveryTime}</span>
                        </div>

                        {bid.status === "ACCEPTED" ? (
                          <div className="px-3 py-1.5 bg-success-solid text-foreground/20 border border-success/30 text-success rounded-xl text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Awarded
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAwardBid(bid)}
                            className="px-3 py-1.5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-xs"
                          >
                            Award Contract
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Proposal Pitch */}
                    <div className="p-3 bg-surface rounded-xl border border-border text-foreground-secondary text-xs leading-relaxed italic">
                      "{bid.pitch}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Host Buyer Profile, Escrow, Admin Notes */}
        <div className="space-y-6">

          {/* Client (Host) Card */}
          <div className="bg-surface rounded-3xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                Event Host (Buyer)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-solid text-foreground/15 text-success border border-success/30">
                Verified Buyer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-elevated border border-border text-brand flex items-center justify-center font-bold text-sm shadow-xs">
                {job.client.avatar}
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1">
                  {job.client.name}
                  {job.client.isVerified && <ShieldCheck className="w-4 h-4 text-success" />}
                </h4>
                <p className="text-foreground-muted text-[11px]">{job.client.location}</p>
                <span className="text-[10px] text-foreground-muted">Member since {job.client.memberSince}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border text-foreground-secondary text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-foreground-muted" />
                <span className="font-mono text-[11px]">{job.client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-foreground-muted" />
                <span className="font-mono text-[11px]">{job.client.phone}</span>
              </div>
            </div>
          </div>

          {/* Escrow Custody & Fee Estimation */}
          <div className="bg-surface border border-border text-foreground rounded-3xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                Marketplace Escrow
              </span>
              <ShieldCheck className="w-4 h-4 text-success" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-foreground-muted">Budget Range Held on Reserve:</span>
              <h3 className="text-xl font-black text-brand font-mono">
                ${job.budgetMin} – ${job.budgetMax}
              </h3>
            </div>

            <div className="p-3 bg-surface-elevated rounded-xl border border-border space-y-1.5 text-[11px]">
              <div className="flex justify-between text-foreground-secondary">
                <span>Vendor Platform Fee (10%):</span>
                <span className="font-mono font-bold text-foreground">${job.budgetMax * 0.1}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary">
                <span>Client Service Fee (5%):</span>
                <span className="font-mono font-bold text-foreground">${job.budgetMax * 0.05}</span>
              </div>
            </div>
          </div>

          {/* Admin Internal Audit Notes */}
          <div className="bg-surface rounded-3xl border border-border p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand" /> Internal Audit Log
              </h4>
              <span className="text-foreground-muted text-[10px] font-bold">{job.adminNotes.length} notes</span>
            </div>

            {/* Note list */}
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {job.adminNotes.map((note) => (
                <div key={note.id} className="p-3 bg-surface-elevated rounded-xl border border-border space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-foreground">{note.author}</span>
                    <span className="text-foreground-muted">{note.date}</span>
                  </div>
                  <p className="text-foreground-secondary text-[11px] leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-border">
              <textarea
                rows={2}
                placeholder="Log internal job moderation note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
              />
              <button
                type="submit"
                className="w-full py-2 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-secondary hover:text-foreground rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                <Send className="w-3.5 h-3.5" /> Append Note
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
