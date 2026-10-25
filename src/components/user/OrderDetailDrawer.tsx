"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  MessageSquare, 
  FileText,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Check,
  Award,
  Ban,
  RotateCcw,
  UploadCloud
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useApproveMilestoneMutation, 
  useCancelOrderMutation,
  useAcceptDeliveryMutation,
  useDeclineDeliveryMutation 
} from "@/redux/service/orders/ordersApi";

interface MilestoneItem {
  id?: string;
  name: string;
  amount: string;
  amountNum?: number;
  status: "PAID" | "PENDING" | "LOCKED" | "FUNDED" | "PENDING_RELEASE" | "APPROVED_PENDING_RELEASE" | "RELEASED" | "REFUNDED";
  note?: string;
}

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order?: {
    id: string;
    orderNumber?: string;
    vendorName: string;
    vendorUserId?: string;
    vendorProfileId?: string;
    vendorProfile?: {
      id?: string;
      userId?: string;
      [key: string]: any;
    };
    serviceTitle: string;
    totalAmount: string;
    eventDate: string;
    location: string;
    status: string;
    milestones: MilestoneItem[];
    [key: string]: any;
  };
}

export default function OrderDetailDrawer({ isOpen, onClose, order }: OrderDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "milestones">("details");
  const [approveMilestone, { isLoading: isApproving }] = useApproveMilestoneMutation();
  const [cancelOrderMutation, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [acceptDeliveryMutation, { isLoading: isAcceptingDelivery }] = useAcceptDeliveryMutation();
  const [declineDeliveryMutation, { isLoading: isDecliningDelivery }] = useDeclineDeliveryMutation();

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Event rescheduled or cancelled");
  const [cancelNotes, setCancelNotes] = useState("");

  // Decline / Revision modal state
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedDeclineMilestone, setSelectedDeclineMilestone] = useState<MilestoneItem | null>(null);
  const [declineReason, setDeclineReason] = useState("Deliverables do not match contract requirements");
  const [declineNotes, setDeclineNotes] = useState("");

  // Local state to reflect milestone payments immediately
  const [localMilestones, setLocalMilestones] = useState<MilestoneItem[]>([]);
  const [localOrderStatus, setLocalOrderStatus] = useState<string>("");

  useEffect(() => {
    if (order) {
      setLocalMilestones(order.milestones || []);
      setLocalOrderStatus(order.status || "IN_PROGRESS");
    }
  }, [order]);

  if (!isOpen) return null;

  const currentOrder = order || {
    id: "OPH-20455",
    vendorName: "Windy City Sound (Marcus Reed)",
    serviceTitle: "DJ and Emcee for 5th Birthday Party",
    totalAmount: "$850.00",
    eventDate: "Saturday, November 14, 2026 (2:00 PM â€“ 6:00 PM)",
    location: "Lincoln Park Conservatory, Chicago, IL",
    status: "IN_PROGRESS",
    milestones: [
      { id: "m-1", name: "Milestone 1 â€¢ Booking Deposit (50%)", amount: "$425.00", status: "RELEASED" as const },
      { id: "m-2", name: "Milestone 2 â€¢ Post-Event Delivery Approval (50%)", amount: "$425.00", status: "PENDING" as const },
    ],
  };

  const milestonesList = localMilestones.length > 0 ? localMilestones : (currentOrder.milestones || []);
  const allMilestonesCompleted = milestonesList.length > 0 && milestonesList.every(
    (m) => m.status === "RELEASED" || m.status === "PAID"
  );
  const isOrderCompleted = localOrderStatus === "COMPLETED" || allMilestonesCompleted;
  const isOrderCancelled = localOrderStatus === "CANCELLED";
  const hasPendingDelivery =
    !isOrderCompleted &&
    !isOrderCancelled &&
    milestonesList.some((m) => m.status === "PENDING_RELEASE") || (!milestonesList.length && currentOrder.status === "IN_PROGRESS" && Boolean(currentOrder.deliveryNotes));

  // Calculations for cancellation breakdown
  const releasedMilestones = milestonesList.filter((m) => m.status === "RELEASED" || m.status === "PAID");
  const unreleasedMilestones = milestonesList.filter((m) => m.status !== "RELEASED" && m.status !== "PAID" && m.status !== "REFUNDED");

  const handleOpenDeclineModal = (ms?: MilestoneItem | null) => {
    setSelectedDeclineMilestone(ms || null);
    setDeclineReason("Deliverables do not match contract requirements");
    setDeclineNotes("");
    setDeclineModalOpen(true);
  };

  const handleConfirmDecline = async () => {
    if (currentOrder.id && !currentOrder.id.startsWith("mock") && !currentOrder.id.startsWith("OPH-")) {
      try {
        await declineDeliveryMutation({
          orderId: currentOrder.id,
          milestoneId: selectedDeclineMilestone?.id,
          reason: declineReason,
          notes: declineNotes,
        }).unwrap();

        toast.success("Delivery Declined & Revision Requested", {
          description: "Vendor has been notified to review feedback and deliver again.",
        });

        if (selectedDeclineMilestone) {
          setLocalMilestones((prev) =>
            prev.map((m) =>
              m.id === selectedDeclineMilestone.id
                ? { ...m, status: "FUNDED" as const, note: `Revision Requested: ${declineReason}` }
                : m
            )
          );
        } else {
          setLocalMilestones((prev) =>
            prev.map((m) =>
              m.status === "PENDING_RELEASE"
                ? { ...m, status: "FUNDED" as const, note: `Revision Requested: ${declineReason}` }
                : m
            )
          );
        }
        setDeclineModalOpen(false);
        return;
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to submit revision request");
        return;
      }
    }

    if (selectedDeclineMilestone) {
      setLocalMilestones((prev) =>
        prev.map((m) =>
          m.name === selectedDeclineMilestone.name || m.id === selectedDeclineMilestone.id
            ? { ...m, status: "FUNDED" as const, note: `Revision Requested: ${declineReason}` }
            : m
        )
      );
    } else {
      setLocalMilestones((prev) =>
        prev.map((m) =>
          m.status === "PENDING_RELEASE"
            ? { ...m, status: "FUNDED" as const, note: `Revision Requested: ${declineReason}` }
            : m
        )
      );
    }
    setDeclineModalOpen(false);
    toast.success("Delivery Declined & Revision Requested", {
      description: "Vendor has been notified to review feedback and deliver again.",
    });
  };

  const handleAcceptAllDelivery = async () => {
    if (currentOrder.id && !currentOrder.id.startsWith("mock") && !currentOrder.id.startsWith("OPH-")) {
      try {
        await acceptDeliveryMutation({
          orderId: currentOrder.id,
          note: "Client approved full order delivery and released payments",
        }).unwrap();

        setLocalOrderStatus("COMPLETED");
        setLocalMilestones((prev) => prev.map((m) => m.status === "PENDING_RELEASE"
          ? { ...m, status: "APPROVED_PENDING_RELEASE" as const }
          : m));
        toast.success("Delivery Accepted & Order Completed!", {
          description: "Approved milestone funds are scheduled for transfer after a 7-day hold.",
        });
        return;
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to accept delivery");
        return;
      }
    }

    toast.error("This sample order is not connected to Stripe and cannot approve payment.");
  };

  const handleApproveMilestone = async (milestone: MilestoneItem) => {
    if (!milestone.id || !currentOrder.id || currentOrder.id.startsWith("mock") || currentOrder.id.startsWith("OPH-")) {
      toast.error("This sample order is not connected to Stripe and cannot release a payment.");
      return;
    }
    try {
      const result = await approveMilestone({
        orderId: currentOrder.id,
        milestoneId: milestone.id,
        note: "Client approved the submitted milestone delivery.",
      }).unwrap();
      setLocalMilestones((previous) => previous.map((item) =>
        item.id === milestone.id ? { ...item, status: "APPROVED_PENDING_RELEASE" as const, note: `Transfer scheduled for ${new Date(result.releaseAt).toLocaleString()}` } : item,
      ));
      if (result.orderCompleted) setLocalOrderStatus("COMPLETED");
      toast.success("Delivery approved. The Stripe Connect transfer is scheduled in 7 days.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not approve this delivery");
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (currentOrder.id && !currentOrder.id.startsWith("mock") && !currentOrder.id.startsWith("OPH-")) {
      try {
        const res: any = await cancelOrderMutation({
          orderId: currentOrder.id,
          reason: cancelReason,
          notes: cancelNotes,
        }).unwrap();

        setLocalOrderStatus("CANCELLED");
        const failedRefunds = new Set<string>(res?.failedRefundMilestones || []);
        setLocalMilestones((previous) => previous.map((m) =>
          m.status === "RELEASED" || m.status === "PAID" || failedRefunds.has(m.id || "")
            ? m
            : { ...m, status: "REFUNDED" as const }
        ));
        setCancelModalOpen(false);

        if (failedRefunds.size) toast.error(`Order cancelled; ${failedRefunds.size} refund(s) need follow-up.`);
        else toast.success("Order cancelled and eligible milestone payments refunded.");
        return;
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to cancel order");
        return;
      }
    }

    toast.error("This sample order is not connected to Stripe and cannot be cancelled.");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      {/* Decline / Request Revision Modal */}
      {declineModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F0C3B]">Decline &amp; Request Revision</h3>
                  <p className="text-xs text-slate-500">
                    {selectedDeclineMilestone
                      ? selectedDeclineMilestone.name
                      : `Order #${currentOrder.orderNumber || currentOrder.id}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Declining will inform the vendor that work needs adjustments. They will be notified to review your feedback and deliver again.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Reason for Decline / Revision *</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium bg-white"
                >
                  <option value="Deliverables do not match contract requirements">Deliverables do not match contract requirements</option>
                  <option value="Missing files, photos, or physical items">Missing files, photos, or physical items</option>
                  <option value="Revisions/changes needed on submitted work">Revisions/changes needed on submitted work</option>
                  <option value="Quality does not meet agreed standard">Quality does not meet agreed standard</option>
                  <option value="Other revision needed">Other revision needed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Specific Revision Instructions (Recommended)
                </label>
                <textarea
                  rows={3}
                  value={declineNotes}
                  onChange={(e) => setDeclineNotes(e.target.value)}
                  placeholder="Explain clearly what the vendor needs to revise, change, or provide..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Keep Delivery
              </button>

              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={isDecliningDelivery}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDecliningDelivery ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Send Revision Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F0C3B]">Cancel Order</h3>
                  <p className="text-xs text-slate-500">Order #{currentOrder.orderNumber || currentOrder.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Escrow & Milestone Retention Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-[#0F0C3B] block mb-1">Cancellation Settlement Policy:</span>

              <div className="flex items-center justify-between text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60">
                <span className="font-medium">
                  {releasedMilestones.length} Completed Milestone(s):
                </span>
                <span className="font-bold">Retained by Vendor</span>
              </div>

              <div className="flex items-center justify-between text-indigo-900 bg-indigo-50/80 p-2 rounded-lg border border-indigo-200/60">
                <span className="font-medium">
                  {unreleasedMilestones.length} Uncompleted Milestone(s):
                </span>
                  <span className="font-bold">Refunded to original payment method</span>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Completed work already transferred is retained by the vendor. The platform cancels pending transfers and requests refunds for paid milestones that have not been transferred.
              </p>
            </div>

            {/* Reason selector */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Reason for Cancellation *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium bg-white"
                >
                  <option value="Event rescheduled or cancelled">Event rescheduled or cancelled</option>
                  <option value="Mutual agreement with vendor">Mutual agreement with vendor</option>
                  <option value="Vendor unavailable or unresponsive">Vendor unavailable or unresponsive</option>
                  <option value="Change of celebration plans">Change of celebration plans</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Provide context for the vendor and Ophir support..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Keep Order Active
              </button>

              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Drawer Container */}
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 bg-[#F8F9FD] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Order #{currentOrder.orderNumber || currentOrder.id}</span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide",
                isOrderCompleted
                  ? "bg-emerald-100 text-emerald-800"
                  : isOrderCancelled
                  ? "bg-rose-100 text-rose-800"
                  : "bg-indigo-100 text-indigo-800"
              )}>
                {isOrderCompleted ? "Fulfillment Complete" : isOrderCancelled ? "Cancelled" : "Active Order"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0F0C3B] mt-1">{currentOrder.serviceTitle}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Cancelled Banner */}
          {isOrderCancelled && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-950">
              <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs">Order Cancelled</h4>
                <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">
                  This engagement was cancelled. Completed milestones have been retained by the vendor for services rendered, and uncompleted milestones have been refunded to your account.
                </p>
              </div>
            </div>
          )}

          {/* Completed Banner */}
          {isOrderCompleted && !isOrderCancelled && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs">All Milestones Fully Disbursed &amp; Order Complete</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  Congratulations! All deliverables have been approved and total funds disbursed to {currentOrder.vendorName}.
                </p>
              </div>
            </div>
          )}

          {/* Pending Delivery Action Required Banner */}
          {hasPendingDelivery && !isOrderCancelled && !isOrderCompleted && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 shadow-2xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#0F0C3B]">Vendor Submitted Delivery</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-900 animate-pulse">
                      Review Needed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    The vendor has delivered the work for your review. Accept to release payment or decline to request revisions.
                  </p>
                  {currentOrder.deliveryNotes && (
                    <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-amber-200/80 text-[11px] text-slate-700">
                      <span className="font-bold text-[#0F0C3B] block">Delivery Notes:</span>
                      <p className="italic mt-0.5">{currentOrder.deliveryNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleAcceptAllDelivery}
                  disabled={isAcceptingDelivery}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAcceptingDelivery ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Approve Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDeclineModal(null)}
                  disabled={isDecliningDelivery}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Decline / Request Revision</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Value</span>
              <span className="text-base font-extrabold text-[#0F0C3B] mt-0.5 block">{currentOrder.totalAmount}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Vendor</span>
                <span className="text-xs font-bold text-[#0F0C3B] mt-0.5 block truncate">{currentOrder.vendorName}</span>
              </div>
              <Link
                href={`/user/messages?userId=${currentOrder.vendorProfile?.userId || currentOrder.vendorProfileId || currentOrder.vendorUserId || ''}&orderId=${currentOrder.id}&vendorName=${encodeURIComponent(currentOrder.vendorName || '')}`}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Vendor</span>
              </Link>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Protection</span>
              <span className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Stripe Connect payments
              </span>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h4 className="font-bold text-[#0F0C3B] text-xs uppercase tracking-wider">Celebration Details</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-600">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Event Date:</span>
                  <p className="text-slate-600">{currentOrder.eventDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Location:</span>
                  <p className="text-slate-600">{currentOrder.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone payment status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#0F0C3B] text-sm">Milestone schedule</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Payment and transfer status for each milestone.
                </p>
              </div>
              <span className="text-slate-500 font-semibold">{milestonesList.length} Milestones</span>
            </div>

            <div className="space-y-3">
              {milestonesList.map((ms, idx) => {
                const isPaidOrReleased = ms.status === "PAID" || ms.status === "RELEASED";
                const isScheduled = ms.status === "APPROVED_PENDING_RELEASE";
                const isFunded = ms.status === "FUNDED";
                const isRefunded = ms.status === "REFUNDED";

                return (
                  <div
                    key={ms.id || idx}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      isPaidOrReleased
                        ? "bg-emerald-50/40 border-emerald-200/70"
                        : isRefunded
                        ? "bg-slate-50/70 border-slate-200 opacity-75"
                        : "bg-white border-slate-200 hover:border-indigo-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5",
                        isPaidOrReleased
                          ? "bg-emerald-600 text-white"
                          : isRefunded
                          ? "bg-slate-200 text-slate-500"
                          : "bg-slate-100 text-slate-600"
                      )}>
                        {isPaidOrReleased ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : isRefunded ? (
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#0F0C3B] text-xs block">{ms.name}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            isPaidOrReleased
                              ? "bg-emerald-100 text-emerald-800"
                              : isRefunded
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-900"
                          )}>
                            {isPaidOrReleased
                              ? "Transferred to vendor"
                              : isScheduled
                              ? "Transfer scheduled"
                              : isFunded
                              ? "Paid; work can start"
                              : isRefunded
                              ? "Refunded to Client"
                              : ms.status === "PENDING_RELEASE" ? "Delivery submitted" : "Payment required"}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          {isPaidOrReleased
                            ? "Stripe transfer created; bank payout timing depends on Stripe."
                            : isScheduled
                            ? `Transfer scheduled for ${ms.note || "7 days after client approval"}`
                            : isFunded
                            ? "This milestone has been paid and is available for vendor work."
                            : isRefunded
                            ? "The refund was sent to the original payment method."
                            : ms.note || (ms.status === "PENDING_RELEASE" ? "Review the vendor's submitted delivery." : "Payment is required before work on this stage begins.")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Milestone Value</span>
                        <span className={cn("font-extrabold text-sm block", isRefunded ? "line-through text-slate-400" : "text-[#0F0C3B]")}>
                          {ms.amount}
                        </span>
                      </div>

                      {/* Milestone-wise Action Button */}
                      {isPaidOrReleased ? (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid</span>
                        </div>
                      ) : isRefunded ? (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refunded</span>
                        </div>
                      ) : !isOrderCancelled && ms.status === "PENDING_RELEASE" ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            disabled={isApproving}
                            onClick={() => handleApproveMilestone(ms)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isApproving ? "Approving…" : "Approve delivery"}</span>
                          </button>
                          {ms.status === "PENDING_RELEASE" && (
                            <button
                              type="button"
                              onClick={() => handleOpenDeclineModal(ms)}
                              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Decline this milestone and request revision"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Decline</span>
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Agreed Offer Price</span>
              <span className="font-semibold text-[#0F0C3B]">{currentOrder.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Service Fee</span>
              <span className="font-semibold text-[#0F0C3B]">Included</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-[#0F0C3B] text-sm">
              <span>Total Contracted</span>
              <span>{currentOrder.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close
            </button>

            {/* Cancel Order Button */}
            {!isOrderCompleted && !isOrderCancelled && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            )}
          </div>

          {isOrderCompleted ? (
            <div className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Milestones Approved</span>
            </div>
          ) : isOrderCancelled ? (
            <div className="px-4 py-2 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5" />
              <span>Order Cancelled</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Click &ldquo;Approve &amp; Pay&rdquo; on any milestone to release milestone payment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
