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

  // Modals & form state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingMilestone, setPayingMilestone] = useState<any>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Event rescheduled or cancelled");
  const [cancelNotes, setCancelNotes] = useState("");

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
        <p className="text-xs text-slate-500 font-medium">Loading order #{orderId}...</p>
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
          The requested order contract #{orderId} could not be retrieved or you do not have permission to view it.
        </p>
        <button
          onClick={() => router.push("/user/orders")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all"
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
      await cancelOrderMutation({
        orderId: order.id,
        reason: cancelReason,
        notes: cancelNotes,
      }).unwrap();

      toast.success("Order Cancellation Submitted", {
        description: "Unreleased funds will be refunded according to policy.",
      });
      setCancelModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel order");
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
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Order Contract</span>
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
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("order-chat-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Vendor</span>
          </button>

          {!isCompleted && !isCancelled && (
            <>
              <button
                onClick={() => setDisputeModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
              >
                Dispute
              </button>
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors"
              >
                Cancel Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pending Payment Notice */}
      {order.status === "PENDING_PAYMENT" && (() => {
        const createdAtMs = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
        const hoursRemaining = Math.max(0, Math.ceil((createdAtMs + 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60)));
        return (
          <div className="p-6 rounded-2xl border-2 border-amber-400 bg-amber-500/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-[#0F0C3B] text-base sm:text-lg">
                      Payment Required to Activate Order
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900 animate-pulse">
                      Auto-cancels in {hoursRemaining} hours if unpaid
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    This booking requires payment before vendor work begins. Your funds are held securely in the Ophir Escrow Vault on Stripe Connect until final completion.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayModalOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Now ({totalAmount})</span>
              </button>
            </div>
          </div>
        );
      })()}

      {order.status === "CANCELLED" && (
        <div className="p-5 rounded-2xl border border-rose-300 bg-rose-50 text-rose-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold block text-sm">Order Cancelled</strong>
            <p className="mt-0.5 text-rose-700">
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
            <div className="p-6 rounded-2xl border-2 border-indigo-400 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-[#0F0C3B] text-base sm:text-lg">
                        Deliverables Submitted for Your Approval
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 animate-pulse">
                        Action Required
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Round #{order.revisionCount ? order.revisionCount + 1 : 1} · Submitted by {vendorName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Message */}
              {order.deliveryNotes && (
                <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Artisan's Delivery Message:
                  </span>
                  <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                    {order.deliveryNotes}
                  </p>
                </div>
              )}

              {/* Delivered Files Grid */}
              {Array.isArray(order.deliveryFiles) && order.deliveryFiles.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#0F0C3B] block">
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
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group hover:border-indigo-400 transition-all flex flex-col justify-between"
                        >
                          {isImg ? (
                            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                              <img
                                src={fullUrl}
                                alt={fileName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <a
                                href={fullUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity gap-1.5"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Full Image</span>
                              </a>
                            </div>
                          ) : isVid ? (
                            <div className="aspect-video w-full bg-slate-900 flex items-center justify-center">
                              <Film className="w-8 h-8 text-white/70" />
                            </div>
                          ) : (
                            <div className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <FileArchive className="w-5 h-5" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-800 truncate" title={fileName}>
                                  {fileName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-medium uppercase">File Deliverable</span>
                              </div>
                            </div>
                          )}

                          <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-slate-600 truncate max-w-[140px]" title={fileName}>
                              {fileName}
                            </span>
                            <a
                              href={fullUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
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
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
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
                  className="flex-1 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                  className="px-5 py-3 bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-300 text-rose-700 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                * Accepting completes the order with no additional charges. Escrow begins the 7-day security clearing before payout to artisan.
              </p>
            </div>
          )}

          {/* Revision Requested Banner */}
          {isRevisionRequested && (
            <div className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/70 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-[#0F0C3B] text-base">
                      Revision Requested (Round #{order.revisionCount || 1})
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                      Artisan Working on Changes
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    You have requested revisions for this order. {vendorName} has been notified and is updating the deliverables.
                  </p>
                  {order.revisionReason && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-800">
                      <span className="font-bold text-amber-900 block mb-0.5">Your Feedback / Requirements:</span>
                      <p className="italic">{order.revisionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Completed & 7-Day Clearing Notice */}
          {isCompleted && (
            <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-emerald-950 text-base">
                      Order Fulfillment Completed
                    </h3>
                    {order.clearingEndsAt && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                        7-Day Security Clearing Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
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
                <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                  <span className="text-xs font-bold text-emerald-950 block">Your Final Delivered Files:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {order.deliveryFiles.map((fileUrl: string, idx: number) => {
                      const fullUrl = getFileUrl(fileUrl);
                      const fileName = getFileName(fileUrl);
                      const isImg = isImageUrl(fileUrl);
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-emerald-200 p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {isImg ? (
                              <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            <span className="text-xs font-medium text-slate-700 truncate" title={fileName}>
                              {fileName}
                            </span>
                          </div>
                          <a
                            href={fullUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors shrink-0"
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
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : isCancelled
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border-indigo-100 text-[#0F0C3B]"
            )}
          >
            <ShieldCheck
              className={cn(
                "w-5 h-5 shrink-0 mt-0.5",
                isCompleted ? "text-emerald-600" : isCancelled ? "text-rose-600" : "text-brand-primary"
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
              <p className="text-slate-600 leading-relaxed">
                {isCompleted
                  ? "All work has been approved. Approved transfers follow the 7-day clearing hold before reaching the vendor's Stripe Connect balance."
                  : isCancelled
                  ? "This order was cancelled. Any locked funds have been processed for return."
                  : "Payments are held in escrow. After you approve delivery, funds enter a 7-day clearing hold before automated transfer to vendor."}
              </p>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-[#0F0C3B] text-base">Milestone Payment Schedule</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approve releases individually as the vendor delivers work
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {milestones.length} {milestones.length === 1 ? "Milestone" : "Milestones"}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {milestones.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
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
                        isPendingRelease ? "bg-amber-50/40" : "hover:bg-slate-50/50"
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5",
                            isReleased
                              ? "bg-emerald-100 text-emerald-700"
                              : isPendingRelease || isScheduled
                              ? "bg-amber-100 text-amber-800"
                              : isRefunded
                              ? "bg-slate-100 text-slate-500"
                              : "bg-slate-100 text-slate-400"
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
                            <h4 className="font-bold text-[#0F0C3B] text-sm">
                              {ms.label || ms.title || `Milestone ${idx + 1}`}
                            </h4>
                            <span
                              className={cn(
                                "text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                isReleased
                                  ? "bg-emerald-100 text-emerald-700"
                                  : isPendingRelease || isScheduled
                                  ? "bg-amber-100 text-amber-800"
                                  : isRefunded
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-slate-100 text-slate-500"
                              )}
                            >
                              {isReleased ? "Transferred" : isPendingRelease ? "Delivery submitted" : isScheduled ? "Transfer scheduled" : isFunded ? "Payment collected · Work in progress" : isRefunded ? "Refunded" : ms.status === "LOCKED" ? "Payment required" : ms.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            {ms.percentage ? `${ms.percentage}% of contract` : "Payment instalment"}
                            {ms.notes && ` • Note: ${ms.notes}`}
                          </p>

                          {/* Proof of delivery if attached */}
                          {ms.proofUrl && (
                            <a
                              href={ms.proofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Submitted Deliverable Proof</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:self-center justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="font-extrabold text-[#0F0C3B] text-base block">
                            ${Number(ms.amount || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {isReleased ? "Transferred to vendor Connect balance" : ms.status === "FUNDED" || ms.status === "PENDING_RELEASE" || ms.status === "APPROVED_PENDING_RELEASE" ? "Payment collected" : ms.status === "REFUNDED" ? "Refunded" : "Payment not collected"}
                          </span>
                        </div>

                        {isPendingRelease && !isCancelled && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => setPayingMilestone(ms)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Delivery</span>
                            </button>
                            <button
                              onClick={() => handleOpenDeclineModal(ms)}
                              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#0F0C3B] text-sm uppercase tracking-wider">
              Celebration &amp; Service Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Date</span>
                  <span className="font-bold text-[#0F0C3B]">{eventDateStr}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Event Venue</span>
                  <span className="font-bold text-[#0F0C3B]">
                    {order.deliveryNotes || order.location || "Online / Coordinate via Chat"}
                  </span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Instructions</span>
                <p className="text-slate-700 mt-1 leading-relaxed">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Live Order Chat Panel */}
          <div className="space-y-3 pt-2" id="order-chat-section">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#0F0C3B] text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Live Order Chat</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Socket room: order:{order.id}</span>
            </div>
            <OrderChat order={order} />
          </div>

          {/* Review section if completed */}
          {isCompleted && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-[#0F0C3B] text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
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
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-300"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{rating} of 5 Stars</span>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share feedback on communication, quality, and overall experience..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={isReviewing}
                  className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Assigned Vendor
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-600 text-white font-black text-lg flex items-center justify-center overflow-hidden shrink-0">
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
                <h4 className="font-extrabold text-[#0F0C3B] text-sm truncate">{vendorName}</h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ophir Verified
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href={`/user/messages?userId=${vendorUserId}&orderId=${order.id}&vendorName=${encodeURIComponent(vendorName)}`}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-brand-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Messages</span>
              </Link>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#0F0C3B] text-sm">Order Payment Summary</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(order.platformFee) > 0 && (
                <div className="flex justify-between py-1 text-slate-500">
                  <span>Service Fee</span>
                  <span className="font-semibold text-slate-700">${Number(order.platformFee).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-slate-100 text-sm font-black text-[#0F0C3B]">
                <span>Total Contract Value</span>
                <span>{totalAmount}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-[11px] text-emerald-900 leading-tight">
                <strong className="block font-bold">Milestone payment status</strong>
                <span>Payments are collected by Stripe. Approved transfers have a 7-day hold before transfer to the vendor's connected Stripe balance.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Milestone Modal */}
      {payingMilestone && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Confirm Milestone Release</h3>
                <p className="text-xs text-slate-500">
                  Approve this delivery for {vendorName}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone:</span>
                <span className="font-bold text-[#0F0C3B]">{payingMilestone.label || payingMilestone.title}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-emerald-700 pt-1 border-t border-slate-200">
                <span>Release Amount:</span>
                <span>${Number(payingMilestone.amount || 0).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              By confirming, you acknowledge that the work for this milestone has been delivered satisfactorily. The transfer is scheduled after the 7-day review hold.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayingMilestone(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApproveMilestone(payingMilestone)}
                disabled={isApproving}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Decline &amp; Request Revision</h3>
                <p className="text-xs text-slate-500">
                  {selectedDeclineMilestone ? selectedDeclineMilestone.label || selectedDeclineMilestone.title : `Order #${order.id}`}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Declining will notify {vendorName} that adjustments are required. They can review your feedback and deliver again.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Revision *</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Deliverables do not match contract requirements">Deliverables do not match contract requirements</option>
                  <option value="Missing files, photos, or physical items">Missing files, photos, or physical items</option>
                  <option value="Revisions/changes needed on submitted work">Revisions/changes needed on submitted work</option>
                  <option value="Quality does not meet agreed standard">Quality does not meet agreed standard</option>
                  <option value="Other revision needed">Other revision needed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Specific Revision Instructions * (min 5 characters)
                </label>
                <textarea
                  rows={3}
                  value={declineNotes}
                  onChange={(e) => setDeclineNotes(e.target.value)}
                  placeholder="Explain clearly what the artisan needs to revise or fix..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Keep Delivery
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={isDecliningDelivery || isRequestingRevision}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Cancel Order</h3>
                <p className="text-xs text-slate-500">Order #{order.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Event rescheduled or cancelled">Event rescheduled or cancelled</option>
                  <option value="Vendor unresponsive">Vendor unresponsive</option>
                  <option value="Mutual agreement to cancel">Mutual agreement to cancel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional Notes</label>
                <textarea
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Explain why you wish to cancel this contract..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Open Dispute</h3>
                <p className="text-xs text-slate-500">Halts remaining milestone payments for mediation</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dispute Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Work not delivered as described">Work not delivered as described</option>
                  <option value="Unacceptable quality or defects">Unacceptable quality or defects</option>
                  <option value="Vendor did not show up">Vendor did not show up</option>
                  <option value="Overcharge or billing issue">Overcharge or billing issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Explain the situation</label>
                <textarea
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="Provide detailed information for our mediation team..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitDispute}
                disabled={isDisputing}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
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
