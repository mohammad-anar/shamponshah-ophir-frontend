"use client";

import { useState, useEffect } from "react";
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
  Paperclip,
  Trash2,
  Image as ImageIcon,
  RotateCcw,
  Check,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import OrderChat from "@/components/chat/OrderChat";
import {
  useGetOrderByIdQuery,
  useSubmitMilestoneDeliveryMutation,
  useDeliverOrderMutation,
  useRespondCancellationMutation,
  useRespondPartialRefundMutation,
  useEscalateOrderToAdminMutation,
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
  const [respondCancellation, { isLoading: isRespondingCancel }] = useRespondCancellationMutation();
  const [respondPartialRefund, { isLoading: isRespondingRefund }] = useRespondPartialRefundMutation();
  const [escalateOrderToAdmin, { isLoading: isEscalating }] = useEscalateOrderToAdminMutation();

  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [proofNotes, setProofNotes] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [isFullOrderDelivery, setIsFullOrderDelivery] = useState(false);

  // Vendor response notes and escalation modal
  const [cancelResponseNote, setCancelResponseNote] = useState("");
  const [partialRefundResponseNote, setPartialRefundResponseNote] = useState("");
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState("Dispute or settlement disagreement with client");
  const [escalateNotes, setEscalateNotes] = useState("");

  useEffect(() => {
    const handleStatusUpdate = () => {
      refetch();
    };
    window.addEventListener("order_status_updated", handleStatusUpdate);
    return () => {
      window.removeEventListener("order_status_updated", handleStatusUpdate);
    };
  }, [refetch]);

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
    setIsFullOrderDelivery(fullOrder || order.status === "REVISION_REQUESTED");
    setProofNotes("");
    setProofUrl("");
    setDeliveryFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setDeliveryFiles((prev) => [...prev, ...selected]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDeliveryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWork = async () => {
    const hasFiles = deliveryFiles.length > 0 || proofUrl.trim().length > 0;
    if (!hasFiles) {
      toast.error("At least one deliverable file or image is mandatory for delivery.");
      return;
    }

    if (!proofNotes.trim() || proofNotes.trim().length < 5) {
      toast.error("Please provide a detailed delivery message (at least 5 characters).");
      return;
    }

    try {
      const formData = new FormData();
      deliveryFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("message", proofNotes.trim());
      if (proofUrl.trim()) {
        formData.append("fileUrls", proofUrl.trim());
      }

      await deliverOrder({
        orderId: order.id,
        data: formData,
      }).unwrap();

      toast.success("Order Deliverables Submitted!", {
        description: "Client has been notified to review within the 3-day window.",
      });

      setDeliveryFiles([]);
      setProofNotes("");
      setProofUrl("");
      setSelectedMilestone(null);
      setIsFullOrderDelivery(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit deliverables");
    }
  };

  const handleRespondCancel = async (action: "ACCEPT" | "REJECT") => {
    try {
      await respondCancellation({
        orderId: order.id,
        action,
        responseNote: cancelResponseNote,
      }).unwrap();

      if (action === "ACCEPT") {
        toast.success("Cancellation Accepted", {
          description: "Order has been cancelled. Full refund has been sent to client via Stripe.",
        });
      } else {
        toast.info("Cancellation Declined", {
          description: "Client has been notified. You or the client may escalate to Admin if not resolved.",
        });
      }
      setCancelResponseNote("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${action.toLowerCase()} cancellation`);
    }
  };

  const handleRespondPartialRefund = async (action: "ACCEPT" | "REJECT") => {
    try {
      await respondPartialRefund({
        orderId: order.id,
        action,
        responseNote: partialRefundResponseNote,
      }).unwrap();

      if (action === "ACCEPT") {
        toast.success("Partial Refund Accepted", {
          description: "Refund portion returned to client via Stripe. Remaining balance settled (15% fee, 85% vendor payout).",
        });
      } else {
        toast.info("Partial Refund Declined", {
          description: "Client has been notified.",
        });
      }
      setPartialRefundResponseNote("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${action.toLowerCase()} partial refund`);
    }
  };

  const handleConfirmEscalation = async () => {
    try {
      await escalateOrderToAdmin({
        orderId: order.id,
        reason: escalateReason,
        notes: escalateNotes,
      }).unwrap();

      toast.success("Order Escalated to Admin", {
        description: "Platform Admin has joined to mediate this contract based on chat, deliverables, and proof.",
      });
      setEscalateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to escalate to admin");
    }
  };

  // Financial calculations for partial refund breakdown
  const grandTotalNum = Number(order.grandTotal || order.subtotal || 0);
  const partialRefundAmountNum = Number(order.partialRefundAmount || 0);
  const remainingAfterPartialRefund = Math.max(0, grandTotalNum - partialRefundAmountNum);
  const partialFee = remainingAfterPartialRefund * 0.15;
  const partialVendorNet = remainingAfterPartialRefund * 0.85;

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

          {!order.escalatedToAdmin && (order.cancelStatus === "REQUESTED" || order.cancelStatus === "REJECTED" || order.refundStatus === "REQUESTED" || order.refundStatus === "REJECTED" || order.status === "DISPUTED") && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Escalate to Admin</span>
            </button>
          )}

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

      {/* Escalated to Admin Notice */}
      {order.escalatedToAdmin && (
        <div className="p-5 rounded-2xl border-2 border-rose-400 bg-rose-50 text-rose-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#0F0C3B] text-sm sm:text-base">
                  Case Escalated to Admin for Official Mediation
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 uppercase">
                  Escalated by {order.escalatedBy || "Party"}
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1">
                An administrator has joined this order. The admin will review chat messages, contract delivery files, and submitted evidence to issue a binding determination.
              </p>
              {order.escalationReason && (
                <p className="text-xs text-slate-700 mt-1.5 italic bg-white/80 p-2.5 rounded-lg border border-rose-200">
                  Escalation statement: "{order.escalationReason}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Resolution Decision Banner */}
      {order.adminResolution && (
        <div className="p-5 rounded-2xl border-2 border-indigo-300 bg-indigo-50/90 text-indigo-950 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-extrabold text-sm text-indigo-950">Admin Arbitration Judgment</strong>
              <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-900 font-bold text-[10px]">
                {order.adminResolution}
              </span>
            </div>
            <p className="text-indigo-800">
              Arbitrated by Platform Admin on {order.adminResolvedAt ? new Date(order.adminResolvedAt).toLocaleString() : "recently"}.
              {order.refundedAmount && ` Total refunded to client: $${Number(order.refundedAmount).toFixed(2)}.`}
            </p>
            {order.deliveryNotes && (
              <p className="text-indigo-900/90 italic mt-1 bg-white p-2.5 rounded-xl border border-indigo-100">
                "{order.deliveryNotes}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Completed with Partial Refund Notice */}
      {order.status === "COMPLETED_WITH_PARTIAL_REFUND" && (
        <div className="p-5 rounded-2xl border-2 border-purple-300 bg-purple-50 text-purple-950 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <h3 className="font-extrabold text-purple-950 text-sm">Order Completed with Partial Refund</h3>
            <p className="text-purple-800">
              A partial refund of <strong className="font-mono text-purple-900">${Number(order.refundedAmount || order.partialRefundAmount || 0).toFixed(2)}</strong> was returned to the client via Stripe.
              The remaining balance was settled with your wallet (15% platform fee deducted, 85% vendor payout).
            </p>
          </div>
        </div>
      )}

      {/* Cancellation Request Review Banner (Active Request by Client) */}
      {order.cancelStatus === "REQUESTED" && (
        <div className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-50 text-amber-950 shadow-sm space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-[#0F0C3B] text-sm">
                  Client Submitted Cancellation &amp; Refund Request
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                  Action Required
                </span>
              </div>
              <p className="text-slate-700">
                Client requested to cancel this order with reason:
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 font-semibold text-slate-800">
                "{order.cancelReason}"
                {order.cancelNotes && <span className="block font-normal text-slate-600 mt-1">{order.cancelNotes}</span>}
              </div>

              {Array.isArray(order.cancelProofUrls) && order.cancelProofUrls.length > 0 && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-bold text-slate-600">Client Submitted Evidence / Proof:</span>
                  <div className="flex flex-wrap gap-2">
                    {order.cancelProofUrls.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-amber-300 rounded-lg text-indigo-600 font-bold text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Proof Attachment #{i + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-amber-200">
            <label className="text-[11px] font-bold text-slate-700 block">
              Response Note / Rejection Reason (Optional):
            </label>
            <input
              type="text"
              value={cancelResponseNote}
              onChange={(e) => setCancelResponseNote(e.target.value)}
              placeholder="e.g. Work is already prepared and non-refundable, or accepting full refund..."
              className="w-full p-2.5 bg-white rounded-xl border border-amber-300 text-xs focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRespondCancel("ACCEPT")}
                disabled={isRespondingCancel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Accept Cancellation &amp; Refund Client</span>
              </button>

              <button
                type="button"
                onClick={() => handleRespondCancel("REJECT")}
                disabled={isRespondingCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Decline Cancellation</span>
              </button>

              {!order.escalatedToAdmin && (
                <button
                  type="button"
                  onClick={() => setEscalateModalOpen(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Escalate to Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Partial Refund Request Review Banner */}
      {order.refundStatus === "REQUESTED" && (
        <div className="p-5 rounded-2xl border-2 border-purple-400 bg-purple-50 text-purple-950 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-[#0F0C3B] text-sm">
                  Client Requested Partial Refund (${partialRefundAmountNum.toFixed(2)})
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900">
                  Action Required
                </span>
              </div>
              <p className="text-slate-700">
                Reason: "{order.refundReason}"
                {order.refundNotes && <span className="block text-slate-600 mt-0.5">{order.refundNotes}</span>}
              </p>

              {Array.isArray(order.refundProofUrls) && order.refundProofUrls.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {order.refundProofUrls.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-purple-300 rounded-lg text-purple-700 font-bold text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Proof Attachment #{i + 1}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transparent Settlement Split Breakdown */}
          <div className="p-3.5 bg-white rounded-xl border border-purple-200 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span>Settlement Breakdown If You Accept:</span>
              <span className="text-[10px] text-purple-700 bg-purple-100 font-bold px-2 py-0.5 rounded">
                COMPLETED_WITH_PARTIAL_REFUND
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Contract Total</span>
                <strong className="text-sm font-bold text-[#0F0C3B]">${grandTotalNum.toFixed(2)}</strong>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-700">
                <span className="text-[10px] text-rose-600 block">Refund to Client</span>
                <strong className="text-sm font-bold">-${partialRefundAmountNum.toFixed(2)}</strong>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
                <span className="text-[10px] text-indigo-600 block">15% Platform Fee</span>
                <strong className="text-sm font-bold">-${partialFee.toFixed(2)}</strong>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
                <span className="text-[10px] text-emerald-600 block">Your Net Payout (85%)</span>
                <strong className="text-sm font-bold">+${partialVendorNet.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-purple-200">
            <label className="text-[11px] font-bold text-slate-700 block">
              Response Note (Optional):
            </label>
            <input
              type="text"
              value={partialRefundResponseNote}
              onChange={(e) => setPartialRefundResponseNote(e.target.value)}
              placeholder="e.g. Accepted with revised scope, or declined..."
              className="w-full p-2.5 bg-white rounded-xl border border-purple-300 text-xs focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRespondPartialRefund("ACCEPT")}
                disabled={isRespondingRefund}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Accept Partial Refund &amp; Settle Payout</span>
              </button>

              <button
                type="button"
                onClick={() => handleRespondPartialRefund("REJECT")}
                disabled={isRespondingRefund}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Decline Partial Refund</span>
              </button>

              {!order.escalatedToAdmin && (
                <button
                  type="button"
                  onClick={() => setEscalateModalOpen(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
                  <span>Escalate to Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Milestone Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revision Requested Alert */}
          {order.status === "REVISION_REQUESTED" && (
            <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50 text-amber-900 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-[#0F0C3B] text-sm">
                      Client Requested Revision (Round #{order.revisionCount || 1})
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    The client reviewed your submission and requested the following modifications:
                  </p>
                  <div className="mt-2 p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-800 font-semibold italic">
                    "{order.revisionReason || order.deliveryNotes}"
                  </div>
                </div>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDelivery(null, true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Deliver Revised Work</span>
                </button>
              </div>
            </div>
          )}

          {/* Delivered Awaiting Review Alert */}
          {order.status === "DELIVERED" && (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/70 text-indigo-900 shadow-xs space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="font-extrabold text-[#0F0C3B] text-sm">
                  Order Delivered · Waiting for Client Approval
                </h3>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                  3-Day Review Window
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Your deliverables have been submitted to the client. The client has 3 days to review and accept or request revisions. If no action is taken within 3 days, the system will automatically complete the order and begin the 7-day security clearing hold.
              </p>
              {order.autoCompleteAt && (
                <p className="text-[11px] font-semibold text-indigo-700">
                  Automatic completion deadline: {new Date(order.autoCompleteAt).toLocaleDateString()} at {new Date(order.autoCompleteAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          )}

          {/* Completed & 7-Day Clearing Alert */}
          {isCompleted && order.clearingEndsAt && (
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-emerald-950 shadow-xs space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-[#0F0C3B] text-sm">
                  Order Completed · 7-Day Security Clearing Active
                </h3>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  Pending for Release
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Client approved your delivery! Your net payout of <strong className="text-emerald-800 font-bold">${Number(order.vendorNet || 0).toFixed(2)}</strong> is currently in the 7-day security clearing hold. Funds will automatically transfer to your Stripe Connect balance on:
              </p>
              <p className="text-xs font-bold text-emerald-700">
                {new Date(order.clearingEndsAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

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

          {/* Live Order Chat */}
          <div id="order-chat-section" className="pt-2">
            <OrderChat order={order} />
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
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("order-chat-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-brand-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Client (Live Chat)</span>
              </button>
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

            <div className="space-y-3.5 text-xs">
              {/* Deliverable File Upload Area */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Upload Deliverables / Files / Images <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-brand-primary/50 rounded-xl p-4 text-center transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="vendor-delivery-files"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*,application/pdf,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  />
                  <label
                    htmlFor="vendor-delivery-files"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-brand-primary flex items-center justify-center">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-brand-primary">Click to attach files</span>
                    <span className="text-[10px] text-slate-400">
                      Images, Videos, PDFs, ZIP archives, Documents (up to 50MB per file)
                    </span>
                  </label>
                </div>

                {/* Selected Files List */}
                {deliveryFiles.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                    {deliveryFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Delivery Message / Work Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Explain completed work, instructions, setup notes (at least 5 characters)..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Additional Proof URL / Cloud Storage Link (Optional)
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

      {/* Escalate to Admin Modal */}
      {escalateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Escalate Order to Admin</h3>
                <p className="text-xs text-slate-500">
                  Request official mediation and arbitration from Platform Administrators
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reason for Escalation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="Client requested unreasonable cancellation">Client requested unreasonable cancellation</option>
                  <option value="Partial refund terms disagreement">Partial refund terms disagreement</option>
                  <option value="Dispute unresolved with client">Dispute unresolved with client</option>
                  <option value="Work completed according to specification but disputed">Work completed according to specification but disputed</option>
                  <option value="Communication breakdown or policy violation">Communication breakdown or policy violation</option>
                  <option value="Other grievance">Other grievance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Vendor Statement / Case Explanation (Optional)
                </label>
                <textarea
                  value={escalateNotes}
                  onChange={(e) => setEscalateNotes(e.target.value)}
                  placeholder="Detail your completed milestones, communication attempts, and grounds for dispute rejection or release..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-[11px] text-rose-900 space-y-1">
                <span className="font-bold block">Mediation Process:</span>
                <p>
                  A platform admin will review all delivery proofs, messages, and contract requirements, then issue a binding judgment: cancel and full refund, partial refund, or dispute rejection with payout release.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEscalateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmEscalation}
                disabled={isEscalating}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isEscalating ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                <span>Confirm Escalation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
