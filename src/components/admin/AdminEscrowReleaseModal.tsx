"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  DollarSign, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  CreditCard,
  Building,
  Scale,
  Sparkles,
  Lock
} from "lucide-react";
import { toast } from "sonner";

interface AdminEscrowReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    clientName: string;
    clientEmail: string;
    vendorName: string;
    vendorStripeAccountId: string;
    stripePaymentIntentId: string;
    totalAmount: number;
    escrowLockedAmount: number;
    status: string;
  };
  onActionComplete: (actionType: string, details: any) => void;
}

export default function AdminEscrowReleaseModal({
  isOpen,
  onClose,
  order,
  onActionComplete,
}: AdminEscrowReleaseModalProps) {
  const [selectedAction, setSelectedAction] = useState<"release" | "full_refund" | "split_refund">("release");
  const [clientRefundPct, setClientRefundPct] = useState(50);
  const [reasonNote, setReasonNote] = useState("Administrative decision based on mediator evidentiary review.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const vendorPayoutPct = 100 - clientRefundPct;
  const clientRefundDollar = +((order.escrowLockedAmount * clientRefundPct) / 100).toFixed(2);
  const vendorPayoutDollar = +((order.escrowLockedAmount * vendorPayoutPct) / 100).toFixed(2);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (selectedAction === "release") {
        toast.success(`Released $${order.escrowLockedAmount.toLocaleString()} to Vendor Stripe Connect (${order.vendorStripeAccountId})!`);
      } else if (selectedAction === "full_refund") {
        toast.success(`Full refund of $${order.escrowLockedAmount.toLocaleString()} issued back to ${order.clientName}'s card!`);
      } else {
        toast.success(`Split settlement executed: $${clientRefundDollar.toLocaleString()} refunded to client, $${vendorPayoutDollar.toLocaleString()} disbursed to vendor!`);
      }

      onActionComplete(selectedAction, {
        orderId: order.id,
        clientRefundDollar,
        vendorPayoutDollar,
        reasonNote,
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121418] text-foreground rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#26282E] animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#26282E] flex items-center justify-between bg-[#121418]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#DFB76C] uppercase tracking-wider">
                Stripe Escrow Custody Desk
              </span>
              <h3 className="text-sm font-bold text-foreground mt-0.5">
                Manual Release & Refund Console ({order.orderNumber})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#16181F] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Stripe Account Dossier Card */}
          <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Locked Escrow Custody:</span>
              <span className="text-base font-black text-[#DFB76C] font-mono">
                ${order.escrowLockedAmount.toLocaleString()} USD
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1 border-t border-[#26282E]">
              <span>Stripe Payment Intent:</span>
              <span className="font-mono text-foreground-secondary">{order.stripePaymentIntentId || "pi_3N9xKl9928198"}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-foreground-muted">
              <span>Vendor Stripe Connect ID:</span>
              <span className="font-mono text-success">{order.vendorStripeAccountId || "acct_1N9xDJ88219"}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-foreground-muted">
              <span>Parties:</span>
              <span className="text-foreground font-semibold">
                Client: {order.clientName} &bull; Vendor: {order.vendorName}
              </span>
            </div>
          </div>

          <form onSubmit={handleExecute} className="space-y-4">
            {/* Action Select Tabs */}
            <div>
              <label className="block text-foreground-secondary font-bold mb-1.5">Select Settlement Directive</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction("release")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedAction === "release"
                      ? "bg-success-soft text-success border-emerald-500 text-foreground font-bold ring-1 ring-emerald-500"
                      : "bg-[#16181F] border-[#26282E] text-foreground-secondary hover:border-slate-600"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-success mb-1" />
                  <p className="font-bold">100% Release</p>
                  <p className="text-[10px] text-foreground-muted">Payout to Vendor</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction("full_refund")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedAction === "full_refund"
                      ? "bg-danger-soft text-danger border-rose-500 text-foreground font-bold ring-1 ring-rose-500"
                      : "bg-[#16181F] border-[#26282E] text-foreground-secondary hover:border-slate-600"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-danger mb-1" />
                  <p className="font-bold">100% Refund</p>
                  <p className="text-[10px] text-foreground-muted">Return to Client</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction("split_refund")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedAction === "split_refund"
                      ? "bg-[#1A1D24] border-[#DFB76C] text-foreground font-bold ring-1 ring-[#DFB76C]"
                      : "bg-[#16181F] border-[#26282E] text-foreground-secondary hover:border-slate-600"
                  }`}
                >
                  <Scale className="w-4 h-4 text-[#DFB76C] mb-1" />
                  <p className="font-bold">Partial Split</p>
                  <p className="text-[10px] text-foreground-muted">Custom Ratio</p>
                </button>
              </div>
            </div>

            {/* Split Slider Section */}
            {selectedAction === "split_refund" && (
              <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-danger">Client Refund: {clientRefundPct}%</span>
                  <span className="text-success">Vendor Payout: {vendorPayoutPct}%</span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="95"
                  step="5"
                  value={clientRefundPct}
                  onChange={(e) => setClientRefundPct(Number(e.target.value))}
                  className="w-full accent-[#DFB76C] cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#26282E] text-xs">
                  <div className="p-2.5 rounded-xl bg-danger-soft text-danger border border-rose-800/40">
                    <span className="text-[10px] text-rose-300 uppercase font-bold block">Refunded to Client</span>
                    <span className="text-sm font-black text-foreground font-mono">${clientRefundDollar.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-success-soft text-success border border-emerald-800/40">
                    <span className="text-[10px] text-emerald-300 uppercase font-bold block">Transferred to Vendor</span>
                    <span className="text-sm font-black text-foreground font-mono">${vendorPayoutDollar.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reason note */}
            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Administrative Audit Note *</label>
              <textarea
                rows={2}
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                className="w-full bg-[#16181F] border border-[#26282E] rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-[#DFB76C] resize-none"
              />
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-xl bg-[#16181F] border border-[#26282E] flex items-center gap-2 text-[11px] text-foreground-secondary">
              <Lock className="w-4 h-4 text-[#DFB76C] flex-shrink-0" />
              <span>Transfers are processed via Stripe Connect API with real-time webhook audit logs.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#26282E]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                  selectedAction === "release"
                    ? "bg-success-solid text-white hover:bg-success-solid text-white text-foreground"
                    : selectedAction === "full_refund"
                    ? "bg-rose-600 hover:bg-danger-solid text-white text-foreground"
                    : "bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E]"
                }`}
              >
                {isSubmitting ? (
                  <span>Executing Stripe API...</span>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-foreground" />
                    <span>Settlement Completed!</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Execute Directive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
