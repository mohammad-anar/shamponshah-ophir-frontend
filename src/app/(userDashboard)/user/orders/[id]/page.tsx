"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
  FileText,
  DollarSign,
  AlertTriangle,
  CreditCard,
  Loader2,
  Sparkles,
  Download,
  Star,
  Check,
  Send,
  ExternalLink,
  UploadCloud,
  RotateCcw,
  FileArchive,
  Film,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import StripePaymentModal from "@/components/payment/StripePaymentModal";
import OrderChat from "@/components/chat/OrderChat";
import {
  useGetOrderByIdQuery,
  useApproveMilestoneMutation,
  useCancelOrderMutation,
  useCreateReviewMutation,
  useCreateDisputeMutation,
  useAcceptDeliveryMutation,
  useDeclineDeliveryMutation,
  useRequestRevisionMutation,
  useRequestCancellationMutation,
  useRequestPartialRefundMutation,
  useEscalateOrderToAdminMutation,
} from "@/redux/service/orders/ordersApi";

export default function UserOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const { data: orderData, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const [approveMilestone, { isLoading: isApproving }] = useApproveMilestoneMutation();
  const [cancelOrderMutation, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [createReviewMutation, { isLoading: isReviewing }] = useCreateReviewMutation();
  const [createDisputeMutation, { isLoading: isDisputing }] = useCreateDisputeMutation();
  const [acceptDeliveryMutation, { isLoading: isAcceptingDelivery }] = useAcceptDeliveryMutation();
  const [declineDeliveryMutation, { isLoading: isDecliningDelivery }] = useDeclineDeliveryMutation();
  const [requestRevisionMutation, { isLoading: isRequestingRevision }] = useRequestRevisionMutation();
  const [requestCancellation, { isLoading: isRequestingCancel }] = useRequestCancellationMutation();
  const [requestPartialRefund, { isLoading: isRequestingPartialRefund }] = useRequestPartialRefundMutation();
  const [escalateOrderToAdmin, { isLoading: isEscalating }] = useEscalateOrderToAdminMutation();

  // Modals & form state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingMilestone, setPayingMilestone] = useState<any>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Event rescheduled or cancelled");
  const [cancelNotes, setCancelNotes] = useState("");
  const [cancelProof, setCancelProof] = useState("");

  const [partialRefundModalOpen, setPartialRefundModalOpen] = useState(false);
  const [partialRefundAmount, setPartialRefundAmount] = useState("");
  const [partialRefundReason, setPartialRefundReason] = useState("Service scope reduced or partially deficient");
  const [partialRefundNotes, setPartialRefundNotes] = useState("");
  const [partialRefundProof, setPartialRefundProof] = useState("");

  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState("Dispute unresolved with vendor");
  const [escalateNotes, setEscalateNotes] = useState("");

  // Decline / Revision modal state
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedDeclineMilestone, setSelectedDeclineMilestone] = useState<any>(null);
  const [declineReason, setDeclineReason] = useState("Deliverables do not match contract requirements");
  const [declineNotes, setDeclineNotes] = useState("");

  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("Work not delivered as described");
  const [disputeDesc, setDisputeDesc] = useState("");

  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Real-time synchronization for order updates (delivered, revision, completion)
  useEffect(() => {
    const handleStatusUpdate = (e: any) => {
      if (!e?.detail?.orderId || e?.detail?.orderId === orderId) {
        refetch();
      }
    };
    window.addEventListener("order_status_updated", handleStatusUpdate);
    return () => window.removeEventListener("order_status_updated", handleStatusUpdate);
  }, [orderId, refetch]);

  const order = orderData?.data || orderData;

  // File resolution helpers
  const getFileUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const backendBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005").replace(/\/api\/v1\/?$/, "");
    return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const getFileName = (url: string) => {
    if (!url) return "deliverable-file";
    const parts = url.split("/");
    return parts[parts.length - 1] || "deliverable-file";
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  };

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov|mkv)$/i.test(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-xs text-foreground-muted font-medium">Loading order #{orderId}...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-surface p-12 rounded-2xl border border-border text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-xs text-foreground-muted">
          The requested order contract #{orderId} could not be retrieved or you do not have permission to view it.
        </p>
        <button
          onClick={() => router.push("/user/orders")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-foreground rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>
      </div>
    );
  }

  const milestones: any[] = order.milestones || [];
  const vendorName =
    order.vendorProfile?.businessName ||
    order.vendorProfile?.user?.name ||
    order.vendorName ||
    "Verified Vendor";
  const vendorUserId =
    order.vendorProfile?.userId ||
    order.vendorProfile?.user?.id ||
    order.vendorUserId ||
    "";
  const serviceTitle =
    order.gig?.title ||
    order.job?.title ||
    order.notes ||
    order.serviceTitle ||
    "Custom Event Vendor Order";
  const totalAmount = order.grandTotal
    ? `$${Number(order.grandTotal).toFixed(2)}`
    : order.totalAmount || `$${Number(order.subtotal || 0).toFixed(2)}`;

  const eventDateStr = order.eventDate
    ? new Date(order.eventDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Event Date To Be Scheduled";

  const isCompleted = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";
  const isDelivered = order.status === "DELIVERED";
  const isRevisionRequested = order.status === "REVISION_REQUESTED";
  const hasPendingDelivery =
    !isCompleted &&
    !isCancelled &&
    (isDelivered || milestones.some((m: any) => m.status === "PENDING_RELEASE") || (!milestones.length && order.status === "IN_PROGRESS" && Boolean(order.deliveryNotes)));

  const handleOpenDeclineModal = (ms?: any) => {
    setSelectedDeclineMilestone(ms || null);
    setDeclineReason("Deliverables do not match contract requirements");
    setDeclineNotes("");
    setDeclineModalOpen(true);
  };

  const handleConfirmDecline = async () => {
    const reasonText = declineNotes.trim()
      ? `${declineReason}: ${declineNotes.trim()}`
      : declineReason;

    if (reasonText.trim().length < 5) {
      toast.error("Please enter a revision message with at least 5 characters.");
      return;
    }

    try {
      await requestRevisionMutation({
        orderId: order.id,
        reason: reasonText,
      }).unwrap();

      toast.success("Revision Request Submitted", {
        description: `Feedback sent to ${vendorName}. They have been notified to review changes and re-deliver.`,
      });
      setDeclineModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit revision request");
    }
  };

  const handleAcceptAllDelivery = async () => {
    try {
      await acceptDeliveryMutation({
        orderId: order.id,
        note: "Client approved order delivery and released remaining funds",
      }).unwrap();

      toast.success("Delivery approved & Order Completed!", {
        description: `The 7-day security clearing has started. Funds will be released to ${vendorName} after clearing. No extra charges applied.`,
      });
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept delivery");
    }
  };

  const handleApproveMilestone = async (ms: any) => {
    try {
      await approveMilestone({
        orderId: order.id,
        milestoneId: ms.id,
        note: `Client approved release of milestone ${ms.label || ms.title || ""}`,
      }).unwrap();

      toast.success("Milestone approved.", {
        description: `$${Number(ms.amount).toFixed(2)} is scheduled to transfer to ${vendorName} after the 7-day hold.`,
      });
      setPayingMilestone(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to release milestone payment");
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await requestCancellation({
        orderId: order.id,
        reason: cancelReason,
        notes: cancelNotes,
        proofUrls: cancelProof.trim() ? [cancelProof.trim()] : [],
      }).unwrap();

      toast.success("Cancellation request submitted to Vendor and Admin", {
        description: "Vendor will review your reason and proof. You may escalate if needed.",
      });
      setCancelModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit cancellation request");
    }
  };

  const handleConfirmPartialRefund = async () => {
    const amt = Number(partialRefundAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }
    const orderTotal = Number(order.grandTotal || 0);
    if (amt >= orderTotal) {
      toast.error(`Partial refund must be less than order total ($${orderTotal}). For full refund, request cancellation.`);
      return;
    }

    try {
      await requestPartialRefund({
        orderId: order.id,
        amount: amt,
        reason: partialRefundReason,
        notes: partialRefundNotes,
        proofUrls: partialRefundProof.trim() ? [partialRefundProof.trim()] : [],
      }).unwrap();

      toast.success("Partial refund request submitted!", {
        description: `Vendor will review your request for $${amt.toFixed(2)}. If accepted, the refund is sent to your card, and remaining balance settled.`,
      });
      setPartialRefundModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit partial refund request");
    }
  };

  const handleConfirmEscalation = async () => {
    try {
      await escalateOrderToAdmin({
        orderId: order.id,
        reason: escalateReason,
        notes: escalateNotes,
      }).unwrap();

      toast.success("Case Escalated to Admin", {
        description: "An administrator has joined this order and will arbitrate based on chat, deliverables, and submitted proof.",
      });
      setEscalateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to escalate case to admin");
    }
  };

  const handleSubmitDispute = async () => {
    try {
      await createDisputeMutation({
        orderId: order.id,
        reason: disputeReason,
        description: disputeDesc,
      }).unwrap();

      toast.success("Dispute submitted.", {
        description: "Scheduled milestone transfers are paused while the case is reviewed.",
      });
      setDisputeModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit dispute");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Please enter a short review comment");
      return;
    }
    try {
      await createReviewMutation({
        orderId: order.id,
        rating,
        comment: reviewComment,
      }).unwrap();

      toast.success("Review Submitted! Thank you for supporting our vendors.");
      setReviewComment("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/user/orders")}
            className="w-9 h-9 rounded-xl border border-border bg-surface hover:bg-surface-elevated flex items-center justify-center text-foreground-secondary transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground-muted font-medium">Order Contract</span>
              <span className="text-xs font-bold text-brand-primary bg-info-soft px-2 py-0.5 rounded-md">
                #{order.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
              {serviceTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("order-chat-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-on-brand hover:bg-indigo-700 text-foreground rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Vendor</span>
          </button>

          {!isCompleted && !isCancelled && (
            <>
              <button
                onClick={() => setPartialRefundModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-purple-200 bg-brand-soft/70 hover:bg-brand-soft text-brand text-xs font-semibold transition-colors cursor-pointer"
              >
                Request Partial Refund
              </button>
              <button
                onClick={() => setDisputeModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-foreground-secondary text-xs font-semibold transition-colors cursor-pointer"
              >
                Dispute
              </button>
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-danger/30 bg-danger-soft/50 hover:bg-danger-soft text-danger text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            </>
          )}

          {(order.cancelStatus === "REJECTED" || order.refundStatus === "REJECTED" || order.status === "DISPUTED") && !order.escalatedToAdmin && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-danger/30 bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Escalate to Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Escalated to Admin Notice */}
      {order.escalatedToAdmin && (
        <div className="p-5 rounded-2xl border-2 border-rose-400 bg-danger-soft text-danger shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-danger-solid text-white text-foreground flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-foreground text-sm sm:text-base">
                  Case Escalated to Admin for Official Mediation
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-danger uppercase">
                  Escalated by {order.escalatedBy || "Party"}
                </span>
              </div>
              <p className="text-xs text-danger mt-1">
                An administrator has joined this order. The admin is reviewing chat history, contract deliverables, and submitted proof to arbitrate a binding resolution.
              </p>
              {order.escalationReason && (
                <p className="text-xs text-foreground-secondary mt-1 italic bg-surface/70 p-2 rounded-lg border border-danger/30">
                  Escalation reason: {order.escalationReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Resolution Decision Banner */}
      {order.adminResolution && (
        <div className="p-5 rounded-2xl border-2 border-info/30 bg-info-soft/90 text-indigo-950 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand text-on-brand text-foreground flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-extrabold text-sm text-indigo-950">Admin Arbitration Judgment</strong>
              <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-info font-bold text-[10px]">
                {order.adminResolution}
              </span>
            </div>
            <p className="text-info">
              The case was arbitrated by Platform Admin on {order.adminResolvedAt ? new Date(order.adminResolvedAt).toLocaleString() : "recently"}.
              {order.refundedAmount && ` Total refunded: $${Number(order.refundedAmount).toFixed(2)}.`}
            </p>
            {order.deliveryNotes && (
              <p className="text-info/90 italic mt-1 bg-surface p-2.5 rounded-xl border border-info/30">
                {order.deliveryNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Completed with Partial Refund Notice */}
      {order.status === "COMPLETED_WITH_PARTIAL_REFUND" && (
        <div className="p-5 rounded-2xl border-2 border-purple-300 bg-brand-soft text-brand shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand text-on-brand text-foreground flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <h3 className="font-extrabold text-brand text-sm">Order Completed with Partial Refund</h3>
            <p className="text-purple-800">
              A partial refund of <strong className="font-mono text-purple-900">${Number(order.refundedAmount || order.partialRefundAmount || 0).toFixed(2)}</strong> has been returned to your payment method via Stripe. The remaining balance was settled with the vendor.
            </p>
          </div>
        </div>
      )}

      {/* Cancellation Request Status Banner */}
      {order.cancelStatus === "REQUESTED" && (
        <div className="p-5 rounded-2xl border-2 border-warning/30 bg-warning-soft text-warning shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-bold text-sm block">Cancellation Request Pending Vendor Review</strong>
              <p className="text-warning">
                Reason: "{order.cancelReason}". Visible on Vendor and Admin dashboards.
              </p>
            </div>
          </div>
          {!order.escalatedToAdmin && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="px-3.5 py-2 bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Escalate to Admin
            </button>
          )}
        </div>
      )}

      {order.cancelStatus === "REJECTED" && (
        <div className="p-5 rounded-2xl border-2 border-danger/30 bg-danger-soft text-rose-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-bold text-sm block">Cancellation Request Declined by Vendor</strong>
              <p className="text-danger">
                Vendor Note: "{order.cancelResponseNote || "Declined"}". You may escalate this order to Admin for binding mediation.
              </p>
            </div>
          </div>
          {!order.escalatedToAdmin && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="px-4 py-2 bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              Escalate Case to Admin
            </button>
          )}
        </div>
      )}

      {/* Partial Refund Request Status Banner */}
      {order.refundStatus === "REQUESTED" && (
        <div className="p-5 rounded-2xl border-2 border-purple-300 bg-brand-soft text-brand shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-bold text-sm block">Partial Refund Request Pending (${Number(order.partialRefundAmount || 0).toFixed(2)})</strong>
              <p className="text-purple-900">
                Reason: "{order.refundReason}". If accepted by vendor, the refund portion will be returned to your payment method, and remainder settled.
              </p>
            </div>
          </div>
          {!order.escalatedToAdmin && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="px-3.5 py-2 bg-brand text-on-brand hover:bg-purple-700 text-foreground rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Escalate to Admin
            </button>
          )}
        </div>
      )}

      {order.refundStatus === "REJECTED" && (
        <div className="p-5 rounded-2xl border-2 border-danger/30 bg-danger-soft text-rose-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-bold text-sm block">Partial Refund Request Declined by Vendor</strong>
              <p className="text-danger">
                Vendor Note: "{order.refundResponseNote || "Declined"}". You can escalate to Admin for mediation.
              </p>
            </div>
          </div>
          {!order.escalatedToAdmin && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="px-4 py-2 bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              Escalate Case to Admin
            </button>
          )}
        </div>
      )}

      {/* Pending Payment Notice */}
      {order.status === "PENDING_PAYMENT" && (() => {
        const createdAtMs = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
        const hoursRemaining = Math.max(0, Math.ceil((createdAtMs + 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60)));
        return (
          <div className="p-6 rounded-2xl border-2 border-warning/30 bg-warning-solid text-on-brand/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-warning-solid text-on-brand text-foreground flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-foreground text-base sm:text-lg">
                      Payment Required to Activate Order
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-soft text-warning animate-pulse">
                      Auto-cancels in {hoursRemaining} hours if unpaid
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary mt-1 max-w-xl">
                    This booking requires payment before vendor work begins. Your funds are held securely in the Ophir Escrow Vault on Stripe Connect until final completion.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayModalOpen(true)}
                className="px-6 py-3 bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Now ({totalAmount})</span>
              </button>
            </div>
          </div>
        );
      })()}

      {order.status === "CANCELLED" && (
        <div className="p-5 rounded-2xl border border-danger/30 bg-danger-soft text-danger flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold block text-sm">Order Cancelled</strong>
            <p className="mt-0.5 text-danger">
              This order contract has been cancelled. Unpaid bookings are automatically cancelled after 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Milestones & Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Review Card: Action Required to Accept or Request Revision */}
          {isDelivered && (
            <div className="p-6 rounded-2xl border-2 border-info/30 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-info/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand text-on-brand text-foreground flex items-center justify-center shrink-0 shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-foreground text-base sm:text-lg">
                        Deliverables Submitted for Your Approval
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-info-soft text-info animate-pulse">
                        Action Required
                      </span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      Round #{order.revisionCount ? order.revisionCount + 1 : 1} · Submitted by {vendorName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Message */}
              {order.deliveryNotes && (
                <div className="p-4 bg-surface rounded-xl border border-info/30 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-info uppercase tracking-wider block">
                    Artisan's Delivery Message:
                  </span>
                  <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">
                    {order.deliveryNotes}
                  </p>
                </div>
              )}

              {/* Delivered Files Grid */}
              {Array.isArray(order.deliveryFiles) && order.deliveryFiles.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-foreground block">
                    Delivered Files &amp; Proof ({order.deliveryFiles.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.deliveryFiles.map((fileUrl: string, idx: number) => {
                      const fullUrl = getFileUrl(fileUrl);
                      const fileName = getFileName(fileUrl);
                      const isImg = isImageUrl(fileUrl);
                      const isVid = isVideoUrl(fileUrl);

                      return (
                        <div
                          key={idx}
                          className="bg-surface rounded-xl border border-border overflow-hidden shadow-2xs group hover:border-info/30 transition-all flex flex-col justify-between"
                        >
                          {isImg ? (
                            <div className="relative aspect-video w-full bg-surface-sunken overflow-hidden">
                              <img
                                src={fullUrl}
                                alt={fileName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <a
                                href={fullUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-foreground text-xs font-bold transition-opacity gap-1.5"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Full Image</span>
                              </a>
                            </div>
                          ) : isVid ? (
                            <div className="aspect-video w-full bg-surface-sunken flex items-center justify-center">
                              <Film className="w-8 h-8 text-foreground/70" />
                            </div>
                          ) : (
                            <div className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-info-soft text-info flex items-center justify-center shrink-0">
                                <FileArchive className="w-5 h-5" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-foreground truncate" title={fileName}>
                                  {fileName}
                                </p>
                                <span className="text-[10px] text-foreground-muted font-medium uppercase">File Deliverable</span>
                              </div>
                            </div>
                          )}

                          <div className="p-2.5 border-t border-border bg-surface-elevated/60 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-foreground-secondary truncate max-w-[140px]" title={fileName}>
                              {fileName}
                            </span>
                            <a
                              href={fullUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-info hover:text-info hover:bg-info-soft rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Auto-Complete Countdown notice */}
              {order.autoCompleteAt && (
                <div className="p-3.5 rounded-xl bg-warning-soft border border-warning/30 text-warning flex items-start gap-2.5 text-xs">
                  <Clock className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                  <div className="leading-relaxed">
                    <strong className="font-bold block">3-Day Review Window Active</strong>
                    <span>
                      Please review the deliverables above. If no action is taken by{" "}
                      <span className="font-bold underline">
                        {new Date(order.autoCompleteAt).toLocaleString()}
                      </span>
                      , this order will automatically be accepted and marked as completed.
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAcceptAllDelivery}
                  disabled={isAcceptingDelivery}
                  className="flex-1 px-5 py-3 bg-success-solid text-foreground hover:bg-success-solid text-white text-foreground text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAcceptingDelivery ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Accept Delivery &amp; Complete Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDeclineModal(null)}
                  disabled={isDecliningDelivery || isRequestingRevision}
                  className="px-5 py-3 bg-surface hover:bg-danger-soft border-2 border-danger/30 hover:border-danger/30 text-danger text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
              </div>

              <p className="text-[11px] text-foreground-muted text-center">
                * Accepting completes the order with no additional charges. Escrow begins the 7-day security clearing before payout to artisan.
              </p>
            </div>
          )}

          {/* Revision Requested Banner */}
          {isRevisionRequested && (
            <div className="p-5 rounded-2xl border-2 border-warning/30 bg-warning-soft/70 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-solid text-on-brand text-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-foreground text-base">
                      Revision Requested (Round #{order.revisionCount || 1})
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning-soft text-warning">
                      Artisan Working on Changes
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary">
                    You have requested revisions for this order. {vendorName} has been notified and is updating the deliverables.
                  </p>
                  {order.revisionReason && (
                    <div className="mt-2 p-3 bg-surface rounded-xl border border-warning/30 text-xs text-foreground">
                      <span className="font-bold text-warning block mb-0.5">Your Feedback / Requirements:</span>
                      <p className="italic">{order.revisionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Completed & 7-Day Clearing Notice */}
          {isCompleted && (
            <div className="p-5 rounded-2xl border-2 border-success/30 bg-success-soft/80 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-success-solid text-foreground text-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-success text-base">
                      Order Fulfillment Completed
                    </h3>
                    {order.clearingEndsAt && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-success">
                        7-Day Security Clearing Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-success leading-relaxed">
                    {order.clearingEndsAt ? (
                      <>
                        Thank you for confirming your order delivery! Funds held in escrow are currently in the 7-day clearing period, scheduled for automatic release to {vendorName}'s Stripe Connect balance on{" "}
                        <strong className="underline">
                          {new Date(order.clearingEndsAt).toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </strong>.
                      </>
                    ) : (
                      <>
                        All deliverables have been accepted and the escrow funds have completed transfer. Thank you for booking with Ophir!
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Delivered Files permanent access */}
              {Array.isArray(order.deliveryFiles) && order.deliveryFiles.length > 0 && (
                <div className="pt-2 border-t border-success/30/60 space-y-2">
                  <span className="text-xs font-bold text-success block">Your Final Delivered Files:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {order.deliveryFiles.map((fileUrl: string, idx: number) => {
                      const fullUrl = getFileUrl(fileUrl);
                      const fileName = getFileName(fileUrl);
                      const isImg = isImageUrl(fileUrl);
                      return (
                        <div
                          key={idx}
                          className="bg-surface rounded-xl border border-success/30 p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {isImg ? (
                              <ImageIcon className="w-4 h-4 text-success shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-success shrink-0" />
                            )}
                            <span className="text-xs font-medium text-foreground-secondary truncate" title={fileName}>
                              {fileName}
                            </span>
                          </div>
                          <a
                            href={fullUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-success hover:bg-success-soft rounded transition-colors shrink-0"
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Alert Banner */}
          <div
            className={cn(
              "p-4 rounded-2xl border flex items-start gap-3",
              isCompleted
                ? "bg-success-soft border-success/30 text-success"
                : isCancelled
                ? "bg-danger-soft border-danger/30 text-danger"
                : "bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border-info/30 text-foreground"
            )}
          >
            <ShieldCheck
              className={cn(
                "w-5 h-5 shrink-0 mt-0.5",
                isCompleted ? "text-success" : isCancelled ? "text-danger" : "text-brand-primary"
              )}
            />
            <div className="text-xs space-y-1">
              <span className="font-extrabold uppercase tracking-wide block">
                {isCompleted
                  ? "Order Fulfillment Completed"
                  : isCancelled
                  ? "Order Cancelled"
                  : `Order Status: ${order.status}`}
              </span>
              <p className="text-foreground-secondary leading-relaxed">
                {isCompleted
                  ? "All work has been approved. Approved transfers follow the 7-day clearing hold before reaching the vendor's Stripe Connect balance."
                  : isCancelled
                  ? "This order was cancelled. Any locked funds have been processed for return."
                  : "Payments are held in escrow. After you approve delivery, funds enter a 7-day clearing hold before automated transfer to vendor."}
              </p>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-foreground text-base">Milestone Payment Schedule</h2>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Approve releases individually as the vendor delivers work
                </p>
              </div>
              <span className="text-xs font-bold text-info bg-info-soft px-2.5 py-1 rounded-lg">
                {milestones.length} {milestones.length === 1 ? "Milestone" : "Milestones"}
              </span>
            </div>

            <div className="divide-y divide-border">
              {milestones.length === 0 ? (
                <div className="p-8 text-center text-foreground-muted text-xs">
                  No explicit milestone breakdown. Order is fulfilled on single delivery.
                </div>
              ) : (
                milestones.map((ms, idx) => {
                  const isReleased = ms.status === "RELEASED" || ms.status === "PAID";
                  const isPendingRelease = ms.status === "PENDING_RELEASE";
                  const isRefunded = ms.status === "REFUNDED";
                  const isFunded = ms.status === "FUNDED";
                  const isScheduled = ms.status === "APPROVED_PENDING_RELEASE";

                  return (
                    <div
                      key={ms.id || idx}
                      className={cn(
                        "p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                        isPendingRelease ? "bg-warning-soft/40" : "hover:bg-surface-elevated/50"
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5",
                            isReleased
                              ? "bg-success-soft text-success"
                              : isPendingRelease || isScheduled
                              ? "bg-warning-soft text-warning"
                              : isRefunded
                              ? "bg-surface-sunken text-foreground-muted"
                              : "bg-surface-sunken text-foreground-muted"
                          )}
                        >
                          {isReleased ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-foreground text-sm">
                              {ms.label || ms.title || `Milestone ${idx + 1}`}
                            </h4>
                            <span
                              className={cn(
                                "text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                isReleased
                                  ? "bg-success-soft text-success"
                                  : isPendingRelease || isScheduled
                                  ? "bg-warning-soft text-warning"
                                  : isRefunded
                                  ? "bg-danger-soft text-danger"
                                  : "bg-surface-sunken text-foreground-muted"
                              )}
                            >
                              {isReleased ? "Transferred" : isPendingRelease ? "Delivery submitted" : isScheduled ? "Transfer scheduled" : isFunded ? "Payment collected · Work in progress" : isRefunded ? "Refunded" : ms.status === "LOCKED" ? "Payment required" : ms.status}
                            </span>
                          </div>

                          <p className="text-xs text-foreground-muted">
                            {ms.percentage ? `${ms.percentage}% of contract` : "Payment instalment"}
                            {ms.notes && ` • Note: ${ms.notes}`}
                          </p>

                          {/* Proof of delivery if attached */}
                          {ms.proofUrl && (
                            <a
                              href={ms.proofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-info hover:underline mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Submitted Deliverable Proof</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:self-center justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="font-extrabold text-foreground text-base block">
                            ${Number(ms.amount || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-foreground-muted block font-medium">
                            {isReleased ? "Transferred to vendor Connect balance" : ms.status === "FUNDED" || ms.status === "PENDING_RELEASE" || ms.status === "APPROVED_PENDING_RELEASE" ? "Payment collected" : ms.status === "REFUNDED" ? "Refunded" : "Payment not collected"}
                          </span>
                        </div>

                        {isPendingRelease && !isCancelled && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => setPayingMilestone(ms)}
                              className="px-3 py-1.5 bg-success-solid text-foreground hover:bg-success-solid text-white text-foreground rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Delivery</span>
                            </button>
                            <button
                              onClick={() => handleOpenDeclineModal(ms)}
                              className="px-2.5 py-1.5 bg-surface hover:bg-danger-soft text-danger border border-danger/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Decline this milestone and request revision"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Celebration Details Card */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider">
              Celebration &amp; Service Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated border border-border">
                <Calendar className="w-4 h-4 text-info mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-foreground-muted block">Scheduled Date</span>
                  <span className="font-bold text-foreground">{eventDateStr}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated border border-border">
                <MapPin className="w-4 h-4 text-info mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-foreground-muted block">Event Venue</span>
                  <span className="font-bold text-foreground">
                    {order.deliveryNotes || order.location || "Online / Coordinate via Chat"}
                  </span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">Order Instructions</span>
                <p className="text-foreground-secondary mt-1 leading-relaxed">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Live Order Chat Panel */}
          <div className="space-y-3 pt-2" id="order-chat-section">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-info" />
                <span>Live Order Chat</span>
              </h3>
              <span className="text-xs text-foreground-muted font-medium">Socket room: order:{order.id}</span>
            </div>
            <OrderChat order={order} />
          </div>

          {/* Review section if completed */}
          {isCompleted && (
            <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-warning fill-amber-500" />
                <span>Rate &amp; Review Your Vendor</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6",
                          star <= rating
                            ? "text-warning fill-amber-500"
                            : "text-foreground-secondary"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground-secondary ml-2">{rating} of 5 Stars</span>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share feedback on communication, quality, and overall experience..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-border focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={isReviewing}
                  className="px-4 py-2 bg-brand-primary text-foreground rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isReviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit Review</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Vendor Profile + Ledger */}
        <div className="space-y-6">
          {/* Vendor Card */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-4">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block tracking-wider">
              Assigned Vendor
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand text-foreground font-black text-lg flex items-center justify-center overflow-hidden shrink-0">
                {order.vendorProfile?.avatarUrl ? (
                  <img
                    src={order.vendorProfile.avatarUrl}
                    alt={vendorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  vendorName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-foreground text-sm truncate">{vendorName}</h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ophir Verified
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Link
                href={`/user/messages?userId=${vendorUserId}&orderId=${order.id}&vendorName=${encodeURIComponent(vendorName)}`}
                className="w-full py-2.5 bg-info-soft hover:bg-info-soft text-brand-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Messages</span>
              </Link>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-foreground text-sm">Order Payment Summary</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 text-foreground-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground-secondary">${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(order.platformFee) > 0 && (
                <div className="flex justify-between py-1 text-foreground-muted">
                  <span>Service Fee</span>
                  <span className="font-semibold text-foreground-secondary">${Number(order.platformFee).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-border text-sm font-black text-foreground">
                <span>Total Contract Value</span>
                <span>{totalAmount}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-success-soft/60 border border-emerald-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <div className="text-[11px] text-success leading-tight">
                <strong className="block font-bold">Milestone payment status</strong>
                <span>Payments are collected by Stripe. Approved transfers have a 7-day hold before transfer to the vendor's connected Stripe balance.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Milestone Modal */}
      {payingMilestone && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-soft text-success flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Confirm Milestone Release</h3>
                <p className="text-xs text-foreground-muted">
                  Approve this delivery for {vendorName}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Milestone:</span>
                <span className="font-bold text-foreground">{payingMilestone.label || payingMilestone.title}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-success pt-1 border-t border-border">
                <span>Release Amount:</span>
                <span>${Number(payingMilestone.amount || 0).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-foreground-muted leading-relaxed">
              By confirming, you acknowledge that the work for this milestone has been delivered satisfactorily. The transfer is scheduled after the 7-day review hold.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayingMilestone(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApproveMilestone(payingMilestone)}
                disabled={isApproving}
                className="flex-1 py-2.5 bg-success-solid text-foreground hover:bg-success-solid text-white text-foreground rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Authorize Release</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Delivery Modal */}
      {declineModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Decline &amp; Request Revision</h3>
                <p className="text-xs text-foreground-muted">
                  {selectedDeclineMilestone ? selectedDeclineMilestone.label || selectedDeclineMilestone.title : `Order #${order.id}`}
                </p>
              </div>
            </div>

            <p className="text-xs text-foreground-secondary">
              Declining will notify {vendorName} that adjustments are required. They can review your feedback and deliver again.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Reason for Revision *</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border text-xs bg-surface"
                >
                  <option value="Deliverables do not match contract requirements">Deliverables do not match contract requirements</option>
                  <option value="Missing files, photos, or physical items">Missing files, photos, or physical items</option>
                  <option value="Revisions/changes needed on submitted work">Revisions/changes needed on submitted work</option>
                  <option value="Quality does not meet agreed standard">Quality does not meet agreed standard</option>
                  <option value="Other revision needed">Other revision needed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">
                  Specific Revision Instructions * (min 5 characters)
                </label>
                <textarea
                  rows={3}
                  value={declineNotes}
                  onChange={(e) => setDeclineNotes(e.target.value)}
                  placeholder="Explain clearly what the artisan needs to revise or fix..."
                  className="w-full p-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated"
              >
                Keep Delivery
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={isDecliningDelivery || isRequestingRevision}
                className="flex-1 py-2.5 bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isDecliningDelivery || isRequestingRevision ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                <span>Send Revision Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Request Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger-soft text-danger flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Request Cancellation</h3>
                <p className="text-xs text-foreground-muted">Order #{order.orderNumber || order.id}</p>
              </div>
            </div>

            <p className="text-xs text-foreground-secondary">
              Your cancellation request and proof will be visible on both Vendor and Admin dashboards.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Reason for cancellation *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border text-xs bg-surface"
                >
                  <option value="Event rescheduled or cancelled">Event rescheduled or cancelled</option>
                  <option value="Vendor unresponsive or late">Vendor unresponsive or late</option>
                  <option value="Mutual agreement to cancel">Mutual agreement to cancel</option>
                  <option value="Deliverables deficient or unsuitable">Deliverables deficient or unsuitable</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Explanation Notes</label>
                <textarea
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Explain why you wish to cancel this contract..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Proof URL / Image Link (Optional)</label>
                <input
                  type="url"
                  value={cancelProof}
                  onChange={(e) => setCancelProof(e.target.value)}
                  placeholder="https://example.com/evidence-document.png"
                  className="w-full p-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isRequestingCancel || isCancelling}
                className="flex-1 py-2.5 bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isRequestingCancel || isCancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit Cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partial Refund Request Modal */}
      {partialRefundModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Request Partial Refund</h3>
                <p className="text-xs text-foreground-muted">Order total: ${Number(order.grandTotal || 0).toFixed(2)}</p>
              </div>
            </div>

            <p className="text-xs text-foreground-secondary bg-brand-soft p-3 rounded-xl border border-purple-100">
              If accepted by vendor, the requested amount will be refunded directly to your card via Stripe. The remaining balance (minus 15% platform fee) will be paid to the vendor.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Refund Amount ($ USD) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max={Number(order.grandTotal || 0) - 1}
                    step="0.01"
                    value={partialRefundAmount}
                    onChange={(e) => setPartialRefundAmount(e.target.value)}
                    placeholder={`e.g. ${(Number(order.grandTotal || 0) * 0.3).toFixed(2)}`}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Reason for partial refund *</label>
                <select
                  value={partialRefundReason}
                  onChange={(e) => setPartialRefundReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border text-xs bg-surface"
                >
                  <option value="Service scope reduced or partially deficient">Service scope reduced or partially deficient</option>
                  <option value="Deliverables partially delivered">Deliverables partially delivered</option>
                  <option value="Quality discrepancy on secondary item">Quality discrepancy on secondary item</option>
                  <option value="Mutual compromise with vendor">Mutual compromise with vendor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Explanation Notes</label>
                <textarea
                  value={partialRefundNotes}
                  onChange={(e) => setPartialRefundNotes(e.target.value)}
                  placeholder="Detail the partial delivery or shortfall..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Proof URL / Document Link (Optional)</label>
                <input
                  type="url"
                  value={partialRefundProof}
                  onChange={(e) => setPartialRefundProof(e.target.value)}
                  placeholder="https://example.com/partial-work-proof.jpg"
                  className="w-full p-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPartialRefundModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmPartialRefund}
                disabled={isRequestingPartialRefund}
                className="flex-1 py-2.5 bg-brand text-on-brand hover:bg-purple-700 text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isRequestingPartialRefund ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate to Admin Modal */}
      {escalateModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger-soft text-danger flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Escalate Case to Admin</h3>
                <p className="text-xs text-foreground-muted">Order #{order.orderNumber || order.id}</p>
              </div>
            </div>

            <p className="text-xs text-foreground-secondary">
              Escalating hands the case to Platform Admin for final arbitration. Admin will review chat history, uploaded deliverables, and submitted proof to make a binding judgment.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Escalation Reason *</label>
                <select
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border text-xs bg-surface"
                >
                  <option value="Vendor rejected cancellation request">Vendor rejected cancellation request</option>
                  <option value="Vendor rejected partial refund request">Vendor rejected partial refund request</option>
                  <option value="Unresolved dispute after communication">Unresolved dispute after communication</option>
                  <option value="Violation of platform terms or delivery contract">Violation of platform terms or delivery contract</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Additional Context for Admin</label>
                <textarea
                  value={escalateNotes}
                  onChange={(e) => setEscalateNotes(e.target.value)}
                  placeholder="Provide any summary notes for the admin mediator..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-danger"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEscalateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmEscalation}
                disabled={isEscalating}
                className="flex-1 py-2.5 bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isEscalating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Escalation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Open Dispute</h3>
                <p className="text-xs text-foreground-muted">Halts remaining milestone payments for mediation</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Dispute Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border text-xs"
                >
                  <option value="Work not delivered as described">Work not delivered as described</option>
                  <option value="Unacceptable quality or defects">Unacceptable quality or defects</option>
                  <option value="Vendor did not show up">Vendor did not show up</option>
                  <option value="Overcharge or billing issue">Overcharge or billing issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Explain the situation</label>
                <textarea
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="Provide detailed information for our mediation team..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-border text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitDispute}
                disabled={isDisputing}
                className="flex-1 py-2.5 bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDisputing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}

      {payModalOpen && (
        <StripePaymentModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          orderId={order.id}
          orderNumber={order.orderNumber}
          amount={Number(order.grandTotal || order.amount || 0)}
          onSuccess={() => {
            toast.success("Payment secured in Escrow Vault! Order is now active.");
            setPayModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
