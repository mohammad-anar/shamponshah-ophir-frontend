"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Lock, ShieldCheck, CheckCircle2, ChevronRight, Download, Loader2, UploadCloud, CreditCard } from "lucide-react";
import { toast } from "sonner";
import OrderDetailDrawer from "@/components/user/OrderDetailDrawer";
import StripePaymentModal from "@/components/payment/StripePaymentModal";
import { cn } from "@/lib/utils";
import { useGetClientOrdersQuery } from "@/redux/service/orders/ordersApi";

export default function UserOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [payingOrder, setPayingOrder] = useState<any>(null);
  const { data: apiOrdersData, isLoading, refetch } = useGetClientOrdersQuery();

  const liveOrders = Array.isArray(apiOrdersData) ? apiOrdersData : (apiOrdersData?.data?.orders || apiOrdersData?.orders || apiOrdersData?.data || []);
  const displayOrders = liveOrders;

  const formatDate = (dateVal: any) => {
    if (!dateVal) return "Upcoming";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Upcoming";
    }
  };

  const handleOpenOrder = (ord: any) => {
    // Format into OrderDetailDrawer shape if from API
    const formatted = ord.vendorProfile
      ? {
          id: ord.id,
          vendorName: ord.vendorProfile?.businessName || ord.vendorProfile?.user?.name || ord.vendorProfile?.name || "Verified Vendor",
          vendorUserId: ord.vendorProfile?.userId || ord.vendorProfile?.user?.id || "",
          serviceTitle: ord.gig?.title || ord.notes || "Event Milestone Service",
          totalAmount: `$${Number(ord.grandTotal || ord.subtotal || 0).toFixed(2)}`,
          eventDate: formatDate(ord.eventDate),
          location: ord.event?.location || ord.deliveryNotes || "Event Location",
          status: ord.status,
          deliveryNotes: ord.deliveryNotes,
          currentMilestone: `Active Milestones (${ord.milestones?.length || 0})`,
          milestones: (ord.milestones || []).map((m: any) => ({
            id: m.id,
            name: m.label || m.title || "Milestone Delivery",
            amount: `$${Number(m.amount || 0).toFixed(2)}`,
            status: m.status,
          })),
        }
      : ord;

    setSelectedOrder(formatted);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <OrderDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        order={selectedOrder}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Track active milestones, review vendor deliveries, and approve milestone payments
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-10 flex items-center justify-center text-foreground-muted gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
            <span>Loading orders...</span>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center text-foreground-muted space-y-3">
            <ShoppingBag className="w-10 h-10 text-foreground-secondary mx-auto" />
            <h3 className="font-bold text-foreground text-base">No orders yet</h3>
            <p className="text-xs text-foreground-muted max-w-sm mx-auto">
              You haven't booked any vendor services yet. Browse our verified artisans or save services in your Family Hub to get started.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/services" className="px-4 py-2 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold transition-all shadow-xs">
                Browse Services
              </Link>
              <Link href="/user/family-hub" className="px-4 py-2 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary text-xs font-bold transition-all">
                Family Hub
              </Link>
            </div>
          </div>
        ) : (
          displayOrders.map((ord: any) => {
            const title = ord.serviceTitle || ord.gig?.title || ord.notes || "Event Milestone Service";
            const vendorName = ord.vendorName || ord.vendorProfile?.businessName || ord.vendorProfile?.user?.name || ord.vendorProfile?.name || "Verified Vendor";
            const dateStr = formatDate(ord.eventDate);
            const amountStr = ord.totalAmount || `$${Number(ord.grandTotal || ord.subtotal || 0).toFixed(2)}`;

            const milestones = ord.milestones || [];
            const totalMs = milestones.length;
            const releasedMs = milestones.filter((m: any) => m.status === "RELEASED" || m.status === "PAID").length;
            const pendingReleaseMs = milestones.filter((m: any) => m.status === "PENDING_RELEASE").length;
            const fundedMs = milestones.filter((m: any) => ["FUNDED", "PENDING_RELEASE", "APPROVED_PENDING_RELEASE", "RELEASED", "PAID"].includes(m.status)).length;
            const scheduledMs = milestones.filter((m: any) => m.status === "APPROVED_PENDING_RELEASE").length;

            let milestoneStatusText = "Pending Payment";
            let milestoneBadgeClass = "bg-surface-sunken text-foreground-secondary";

            if (ord.status === "PENDING_PAYMENT") {
              const createdAtMs = ord.createdAt ? new Date(ord.createdAt).getTime() : Date.now();
              const hoursLeft = Math.max(0, Math.ceil((createdAtMs + 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60)));
              milestoneStatusText = `Unpaid · Auto-cancels in ${hoursLeft}h`;
              milestoneBadgeClass = "bg-warning-soft text-warning border border-warning/30 font-semibold";
            } else if (ord.status === "CANCELLED") {
              milestoneStatusText = "Cancelled / Expired (24h)";
              milestoneBadgeClass = "bg-danger-soft text-danger border border-danger/30";
            } else if (ord.status === "COMPLETED" && scheduledMs > 0) {
              milestoneStatusText = `Approved · ${scheduledMs} Transfer${scheduledMs === 1 ? "" : "s"} in 7-day hold`;
              milestoneBadgeClass = "bg-info-soft text-blue-800 border border-info/30";
            } else if (ord.status === "COMPLETED" || (totalMs > 0 && releasedMs === totalMs)) {
              milestoneStatusText = "All Milestones Transferred";
              milestoneBadgeClass = "bg-success-soft text-success border border-success/30/60";
            } else if (pendingReleaseMs > 0) {
              milestoneStatusText = `Delivery Submitted (${pendingReleaseMs} Approval Needed)`;
              milestoneBadgeClass = "bg-warning-soft text-warning border border-warning/30/60 animate-pulse";
            } else if (fundedMs > 0) {
              milestoneStatusText = `${fundedMs} of ${totalMs} Milestones Funded`;
              milestoneBadgeClass = "bg-info-soft text-blue-800 border border-info/30/60";
            } else if (totalMs === 1) {
              milestoneStatusText = "1 Milestone • Payment Locked";
              milestoneBadgeClass = "bg-info-soft text-info border border-info/30";
            } else if (totalMs > 1) {
              milestoneStatusText = `0/${totalMs} Milestones Paid`;
              milestoneBadgeClass = "bg-surface-sunken text-foreground-secondary border border-border";
            } else if (ord.status === "CONFIRMED" || ord.status === "IN_PROGRESS" || ord.status === "ACTIVE") {
              milestoneStatusText = "In Progress • Payment Secured";
              milestoneBadgeClass = "bg-success-soft text-success border border-success/30/60";
            }

            const milestoneSubtitle = totalMs === 1
              ? "Single Milestone Payment"
              : totalMs > 1
              ? `${totalMs} Milestone Payments • ${releasedMs} Released`
              : "Milestone Payment";

            return (
              <div
                key={ord.id}
                onClick={() => handleOpenOrder(ord)}
                className="bg-surface p-5 rounded-2xl border border-border shadow-xs hover:border-info/30 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-info-soft text-brand-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-info-soft text-info">
                        #{ord.id}
                      </span>
                    </div>
                    <p className="text-foreground-muted mt-0.5">{vendorName} • {dateStr}</p>
                    <span className="text-[11px] font-semibold text-brand-primary mt-1 block">
                      {ord.currentMilestone || milestoneSubtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center flex-wrap">
                  <div className="text-right">
                    <span className="font-extrabold text-foreground text-base block">{amountStr}</span>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block mt-0.5", milestoneBadgeClass)}>
                      {milestoneStatusText}
                    </span>
                  </div>

                  {ord.status === "PENDING_PAYMENT" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPayingOrder(ord);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now</span>
                    </button>
                  )}

                  {pendingReleaseMs > 0 && (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenOrder(ord)}
                        className="px-3 py-1.5 rounded-xl bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-foreground font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Review &amp; Action</span>
                      </button>
                    </div>
                  )}

                  <ChevronRight className="w-4 h-4 text-foreground-muted" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {payingOrder && (
        <StripePaymentModal
          isOpen={!!payingOrder}
          onClose={() => setPayingOrder(null)}
          orderId={payingOrder.id}
          orderNumber={payingOrder.orderNumber}
          amount={Number(payingOrder.grandTotal || payingOrder.totalAmount?.replace(/[^0-9.]/g, "") || payingOrder.subtotal || 0)}
          onSuccess={() => {
            toast.success("Payment secured in escrow vault! Order is now active.");
            setPayingOrder(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
