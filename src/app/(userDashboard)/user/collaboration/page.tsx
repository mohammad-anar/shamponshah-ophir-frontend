"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Users2, 
  Plus, 
  ThumbsUp, 
  Check, 
  Sparkles, 
  UserPlus, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Trash2, 
  ArrowRight, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  Lock,
  MessageSquare,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetWorkspaceQuery,
  useAddBoardItemMutation,
  useVoteBoardItemMutation,
  useInviteMemberMutation,
  useDeleteBoardItemMutation,
} from "@/redux/service/family-hub/familyHubApi";
import { useGetPublicGigsQuery } from "@/redux/service/gigs/gigsApi";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import FamilyPaymentModal from "@/components/user/FamilyPaymentModal";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email?: string;
  status?: string;
}

interface ServiceCardItem {
  id: string;
  boardItemId: string;
  gigId?: string;
  vendorId?: string;
  title: string;
  category: string;
  image: string;
  vendorName: string;
  vendorAvatar: string;
  vendorRating: number;
  vendorReviewCount: number;
  vendorTier: string;
  location: string;
  price: number;
  status: "SHORTLISTED" | "IN_PROGRESS" | "BOOKED";
  recommendedBy: {
    name: string;
    avatar: string;
    role: string;
    date: string;
  };
  note: string;
  votesUp: number;
  votedBy: string[];
  inclusions: string[];
}

