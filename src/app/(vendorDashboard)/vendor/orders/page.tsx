"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Lock, 
  Clock, 
  CheckCircle2, 
  UploadCloud, 
  MessageSquare, 
  ChevronRight, 
  Loader2, 
  X, 
  FileText, 
  AlertCircle,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetVendorOrdersQuery, 
  useSubmitMilestoneDeliveryMutation,
  useDeliverOrderMutation
} from "@/redux/service/orders/ordersApi";
import { useAppSelector } from "@/redux/hooks/hooks";
import OrderChatModal from "@/components/vendor/OrderChatModal";

export default function VendorOrdersPage() {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const { data: apiOrdersData, isLoading, refetch: refetchOrders } = useGetVendorOrdersQuery();
  const [submitDelivery, { isLoading: isSubmittingMilestone }] = useSubmitMilestoneDeliveryMutation();
  const [deliverOrder, { isLoading: isSubmittingOrder }] = useDeliverOrderMutation();

  const currentUser = useAppSelector((state) => state.auth?.user);

  // Delivery Modal State
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  // Live Socket Chat Modal State
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatOrder, setChatOrder] = useState<any>(null);

  const isSubmitting = isSubmittingMilestone || isSubmittingOrder;

  const liveOrders = apiOrdersData?.data?.orders || apiOrdersData?.orders || (Array.isArray(apiOrdersData) ? apiOrdersData : []);
  const displayOrders = liveOrders;

  const filteredOrders = displayOrders.filter((ord: any) => {
    const milestonesList = ord.milestones || [];
    const isCompleted = ord.status === "COMPLETED";
    const hasPendingApproval = !isCompleted && (milestonesList.some((m: any) => m.status === "PENDING_RELEASE") || (!milestonesList.length && ord.status === "IN_PROGRESS" && Boolean(ord.deliveryNotes)));

    if (filterStatus === "ALL") return true;
    if (filterStatus === "WAITING_APPROVAL") return hasPendingApproval;
    if (filterStatus === "IN_PROGRESS") return !isCompleted && ord.status !== "DISPUTED";
    if (filterStatus === "COMPLETED") return isCompleted;
    if (filterStatus === "DISPUTED") return ord.status === "DISPUTED";
    return true;
  });

  const handleOpenDelivery = (ord: any) => {
    setSelectedOrder(ord);
    const pendingMilestone = ord.milestones?.find((m: any) => m.status === "FUNDED");
    if (ord.milestones?.length && !pendingMilestone) {
      toast.error("A funded milestone is required before you can submit delivery.");
      return;
    }
    setSelectedMilestoneId(pendingMilestone?.id || "full_order");
    setDeliveryNotes(ord.deliveryNotes || "Completed milestone fulfillment according to client specifications.");
    setProofUrl("");
    setDeliveryModalOpen(true);
  };

  const handleOpenChat = (ord: any) => {
    setChatOrder(ord);
    setChatModalOpen(true);
  };

  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      if (selectedOrder.id && !selectedOrder.id.startsWith("OPH-")) {
        if (selectedMilestoneId === "full_order" || !selectedOrder.milestones || selectedOrder.milestones.length === 0) {
          await deliverOrder({
            orderId: selectedOrder.id,
            notes: deliveryNotes,
            proofUrl: proofUrl || undefined,
          }).unwrap();
        } else {
          await submitDelivery({
            orderId: selectedOrder.id,
            milestoneId: selectedMilestoneId,
            notes: deliveryNotes,
            proofUrl: proofUrl || undefined,
          }).unwrap();
        }
      }
      toast.success(`Delivery submitted for Order #${selectedOrder.orderNumber || selectedOrder.id.slice(-6).toUpperCase()}. Client has been asked to review it.`);
      setDeliveryModalOpen(false);
      refetchOrders();
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to submit delivery: ${err?.message || 'Check connection'}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fulfillment &amp; Client Orders</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Submit work for funded milestones. Client approval starts the 7-day transfer hold.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-border self-start text-xs font-bold flex-wrap">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "IN_PROGRESS", label: "In Progress" },
            { id: "WAITING_APPROVAL", label: "Waiting Approval" },
            { id: "COMPLETED", label: "Delivered" },
            { id: "DISPUTED", label: "Disputed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                filterStatus === tab.id 
                  ? "bg-brand text-foreground" 
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-elevated"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 text-xs">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-foreground-muted gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
            <span>Loading active orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center text-foreground-muted">
            <ShoppingBag className="w-8 h-8 text-foreground-secondary mx-auto mb-2" />
            <p className="font-bold text-foreground">No orders matching status</p>
            <p className="text-xs text-foreground-muted mt-0.5">Change filters or browse open client RFPs</p>
          </div>
        ) : (
          filteredOrders.map((ord: any) => {
            const title = ord.service || ord.gig?.title || ord.notes || "Event Service";
            const clientName = ord.client || ord.clientProfile?.displayName || ord.clientProfile?.user?.name || "Verified Client";
            const dateStr = ord.date || (ord.eventDate ? new Date(ord.eventDate).toLocaleDateString() : "Upcoming");
            const amountStr = ord.totalAmount || `$${Number(ord.subtotal || ord.total || 0).toFixed(2)}`;
            const milestonesList = ord.milestones || [];
            const milestoneText = ord.milestone || `Milestones (${milestonesList.length} total)`;
            const isCompleted = ord.status === "COMPLETED";
            const hasPendingApproval = !isCompleted && (milestonesList.some((m: any) => m.status === "PENDING_RELEASE") || (!milestonesList.length && ord.status === "IN_PROGRESS" && Boolean(ord.deliveryNotes)));

            return (
              <div
                key={ord.id}
                className="bg-surface p-5 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-info-soft text-brand-primary flex items-center justify-center font-bold text-lg flex-shrink-0 mt-0.5">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm">{title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-info-soft text-info font-mono">
                        #{ord.id.slice(-6).toUpperCase()}
                      </span>
                      {isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-soft text-success border border-success/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          Delivered
                        </span>
                      ) : hasPendingApproval ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warning-soft text-warning border border-warning/30 flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3 text-warning" />
                          Waiting for Client Approval
                        </span>
                      ) : ord.status === "DISPUTED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger-soft text-danger border border-danger/30">
                          Disputed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-info-soft text-info border border-info/30">
                          In Progress
                        </span>
                      )}
                    </div>

                    <p className="text-foreground-muted mt-0.5">
                      Client: <strong>{clientName}</strong> • Event Date: {dateStr}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {isCompleted ? (
                        <span className="text-[11px] font-bold text-success flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          Client approved · transfer follows the 7-day hold
                        </span>
                      ) : hasPendingApproval ? (
                        <span className="text-[11px] font-bold text-warning flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-warning" />
                          Waiting for Client Approval {ord.deliveryNotes ? "• Deliverables Submitted" : ""}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-foreground-secondary flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-foreground-muted" />
                          {milestoneText}
                        </span>
                      )}

                      {milestonesList.length > 0 && (
                        <div className="flex items-center gap-1">
                          {milestonesList.map((m: any, idx: number) => {
                            const isRel = m.status === "RELEASED" || m.status === "PAID";
                            const isPend = m.status === "PENDING_RELEASE";
                            return (
                              <span 
                                key={m.id || idx}
                                className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-bold",
                                  isRel ? "bg-success-soft text-success border border-success/30" :
                                  isPend ? "bg-warning-soft text-warning border border-warning/30 font-extrabold" :
                                  "bg-surface-sunken text-foreground-secondary"
                                )}
                              >
                                M{idx + 1}: {isRel ? "DELIVERED" : isPend ? "PENDING APPROVAL" : (m.status || "LOCKED")}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
                  <div className="text-right mr-2">
                    <span className="text-base font-extrabold text-foreground block">{amountStr}</span>
                    <span className="text-[10px] text-foreground-muted font-bold">Stripe Connect payments</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenChat(ord)}
                      className="px-3 py-2 rounded-xl border border-border hover:bg-info-soft hover:text-brand-primary hover:border-info/30 text-foreground-secondary transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs shadow-2xs"
                      title="Live Chat Modal via Socket.IO"
                    >
                      <MessageSquare className="w-4 h-4 text-brand-primary" />
                      <span>Live Chat</span>
                    </button>
                    <Link
                      href={`/vendor/messages?userId=${ord.clientProfile?.userId || ord.clientProfile?.id || ''}&orderId=${ord.id}&name=${encodeURIComponent(clientName)}`}
                      className="p-2 rounded-xl border border-border hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Open in Full Messages Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-1.5">
                      <div className="px-3.5 py-2.5 rounded-xl bg-success-soft border border-success/30 text-success text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Delivered</span>
                      </div>
                      <Link
                        href={`/vendor/orders/${ord.id}`}
                        className="px-3 py-2.5 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary hover:text-foreground text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                        title="View Order Contract"
                      >
                        <FileText className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>Details</span>
                      </Link>
                    </div>
                  ) : hasPendingApproval ? (
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-warning bg-warning-soft border border-warning/30 px-2.5 py-2.5 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-warning animate-spin" />
                        Waiting for Client Approval
                      </span>
                    </div>
                  ) : (!ord.milestones?.length || ord.milestones?.some((m: any) => m.status === "FUNDED")) ? (
                    <button
                      onClick={() => handleOpenDelivery(ord)}
                      className="px-4 py-2.5 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-warning" />
                      <span>Submit Funded Milestone</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Deliver Milestone Modal */}
      {deliveryModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">
                  Order #{selectedOrder.orderNumber || selectedOrder.id?.slice(-6).toUpperCase()}
                </span>
                <h2 className="text-base font-bold text-foreground">
                  {selectedOrder.milestones?.some((m: any) => m.status === "PENDING_RELEASE") || (!selectedOrder.milestones?.length && selectedOrder.status === "IN_PROGRESS" && selectedOrder.deliveryNotes)
                    ? "Deliver Again / Update Deliverables"
                    : "Submit Deliverables to Client"}
                </h2>
              </div>
              <button 
                onClick={() => setDeliveryModalOpen(false)} 
                className="text-foreground-muted hover:text-foreground-secondary p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4 text-xs">
              {/* Select Milestone */}
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Target Milestone to Deliver *</label>
                <select
                  value={selectedMilestoneId}
                  onChange={(e) => setSelectedMilestoneId(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                >
                  {selectedOrder.milestones && selectedOrder.milestones.length > 0 ? (
                    <>
                      {selectedOrder.milestones.map((m: any, idx: number) => (
                        <option key={m.id || idx} value={m.id}>
                          Milestone {idx + 1}: {m.label || m.title || "Deliverable"} (${Number(m.amount || 0).toFixed(2)}) — {m.status || "LOCKED"}
                        </option>
                      ))}
                      <option value="full_order">Complete All Remaining Milestones (Full Delivery)</option>
                    </>
                  ) : (
                    <option value="full_order">Full Order Delivery Release ($ {selectedOrder.totalAmount || selectedOrder.grandTotal || "550.00"})</option>
                  )}
                </select>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Fulfillment Notes &amp; Summary *</label>
                <textarea
                  rows={3}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Provide completion details, summary of work done for client review..."
                  required
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary resize-none leading-relaxed"
                />
              </div>

              {/* Work Proof URL */}
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Work Proof / Deliverable Link (Optional)</label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or cloud share link"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="p-3 bg-info-soft/70 border border-info/30 rounded-xl text-info flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                <p>
                  Submitting this delivery changes milestone status to <strong>PENDING RELEASE</strong> and notifies the client to inspect and release funds.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOpen(false)}
                  className="px-4 py-2 bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand hover:bg-surface-sunken text-foreground rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-warning" />
                  )}
                  <span>
                    {selectedOrder.milestones?.some((m: any) => m.status === "PENDING_RELEASE") || selectedOrder.deliveryNotes
                      ? "Deliver Again"
                      : "Submit Delivery"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Socket.IO Order Chat Modal */}
      {chatModalOpen && chatOrder && (
        <OrderChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          order={chatOrder}
          currentUserId={currentUser?.userId}
        />
      )}
    </div>
  );
}
