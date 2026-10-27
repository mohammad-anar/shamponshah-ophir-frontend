"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ChevronRight,
  UploadCloud,
  Download,
  Film,
  Image as ImageIcon,
  FileArchive,
  Loader2,
  User,
  Store,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import OrderChat from "@/components/chat/OrderChat";
import {
  useGetOrderByIdQuery,
  useAdminResolveOrderDisputeMutation,
} from "@/redux/service/orders/ordersApi";

export default function AdminOrderMediationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const { data: orderData, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const [adminResolveDispute, { isLoading: isResolving }] = useAdminResolveOrderDisputeMutation();

  const [decision, setDecision] = useState<
    "CANCEL_FULL_REFUND" | "PARTIAL_REFUND" | "REJECT_DISPUTE_RELEASE_VENDOR"
  >("CANCEL_FULL_REFUND");
  const [partialRefundAmount, setPartialRefundAmount] = useState<string>("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "chat" | "deliverables" | "dispute">("overview");

  const order = orderData?.data || orderData;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-xs text-foreground-muted font-medium">Loading mediation case for order #{orderId}...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-surface p-12 rounded-3xl border border-border text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 bg-danger-solid text-foreground/15 text-danger rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-xs text-foreground-muted">The requested order #{orderId} could not be loaded.</p>
        <button
          onClick={() => router.push("/admin/disputes")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disputes Docket</span>
        </button>
      </div>
    );
  }

  const grandTotal = Number(order.grandTotal || 0);
  const requestedRefund = Number(order.partialRefundAmount || 0);
  const refundValue = decision === "PARTIAL_REFUND" ? Number(partialRefundAmount || requestedRefund || 0) : 0;
  const remainingPortion = Math.max(0, grandTotal - refundValue);
  const platformFee = +(remainingPortion * 0.15).toFixed(2);
  const vendorNet = +(remainingPortion * 0.85).toFixed(2);

  const getFileUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      toast.error("Please provide formal resolution notes explaining your arbitration decision.");
      return;
    }

    if (decision === "PARTIAL_REFUND") {
      const pAmt = Number(partialRefundAmount || requestedRefund);
      if (pAmt <= 0 || pAmt >= grandTotal) {
        toast.error(`Partial refund must be between $1 and $${(grandTotal - 1).toFixed(2)}`);
        return;
      }
    }

    try {
      await adminResolveDispute({
        orderId: order.id,
        decision,
        partialRefundAmount: decision === "PARTIAL_REFUND" ? Number(partialRefundAmount || requestedRefund) : undefined,
        resolutionNotes: resolutionNotes.trim(),
      }).unwrap();

      toast.success("Arbitration judgment recorded! Escrow, refunds, and ledger have been finalized.");
      setResolutionNotes("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to execute arbitration decision");
    }
  };

  const isResolved = Boolean(order.adminResolution || ["CANCELLED", "COMPLETED", "COMPLETED_WITH_PARTIAL_REFUND"].includes(order.status));

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/disputes")}
            className="w-9 h-9 rounded-xl border border-border bg-surface-elevated hover:bg-surface-sunken flex items-center justify-center text-foreground-secondary transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground-muted font-medium">Order Arbitration Docket</span>
              <span className="text-xs font-bold text-brand bg-surface-sunken px-2.5 py-0.5 rounded-md border border-border-brand/40">
                #{order.orderNumber || order.id}
              </span>
              {order.escalatedToAdmin && (
                <span className="text-xs font-bold text-danger bg-danger-solid text-foreground/15 px-2 py-0.5 rounded-md border border-danger/30 flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> Escalated to Admin
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
              {order.gig?.title || "Contractual Milestone Order"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand" />
            <span>Refresh State</span>
          </button>
          <span className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold border",
            order.status === "DISPUTED" && "bg-danger-solid text-foreground/15 border-danger/30 text-danger",
            order.status === "COMPLETED_WITH_PARTIAL_REFUND" && "bg-brand text-on-brand/15 border-border-brand/30 text-info",
            order.status === "CANCELLED" && "bg-surface-sunken border-border text-foreground-muted",
            order.status === "COMPLETED" && "bg-success-solid text-foreground/15 border-success/30 text-success",
            !["DISPUTED", "COMPLETED_WITH_PARTIAL_REFUND", "CANCELLED", "COMPLETED"].includes(order.status) && "bg-warning-solid text-on-brand/15 border-warning/30 text-warning",
          )}>
            Status: {order.status}
          </span>
        </div>
      </div>

      {/* Existing Resolution Notice if already decided */}
      {order.adminResolution && (
        <div className="p-5 rounded-2xl border-2 border-info/30 bg-surface-elevated text-foreground-secondary flex items-start gap-3.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-info shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-sm text-foreground">Arbitration Decision Finalized</strong>
              <span className="px-2 py-0.5 rounded-md bg-surface-sunken text-brand font-bold text-[10px] border border-border-brand/40">
                {order.adminResolution}
              </span>
            </div>
            <p className="text-foreground-secondary">
              Resolved on {order.adminResolvedAt ? new Date(order.adminResolvedAt).toLocaleString() : "Recently"}.
              {order.refundedAmount && ` Refunded $${Number(order.refundedAmount).toFixed(2)} to client.`}
            </p>
            {order.deliveryNotes && (
              <p className="text-foreground-secondary italic mt-1 bg-surface p-2 rounded-lg border border-border">
                {order.deliveryNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Escalation Context Banner */}
      {order.escalatedToAdmin && (
        <div className="p-5 rounded-2xl border-2 border-danger/30 bg-surface-elevated text-foreground-secondary flex items-start gap-3.5 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-sm text-foreground">
                Case Escalated by {order.escalatedBy || "Party"}
              </strong>
              <span className="text-foreground-muted text-[11px]">
                {order.escalatedAt ? new Date(order.escalatedAt).toLocaleString() : ""}
              </span>
            </div>
            <p className="text-danger">
              <strong>Reason:</strong> {order.escalationReason || "Vendor and client were unable to reach agreement."}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === "overview"
              ? "bg-brand text-on-brand shadow-sm"
              : "text-foreground-muted hover:bg-surface-elevated hover:text-foreground"
          )}
        >
          Case & Evidence Overview
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "chat"
              ? "bg-brand text-on-brand shadow-sm"
              : "text-foreground-muted hover:bg-surface-elevated hover:text-foreground"
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Live Order Chat</span>
        </button>
        <button
          onClick={() => setActiveTab("deliverables")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "deliverables"
              ? "bg-brand text-on-brand shadow-sm"
              : "text-foreground-muted hover:bg-surface-elevated hover:text-foreground"
          )}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Deliverables & Work Files</span>
        </button>
      </div>

      {/* TAB CONTENT: Chat */}
      {activeTab === "chat" && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-extrabold text-foreground text-base">Direct Order Chat Room</h3>
              <p className="text-xs text-foreground-muted">
                Admin is authorized to view complete communications and post binding mediator messages.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-success-solid text-foreground/15 text-success text-xs font-bold border border-success/30">
              Room: order:{order.id}
            </span>
          </div>
          <OrderChat order={order} />
        </div>
      )}

      {/* TAB CONTENT: Deliverables */}
      {activeTab === "deliverables" && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-extrabold text-foreground text-base">Deliverables Audit</h3>
            <span className="text-xs text-foreground-muted">
              Round #{order.revisionCount ? order.revisionCount + 1 : 1}
            </span>
          </div>

          {order.deliveryNotes ? (
            <div className="p-4 bg-surface-elevated rounded-2xl border border-border space-y-2">
              <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider block">
                Vendor's Delivery Submission Statement:
              </span>
              <p className="text-xs text-foreground-secondary leading-relaxed whitespace-pre-line">
                {order.deliveryNotes}
              </p>
            </div>
          ) : (
            <p className="text-xs text-foreground-muted italic">No delivery message submitted yet.</p>
          )}

          {Array.isArray(order.deliveryFiles) && order.deliveryFiles.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-foreground-secondary block">Submitted Files ({order.deliveryFiles.length}):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.deliveryFiles.map((fileUrl: string, idx: number) => {
                  const fullUrl = getFileUrl(fileUrl);
                  const filename = fileUrl.split("/").pop() || `deliverable-${idx + 1}`;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-surface-elevated rounded-xl border border-border flex items-center justify-between gap-3 shadow-sm hover:border-border-brand/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-sunken text-brand flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-foreground-secondary truncate">{filename}</span>
                      </div>
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary hover:text-brand rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 border border-border"
                      >
                        <Download className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-xs text-foreground-muted">
              No digital files uploaded in deliverables.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Overview & Decision Panel */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Case Evidence & Parties */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cancellation Request Section */}
            {order.cancelStatus && (
              <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-danger-solid text-foreground animate-ping" />
                    <h3 className="font-extrabold text-foreground text-base">Cancellation Request Record</h3>
                  </div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    order.cancelStatus === "REQUESTED" && "bg-warning-solid text-on-brand/15 text-warning border-warning/30",
                    order.cancelStatus === "ACCEPTED" && "bg-success-solid text-foreground/15 text-success border-success/30",
                    order.cancelStatus === "REJECTED" && "bg-danger-solid text-foreground/15 text-danger border-danger/30",
                  )}>
                    Status: {order.cancelStatus}
                  </span>
                </div>
                <div className="text-xs space-y-2 text-foreground-secondary">
                  <p><strong className="text-foreground">Reason:</strong> {order.cancelReason || "No formal reason provided"}</p>
                  {order.cancelResponseNote && (
                    <p className="text-foreground-secondary bg-surface-elevated p-3 rounded-xl border border-border">
                      <strong className="text-foreground">Vendor Response:</strong> {order.cancelResponseNote}
                    </p>
                  )}
                  {Array.isArray(order.cancelProof) && order.cancelProof.length > 0 && (
                    <div className="pt-2">
                      <strong className="block mb-1.5 text-foreground-secondary">Proof Evidence:</strong>
                      <div className="flex flex-wrap gap-2">
                        {order.cancelProof.map((proof: string, i: number) => (
                          <a
                            key={i}
                            href={getFileUrl(proof)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-brand rounded-lg text-xs font-medium border border-border"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Evidence #{i + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Partial Refund Request Section */}
            {order.refundStatus && (
              <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand text-on-brand" />
                    <h3 className="font-extrabold text-foreground text-base">Partial Refund Request Record</h3>
                  </div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    order.refundStatus === "REQUESTED" && "bg-warning-solid text-on-brand/15 text-warning border-warning/30",
                    order.refundStatus === "ACCEPTED" && "bg-success-solid text-foreground/15 text-success border-success/30",
                    order.refundStatus === "REJECTED" && "bg-danger-solid text-foreground/15 text-danger border-danger/30",
                  )}>
                    Status: {order.refundStatus}
                  </span>
                </div>
                <div className="text-xs space-y-2 text-foreground-secondary">
                  <p>
                    <strong className="text-foreground">Requested Refund:</strong>{" "}
                    <span className="font-bold text-info text-sm font-mono">
                      ${Number(order.partialRefundAmount || 0).toFixed(2)}
                    </span>{" "}
                    (out of total ${grandTotal.toFixed(2)})
                  </p>
                  <p><strong className="text-foreground">Reason:</strong> {order.refundReason || "Partial non-delivery or deficiency"}</p>
                  {order.refundResponseNote && (
                    <p className="text-foreground-secondary bg-surface-elevated p-3 rounded-xl border border-border">
                      <strong className="text-foreground">Vendor Response:</strong> {order.refundResponseNote}
                    </p>
                  )}
                  {Array.isArray(order.refundProof) && order.refundProof.length > 0 && (
                    <div className="pt-2">
                      <strong className="block mb-1.5 text-foreground-secondary">Proof Evidence:</strong>
                      <div className="flex flex-wrap gap-2">
                        {order.refundProof.map((proof: string, i: number) => (
                          <a
                            key={i}
                            href={getFileUrl(proof)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-info rounded-lg text-xs font-medium border border-border"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Refund Proof #{i + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Parties Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-info-solid text-foreground/15 text-info flex items-center justify-center font-bold text-xs border border-info/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-muted font-bold uppercase">Client Host</span>
                    <h4 className="font-bold text-foreground text-sm">
                      {order.clientProfile?.displayName || "Client"}
                    </h4>
                  </div>
                </div>
                <div className="text-xs text-foreground-muted space-y-1">
                  <p>Email: <span className="text-foreground-secondary">{order.clientProfile?.user?.email || "client@example.com"}</span></p>
                  <p>Phone: <span className="text-foreground-secondary">{order.clientProfile?.phone || "Not specified"}</span></p>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-success-solid text-foreground/15 text-success flex items-center justify-center font-bold text-xs border border-success/30">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-muted font-bold uppercase">Vendor Professional</span>
                    <h4 className="font-bold text-foreground text-sm">
                      {order.vendorProfile?.businessName || "Vendor"}
                    </h4>
                  </div>
                </div>
                <div className="text-xs text-foreground-muted space-y-1">
                  <p>Email: <span className="text-foreground-secondary">{order.vendorProfile?.user?.email || "vendor@example.com"}</span></p>
                  <p className="font-mono text-[11px] text-brand truncate">
                    Stripe: {order.vendorProfile?.stripeAccountId || "Not connected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Milestones Summary */}
            <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <h3 className="font-extrabold text-foreground text-base">Contract Milestones</h3>
              <div className="space-y-2">
                {(order.milestones || []).map((m: any) => (
                  <div
                    key={m.id}
                    className="p-3 bg-surface-elevated rounded-xl border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground">{m.label}</span>
                      <span className="text-foreground-muted text-[11px] ml-2">({m.percentage}%)</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-bold text-brand">${Number(m.amount).toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-sunken text-foreground-secondary text-[10px] font-bold border border-border">
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Admin Arbitration Action Card */}
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-3xl border-2 border-border shadow-md space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-brand" />
                  <h3 className="font-black text-foreground text-base">Admin Judgment Panel</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-brand bg-surface-sunken px-2 py-0.5 rounded-md border border-border-brand/40">
                  Binding Escrow
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground-secondary block">Select Official Ruling:</span>

                {/* Ruling 1: Full Refund */}
                <label
                  onClick={() => setDecision("CANCEL_FULL_REFUND")}
                  className={cn(
                    "p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all",
                    decision === "CANCEL_FULL_REFUND"
                      ? "border-danger/30 bg-danger-solid text-foreground/10"
                      : "border-border bg-surface-elevated hover:border-border-strong"
                  )}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "CANCEL_FULL_REFUND"}
                    onChange={() => setDecision("CANCEL_FULL_REFUND")}
                    className="mt-1 accent-danger"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-danger block">Cancel & Full Refund</strong>
                    <p className="text-foreground-muted text-[11px] mt-0.5">
                      100% (${grandTotal.toFixed(2)}) returned to client via Stripe. Reverses any transfers and closes order as CANCELLED.
                    </p>
                  </div>
                </label>

                {/* Ruling 2: Partial Refund */}
                <label
                  onClick={() => setDecision("PARTIAL_REFUND")}
                  className={cn(
                    "p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all",
                    decision === "PARTIAL_REFUND"
                      ? "border-border-brand/60 bg-brand text-on-brand/10"
                      : "border-border bg-surface-elevated hover:border-border-strong"
                  )}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "PARTIAL_REFUND"}
                    onChange={() => setDecision("PARTIAL_REFUND")}
                    className="mt-1 accent-brand"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-info block">Partial Refund</strong>
                    <p className="text-foreground-muted text-[11px] mt-0.5">
                      Refund specified portion to client. Remaining balance split: 15% platform fee, 85% net to vendor.
                    </p>
                  </div>
                </label>

                {/* Ruling 3: Release to Vendor */}
                <label
                  onClick={() => setDecision("REJECT_DISPUTE_RELEASE_VENDOR")}
                  className={cn(
                    "p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all",
                    decision === "REJECT_DISPUTE_RELEASE_VENDOR"
                      ? "border-success/30 bg-success-solid text-foreground/10"
                      : "border-border bg-surface-elevated hover:border-border-strong"
                  )}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "REJECT_DISPUTE_RELEASE_VENDOR"}
                    onChange={() => setDecision("REJECT_DISPUTE_RELEASE_VENDOR")}
                    className="mt-1 accent-success"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-success block">Reject Dispute & Release to Vendor</strong>
                    <p className="text-foreground-muted text-[11px] mt-0.5">
                      Dispute rejected. Vendor fulfillment validated. Releases net payout (85%) to vendor after 15% platform fee.
                    </p>
                  </div>
                </label>
              </div>

              {/* Partial Refund Input if chosen */}
              {decision === "PARTIAL_REFUND" && (
                <div className="p-4 bg-surface-elevated rounded-2xl border border-border-brand/30 space-y-3">
                  <label className="text-xs font-bold text-brand block">
                    Refund Amount to Client ($ USD):
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      max={grandTotal - 1}
                      step="0.01"
                      value={partialRefundAmount || (requestedRefund ? String(requestedRefund) : "")}
                      onChange={(e) => setPartialRefundAmount(e.target.value)}
                      placeholder={`e.g. ${(grandTotal / 2).toFixed(2)}`}
                      className="w-full pl-9 pr-3 py-2 bg-surface rounded-xl border border-border text-foreground text-xs font-mono font-bold focus:outline-none focus:border-border-brand"
                    />
                  </div>

                  {/* Live Calculation Preview */}
                  <div className="p-3 bg-surface rounded-xl border border-border text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Client Refund:</span>
                      <span className="font-bold font-mono text-info">${refundValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Remaining Base:</span>
                      <span className="font-mono text-foreground-secondary">${remainingPortion.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">15% Platform Fee:</span>
                      <span className="font-mono text-foreground-secondary">${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="font-bold text-foreground-secondary">85% Vendor Net:</span>
                      <span className="font-bold font-mono text-success">${vendorNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground-secondary block">
                  Formal Arbitration Ruling & Explanation <span className="text-danger">*</span>:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="State the findings based on chat, delivered work, and policy reasons..."
                  className="w-full p-3 bg-surface-elevated rounded-xl border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isResolving}
                onClick={handleResolve}
                className="w-full py-3 bg-brand hover:bg-brand-hover disabled:opacity-50 text-on-brand rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isResolving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-on-brand" />
                    <span>Executing Arbitration...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 text-on-brand" />
                    <span>Finalize Arbitration Judgment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