export default function CollaborationSuitePage() {
  const router = useRouter();
  const { data: meData } = useGetMeQuery();
  const { data: wsData, isLoading: isWsLoading } = useGetWorkspaceQuery();
  const { data: publicGigsResp } = useGetPublicGigsQuery();
  const [addBoardItem, { isLoading: isAddingItem }] = useAddBoardItemMutation();
  const [voteBoardItem] = useVoteBoardItemMutation();
  const [deleteBoardItem] = useDeleteBoardItemMutation();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();

  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "in_progress" | "booked">("all");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("COLLABORATOR");

  // Payment Modal state for booking
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<any>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Recommend Service modal state
  const [recommendModalOpen, setRecommendModalOpen] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Cinematography");
  const [customPrice, setCustomPrice] = useState("");
  const [recommendationNote, setRecommendationNote] = useState("");

  // Brain Dump notepad state (persisted in localStorage for convenience)
  const [brainDumpText, setBrainDumpText] = useState("");
  const [isSavingBrainDump, setIsSavingBrainDump] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ophir_collaboration_braindump");
    if (saved) setBrainDumpText(saved);
  }, []);

  const handleSaveBrainDump = () => {
    setIsSavingBrainDump(true);
    localStorage.setItem("ophir_collaboration_braindump", brainDumpText);
    setTimeout(() => {
      setIsSavingBrainDump(false);
      toast.success("Brain dump notes saved to your workspace.");
    }, 300);
  };

  const me = (meData as any)?.data || meData;
  const ws = wsData?.data || wsData;
  const eventTitle = ws?.name || "Heritage Gala 2026";

  // Public gigs for quick picker
  const availableGigs = publicGigsResp?.data || (Array.isArray(publicGigsResp) ? publicGigsResp : []);

  // Collaborators List
  const collaborators: Collaborator[] = useMemo(() => {
    const list: Collaborator[] = [];
    const ownerName =
      ws?.owner?.displayName ||
      ws?.owner?.user?.name ||
      me?.name ||
      me?.email?.split("@")[0] ||
      "Lead Host (You)";

    list.push({
      id: ws?.owner?.id || "owner",
      name: `${ownerName}`,
      avatar: ownerName.slice(0, 2).toUpperCase(),
      role: "Lead Host",
      email: ws?.owner?.user?.email || me?.email,
      status: "Active",
    });

    if (ws?.members && Array.isArray(ws.members)) {
      ws.members.forEach((m: any, idx: number) => {
        if (m.userId !== ws?.owner?.userId && m.user?.id !== me?.id) {
          const name = m.user?.name || m.user?.email?.split("@")[0] || m.inviteEmail || `Collaborator ${idx + 1}`;
          list.push({
            id: m.id || `collab-${idx}`,
            name,
            avatar: name.slice(0, 2).toUpperCase(),
            role: m.role || "Team Collaborator",
            email: m.user?.email || m.inviteEmail,
            status: "Active",
          });
        }
      });
    }

    return list;
  }, [ws, me]);

  // Parse Services from database board items
  const services: ServiceCardItem[] = useMemo(() => {
    const primaryBoard = ws?.boards?.[0];
    const items = primaryBoard?.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    return items.map((item: any) => {
      let parsed: any = {};
      try {
        parsed = typeof item.notes === "string" ? JSON.parse(item.notes) : (item.notes || {});
      } catch {
        parsed = { note: item.notes };
      }

      const votes = item.votes || {};
      const votesUpCount = Object.values(votes).filter((v) => v === "YES").length;

      let itemStatus: "SHORTLISTED" | "IN_PROGRESS" | "BOOKED" = "SHORTLISTED";
      if (item.status === "BOOKED") {
        itemStatus = "BOOKED";
      } else if (item.status === "IN_PROGRESS") {
        itemStatus = "IN_PROGRESS";
      }

      return {
        id: item.gigId || item.id,
        boardItemId: item.id,
        gigId: item.gigId,
        vendorId: item.vendorId || parsed.vendorId,
        title: item.title,
        category: parsed.category || "Heritage Artisan",
        image: parsed.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        vendorName: parsed.vendorName || "Verified Artisan",
        vendorAvatar: parsed.vendorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        vendorRating: parsed.vendorRating || 4.95,
        vendorReviewCount: parsed.vendorReviewCount || 12,
        vendorTier: parsed.vendorTier || "Elite Guild",
        location: parsed.location || "San Francisco, CA",
        price: Number(parsed.price || 0),
        status: itemStatus,
        recommendedBy: {
          name: parsed.addedByName || "Collaborator",
          avatar: (parsed.addedByName || "CO").slice(0, 2).toUpperCase(),
          role: "Collaborator",
          date: new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
        },
        note: parsed.note || "Shortlisted for collaborative review and milestone escrow booking.",
        votesUp: votesUpCount,
        votedBy: Object.keys(votes),
        inclusions: parsed.inclusions || ["FDIC Escrow Protected", "Dedicated Artisan Briefing"],
      };
    });
  }, [ws]);

  // Tab filtering
  const filteredServices = useMemo(() => {
    if (activeTab === "shortlisted") return services.filter((s) => s.status === "SHORTLISTED");
    if (activeTab === "in_progress") return services.filter((s) => s.status === "IN_PROGRESS");
    if (activeTab === "booked") return services.filter((s) => s.status === "BOOKED");
    return services;
  }, [services, activeTab]);

  // Budget calculations
  const totalBudget = 50000;
  const bookedTotal = useMemo(() => {
    return services.filter((s) => s.status === "BOOKED").reduce((sum, s) => sum + s.price, 0);
  }, [services]);
  const shortlistedTotal = useMemo(() => {
    return services.filter((s) => s.status === "SHORTLISTED").reduce((sum, s) => sum + s.price, 0);
  }, [services]);

  // Voting handler
  const handleVote = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    try {
      await voteBoardItem({ itemId, vote: "YES" }).unwrap();
      toast.success("Vote recorded! Your collaborator vote was counted.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not record vote.");
    }
  };

  // Delete handlers
  const handleDeleteClick = (e: React.MouseEvent, itemId: string, title: string) => {
    e.stopPropagation();
    setItemToDelete({ id: itemId, title });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeletingItem(true);
    try {
      await deleteBoardItem(itemToDelete.id).unwrap();
      toast.success(`Removed "${itemToDelete.title}" from collaboration board.`);
      setItemToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item.");
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Add Item handler
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalTitle = customTitle.trim();
    let finalCategory = customCategory;
    let finalPrice = Number(customPrice) || 0;
    let finalVendorName = "Independent Artisan";
    let finalVendorAvatar = "";
    let finalImage = "";

    if (selectedGigId) {
      const selected = availableGigs.find((g: any) => g.id === selectedGigId);
      if (selected) {
        finalTitle = selected.title;
        finalCategory = selected.category?.name || selected.category || customCategory;
        finalPrice = selected.price || finalPrice;
        finalVendorName = selected.vendor?.name || selected.vendor?.displayName || "Verified Vendor";
        finalVendorAvatar = selected.vendor?.avatarUrl || "";
        finalImage = selected.coverImage || selected.images?.[0] || "";
      }
    }

    if (!finalTitle) {
      toast.error("Please enter a service title or pick from available services.");
      return;
    }

    try {
      await addBoardItem({
        data: {
          gigId: selectedGigId || undefined,
          title: finalTitle,
          notes: JSON.stringify({
            category: finalCategory,
            price: finalPrice,
            vendorName: finalVendorName,
            vendorAvatar: finalVendorAvatar,
            image: finalImage,
            note: recommendationNote || "Shortlisted for collaborative review.",
            addedByName: me?.name || "Collaborator",
          }),
          status: "SHORTLISTED",
        },
      }).unwrap();

      toast.success(`Added "${finalTitle}" to Collaboration Suite!`);
      setRecommendModalOpen(false);
      setSelectedGigId("");
      setCustomTitle("");
      setCustomPrice("");
      setRecommendationNote("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add service.");
    }
  };

  // Invite Collaborator handler
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await inviteMember({ email: inviteEmail, role: inviteRole }).unwrap();
      toast.success(`Invitation sent to ${inviteEmail} as ${inviteRole}!`);
      setInviteEmail("");
      setInviteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send invitation.");
    }
  };

  // Open booking modal
  const handleInitiateBooking = (service: ServiceCardItem) => {
    setSelectedServiceForPayment({
      id: service.boardItemId,
      title: service.title,
      vendorName: service.vendorName,
      totalPrice: service.price,
      amountPaid: 0,
    });
    setPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb / Title Bar matching Figma 4E1FFD57 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-foreground-muted mb-1 font-semibold">
            <Link href="/user" className="hover:text-foreground">Portal</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand">Collaboration Suite</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{eventTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {eventTitle}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-surface-sunken border border-border text-[11px] font-bold text-brand uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Active Workspace
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Collaborative planning suite for hosts, co-planners, and decision makers. All milestone deposits held securely in escrow.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="h-10 px-4 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-brand" />
            <span>Invite Collaborator</span>
          </button>

          <button
            onClick={() => setRecommendModalOpen(true)}
            className="h-10 px-5 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-gold-glow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service to Board</span>
          </button>
        </div>
      </div>

      {/* Escrow Health & Budget Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-[11px] text-foreground-muted font-bold uppercase tracking-wider">
            <span>Escrow Funded</span>
            <ShieldCheck className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-serif font-bold text-foreground font-mono">
            ${bookedTotal.toLocaleString()}
          </div>
          <p className="text-[10px] text-foreground-muted">Secured with 100% milestone protection</p>
        </div>

        <div className="p-4 bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-[11px] text-foreground-muted font-bold uppercase tracking-wider">
            <span>Shortlisted Value</span>
            <DollarSign className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-serif font-bold text-foreground font-mono">
            ${shortlistedTotal.toLocaleString()}
          </div>
          <p className="text-[10px] text-foreground-muted">{services.filter(s => s.status === 'SHORTLISTED').length} services awaiting team vote</p>
        </div>

        <div className="p-4 bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-[11px] text-foreground-muted font-bold uppercase tracking-wider">
            <span>Active Planners</span>
            <Users2 className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-serif font-bold text-foreground">
            {collaborators.length}
          </div>
          <p className="text-[10px] text-foreground-muted">Collaborators with voting rights</p>
        </div>

        <div className="p-4 bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-[11px] text-foreground-muted font-bold uppercase tracking-wider">
            <span>Decision Target</span>
            <Clock className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-serif font-bold text-foreground">
            18 Days Left
          </div>
          <p className="text-[10px] text-foreground-muted">Milestone lock before celebration</p>
        </div>
      </div>

      {/* Main Workspace Layout matching Figma 4E1FFD57 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Brain Dump & Active Planners (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Brain Dump Section */}
          <div className="bg-surface border border-border p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand" />
                <h3 className="font-serif font-bold text-sm text-foreground">Brain Dump</h3>
              </div>
              <span className="text-[10px] text-foreground-muted font-mono uppercase">Live Pad</span>
            </div>

            <p className="text-[11px] text-foreground-muted">
              Jot down cultural requests, venue ideas, dietary restrictions, and collaborator inspirations.
            </p>

            <textarea
              rows={6}
              value={brainDumpText}
              onChange={(e) => setBrainDumpText(e.target.value)}
              placeholder="e.g. Traditional West African palm wine ceremony requirement; Mandap floral color scheme must match champagne gold; Check with Uncle David on guest list..."
              className="w-full bg-surface-elevated border border-border p-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-brand resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-foreground-muted">Auto-persisted to local workspace</span>
              <button
                type="button"
                onClick={handleSaveBrainDump}
                disabled={isSavingBrainDump}
                className="px-3.5 py-1.5 bg-surface-sunken hover:bg-surface-elevated border border-border text-[11px] font-bold uppercase tracking-wider text-brand cursor-pointer"
              >
                {isSavingBrainDump ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>

          {/* 2. Active Planners / Collaborators List */}
          <div className="bg-surface border border-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-brand" />
                <h3 className="font-serif font-bold text-sm text-foreground">Active Planners</h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(true)}
                className="text-[10px] font-bold uppercase tracking-wider text-brand hover:underline cursor-pointer"
              >
                + Invite
              </button>
            </div>

            <div className="space-y-3">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="p-3 bg-surface-elevated border border-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand text-black font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {collab.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-snug">{collab.name}</p>
                      <p className="text-[10px] text-foreground-muted">{collab.email || "Registered Collaborator"}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-surface-sunken text-brand border border-border">
                      {collab.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface-sunken border border-border/80 text-[11px] text-foreground-muted flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
              <span>Invited team collaborators can shortlist vendors, vote on proposals, and review milestone budgets.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Flow Management Kanban (col-span-8) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Kanban Flow Controls */}
          <div className="bg-surface border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-base text-foreground">Flow Management</h2>
              <p className="text-[11px] text-foreground-muted">Vote on candidates, review terms, and execute milestone escrow reservations.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-surface-sunken p-1 border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-surface-elevated text-brand border border-border" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                All ({services.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shortlisted")}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "shortlisted" ? "bg-surface-elevated text-brand border border-border" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                Shortlisted ({services.filter(s => s.status === 'SHORTLISTED').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("booked")}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "booked" ? "bg-surface-elevated text-brand border border-border" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                Secured ({services.filter(s => s.status === 'BOOKED').length})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredServices.length === 0 ? (
            <div className="bg-surface border border-border p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-surface-sunken text-brand border border-border flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-foreground">No Services in This Stage</h3>
                <p className="text-xs text-foreground-muted max-w-md mx-auto">
                  Browse award-winning cultural artisans from the marketplace and recommend them to your collaboration workspace.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/services"
                  className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Browse Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => setRecommendModalOpen(true)}
                  className="px-5 py-2.5 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  + Add Custom Service
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => {
                const isBooked = service.status === "BOOKED";

                return (
                  <div
                    key={service.boardItemId}
                    className="bg-surface border border-border flex flex-col justify-between overflow-hidden group hover:border-brand/40 transition-all shadow-xs"
                  >
                    <div>
                      {/* Image header with Category Tag and Escrow status */}
                      <div className="relative h-44 w-full bg-surface-sunken overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-black/80 backdrop-blur-xs text-[10px] font-bold text-brand uppercase tracking-wider border border-border-brand/40">
                            {service.category}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {isBooked ? (
                            <span className="px-2.5 py-1 bg-brand text-black text-[10px] font-bold uppercase tracking-wider">
                              Secured in Escrow
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-black/80 text-[10px] font-bold text-warning uppercase tracking-wider border border-border">
                              Awaiting Votes
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, service.boardItemId, service.title)}
                            className="p-1 bg-black/80 hover:bg-black text-foreground-muted hover:text-danger border border-border cursor-pointer transition-colors"
                            title="Remove from board"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand text-black text-xs font-bold flex items-center justify-center border border-black/40">
                              {service.vendorName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight drop-shadow-sm">{service.vendorName}</p>
                              <span className="text-[10px] text-zinc-300 drop-shadow-sm">{service.vendorTier}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-mono font-bold text-brand drop-shadow-sm">
                              ${service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-3">
                        <h4 className="font-serif font-bold text-sm text-foreground line-clamp-1">
                          {service.title}
                        </h4>

                        <div className="p-2.5 bg-surface-elevated border border-border/80 text-[11px] text-foreground-muted italic leading-relaxed">
                          &ldquo;{service.note}&rdquo;
                          <span className="block not-italic font-semibold text-foreground text-[10px] mt-1 text-right">
                            — Added by {service.recommendedBy.name}
                          </span>
                        </div>

                        {/* Inclusions / Perks */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {service.inclusions.slice(0, 2).map((inc, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-surface-sunken border border-border text-foreground-secondary"
                            >
                              <CheckCircle2 className="w-3 h-3 text-brand" />
                              <span>{inc}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-4 border-t border-border bg-surface-elevated flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleVote(e, service.boardItemId)}
                        className="h-9 px-3 bg-surface border border-border hover:border-brand/40 text-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-brand" />
                        <span>{service.votesUp} {service.votesUp === 1 ? "Vote" : "Votes"}</span>
                      </button>

                      {isBooked ? (
                        <Link
                          href="/user/orders"
                          className="h-9 px-4 bg-surface-sunken border border-border text-brand text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-surface"
                        >
                          <span>Manage Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleInitiateBooking(service)}
                          className="h-9 px-4 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-gold-glow-sm"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Book with Escrow</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel: Critical Paths Table matching Figma 4E1FFD57 */}
      <div className="bg-surface border border-border p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-serif font-bold text-base text-foreground">Critical Paths & Timeline</h3>
            <p className="text-xs text-foreground-muted">Milestone delivery checkpoints and assigned collaborator oversight.</p>
          </div>
          <span className="text-xs font-mono font-bold text-brand uppercase tracking-wider">
            Phase 1 of 3 Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-foreground-muted uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Phase</th>
                <th className="py-3 px-3">Milestone / Scope</th>
                <th className="py-3 px-3">Assigned Lead</th>
                <th className="py-3 px-3">Escrow Status</th>
                <th className="py-3 px-3">Target Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-3 font-bold text-brand">Phase 1</td>
                <td className="py-3 px-3 font-semibold text-foreground">Artisan Shortlisting & Team Voting</td>
                <td className="py-3 px-3 text-foreground-muted">{collaborators[0]?.name || "Lead Host"}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 bg-brand-soft border border-brand/30 text-brand text-[10px] font-bold uppercase">
                    In Progress
                  </span>
                </td>
                <td className="py-3 px-3 text-foreground-muted">Nov 15, 2026</td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => setRecommendModalOpen(true)}
                    className="text-brand hover:underline font-bold text-xs cursor-pointer"
                  >
                    Add Service
                  </button>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-brand">Phase 2</td>
                <td className="py-3 px-3 font-semibold text-foreground">100% Milestone Escrow Funding</td>
                <td className="py-3 px-3 text-foreground-muted">Finance Collaborator</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 bg-surface-sunken border border-border text-foreground-muted text-[10px] font-bold uppercase">
                    Scheduled
                  </span>
                </td>
                <td className="py-3 px-3 text-foreground-muted">Nov 28, 2026</td>
                <td className="py-3 px-3 text-right">
                  <Link href="/user/payments" className="text-foreground hover:text-brand font-bold text-xs">
                    View Invoices
                  </Link>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-brand">Phase 3</td>
                <td className="py-3 px-3 font-semibold text-foreground">Day-of Execution & Signoff Inspection</td>
                <td className="py-3 px-3 text-foreground-muted">Event Collective</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 bg-surface-sunken border border-border text-foreground-muted text-[10px] font-bold uppercase">
                    Locked
                  </span>
                </td>
                <td className="py-3 px-3 text-foreground-muted">Dec 18, 2026</td>
                <td className="py-3 px-3 text-right">
                  <span className="text-foreground-muted text-xs">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Invite Collaborator */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full border border-border p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand" />
                <h3 className="font-serif font-bold text-base text-foreground">Invite Team Collaborator</h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-foreground-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-foreground-muted leading-relaxed">
              Invited collaborators receive access to review candidates, vote on proposals, and share notes in this workspace.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                  Collaborator Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="collaborator@example.com"
                  className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                  Assigned Workspace Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                >
                  <option value="COLLABORATOR">Team Collaborator (Voting & Reviews)</option>
                  <option value="CO_HOST">Co-Host (Full Planning Permissions)</option>
                  <option value="PLANNER">Professional Event Planner</option>
                  <option value="FINANCE_LEAD">Budget & Finance Lead</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-5 py-2 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isInviting ? "Sending Invite..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Recommend / Add Service */}
      {recommendModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full border border-border p-6 space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand" />
                <h3 className="font-serif font-bold text-base text-foreground">Shortlist Service for Team</h3>
              </div>
              <button
                onClick={() => setRecommendModalOpen(false)}
                className="text-foreground-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="space-y-4">
              {availableGigs.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                    Select from Marketplace Services
                  </label>
                  <select
                    value={selectedGigId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedGigId(id);
                      const match = availableGigs.find((g: any) => g.id === id);
                      if (match) {
                        setCustomTitle(match.title);
                        setCustomCategory(match.category?.name || match.category || "Artisan");
                        setCustomPrice(String(match.price || 0));
                      }
                    }}
                    className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  >
                    <option value="">— Or enter custom service below —</option>
                    {availableGigs.map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.title} (${g.price?.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Byzantine Choral Ensemble & Classical Staging"
                  className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                    Cultural Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  >
                    <option value="West African Traditions">West African Traditions</option>
                    <option value="South Asian Legacies">South Asian Legacies</option>
                    <option value="Byzantine Restoration">Byzantine Restoration</option>
                    <option value="Cinematography">Cinematography</option>
                    <option value="Floral Architecture">Floral Architecture</option>
                    <option value="Banquet & Hospitality">Banquet & Hospitality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                    Estimated Fee ($ USD)
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                  Collaborator Recommendation Note
                </label>
                <textarea
                  rows={3}
                  value={recommendationNote}
                  onChange={(e) => setRecommendationNote(e.target.value)}
                  placeholder="Why should our team vote for this artisan?"
                  className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setRecommendModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingItem}
                  className="px-5 py-2 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isAddingItem ? "Shortlisting..." : "Add to Board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-sm w-full border border-border p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-danger">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base">Remove Shortlisted Service?</h3>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Are you sure you want to remove &ldquo;{itemToDelete.title}&rdquo; from the collaboration board? All collaborator votes on this candidate will be cleared.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
              >
                Keep Item
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingItem}
                className="px-4 py-1.5 bg-danger hover:bg-danger/90 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {isDeletingItem ? "Removing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Payment Modal Integration */}
      {paymentModalOpen && selectedServiceForPayment && (
        <FamilyPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedServiceForPayment(null);
          }}
          service={selectedServiceForPayment}
          onPaymentSuccess={() => {
            setPaymentModalOpen(false);
            setSelectedServiceForPayment(null);
            toast.success("Milestone Escrow payment secured! Order created in pipeline.");
          }}
        />
      )}
    </div>
  );
}
