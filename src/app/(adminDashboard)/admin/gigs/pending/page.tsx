"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  DollarSign, 
  Calendar, 
  Check, 
  Layers, 
  FileText, 
  X,
  ExternalLink,
  Loader2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  User,
  PackageCheck,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetPendingGigsQuery, 
  useApproveGigMutation, 
  useRejectGigMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminPendingGigsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: apiData, isLoading, refetch } = useGetPendingGigsQuery({ search: searchQuery });
  const [approveGig, { isLoading: isApproving }] = useApproveGigMutation();
  const [rejectGig, { isLoading: isRejecting }] = useRejectGigMutation();

  // Review modal state
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adminNotes, setAdminNotes] = useState("");

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedQuickReason, setSelectedQuickReason] = useState("");

  const quickRejectionReasons = [
    "Misleading or incomplete package descriptions",
    "Low resolution or copyright-infringing cover image",
    "Unreasonable pricing or non-compliant fee structure",
    "Prohibited services or regulatory violation",
    "Missing deliverable timeline or scope details",
  ];

  const pendingGigs: any[] = Array.isArray(apiData)
    ? apiData
    : Array.isArray(apiData?.data)
    ? apiData.data
    : Array.isArray(apiData?.gigs)
    ? apiData.gigs
    : [];

  const handleOpenReview = (gig: any) => {
    setSelectedGig(gig);
    setActiveImageIndex(0);
    setAdminNotes(gig.adminNotes || "");
  };

  const handleApprove = async (gigId: string) => {
    try {
      await approveGig({ id: gigId, adminNotes }).unwrap();
      toast.success("Gig approved and published to live marketplace!");
      setSelectedGig(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve gig");
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedGig) return;
    const finalReason = rejectionReason.trim() || selectedQuickReason;
    if (!finalReason) {
      toast.error("Please provide a rejection reason for the vendor");
      return;
    }

    try {
      await rejectGig({
        id: selectedGig.id,
        reason: finalReason,
        adminNotes,
      }).unwrap();
      toast.success("Gig rejected and vendor notified with reason");
      setRejectModalOpen(false);
      setSelectedGig(null);
      setRejectionReason("");
      setSelectedQuickReason("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject gig");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
              Verification Queue
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {pendingGigs.length} pending review
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0F0C3B] tracking-tight">
            Pending Gigs Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit vendor service submissions, inspect deliverables and gallery assets, and approve or reject before they go live on Ophir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/gigs"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-brand-primary" />
            <span>All Gigs Catalog</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search pending by title, vendor, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8F9FD] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors self-end sm:self-auto cursor-pointer"
        >
          Refresh Queue
        </button>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <span className="text-xs font-medium text-slate-600">Loading pending verification queue...</span>
        </div>
      ) : pendingGigs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F0C3B]">All Gigs Reviewed!</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            There are currently no service gigs awaiting verification. When vendors create or re-submit their services, they will appear here for audit.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/gigs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F0C3B] text-white text-xs font-bold hover:bg-[#18124E] transition-all"
            >
              <span>View All Published Gigs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingGigs.map((gig: any) => {
            const vendorName =
              gig.vendorProfile?.businessName ||
              gig.vendor?.name ||
              gig.vendor?.email ||
              "Vendor";
            const coverImage =
              gig.gallery?.[0]?.url ||
              gig.images?.[0] ||
              gig.coverImageUrl ||
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80";
            const price = gig.packages?.[0]?.price ? `$${gig.packages[0].price}` : "$450";
            const submittedDate = gig.createdAt ? new Date(gig.createdAt).toLocaleDateString() : "Recent";

            return (
              <div
                key={gig.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Media preview */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={gig.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending Approval
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {gig.gallery?.length || gig.images?.length || 1} Assets
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                      {gig.category?.name || "Event Service"}
                    </span>
                    <h3 className="font-bold text-[#0F0C3B] text-sm mt-1 line-clamp-2 leading-snug">
                      {gig.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                        {vendorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-700 truncate">{vendorName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400 font-mono">{submittedDate}</span>
                    </div>
                  </div>

                  {/* Summary badges */}
                  <div className="py-2.5 px-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Starting at</span>
                      <span className="font-extrabold text-[#0F0C3B]">{price}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Tiers</span>
                      <span className="font-bold text-indigo-700">{gig.packages?.length || 1} packages</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Status</span>
                      <span className="font-bold text-amber-700">Needs Audit</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenReview(gig)}
                      className="flex-1 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Review Details</span>
                    </button>
                    <button
                      onClick={() => handleApprove(gig.id)}
                      disabled={isApproving}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Quick Approve"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL INSPECTION MODAL */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-[#0F0C3B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Service Moderation Review
                </span>
                <h2 className="text-base font-bold text-white line-clamp-1">
                  {selectedGig.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedGig(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
              {/* Media Gallery Showcase */}
              <div>
                <h4 className="font-bold text-[#0F0C3B] uppercase text-[11px] mb-2 tracking-wider">
                  Gallery Assets ({selectedGig.gallery?.length || selectedGig.images?.length || 1})
                </h4>
                {(() => {
                  const images = (selectedGig.gallery && selectedGig.gallery.length > 0)
                    ? selectedGig.gallery.map((g: any) => g.url)
                    : (selectedGig.images && selectedGig.images.length > 0)
                    ? selectedGig.images
                    : [selectedGig.coverImageUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"];

                  const activeSrc = images[activeImageIndex] || images[0];

                  return (
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeSrc}
                          alt="Gig inspection preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {images.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {images.map((src: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex(idx)}
                              className={cn(
                                "w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer",
                                activeImageIndex === idx ? "border-brand-primary shadow-xs" : "border-slate-200 opacity-60 hover:opacity-100"
                              )}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="thumb" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Vendor & Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Vendor Guild Member
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                      {(selectedGig.vendorProfile?.businessName || selectedGig.vendor?.name || "V").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F0C3B] text-sm">
                        {selectedGig.vendorProfile?.businessName || selectedGig.vendor?.name || "Vendor"}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {selectedGig.vendor?.email || "No email available"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Level: <strong className="text-indigo-600">{selectedGig.vendorProfile?.level || "PRO"}</strong></span>
                    <span className="text-slate-500">Submitted: <strong className="text-[#0F0C3B]">{new Date(selectedGig.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Category & Scope
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Category: <strong className="text-[#0F0C3B]">{selectedGig.category?.name || "General Event"}</strong></p>
                    <p className="text-xs text-slate-600">Slug: <code className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">{selectedGig.slug || selectedGig.id}</code></p>
                    {selectedGig.tags && selectedGig.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedGig.tags.map((t: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-brand-primary text-[10px] font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-[#0F0C3B] uppercase text-[11px] mb-2 tracking-wider">
                  Full Service Description
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 whitespace-pre-line leading-relaxed text-slate-800">
                  {selectedGig.description || "No description provided."}
                </div>
              </div>

              {/* Package Tiers Comparison */}
              <div>
                <h4 className="font-bold text-[#0F0C3B] uppercase text-[11px] mb-2 tracking-wider">
                  Pricing Package Tiers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedGig.packages?.map((pkg: any, idx: number) => (
                    <div
                      key={pkg.id || idx}
                      className={cn(
                        "p-4 rounded-2xl border flex flex-col justify-between space-y-3",
                        idx === 1 ? "bg-indigo-50/40 border-indigo-200 shadow-2xs" : "bg-white border-slate-200"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-[#0F0C3B] uppercase text-[11px]">{pkg.name || `Package ${idx + 1}`}</span>
                          <span className="text-base font-black text-brand-primary">${pkg.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-3 mb-2">{pkg.description}</p>
                        <div className="text-[10px] text-slate-600 space-y-1">
                          <p>⏱️ Turnaround: <strong>{pkg.deliveryDays || pkg.deliveryTime || 3} days</strong></p>
                          <p>🔄 Revisions: <strong>{pkg.revisions ?? 2}</strong></p>
                        </div>
                      </div>
                      {pkg.features && Array.isArray(pkg.features) && (
                        <ul className="border-t border-slate-100 pt-2 space-y-1">
                          {pkg.features.map((feat: string, fIdx: number) => (
                            <li key={fIdx} className="text-[10px] text-slate-600 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="font-bold text-[#0F0C3B] uppercase text-[11px] mb-1.5 block tracking-wider">
                  Internal Admin Audit Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Optional internal remarks, verification audit observations, or insurance notes..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                  rows={2}
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedGig(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Audit
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={isApproving || isRejecting}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject Listing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(selectedGig.id)}
                  disabled={isApproving || isRejecting}
                  className="px-5 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  {isApproving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>Approve &amp; Make Live</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL WITH MANDATORY REASON */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Reject Service Gig</h3>
                <p className="text-xs text-slate-500">
                  Provide constructive reason for the vendor to update and resubmit.
                </p>
              </div>
            </div>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">Select Common Reason:</label>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {quickRejectionReasons.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedQuickReason(preset);
                      setRejectionReason(preset);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs border transition-all cursor-pointer",
                      selectedQuickReason === preset
                        ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Explanation */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Detailed Feedback (Mandatory):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain specifically what needs to be changed before this listing can be approved..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                disabled={isRejecting || (!rejectionReason.trim() && !selectedQuickReason)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
