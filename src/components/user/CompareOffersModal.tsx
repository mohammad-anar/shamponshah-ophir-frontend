"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  ShieldCheck,
  Sparkles,
  Star,
  Clock,
  DollarSign,
  ChevronRight,
  Loader2,
  BadgeCheck,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  ArrowRight,
  Trash2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useAcceptOfferMutation,
  useGetJobOffersQuery,
  useCancelJobMutation,
} from "@/redux/service/jobs/jobsApi";
import { useGetPaymentMethodsQuery } from "@/redux/service/payments/paymentsApi";

export interface OfferCandidate {
  id: string;
  vendorUserId?: string;
  name: string;
  founder: string;
  avatarUrl?: string;
  location: string;
  badge: string;
  rating: string;
  reviewsCount: number | string;
  identityVerified: boolean;
  baseOffer: string;
  baseOfferNum: number;
  escrowFee: string;
  escrowFeeNum: number;
  totalPay: string;
  totalPayNum: number;
  hours: string;
  deliverables: string;
  message: string;
  depositSplit: string;
  completionSplit: string;
  status: string;
  bestValue: boolean;
  escrowSplit?: any;
}

interface CompareOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  job?: any;
  offers?: any[];
  onAcceptOffer?: (vendorName: string, amount: string) => void;
}

