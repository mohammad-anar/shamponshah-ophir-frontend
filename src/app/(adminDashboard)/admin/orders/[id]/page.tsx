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
        <Loader2 className="w-8 h-8 text-[#DFB76C] animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading mediation case for order #{orderId}...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-[#121418] p-12 rounded-3xl border border-[#26282E] text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 bg-rose-500/15 text-rose-400 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-slate-400">The requested order #{orderId} could not be loaded.</p>
        <button
          onClick={() => router.push("/admin/disputes")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] rounded-xl text-xs font-bold transition-all cursor-pointer"
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
            className="w-9 h-9 rounded-xl border border-[#26282E] bg-[#16181F] hover:bg-[#1A1D24] flex items-center justify-center text-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Order Arbitration Docket</span>
              <span className="text-xs font-bold text-[#DFB76C] bg-[#1A1D24] px-2.5 py-0.5 rounded-md border border-[#DFB76C]/30">
                #{order.orderNumber || order.id}
              </span>
              {order.escalatedToAdmin && (
                <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> Escalated to Admin
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {order.gig?.title || "Contractual Milestone Order"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 rounded-xl border border-[#26282E] bg-[#16181F] hover:bg-[#1A1D24] text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>Refresh State</span>
          </button>
          <span className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold border",
            order.status === "DISPUTED" && "bg-rose-500/15 border-rose-500/30 text-rose-400",
            order.status === "COMPLETED_WITH_PARTIAL_REFUND" && "bg-purple-500/15 border-purple-500/30 text-purple-400",
            order.status === "CANCELLED" && "bg-[#1A1D24] border-[#26282E] text-slate-400",
            order.status === "COMPLETED" && "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
            !["DISPUTED", "COMPLETED_WITH_PARTIAL_REFUND", "CANCELLED", "COMPLETED"].includes(order.status) && "bg-amber-500/15 border-amber-500/30 text-amber-400",
          )}>
            Status: {order.status}
          </span>
        </div>
      </div>

      {/* Existing Resolution Notice if already decided */}
      {order.adminResolution && (
        <div className="p-5 rounded-2xl border-2 border-indigo-500/30 bg-[#16181F] text-slate-200 flex items-start gap-3.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-sm text-white">Arbitration Decision Finalized</strong>
              <span className="px-2 py-0.5 rounded-md bg-[#1A1D24] text-[#DFB76C] font-bold text-[10px] border border-[#DFB76C]/30">
                {order.adminResolution}
              </span>
            </div>
            <p className="text-slate-300">
              Resolved on {order.adminResolvedAt ? new Date(order.adminResolvedAt).toLocaleString() : "Recently"}.
              {order.refundedAmount && ` Refunded $${Number(order.refundedAmount).toFixed(2)} to client.`}
            </p>
            {order.deliveryNotes && (
              <p className="text-slate-300 italic mt-1 bg-[#121418] p-2 rounded-lg border border-[#26282E]">
                {order.deliveryNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Escalation Context Banner */}
      {order.escalatedToAdmin && (
        <div className="p-5 rounded-2xl border-2 border-rose-500/30 bg-[#16181F] text-slate-200 flex items-start gap-3.5 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-sm text-white">
                Case Escalated by {order.escalatedBy || "Party"}
              </strong>
              <span className="text-slate-400 text-[11px]">
                {order.escalatedAt ? new Date(order.escalatedAt).toLocaleString() : ""}
              </span>
            </div>
            <p className="text-rose-300">
              <strong>Reason:</strong> {order.escalationReason || "Vendor and client were unable to reach agreement."}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#26282E] pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === "overview"
              ? "bg-[#DFB76C] text-[#0B0C0E] shadow-sm"
              : "text-slate-400 hover:bg-[#16181F] hover:text-white"
          )}
        >
          Case & Evidence Overview
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "chat"
              ? "bg-[#DFB76C] text-[#0B0C0E] shadow-sm"
              : "text-slate-400 hover:bg-[#16181F] hover:text-white"
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
              ? "bg-[#DFB76C] text-[#0B0C0E] shadow-sm"
              : "text-slate-400 hover:bg-[#16181F] hover:text-white"
          )}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Deliverables & Work Files</span>
        </button>
      </div>

      {/* TAB CONTENT: Chat */}
      {activeTab === "chat" && (
        <div className="bg-[#121418] rounded-3xl border border-[#26282E] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26282E]">
            <div>
              <h3 className="font-extrabold text-white text-base">Direct Order Chat Room</h3>
              <p className="text-xs text-slate-400">
                Admin is authorized to view complete communications and post binding mediator messages.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Room: order:{order.id}
            </span>
          </div>
          <OrderChat order={order} />
        </div>
      )}

      {/* TAB CONTENT: Deliverables */}
      {activeTab === "deliverables" && (
        <div className="bg-[#121418] rounded-3xl border border-[#26282E] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#26282E]">
            <h3 className="font-extrabold text-white text-base">Deliverables Audit</h3>
            <span className="text-xs text-slate-400">
              Round #{order.revisionCount ? order.revisionCount + 1 : 1}
            </span>
          </div>

          {order.deliveryNotes ? (
            <div className="p-4 bg-[#16181F] rounded-2xl border border-[#26282E] space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Vendor's Delivery Submission Statement:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {order.deliveryNotes}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No delivery message submitted yet.</p>
          )}

          {Array.isArray(order.deliveryFiles) && order.deliveryFiles.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Submitted Files ({order.deliveryFiles.length}):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.deliveryFiles.map((fileUrl: string, idx: number) => {
                  const fullUrl = getFileUrl(fileUrl);
                  const filename = fileUrl.split("/").pop() || `deliverable-${idx + 1}`;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-[#16181F] rounded-xl border border-[#26282E] flex items-center justify-between gap-3 shadow-sm hover:border-[#DFB76C]/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#1A1D24] text-[#DFB76C] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-slate-200 truncate">{filename}</span>
                      </div>
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#1A1D24] hover:bg-[#222630] text-slate-300 hover:text-[#DFB76C] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 border border-[#26282E]"
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
            <div className="p-8 text-center border-2 border-dashed border-[#26282E] rounded-2xl text-xs text-slate-500">
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
              <div className="bg-[#121418] p-6 rounded-3xl border border-[#26282E] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#26282E] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <h3 className="font-extrabold text-white text-base">Cancellation Request Record</h3>
                  </div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    order.cancelStatus === "REQUESTED" && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                    order.cancelStatus === "ACCEPTED" && "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                    order.cancelStatus === "REJECTED" && "bg-rose-500/15 text-rose-400 border-rose-500/30",
                  )}>
                    Status: {order.cancelStatus}
                  </span>
                </div>
                <div className="text-xs space-y-2 text-slate-300">
                  <p><strong className="text-white">Reason:</strong> {order.cancelReason || "No formal reason provided"}</p>
                  {order.cancelResponseNote && (
                    <p className="text-slate-300 bg-[#16181F] p-3 rounded-xl border border-[#26282E]">
                      <strong className="text-white">Vendor Response:</strong> {order.cancelResponseNote}
                    </p>
                  )}
                  {Array.isArray(order.cancelProof) && order.cancelProof.length > 0 && (
                    <div className="pt-2">
                      <strong className="block mb-1.5 text-slate-300">Proof Evidence:</strong>
                      <div className="flex flex-wrap gap-2">
                        {order.cancelProof.map((proof: string, i: number) => (
                          <a
                            key={i}
                            href={getFileUrl(proof)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#16181F] hover:bg-[#1A1D24] text-slate-300 hover:text-[#DFB76C] rounded-lg text-xs font-medium border border-[#26282E]"
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
              <div className="bg-[#121418] p-6 rounded-3xl border border-[#26282E] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#26282E] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <h3 className="font-extrabold text-white text-base">Partial Refund Request Record</h3>
                  </div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    order.refundStatus === "REQUESTED" && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                    order.refundStatus === "ACCEPTED" && "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                    order.refundStatus === "REJECTED" && "bg-rose-500/15 text-rose-400 border-rose-500/30",
                  )}>
                    Status: {order.refundStatus}
                  </span>
                </div>
                <div className="text-xs space-y-2 text-slate-300">
                  <p>
                    <strong className="text-white">Requested Refund:</strong>{" "}
                    <span className="font-bold text-purple-400 text-sm font-mono">
                      ${Number(order.partialRefundAmount || 0).toFixed(2)}
                    </span>{" "}
                    (out of total ${grandTotal.toFixed(2)})
                  </p>
                  <p><strong className="text-white">Reason:</strong> {order.refundReason || "Partial non-delivery or deficiency"}</p>
                  {order.refundResponseNote && (
                    <p className="text-slate-300 bg-[#16181F] p-3 rounded-xl border border-[#26282E]">
                      <strong className="text-white">Vendor Response:</strong> {order.refundResponseNote}
                    </p>
                  )}
                  {Array.isArray(order.refundProof) && order.refundProof.length > 0 && (
                    <div className="pt-2">
                      <strong className="block mb-1.5 text-slate-300">Proof Evidence:</strong>
                      <div className="flex flex-wrap gap-2">
                        {order.refundProof.map((proof: string, i: number) => (
                          <a
                            key={i}
                            href={getFileUrl(proof)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#16181F] hover:bg-[#1A1D24] text-slate-300 hover:text-purple-400 rounded-lg text-xs font-medium border border-[#26282E]"
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
              <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#26282E]">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Client Host</span>
                    <h4 className="font-bold text-white text-sm">
                      {order.clientProfile?.displayName || "Client"}
                    </h4>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>Email: <span className="text-slate-300">{order.clientProfile?.user?.email || "client@example.com"}</span></p>
                  <p>Phone: <span className="text-slate-300">{order.clientProfile?.phone || "Not specified"}</span></p>
                </div>
              </div>

              <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#26282E]">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Vendor Professional</span>
                    <h4 className="font-bold text-white text-sm">
                      {order.vendorProfile?.businessName || "Vendor"}
                    </h4>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>Email: <span className="text-slate-300">{order.vendorProfile?.user?.email || "vendor@example.com"}</span></p>
                  <p className="font-mono text-[11px] text-[#DFB76C] truncate">
                    Stripe: {order.vendorProfile?.stripeAccountId || "Not connected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Milestones Summary */}
            <div className="bg-[#121418] p-6 rounded-3xl border border-[#26282E] shadow-sm space-y-3">
              <h3 className="font-extrabold text-white text-base">Contract Milestones</h3>
              <div className="space-y-2">
                {(order.milestones || []).map((m: any) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#16181F] rounded-xl border border-[#26282E] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{m.label}</span>
                      <span className="text-slate-400 text-[11px] ml-2">({m.percentage}%)</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-bold text-[#DFB76C]">${Number(m.amount).toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1A1D24] text-slate-300 text-[10px] font-bold border border-[#26282E]">
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
            <div className="bg-[#121418] p-6 rounded-3xl border-2 border-[#26282E] shadow-md space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#26282E] pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#DFB76C]" />
                  <h3 className="font-black text-white text-base">Admin Judgment Panel</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#DFB76C] bg-[#1A1D24] px-2 py-0.5 rounded-md border border-[#DFB76C]/30">
                  Binding Escrow
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Select Official Ruling:</span>

                {/* Ruling 1: Full Refund */}
                <label
                  onClick={() => setDecision("CANCEL_FULL_REFUND")}
                  className={cn(
                    "p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all",
                    decision === "CANCEL_FULL_REFUND"
                      ? "border-rose-500/60 bg-rose-500/10"
                      : "border-[#26282E] bg-[#16181F] hover:border-slate-600"
                  )}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "CANCEL_FULL_REFUND"}
                    onChange={() => setDecision("CANCEL_FULL_REFUND")}
                    className="mt-1 accent-rose-500"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-rose-400 block">Cancel & Full Refund</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
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
                      ? "border-purple-500/60 bg-purple-500/10"
                      : "border-[#26282E] bg-[#16181F] hover:border-slate-600"
                  )}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "PARTIAL_REFUND"}
                    onChange={() => setDecision("PARTIAL_REFUND")}
                    className="mt-1 accent-purple-500"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-purple-400 block">Partial Refund</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
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
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : "border-[#26282E] bg-[#16181F] hover:border-slate-600"
                  )}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "REJECT_DISPUTE_RELEASE_VENDOR"}
                    onChange={() => setDecision("REJECT_DISPUTE_RELEASE_VENDOR")}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-emerald-400 block">Reject Dispute & Release to Vendor</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Dispute rejected. Vendor fulfillment validated. Releases net payout (85%) to vendor after 15% platform fee.
                    </p>
                  </div>
                </label>
              </div>

              {/* Partial Refund Input if chosen */}
              {decision === "PARTIAL_REFUND" && (
                <div className="p-4 bg-[#16181F] rounded-2xl border border-purple-500/30 space-y-3">
                  <label className="text-xs font-bold text-purple-300 block">
                    Refund Amount to Client ($ USD):
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      max={grandTotal - 1}
                      step="0.01"
                      value={partialRefundAmount || (requestedRefund ? String(requestedRefund) : "")}
                      onChange={(e) => setPartialRefundAmount(e.target.value)}
                      placeholder={`e.g. ${(grandTotal / 2).toFixed(2)}`}
                      className="w-full pl-9 pr-3 py-2 bg-[#121418] rounded-xl border border-[#26282E] text-white text-xs font-mono font-bold focus:outline-none focus:border-[#DFB76C]"
                    />
                  </div>

                  {/* Live Calculation Preview */}
                  <div className="p-3 bg-[#121418] rounded-xl border border-[#26282E] text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Client Refund:</span>
                      <span className="font-bold font-mono text-purple-400">${refundValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Remaining Base:</span>
                      <span className="font-mono text-slate-200">${remainingPortion.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">15% Platform Fee:</span>
                      <span className="font-mono text-slate-300">${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#26282E]">
                      <span className="font-bold text-slate-200">85% Vendor Net:</span>
                      <span className="font-bold font-mono text-emerald-400">${vendorNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Formal Arbitration Ruling & Explanation <span className="text-rose-400">*</span>:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="State the findings based on chat, delivered work, and policy reasons..."
                  className="w-full p-3 bg-[#16181F] rounded-xl border border-[#26282E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C] resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isResolving}
                onClick={handleResolve}
                className="w-full py-3 bg-[#DFB76C] hover:bg-[#ECC870] disabled:opacity-50 text-[#0B0C0E] rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isResolving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B0C0E]" />
                    <span>Executing Arbitration...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 text-[#0B0C0E]" />
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
