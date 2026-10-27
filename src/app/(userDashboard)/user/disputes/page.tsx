"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useGetClientDisputesQuery, useCreateDisputeMutation, useGetClientOrdersQuery } from "@/redux/service/orders/ordersApi";

interface DisputeCase {
  id: string;
  disputeNumber: string;
  orderId: string;
  orderEntityId?: string;
  vendorName: string;
  serviceTitle: string;
  amountInCustody: number;
  reason: string;
  status: string;
  openedDate: string;
  timerHoursLeft: number;
  assignedMediator: string;
}

const mockDisputes: DisputeCase[] = [
  {
    id: "d1",
    disputeNumber: "DISP-4019",
    orderId: "ORD-8799",
    vendorName: "Illumination Pro Lighting",
    serviceTitle: "Full Ballroom Uplighting & Monogram Projection",
    amountInCustody: 650,
    reason: "Vendor failed to provide the custom monogram gobo projector as specified in contract.",
    status: "Under Mediation",
    openedDate: "Oct 01, 2025",
    timerHoursLeft: 28,
    assignedMediator: "Alex Mercer (Ophir Trust Desk)",
  }
];

export default function UserDisputesPage() {
  const { data: apiDisputes } = useGetClientDisputesQuery();
  const { data: clientOrdersData } = useGetClientOrdersQuery();
  const [createDisputeMutation, { isLoading: isCreatingDispute }] = useCreateDisputeMutation();

  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  
  // New Dispute Form
  const [orderId, setOrderId] = useState("");
  const [reasonCategory, setReasonCategory] = useState("Service Not Rendered as Agreed");
  const [explanation, setExplanation] = useState("");

  const orderList = Array.isArray(clientOrdersData) ? clientOrdersData : (clientOrdersData?.data?.orders || clientOrdersData?.orders || clientOrdersData?.data || []);

  useEffect(() => {
    const list = Array.isArray(apiDisputes) ? apiDisputes : (apiDisputes?.data || []);
    setDisputes(Array.isArray(list) ? list.map((d: any) => ({
      id: d.id, disputeNumber: d.id, orderId: d.order?.orderNumber || d.orderId, orderEntityId: d.orderId,
      vendorName: d.vendorProfile?.businessName || "Vendor",
      serviceTitle: d.order?.gig?.title || "Marketplace order",
      amountInCustody: Number(d.order?.grandTotal || 0), reason: d.reason,
      status: d.status, openedDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "",
      timerHoursLeft: 0, assignedMediator: "",
    })) : []);
  }, [apiDisputes]);

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !explanation.trim()) return;

    try {
      await createDisputeMutation({
        orderId: orderId,
        reason: `${reasonCategory}: ${explanation}`,
        description: explanation,
      }).unwrap();
      toast.success("Dispute submitted.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not submit dispute.");
      return;
    }
    setShowNewModal(false);
    setExplanation("");
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Resolution Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Escrow Protection
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Fair and transparent milestone dispute mediation. Funds remain frozen in Ophir Escrow until resolved.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-foreground rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <Scale className="w-4 h-4" /> Open New Resolution Case
        </button>
      </div>

      {/* Escrow Shield Assurance Banner */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-foreground-secondary leading-relaxed">
          <p className="font-bold text-[#0F0C3B]">How Ophir Escrow Dispute Mediation Works:</p>
            <p className="text-foreground-secondary mt-0.5">
            Opening a dispute pauses scheduled milestone transfers while the case is reviewed. Refunds and transfers follow the marketplace dispute resolution process.
          </p>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#0F0C3B]">Active & Past Resolution Cases ({disputes.length})</h2>

        {disputes.map((d) => (
          <div
            key={d.id}
            className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-black text-brand-primary">{d.disputeNumber}</span>
                <span className="text-xs font-bold text-foreground-muted">&bull;</span>
                <span className="text-xs font-semibold text-foreground-secondary">Order #{d.orderId}</span>
                <span className="text-xs font-bold text-foreground-muted">&bull;</span>
                <span className="text-xs font-medium text-foreground-muted">{d.vendorName}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                d.status === "Under Mediation" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                d.status === "Vendor Response Pending" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                "bg-emerald-50 text-emerald-700"
              }`}>
                {d.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-bold text-[#0F0C3B]">{d.serviceTitle}</h3>
                <p className="text-xs text-foreground-secondary leading-relaxed bg-[#F8F9FD] p-3 rounded-xl border border-border">
                  "{d.reason}"
                </p>
                <div className="flex items-center gap-4 text-xs text-foreground-muted pt-1">
                  <span>Opened on: <strong>{d.openedDate}</strong></span>
                  <span>Mediator: <strong>{d.assignedMediator}</strong></span>
                </div>
              </div>

              <div className="bg-surface-elevated p-4 rounded-xl border border-border/80 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider">Disputed Escrow Sum</span>
                  <p className="text-lg font-black text-rose-600 mt-0.5">
                    ${d.amountInCustody.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{d.timerHoursLeft}h left before ruling</span>
                  </div>
                </div>

                {d.orderEntityId && <Link href={`/user/orders/${d.orderEntityId}`} className="block w-full py-2 bg-surface hover:bg-surface-sunken border border-border text-[#0F0C3B] rounded-lg text-xs font-bold text-center transition-all shadow-xs">View related order</Link>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Dispute Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-[#0F0C3B] flex items-center gap-2">
                <Scale className="w-4 h-4 text-rose-600" /> Open Resolution Case
              </h2>
              <button onClick={() => setShowNewModal(false)} className="text-foreground-muted hover:text-foreground-secondary">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-3 text-xs">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Select Order / Vendor</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none"
                >
                  {orderList && orderList.length > 0 ? (
                    orderList.map((ord: any) => (
                      <option key={ord.id} value={ord.id}>
                        Order #{ord.orderNumber || ord.id.slice(-6)} • {ord.vendorProfile?.businessName || "Vendor"} (${Number(ord.grandTotal || ord.subtotal || 0).toLocaleString()})
                      </option>
                    ))
                  ) : <option value="">No orders available</option>}
                </select>

              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Reason for Mediation</label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none"
                >
                  <option>Service Not Rendered as Agreed</option>
                  <option>Vendor Unresponsive / No-Show</option>
                  <option>Significant Delay / Missing Deliverables</option>
                  <option>Damaged Equipment / Venue Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Detailed Explanation & Summary of Issue</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain clearly what was contracted vs what was delivered..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-surface-sunken hover:bg-slate-200 text-foreground-secondary rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-foreground rounded-xl font-bold"
                >
                  Submit Dispute to Trust Desk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