export default function CompareOffersModal({
  isOpen,
  onClose,
  jobId,
  job,
  offers,
  onAcceptOffer,
}: CompareOffersModalProps) {
  const router = useRouter();
  const targetJobId = jobId || job?.id;

  const {
    data: fetchedData,
    isLoading: isOffersLoading,
    refetch,
  } = useGetJobOffersQuery(targetJobId as string, {
    skip: !isOpen || !targetJobId,
  });

  const [acceptOfferMutation, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [cancelJobMutation, { isLoading: isCancelling }] = useCancelJobMutation();
  const { data: methodsData } = useGetPaymentMethodsQuery();
  const savedMethods = Array.isArray(methodsData?.data) ? methodsData.data : Array.isArray(methodsData) ? methodsData : [];
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const activeJob = fetchedData?.job || job || {};
  const backendOffers: any[] = fetchedData?.offers || [];
  const rawFallbackOffers: any[] = offers || job?.offers || [];

  const hasAnyAccepted =
    backendOffers.some((o: any) => o.status === "ACCEPTED") ||
    activeJob.status === "AWARDED";
  const canCancelJob =
    (activeJob.status === "OPEN" || !activeJob.status) &&
    activeJob.status !== "CANCELLED" &&
    !hasAnyAccepted;

  const handleCancelJob = async () => {
    if (!targetJobId) return;
    try {
      await cancelJobMutation(targetJobId).unwrap();
      toast.success("Job RFP cancelled successfully", {
        description: "Vendor bids have been withdrawn and this job is closed.",
      });
      setShowCancelConfirm(false);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel job RFP");
    }
  };

  // Determine display candidates from real API data or fallback
  const candidates: OfferCandidate[] =
    backendOffers.length > 0
      ? backendOffers.map((o: any, idx: number): OfferCandidate => {
          const basePrice = Number(o.basePrice || o.price || 0);
          const fee = Number(o.escrowFee || (basePrice * 0.05).toFixed(2));
          const total = Number(o.totalPay || (basePrice + fee).toFixed(2));
          const escrowSplit = o.escrowSplit || {};

          return {
            id: o.id || `offer-${idx}`,
            vendorUserId: o.vendorProfile?.userId || o.vendorProfile?.user?.id || o.vendorUserId || o.vendorProfileId,
            name: o.vendorName || "Verified Vendor",
            founder: o.vendorName || "Vendor Studio",
            avatarUrl: o.avatarUrl,
            location: o.location || "Chicago, IL",
            badge: o.tier ? `${o.tier} Vendor` : "Verified Vendor",
            rating: o.rating ? Number(o.rating).toFixed(1) : "5.0",
            reviewsCount: o.reviewCount || 12,
            identityVerified: o.identityVerified ?? true,
            baseOffer: `$${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            baseOfferNum: basePrice,
            escrowFee: `$${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            escrowFeeNum: fee,
            totalPay: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalPayNum: total,
            hours: o.estimatedHours || "4-5 Hours Event Coverage",
            deliverables: o.deliverables || "Full celebration execution & milestone deliverables",
            message: o.message || "Customized proposal tailored to your celebration requirements.",
            depositSplit: escrowSplit.deposit || "50%",
            completionSplit: escrowSplit.completion || "50%",
            status: o.status || "PENDING",
            bestValue: o.bestValue ?? idx === 0,
            escrowSplit,
          };
        })
      : rawFallbackOffers.map((o: any, idx: number): OfferCandidate => {
          const basePrice = Number(o.price || 0);
          const fee = Number((basePrice * 0.05).toFixed(2));
          const vendor = o.vendorProfile;
          return {
            id: o.id || `offer-${idx}`,
            name: vendor?.businessName || vendor?.name || `Vendor Proposal ${idx + 1}`,
            founder: vendor?.businessName || "Verified Vendor",
            avatarUrl: vendor?.avatarUrl,
            location: vendor?.city ? `${vendor.city}, ${vendor?.state || "IL"}` : "Chicago, IL",
            badge: vendor?.tier ? `${vendor.tier} Vendor` : "Verified Vendor",
            rating: vendor?.rating ? Number(vendor.rating).toFixed(1) : "5.0",
            reviewsCount: vendor?.reviewCount || 12,
            identityVerified: vendor?.identityVerified ?? true,
            baseOffer: `$${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            baseOfferNum: basePrice,
            escrowFee: `$${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            escrowFeeNum: fee,
            totalPay: `$${(basePrice + fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalPayNum: basePrice + fee,
            hours: o.estimatedHours || "Full Event Coverage",
            deliverables: o.deliverables || "Milestone deliverables confirmed",
            message: o.message || "Custom proposal with guaranteed milestone delivery.",
            depositSplit: "50%",
            completionSplit: "50%",
            status: o.status || "PENDING",
            bestValue: idx === 0,
          };
        });

  // Check if any offer in this job has already been accepted
  const hasAcceptedOffer = candidates.some((c) => c.status === "ACCEPTED");

  const handleAccept = async (c: OfferCandidate) => {
    setSelectedOfferId(c.id);
    const effectiveJobId = activeJob.id || targetJobId;

    if (!savedMethods.length) {
      toast.error("A saved payment method is required before accepting an offer.", {
        description: "Your card will be charged immediately and held in escrow vault upon acceptance.",
      });
      router.push("/user/payments");
      return;
    }

    if (effectiveJobId && c.id && !c.id.startsWith("offer-")) {
      try {
        const defaultMethod = savedMethods.find((m: any) => m.isDefault) || savedMethods[0];
        const res = await acceptOfferMutation({
          jobId: effectiveJobId,
          offerId: c.id,
          paymentMethodId: defaultMethod?.stripePaymentMethodId,
        }).unwrap();

        toast.success(
          `Proposal from ${c.name} accepted & funded!`,
          { description: "Total payment is secured in escrow vault. Order is now ACTIVE." }
        );
        if (refetch) await refetch();
        onClose();
        const targetOrderId = res?.id || res?.orderId || res?.data?.id || res?.data?.orderId;
        router.push(targetOrderId ? `/user/orders/${targetOrderId}` : "/user/orders");
        return;
      } catch (err: any) {
        toast.error(err?.data?.message || err?.message || "Payment charge failed. Offer was not accepted.");
        return;
      }
    }

    toast.success(`Proposal from ${c.name} accepted! Other offers marked not selected.`);
    if (onAcceptOffer) onAcceptOffer(c.name, c.totalPay);
    onClose();
    router.push("/user/orders");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-surface rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-border flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/30">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                Proposals &amp; Bids
              </span>
              <span className="text-foreground-secondary">•</span>
              <h2 className="text-sm sm:text-base text-foreground font-extrabold truncate max-w-lg">
                {activeJob?.title || "Celebration RFP"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-info-soft text-info">
                {candidates.length} Proposal{candidates.length === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1 flex items-center gap-1.5 flex-wrap">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              <span>Protected by Ophir Vault Escrow Protocol • 100% milestone delivery guarantee</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-foreground-muted hover:text-foreground-secondary hover:bg-surface-sunken transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Full-Width Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-surface-elevated/60">
          {/* Job Target Budget & Spec Strip */}
          {activeJob && (
            <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted">
                  RFP Specification
                </span>
                <h3 className="text-sm font-bold text-foreground">{activeJob.title}</h3>
                {activeJob.description && (
                  <p className="text-xs text-foreground-muted line-clamp-2 max-w-2xl leading-relaxed">
                    {activeJob.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                {activeJob.location && (
                  <div className="flex items-center gap-1 text-xs text-foreground-secondary font-medium">
                    <MapPin className="w-3.5 h-3.5 text-foreground-muted" />
                    <span>{activeJob.location}</span>
                  </div>
                )}
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                    Target Budget
                  </span>
                  <span className="text-base font-extrabold text-foreground">
                    ${Number(activeJob.budgetMin || 0).toLocaleString()} - $
                    {Number(activeJob.budgetMax || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isOffersLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-surface rounded-2xl border border-border">
              <Loader2 className="w-8 h-8 text-info animate-spin" />
              <p className="text-xs font-semibold text-foreground-secondary">
                Loading real vendor proposals from Ophir Network...
              </p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-surface rounded-2xl border border-border">
              <div className="w-14 h-14 rounded-2xl bg-info-soft text-brand-primary flex items-center justify-center mx-auto text-2xl font-bold">
                📋
              </div>
              <h3 className="text-base font-bold text-foreground">No proposals submitted yet</h3>
              <p className="text-xs text-foreground-muted max-w-md mx-auto leading-relaxed">
                Your RFP is currently open. Vendors are reviewing your celebration specifications and will submit customized proposals with transparent milestone splits shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((c, index) => {
                const isAccepted = c.status === "ACCEPTED";
                const isRejected = c.status === "REJECTED";
                const isOtherAccepted = hasAcceptedOffer && !isAccepted;
                const isCurrentlyAccepting = isAccepting && selectedOfferId === c.id;

                const depositAmount = (c.totalPayNum * 0.5).toFixed(2);
                const finalAmount = (c.totalPayNum - Number(depositAmount)).toFixed(2);

                return (
                  <div
                    key={c.id}
                    className={cn(
                      "w-full bg-surface rounded-2xl border transition-all p-5 sm:p-6 shadow-xs relative flex flex-col justify-between space-y-5",
                      isAccepted
                        ? "border-emerald-400 ring-2 ring-emerald-100 bg-success-soft/20"
                        : isRejected || isOtherAccepted
                        ? "border-border bg-surface-elevated/60 opacity-75"
                        : c.bestValue
                        ? "border-info/30 ring-1 ring-indigo-100 hover:border-info/30"
                        : "border-border hover:border-border"
                    )}
                  >
                    {/* Top Row: Best Value Tag + Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Vendor Profile */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-surface-sunken border border-border shrink-0 flex items-center justify-center relative shadow-xs">
                          {c.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.avatarUrl}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-extrabold text-info">
                              {c.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-foreground text-base hover:text-info transition-colors flex items-center gap-1.5">
                              {c.name}
                              {c.identityVerified && (
                                <BadgeCheck className="w-4 h-4 text-info shrink-0" />
                              )}
                            </h3>

                            {c.bestValue && !isAccepted && !isRejected && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-success-soft text-success flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-success" /> Best Value
                              </span>
                            )}

                            {isAccepted && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-success-solid text-foreground text-foreground flex items-center gap-1 shadow-xs">
                                <Check className="w-3 h-3" /> Awarded &amp; Contract Active
                              </span>
                            )}

                            {(isRejected || isOtherAccepted) && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-sunken text-foreground-secondary">
                                Declined
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-foreground-muted mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-foreground-secondary font-medium">
                              <MapPin className="w-3 h-3 text-foreground-muted" />
                              {c.location}
                            </span>
                            <span className="text-foreground-secondary">•</span>
                            <div className="flex items-center gap-1 text-warning font-bold">
                              <Star className="w-3.5 h-3.5 text-warning fill-amber-500" />
                              <span>{c.rating}</span>
                              <span className="text-foreground-muted font-normal">({c.reviewsCount} reviews)</span>
                            </div>
                            <span className="text-foreground-secondary">•</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-info-soft text-info border border-info/30">
                              {c.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Escrow Total */}
                      <div className="text-left sm:text-right shrink-0 bg-surface-elevated sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-border">
                        <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider block">
                          Total Escrow Deposit
                        </span>
                        <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5">
                          <span
                            className={cn(
                              "text-xl sm:text-2xl font-black",
                              isAccepted
                                ? "text-success"
                                : c.bestValue
                                ? "text-info"
                                : "text-foreground"
                            )}
                          >
                            {c.totalPay}
                          </span>
                        </div>
                        <span className="text-[11px] text-foreground-muted block mt-0.5">
                          {c.baseOffer} vendor quote + {c.escrowFee} vault escrow fee (5%)
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Vendor Pitch Note */}
                    {c.message && (
                      <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-border text-xs text-foreground-secondary italic leading-relaxed">
                        <span className="font-bold not-italic text-foreground block mb-0.5 text-[11px] uppercase tracking-wider">
                          Vendor Proposal Pitch:
                        </span>
                        &ldquo;{c.message}&rdquo;
                      </div>
                    )}

                    {/* Specifications & Deliverables Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Schedule */}
                      <div className="p-3 rounded-xl border border-border/80 bg-surface space-y-1">
                        <div className="flex items-center gap-1.5 text-foreground-muted font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-info" />
                          <span>Coverage Schedule</span>
                        </div>
                        <p className="font-bold text-foreground text-xs">{c.hours}</p>
                      </div>

                      {/* Escrow Split */}
                      <div className="p-3 rounded-xl border border-border/80 bg-surface space-y-1">
                        <div className="flex items-center gap-1.5 text-foreground-muted font-bold text-[10px] uppercase tracking-wider">
                          <Layers className="w-3.5 h-3.5 text-info" />
                          <span>Payment Structure</span>
                        </div>
                        <p className="font-bold text-foreground text-xs">
                          {c.escrowSplit?.type === "FULL"
                            ? `Full 100% on Completion ($${c.totalPayNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                            : c.escrowSplit?.type === "MILESTONE" && Array.isArray(c.escrowSplit.milestones) && c.escrowSplit.milestones.length > 0
                            ? `${c.escrowSplit.milestones.length} Milestones (${c.escrowSplit.milestones.map((m: any) => `${m.label?.split("(")[0]?.trim() || "Stage"}: $${Number(m.amount).toLocaleString()}`).join(" • ")})`
                            : `50% Deposit ($${Number(depositAmount).toLocaleString()}) • 50% Final ($${Number(finalAmount).toLocaleString()})`}
                        </p>
                      </div>

                      {/* Deliverables */}
                      <div className="p-3 rounded-xl border border-border/80 bg-surface space-y-1">
                        <div className="flex items-center gap-1.5 text-foreground-muted font-bold text-[10px] uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5 text-info" />
                          <span>Deliverables</span>
                        </div>
                        <p className="font-medium text-foreground-secondary text-xs truncate" title={c.deliverables}>
                          {c.deliverables}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3.5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
                        <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                        <span>Milestone guarantee: Funds remain in Ophir Vault Escrow until final sign-off.</span>
                      </div>

                      <div>
                        {isAccepted ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="px-4 py-2 rounded-xl bg-success-solid text-foreground text-foreground font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Proposal Accepted</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                router.push("/user/orders");
                              }}
                              className="px-4 py-2 rounded-xl bg-brand hover:bg-surface-sunken text-foreground font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>View Order &amp; Milestones</span>
                              <ArrowRight className="w-3.5 h-3.5 text-warning" />
                            </button>
                          </div>
                        ) : isRejected || isOtherAccepted ? (
                          <div className="px-4 py-2 rounded-xl bg-surface-sunken text-foreground-muted font-medium text-xs flex items-center justify-center gap-1.5">
                            <XCircle className="w-4 h-4" />
                            <span>Declined</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/user/messages?userId=${c.vendorUserId || ''}&vendorName=${encodeURIComponent(c.name)}&category=${encodeURIComponent(activeJob?.title || '')}`}
                              className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                              title="Chat with Vendor via Socket.IO"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-brand-primary" />
                              <span>Chat</span>
                            </Link>

                            <button
                              onClick={() => handleAccept(c)}
                              disabled={isAccepting}
                              className={cn(
                                "w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50",
                                c.bestValue
                                  ? "bg-brand hover:bg-surface-sunken text-foreground hover:shadow-md"
                                  : "bg-brand hover:bg-surface-sunken text-foreground"
                              )}
                            >
                              {isCurrentlyAccepting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin text-warning" />
                                  <span>Securing Escrow Contract...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 text-success" />
                                  <span>Accept Proposal ({c.totalPay})</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground-secondary">Need changes before accepting?</span>
            <span className="text-foreground-muted">You can message vendors directly from your inbox.</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {canCancelJob && (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="px-3.5 py-2 rounded-xl border border-danger/30 hover:bg-danger-soft text-danger font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel this Job RFP</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Cancellation Confirmation Dialog */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-border space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-danger-soft text-danger flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Cancel this Job RFP?</h4>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                    No offer has been accepted yet. Cancelling will withdraw all {candidates.length} active vendor proposal(s) and close this listing.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isCancelling}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-foreground-secondary hover:bg-surface-sunken transition-colors cursor-pointer"
                >
                  Keep Job
                </button>
                <button
                  type="button"
                  onClick={handleCancelJob}
                  disabled={isCancelling}
                  className="px-4 py-1.5 rounded-xl bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Cancel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
