"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
  UploadCloud,
  FileText,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetOrderByIdQuery,
  useSubmitMilestoneDeliveryMutation,
  useDeliverOrderMutation,
} from "@/redux/service/orders/ordersApi";

export default function VendorOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const { data: orderData, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const [submitMilestone, { isLoading: isSubmitting }] = useSubmitMilestoneDeliveryMutation();
  const [deliverOrder, { isLoading: isDeliveringFull }] = useDeliverOrderMutation();

  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [proofNotes, setProofNotes] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isFullOrderDelivery, setIsFullOrderDelivery] = useState(false);

  const order = orderData?.data || orderData;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading vendor order #{orderId}...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0F0C3B]">Order Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested vendor order contract #{orderId} could not be retrieved.
        </p>
        <button
          onClick={() => router.push("/vendor/orders")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>
      </div>
    );
  }

  const milestones: any[] = order.milestones || [];
  const clientName =
    order.clientProfile?.displayName ||
    order.clientProfile?.user?.name ||
    order.clientName ||
    "Event Client";
  const clientUserId =
    order.clientProfile?.userId ||
    order.clientProfile?.user?.id ||
    "";
  const serviceTitle =
    order.gig?.title ||
    order.job?.title ||
    order.notes ||
    "Custom Event Vendor Contract";
  const totalAmount = order.grandTotal
    ? `$${Number(order.grandTotal).toFixed(2)}`
    : `$${Number(order.subtotal || 0).toFixed(2)}`;

  const isCompleted = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";
  const hasPendingApproval =
    !isCompleted &&
    (milestones.some((m: any) => m.status === "PENDING_RELEASE") || (!milestones.length && order.status === "IN_PROGRESS" && Boolean(order.deliveryNotes)));
  const hasFundedMilestone = milestones.some((m: any) => m.status === "FUNDED");

  const handleOpenDelivery = (ms: any, fullOrder = false) => {
    setSelectedMilestone(ms);
    setIsFullOrderDelivery(fullOrder);
    setProofNotes("");
    setProofUrl("");
  };

  const handleSubmitWork = async () => {
    if (!proofNotes.trim() && !proofUrl.trim()) {
      toast.error("Please provide delivery notes or a work proof link");
      return;
    }

    try {
      if (isFullOrderDelivery) {
        await deliverOrder({
          orderId: order.id,
          notes: proofNotes,
          proofUrl: proofUrl || undefined,
        }).unwrap();
        toast.success("Order Deliverables Submitted!", {
          description: "Client has been notified to review and release payment.",
        });
      } else if (selectedMilestone) {
        await submitMilestone({
          orderId: order.id,
          milestoneId: selectedMilestone.id,
          notes: proofNotes,
          proofUrl: proofUrl || undefined,
        }).unwrap();
        toast.success("Milestone Work Submitted!", {
          description: "Milestone marked as pending client approval.",
        });
      }

      setSelectedMilestone(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit deliverables");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/vendor/orders")}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Vendor Order Contract</span>
              <span className="text-xs font-bold text-brand-primary bg-indigo-50 px-2 py-0.5 rounded-md">
                #{order.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F0C3B] tracking-tight mt-0.5">
              {serviceTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/vendor/messages?userId=${clientUserId}&orderId=${order.id}&clientName=${encodeURIComponent(clientName)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Client</span>
          </Link>

          {isCompleted ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Delivered</span>
            </div>
          ) : (
            !isCancelled && (
              (!milestones.length || hasFundedMilestone) &&
              <button
                onClick={() => handleOpenDelivery(null, true)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all text-white",
                  hasPendingApproval
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{hasPendingApproval ? "Deliver Again" : "Submit Funded Work"}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Milestone Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-[#0F0C3B] text-base">Milestone Progress &amp; Payouts</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit proof for each milestone to trigger client approval
                </p>
              </div>
              {isCompleted ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Delivered
                </span>
              ) : hasPendingApproval ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Waiting for Client Approval
                </span>
              ) : (
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Status: {order.status}
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {milestones.map((ms, idx) => {
                const isReleased = ms.status === "RELEASED" || ms.status === "PAID";
                const isPendingRelease = ms.status === "PENDING_RELEASE";
                const isApprovedPending = ms.status === "APPROVED_PENDING_RELEASE";
                const isFunded = ms.status === "FUNDED";

                return (
                  <div
                    key={ms.id || idx}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-[#0F0C3B] text-sm">
                          {ms.label || ms.title || `Milestone ${idx + 1}`}
                        </h4>
                        <span
                          className={cn(
                            "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                            isReleased
                              ? "bg-emerald-100 text-emerald-700"
                              : isPendingRelease || isApprovedPending
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {isReleased ? "Transferred" : isPendingRelease ? "Waiting Approval" : isApprovedPending ? "Transfer Scheduled" : isFunded ? "Funded · Ready to Deliver" : ms.status === "LOCKED" ? "Awaiting Client Payment" : ms.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        {ms.percentage ? `${ms.percentage}% of payout` : "Payment instalment"}
                        {ms.notes && ` • Work notes: ${ms.notes}`}
                      </p>

                      {ms.proofUrl && (
                        <a
                          href={ms.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Uploaded Proof</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:self-center justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="font-extrabold text-[#0F0C3B] text-base block">
                          ${Number(ms.amount || 0).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {isReleased ? "Transferred to Connect balance" : isPendingRelease ? "Awaiting client approval" : isApprovedPending ? "7-day transfer hold" : isFunded ? "Funded · ready for work" : ms.status === "LOCKED" ? "Awaiting client payment" : ms.status}
                        </span>
                      </div>

                      {isFunded && !isCancelled && (
                        <button
                          onClick={() => handleOpenDelivery(ms, false)}
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5",
                            isPendingRelease
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-indigo-50 hover:bg-indigo-100 text-brand-primary"
                          )}
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Submit Work</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Client Info & Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Client Information
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-brand-primary font-black text-lg flex items-center justify-center overflow-hidden shrink-0">
                {order.clientProfile?.avatarUrl ? (
                  <img
                    src={order.clientProfile.avatarUrl}
                    alt={clientName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  clientName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-[#0F0C3B] text-sm">{clientName}</h4>
                <p className="text-xs text-slate-400">{order.clientProfile?.phone || "Verified Client"}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href={`/vendor/messages?userId=${clientUserId}&orderId=${order.id}&clientName=${encodeURIComponent(clientName)}`}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-brand-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Client</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-[#0F0C3B] text-sm">Contract Total</h3>
            <div className="text-2xl font-black text-[#0F0C3B]">{totalAmount}</div>
            <p className="text-xs text-slate-500">
              Client approved milestones enter a 7-day hold before transfer to your Stripe Connect balance. Bank payouts are managed separately.
            </p>
          </div>
        </div>
      </div>

      {/* Deliver Work Modal */}
      {(selectedMilestone || isFullOrderDelivery) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-brand-primary flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">
                  {isFullOrderDelivery
                    ? (hasPendingApproval ? "Deliver Again / Update Deliverables" : "Deliver Entire Order")
                    : (selectedMilestone?.status === "PENDING_RELEASE" ? "Deliver Again / Update Milestone" : "Submit Milestone Deliverable")}
                </h3>
                <p className="text-xs text-slate-500">
                  {isFullOrderDelivery
                    ? (hasPendingApproval ? "Update deliverables and notify client to review" : "Mark order as fulfilled for client approval")
                    : selectedMilestone?.label || selectedMilestone?.title}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deliverable Notes / Description
                </label>
                <textarea
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Describe the completed work, venue setup details, or instructions..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Proof File URL / Cloud Link (Optional)
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedMilestone(null);
                  setIsFullOrderDelivery(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitWork}
                disabled={isSubmitting || isDeliveringFull}
                className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting || isDeliveringFull ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>
                  {isFullOrderDelivery
                    ? (hasPendingApproval ? "Deliver Again" : "Submit Deliverable")
                    : (selectedMilestone?.status === "PENDING_RELEASE" ? "Deliver Again" : "Submit Deliverable")}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
