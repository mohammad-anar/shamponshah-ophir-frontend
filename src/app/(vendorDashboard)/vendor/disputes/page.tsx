"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Scale, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Upload, 
  DollarSign, 
  MessageSquare, 
  ChevronRight,
  Send,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetVendorDisputesQuery, 
  useRespondToDisputeMutation, 
  useAcceptDisputeRefundMutation 
} from "@/redux/service/orders/ordersApi";

export default function VendorDisputesPage() {
  const { data: disputesResp, isLoading, refetch } = useGetVendorDisputesQuery();
  const [respondToDispute, { isLoading: isResponding }] = useRespondToDisputeMutation();
  const [acceptRefund, { isLoading: isAccepting }] = useAcceptDisputeRefundMutation();

  const [activeDispute, setActiveDispute] = useState<any | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [refundConfirmOpen, setRefundConfirmOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const rawDisputes = Array.isArray(disputesResp) 
    ? disputesResp 
    : (disputesResp?.data || []);

  const disputes = Array.isArray(rawDisputes) ? rawDisputes : [];

  const openCasesCount = disputes.filter((d: any) => d.status === "OPEN").length;
  const underReviewCount = disputes.filter((d: any) => d.status === "UNDER_REVIEW").length;
  const resolvedCount = disputes.filter((d: any) => 
    d.status === "RESOLVED_CLIENT" || d.status === "RESOLVED_VENDOR" || d.status === "CLOSED"
  ).length;

  const handleOpenResponse = (dispute: any) => {
    setActiveDispute(dispute);
    setResponseText("");
    setEvidenceUrl("");
    setResponseModalOpen(true);
  };

  const handleOpenAcceptRefund = (dispute: any) => {
    setActiveDispute(dispute);
    setRefundConfirmOpen(true);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDispute || !responseText.trim()) {
      toast.error("Please enter your vendor statement or response.");
      return;
    }

    try {
      await respondToDispute({
        disputeId: activeDispute.id,
        responseText: responseText.trim(),
        attachments: evidenceUrl.trim() ? [evidenceUrl.trim()] : [],
      }).unwrap();

      toast.success("Response and evidence submitted to the resolution desk.");
      setResponseModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit response.");
    }
  };

  const handleConfirmRefund = async () => {
    if (!activeDispute) return;

    try {
      await acceptRefund({ disputeId: activeDispute.id }).unwrap();
      toast.success("Dispute accepted. Escrow refund authorized for client.");
      setRefundConfirmOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept dispute.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            Response Required
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-indigo-600" />
            Under Mediation Review
          </span>
        );
      case "RESOLVED_CLIENT":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved (Client Refunded)
          </span>
        );
      case "RESOLVED_VENDOR":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved in Vendor's Favor
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status || "Closed"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F0C3B] tracking-tight">
              Resolution Center &amp; Disputes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Ophir Escrow Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review client dispute filings, submit fulfillment proof &amp; statements, or authorize escrow resolutions.
          </p>
        </div>

        <Link
          href="/vendor/orders"
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Orders</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Escrow Mediation Assurance Banner */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-[#0F0C3B]">How Vendor Dispute Resolution Works:</p>
          <p className="text-slate-600 mt-0.5">
            When a client files a dispute, the disputed milestone funds remain securely held in the Ophir Escrow Vault. 
            You have the opportunity to provide your statement and upload delivery proof. If mutually resolved or confirmed, 
            the mediation desk finalizes the settlement via Stripe Connect.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Action Required</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{openCasesCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting your statement</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Under Mediation</span>
            <div className="text-2xl font-black text-indigo-700 mt-0.5">{underReviewCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Reviewed by Ophir Trust Desk</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Resolved Cases</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{resolvedCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Settled or closed</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F0C3B]">
            All Disputes ({disputes.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#0F0C3B]" />
            <span className="text-xs">Loading resolution cases...</span>
          </div>
        ) : disputes.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F0C3B]">No Disputes on Record</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You maintain a clean dispute record! All client orders and milestone deliveries are proceeding normally.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((d: any) => {
              const isActionable = d.status === "OPEN" || d.status === "UNDER_REVIEW";

              return (
                <div
                  key={d.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {d.disputeNumber || `DISP-${d.id.slice(-6).toUpperCase()}`}
                      </span>
                      <span className="text-xs font-bold text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-700">
                        Order #{d.orderId}
                      </span>
                      <span className="text-xs font-bold text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-500">
                        Client: <strong className="text-slate-800">{d.clientName || "Host Client"}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(d.status)}
                    </div>
                  </div>

                  {/* Service & Escrow Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Service Disputed</span>
                      <strong className="text-[#0F0C3B] text-sm mt-0.5 block">{d.serviceTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Escrow Amount in Custody</span>
                      <strong className="text-indigo-700 text-sm mt-0.5 block">${d.amountInCustody}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Opened Date</span>
                      <span className="text-slate-600 mt-0.5 block">{d.openedDate || "Recent"}</span>
                    </div>
                  </div>

                  {/* Client Reason */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-slate-500 font-bold block">Client Claim / Dispute Reason:</span>
                    <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-rose-950 leading-relaxed font-medium">
                      "{d.reason}"
                    </div>
                  </div>

                  {/* Evidence / Attachments if any */}
                  {d.evidence && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-slate-500 block">Submitted Evidence:</span>
                      <p className="text-slate-700">{typeof d.evidence === "string" ? d.evidence : JSON.stringify(d.evidence)}</p>
                    </div>
                  )}

                  {/* Resolution Notes if Resolved */}
                  {d.resolution && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-emerald-800 block">Resolution Outcome:</span>
                      <p className="text-emerald-900">{d.resolution}</p>
                    </div>
                  )}

                  {/* Messages / Statement History Thread */}
                  {Array.isArray(d.messages) && d.messages.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="font-bold text-slate-500 block">Mediation Messages &amp; Vendor Responses ({d.messages.length}):</span>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {d.messages.map((m: any) => (
                          <div 
                            key={m.id} 
                            className={`p-3 rounded-xl ${
                              m.senderRole === "VENDOR" 
                                ? "bg-indigo-50/80 border border-indigo-100 ml-4" 
                                : "bg-slate-50 border border-slate-200 mr-4"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span className="font-bold uppercase tracking-wider text-[#0F0C3B]">
                                {m.senderRole === "VENDOR" ? "Your Response" : m.senderRole}
                              </span>
                              <span>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{m.content}</p>
                            {Array.isArray(m.attachments) && m.attachments.length > 0 && (
                              <div className="mt-1 flex items-center gap-2">
                                {m.attachments.map((att: string, idx: number) => (
                                  <a
                                    key={idx}
                                    href={att}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 underline text-[11px] flex items-center gap-1"
                                  >
                                    Proof Attachment #{idx + 1} <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons for Vendor */}
                  {isActionable && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 flex-wrap">
                      <button
                        onClick={() => handleOpenAcceptRefund(d)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      >
                        Accept Client Refund
                      </button>

                      <button
                        onClick={() => handleOpenResponse(d)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F0C3B] hover:bg-[#1C1656] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                        <span>Submit Vendor Statement &amp; Proof</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Submit Statement & Evidence */}
      {responseModalOpen && activeDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-[#0F0C3B] text-base">Submit Dispute Statement</h3>
                <p className="text-xs text-slate-500">Order #{activeDispute.orderId} • {activeDispute.serviceTitle}</p>
              </div>
              <button
                onClick={() => setResponseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResponse} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 block">Client's Claim:</span>
                <p className="text-amber-950 font-medium">{activeDispute.reason}</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Your Vendor Response / Evidence Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Detail the services delivered, milestones completed, agreement terms, or any communication with the client..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Evidence Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or photo/contract link"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-slate-400">
                  Provide a link to delivery files, event photos, logs, or signed agreements for mediator review.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResponseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResponding || !responseText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#1C1656] text-white font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isResponding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit Statement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Accept Refund */}
      {refundConfirmOpen && activeDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-[#0F0C3B] text-base">Authorize Escrow Refund?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are agreeing to resolve Dispute <strong>#{activeDispute.disputeNumber || activeDispute.id.slice(-6).toUpperCase()}</strong> by refunding the escrow amount of <strong>${activeDispute.amountInCustody}</strong> back to the client.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block">Note:</span>
              <p>The associated order will be marked as cancelled/resolved and funds will be released to the client via Stripe.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRefundConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                No, Go Back
              </button>
              <button
                type="button"
                disabled={isAccepting}
                onClick={handleConfirmRefund}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isAccepting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Authorize Refund</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
