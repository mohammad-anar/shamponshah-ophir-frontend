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
  AlertCircle 
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

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email?: string;
}

interface RecommendedService {
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
  status: "SHORTLISTED" | "BOOKED";
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

export default function FamilyHubPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/collaboration");
  }, [router]);

  const { data: meData } = useGetMeQuery();
  const { data: wsData, isLoading: isWsLoading } = useGetWorkspaceQuery();
  const { data: publicGigsResp } = useGetPublicGigsQuery();
  const [addBoardItem, { isLoading: isAddingItem }] = useAddBoardItemMutation();
  const [voteBoardItem] = useVoteBoardItemMutation();
  const [deleteBoardItem] = useDeleteBoardItemMutation();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();

  const [filterTab, setFilterTab] = useState<"all" | "shortlisted" | "booked">("all");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("FAMILY_MEMBER");

  // Delete Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Recommend Service Modal State
  const [recommendModalOpen, setRecommendModalOpen] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Cinematography");
  const [customPrice, setCustomPrice] = useState("");
  const [recommendationNote, setRecommendationNote] = useState("");

  const me = (meData as any)?.data || meData;
  const ws = wsData?.data || wsData;
  const workspaceTitle = ws?.name || "Family Collaboration Hub";

  // Public gigs for picker
  const availableGigs = publicGigsResp?.data || (Array.isArray(publicGigsResp) ? publicGigsResp : []);

  // Real Family Members (no fake fallback names)
  const members: FamilyMember[] = useMemo(() => {
    const list: FamilyMember[] = [];
    const ownerName =
      ws?.owner?.displayName ||
      ws?.owner?.user?.name ||
      me?.name ||
      me?.email?.split("@")[0] ||
      "Family Host (You)";

    list.push({
      id: ws?.owner?.id || "owner",
      name: `${ownerName} (Host)`,
      avatar: ownerName.slice(0, 2).toUpperCase(),
      role: "OWNER",
      email: ws?.owner?.user?.email || me?.email,
    });

    if (ws?.members && Array.isArray(ws.members)) {
      ws.members.forEach((m: any, idx: number) => {
        if (m.userId !== ws?.owner?.userId && m.user?.id !== me?.id) {
          const name = m.user?.name || m.user?.email?.split("@")[0] || m.inviteEmail || `Member ${idx + 1}`;
          list.push({
            id: m.id || `m-${idx}`,
            name,
            avatar: name.slice(0, 2).toUpperCase(),
            role: m.role || "MEMBER",
            email: m.user?.email || m.inviteEmail,
          });
        }
      });
    }

    return list;
  }, [ws, me]);

  // Recommended Services parsed strictly from actual database board items (NO dummy data fallback)
  const services: RecommendedService[] = useMemo(() => {
    const primaryBoard = ws?.boards?.[0];
    const items = primaryBoard?.items || [];

    // If 0 items, return empty array so user can delete all and see true empty state
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

      return {
        id: item.gigId || item.id,
        boardItemId: item.id,
        gigId: item.gigId,
        vendorId: item.vendorId || parsed.vendorId,
        title: item.title,
        category: parsed.category || "Vendor Service",
        image: parsed.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        vendorName: parsed.vendorName || "Verified Vendor",
        vendorAvatar: parsed.vendorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        vendorRating: parsed.vendorRating || 0,
        vendorReviewCount: parsed.vendorReviewCount || 0,
        vendorTier: parsed.vendorTier || "",
        location: parsed.location || "Chicago, IL",
        price: Number(parsed.price || 0),
        status: (item.status === "BOOKED" ? "BOOKED" : "SHORTLISTED") as "SHORTLISTED" | "BOOKED",
        recommendedBy: {
          name: parsed.addedByName || "Family Member",
          avatar: (parsed.addedByName || "FM").slice(0, 2).toUpperCase(),
          role: "Collaborator",
          date: new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
        },
        note: parsed.note || "Recommended for family review and booking.",
        votesUp: votesUpCount,
        votedBy: Object.keys(votes),
        inclusions: parsed.inclusions || [],
      };
    });
  }, [ws]);

  // Tab filter
  const filteredServices = useMemo(() => {
    if (filterTab === "shortlisted") return services.filter((s) => s.status === "SHORTLISTED");
    if (filterTab === "booked") return services.filter((s) => s.status === "BOOKED");
    return services;
  }, [services, filterTab]);

  // Handle voting
  const handleVote = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    try {
      await voteBoardItem({ itemId, vote: "YES" }).unwrap();
      toast.success("Vote recorded! Your recommendation has been added.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not record vote.");
    }
  };

  // Open confirmation modal (NO native browser alert/confirm)
  const handleDeleteClick = (e: React.MouseEvent, itemId: string, title: string) => {
    e.stopPropagation();
    setItemToDelete({ id: itemId, title });
  };

  // Confirm delete handler with Sonner toast
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeletingItem(true);
    try {
      await deleteBoardItem(itemToDelete.id).unwrap();
      toast.success(`"${itemToDelete.title}" removed from Family Hub`);
      setItemToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove recommendation");
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Handle invite member
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await inviteMember({ email: inviteEmail, role: inviteRole }).unwrap();
      toast.success(`Invitation sent to ${inviteEmail}! They can now view and recommend services.`);
      setInviteModalOpen(false);
      setInviteEmail("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to invite member");
    }
  };

  // Handle adding recommendation
  const handleAddRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryBoard = ws?.boards?.[0];
    const targetBoardId = primaryBoard?.id || "primary";

    const gigToUse = availableGigs.find((g: any) => g.id === selectedGigId);
    const titleToUse = gigToUse?.title || customTitle;
    const priceToUse = gigToUse?.packages?.[0]?.price ? Number(gigToUse.packages[0].price) : Number(customPrice || 0);
    const categoryToUse = gigToUse?.category?.name || customCategory;
    const vendorNameToUse = gigToUse?.vendorProfile?.businessName || "Verified Vendor";
    const vendorIdToUse = gigToUse?.vendorProfileId || undefined;

    if (!titleToUse.trim()) {
      toast.error("Please select a service or enter a service title");
      return;
    }
    if (!gigToUse && (!Number.isFinite(priceToUse) || priceToUse <= 0)) {
      toast.error("Enter an estimated price above zero for a custom recommendation.");
      return;
    }

    const isAlreadyAdded = services.some(
      (s) =>
        (gigToUse?.id && (s.gigId === gigToUse.id || s.id === gigToUse.id)) ||
        s.title?.toLowerCase().trim() === titleToUse.toLowerCase().trim()
    );
    if (isAlreadyAdded) {
      toast.error("This service has already been recommended to your Family Hub");
      return;
    }

    try {
      await addBoardItem({
        boardId: targetBoardId,
        data: {
          gigId: gigToUse?.id || undefined,
          vendorId: vendorIdToUse,
          title: titleToUse,
          status: "SHORTLISTED",
          notes: JSON.stringify({
            price: priceToUse,
            category: categoryToUse,
            vendorName: vendorNameToUse,
            note: recommendationNote || "Recommended service for family review and booking.",
            image: gigToUse?.gallery?.[0]?.url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            addedByName: me?.name || me?.displayName || "Family Collaborator",
          }),
        },
      }).unwrap();

      toast.success("Service recommended to Family Hub!");
      setRecommendModalOpen(false);
      setSelectedGigId("");
      setCustomTitle("");
      setRecommendationNote("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add service recommendation");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Delete Confirmation Modal (Custom UI, replacing browser confirm) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 space-y-5 border border-border shadow-2xl animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-danger-soft border border-danger/30 flex items-center justify-center text-danger shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-foreground">Remove Recommendation</h3>
                <p className="text-xs text-foreground-muted">Remove from family collaboration board</p>
              </div>
            </div>

            <p className="text-xs text-foreground-secondary leading-relaxed bg-surface-elevated p-3.5 rounded-2xl border border-border">
              Are you sure you want to remove <strong className="text-foreground">&ldquo;{itemToDelete.title}&rdquo;</strong> from your Family Hub? Other family members will no longer be able to vote or review this recommendation.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-danger-solid text-foreground hover:bg-danger-solid text-foreground text-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeletingItem ? (
                  <span>Removing...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 space-y-5 border border-border shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-info-soft text-brand-primary">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">Invite Family Member</h3>
                  <p className="text-xs text-foreground-muted">Collaborate & vote on services together</p>
                </div>
              </div>
              <button onClick={() => setInviteModalOpen(false)} className="text-foreground-muted hover:text-foreground-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground-secondary mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="partner@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground-secondary mb-1">Permission Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none text-foreground bg-surface-elevated cursor-pointer"
                >
                  <option value="CO_PLANNER">Co-Planner (Can Recommend & Vote)</option>
                  <option value="FAMILY_MEMBER">Family Member (Can Recommend & Vote)</option>
                  <option value="VIEWER">Viewer (View & Upvote only)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-5 py-2 rounded-xl bg-brand hover:bg-surface-sunken text-foreground font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Send Invite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recommend Service Modal */}
      {recommendModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 space-y-5 border border-border shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-warning-soft text-warning">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">Recommend a Service</h3>
                  <p className="text-xs text-foreground-muted">Suggest an vendor service for the family to review</p>
                </div>
              </div>
              <button onClick={() => setRecommendModalOpen(false)} className="text-foreground-muted hover:text-foreground-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecommendation} className="space-y-4 text-xs">
              {availableGigs.length > 0 && (
                <div>
                  <label className="block font-bold text-foreground-secondary mb-1">Pick from Catalog</label>
                  <select
                    value={selectedGigId}
                    onChange={(e) => {
                      setSelectedGigId(e.target.value);
                      const g = availableGigs.find((item: any) => item.id === e.target.value);
                      if (g) {
                        setCustomTitle(g.title);
                        setCustomCategory(g.category?.name || "Vendor Service");
                        setCustomPrice(String(g.packages?.[0]?.price || 1200));
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-elevated text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="">-- Choose an active service --</option>
                    {availableGigs.map((g: any) => {
                      const alreadyInHub = services.some(
                        (s) =>
                          s.gigId === g.id ||
                          s.id === g.id ||
                          s.title?.toLowerCase().trim() === g.title?.toLowerCase().trim()
                      );
                      return (
                        <option key={g.id} value={g.id} disabled={alreadyInHub}>
                          {g.title} ({g.category?.name || "Service"}) — from ${g.packages?.[0]?.price || 1200}
                          {alreadyInHub ? " [Already in Family Hub]" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-foreground-secondary mb-1">Service Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Golden Hour Drone & Video Coverage"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border focus:outline-none text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground-secondary mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-elevated text-foreground focus:outline-none"
                  >
                    <option value="Cinematography">Cinematography</option>
                    <option value="Floral Design">Floral Design</option>
                    <option value="Live Music & DJ">Live Music & DJ</option>
                    <option value="Vendor Catering">Vendor Catering</option>
                    <option value="Lighting & Production">Lighting & Production</option>
                    <option value="Event Planning">Event Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground-secondary mb-1">Estimated Price ($)</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border focus:outline-none text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground-secondary mb-1">Recommendation Note</label>
                <textarea
                  rows={3}
                  placeholder="Tell your family why you recommend this service..."
                  value={recommendationNote}
                  onChange={(e) => setRecommendationNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border focus:outline-none text-foreground resize-none"
                />
              </div>

              {/* Duplicate Notice */}
              {services.some(
                (s) =>
                  (selectedGigId && (s.gigId === selectedGigId || s.id === selectedGigId)) ||
                  (customTitle.trim() && s.title?.toLowerCase().trim() === customTitle.toLowerCase().trim())
              ) && (
                <div className="p-3 rounded-xl bg-warning-soft border border-warning/30 text-warning text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-warning shrink-0" />
                  <span>This service is already in your Family Hub. Each service can only be added once.</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRecommendModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isAddingItem ||
                    services.some(
                      (s) =>
                        (selectedGigId && (s.gigId === selectedGigId || s.id === selectedGigId)) ||
                        (customTitle.trim() && s.title?.toLowerCase().trim() === customTitle.toLowerCase().trim())
                    )
                  }
                  className={`px-5 py-2 rounded-xl text-foreground font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                    services.some(
                      (s) =>
                        (selectedGigId && (s.gigId === selectedGigId || s.id === selectedGigId)) ||
                        (customTitle.trim() && s.title?.toLowerCase().trim() === customTitle.toLowerCase().trim())
                    )
                      ? "bg-warning-solid text-on-brand cursor-not-allowed"
                      : "bg-brand hover:bg-surface-sunken"
                  }`}
                >
                  <span>
                    {services.some(
                      (s) =>
                        (selectedGigId && (s.gigId === selectedGigId || s.id === selectedGigId)) ||
                        (customTitle.trim() && s.title?.toLowerCase().trim() === customTitle.toLowerCase().trim())
                    )
                      ? "Already in Family Hub"
                      : "Recommend Service"}
                  </span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header & Workspace Info */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-info-soft border border-info/30 text-brand-primary text-[10px] font-extrabold uppercase tracking-wider">
              Family Collaboration Hub
            </span>
            <span className="text-xs text-foreground-muted font-medium">
              &bull; {members.length} Member{members.length === 1 ? "" : "s"} Collaborating
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-serif tracking-tight">
            {workspaceTitle}
          </h1>

          <p className="text-xs text-foreground-muted mt-1 max-w-xl">
            Recommend, vote, and finalize vendor services together. Click any service to explore full public details, package tiers, and order directly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-foreground text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-brand-primary" />
            <span>Invite Member</span>
          </button>

          <button
            onClick={() => setRecommendModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-active hover:from-brand hover:to-brand-active text-foreground text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-foreground" />
            <span>Recommend a Service</span>
          </button>
        </div>
      </div>

      {/* Family Members Strip */}
      <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            {members.map((m) => (
              <div
                key={m.id}
                title={`${m.name} (${m.role})`}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-border bg-brand text-foreground text-[11px] font-bold flex items-center justify-center"
              >
                {m.avatar}
              </div>
            ))}
          </div>
          <span className="text-xs text-foreground-secondary font-medium">
            <strong className="text-foreground">{members.length} member{members.length === 1 ? "" : "s"}</strong> active in this workspace
          </span>
        </div>

        <Link
          href="/services"
          className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
        >
          <span>Browse Public Services Catalog</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Board Controls: Filter Tabs & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-surface-sunken p-1 rounded-2xl w-fit">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === "all"
                ? "bg-surface text-foreground shadow-xs"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            All Recommendations ({services.length})
          </button>
          <button
            onClick={() => setFilterTab("shortlisted")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === "shortlisted"
                ? "bg-surface text-foreground shadow-xs"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Under Review ({services.filter((s) => s.status === "SHORTLISTED").length})
          </button>
          <button
            onClick={() => setFilterTab("booked")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === "booked"
                ? "bg-surface text-foreground shadow-xs"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Booked ({services.filter((s) => s.status === "BOOKED").length})
          </button>
        </div>

        {services.length > 0 && (
          <span className="text-xs text-foreground-muted">
            Click any service card to view packages, gallery, and book.
          </span>
        )}
      </div>

      {/* Recommended Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isBooked = service.status === "BOOKED";
            const gig = availableGigs.find((item: any) => item.id === service.gigId);
            const packageId = gig?.packages?.[0]?.id;
            const vendorSlug = gig?.vendorProfile?.slug;
            const checkoutHref = packageId && vendorSlug
              ? `/checkout?vendorId=${encodeURIComponent(vendorSlug)}&packageId=${encodeURIComponent(packageId)}&familyBoardItemId=${encodeURIComponent(service.boardItemId)}`
              : null;
            return (
              <div
                key={service.boardItemId}
                onClick={() => router.push(`/services/${service.gigId || service.id}`)}
                className="bg-surface rounded-3xl overflow-hidden border border-border/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 cursor-pointer"
              >
                {/* Image & Category */}
                <div className="relative h-52 w-full overflow-hidden bg-surface-sunken">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-surface/95 backdrop-blur-md text-[10px] font-extrabold text-foreground uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${
                        isBooked
                          ? "bg-success-solid text-foreground text-foreground"
                          : "bg-warning-solid text-on-brand text-on-brand"
                      }`}
                    >
                      {isBooked ? "Booked" : "Recommended"}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-foreground">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-foreground-secondary block">Starting at</span>
                      <span className="text-2xl font-black font-serif">${service.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-warning">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-warning" />
                      <span>{service.vendorRating}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Vendor Subtitle */}
                    <div className="flex items-center justify-between text-xs text-foreground-muted mb-2">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <span>{service.vendorName}</span>
                        <span className="text-[10px] px-1 bg-surface-sunken text-foreground-secondary rounded">
                          {service.vendorTier}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-foreground-muted">
                        <MapPin className="w-3 h-3" />
                        {service.location}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-base text-foreground group-hover:text-brand-primary transition-colors line-clamp-1">
                      {service.title}
                    </h3>

                    {/* Recommendation Note Box */}
                    <div className="mt-3 p-3 rounded-2xl bg-info-soft/60 border border-info/30 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-primary flex items-center gap-1">
                          <Users2 className="w-3 h-3" />
                          Recommended by {service.recommendedBy.name}
                        </span>
                        <span className="text-[10px] text-foreground-muted">{service.recommendedBy.date}</span>
                      </div>
                      <p className="text-foreground-secondary italic text-[11px] leading-relaxed">
                        &ldquo;{service.note}&rdquo;
                      </p>
                    </div>

                    {/* Inclusions list */}
                    <div className="mt-3 space-y-1 pt-2 border-t border-border">
                      {service.inclusions.slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground-secondary">
                          <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions: Vote & Book */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      {/* Upvote button */}
                      <button
                        onClick={(e) => handleVote(e, service.boardItemId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-surface-elevated text-xs font-bold text-foreground-secondary transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-brand-primary" />
                        <span>{service.votesUp} Votes</span>
                      </button>

                      {/* Direct Delete button with confirmation modal */}
                      {!isBooked && (
                        <button
                          onClick={(e) => handleDeleteClick(e, service.boardItemId, service.title)}
                          className="p-2 rounded-xl text-foreground-muted hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                          title="Remove Recommendation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Main Action: View Details / Book */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/services/${service.gigId || service.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="py-2 px-3 rounded-xl bg-surface-elevated hover:bg-surface-sunken text-foreground text-xs font-bold text-center border border-border transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {checkoutHref ? <Link
                        href={checkoutHref}
                        onClick={(e) => e.stopPropagation()}
                        className="py-2 px-3 rounded-xl bg-gradient-to-r from-brand to-brand-active hover:from-brand hover:to-brand-active text-foreground text-xs font-extrabold text-center shadow-xs transition-all flex items-center justify-center gap-1"
                      ><span>Book Service</span><ArrowRight className="w-3.5 h-3.5" /></Link> : <span title="This service has no available paid package" className="py-2 px-3 rounded-xl bg-surface-sunken text-foreground-muted text-xs font-bold text-center">Package unavailable</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Clean Empty State when 0 services exist */
        <div className="p-16 text-center bg-surface rounded-3xl border border-border shadow-xs max-w-lg mx-auto my-12 space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-info-soft border border-info/30 flex items-center justify-center text-brand-primary mx-auto">
            <ShoppingBag className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-foreground">No Service Recommendations Yet</h3>
            <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto leading-relaxed">
              Collaborate with your family! Recommend vendor services like cinematography, live music, floral design, or catering to review and book together.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setRecommendModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-active text-foreground text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-foreground" />
              <span>Recommend a Service</span>
            </button>
            <Link
              href="/services"
              className="px-4 py-2.5 rounded-xl bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary text-xs font-bold transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
