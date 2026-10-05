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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#18124E] text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-white/20 animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0F0C3B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Stripe Escrow Custody Desk
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Manual Release & Refund Console ({order.orderNumber})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Stripe Account Dossier Card */}
          <div className="p-4 rounded-2xl bg-[#0F0C3B] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Locked Escrow Custody:</span>
              <span className="text-base font-black text-amber-400 font-mono">
                ${order.escrowLockedAmount.toLocaleString()} USD
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span>Stripe Payment Intent:</span>
              <span className="font-mono text-indigo-300">{order.stripePaymentIntentId || "pi_3N9xKl9928198"}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Vendor Stripe Connect ID:</span>
              <span className="font-mono text-emerald-300">{order.vendorStripeAccountId || "acct_1N9xDJ88219"}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Parties:</span>
              <span className="text-white font-semibold">
                Client: {order.clientName} &bull; Vendor: {order.vendorName}
              </span>
            </div>
          </div>

          <form onSubmit={handleExecute} className="space-y-4">
            {/* Action Select Tabs */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Select Settlement Directive</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction("release")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === "release"
                      ? "bg-emerald-600/30 border-emerald-400 text-white font-bold ring-1 ring-emerald-400"
                      : "bg-[#0F0C3B] border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
                  <p className="font-bold">100% Release</p>
                  <p className="text-[10px] text-slate-400">Payout to Vendor</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction("full_refund")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === "full_refund"
                      ? "bg-rose-600/30 border-rose-400 text-white font-bold ring-1 ring-rose-400"
                      : "bg-[#0F0C3B] border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-rose-400 mb-1" />
                  <p className="font-bold">100% Refund</p>
                  <p className="text-[10px] text-slate-400">Return to Client</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction("split_refund")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === "split_refund"
                      ? "bg-indigo-600/30 border-indigo-400 text-white font-bold ring-1 ring-indigo-400"
                      : "bg-[#0F0C3B] border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <Scale className="w-4 h-4 text-indigo-400 mb-1" />
                  <p className="font-bold">Partial Split</p>
                  <p className="text-[10px] text-slate-400">Custom Ratio</p>
                </button>
              </div>
            </div>

            {/* Split Slider Section */}
            {selectedAction === "split_refund" && (
              <div className="p-4 rounded-2xl bg-[#0F0C3B] border border-white/10 space-y-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-rose-300">Client Refund: {clientRefundPct}%</span>
                  <span className="text-emerald-300">Vendor Payout: {vendorPayoutPct}%</span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="95"
                  step="5"
                  value={clientRefundPct}
                  onChange={(e) => setClientRefundPct(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[10px] text-rose-300 uppercase font-bold block">Refunded to Client</span>
                    <span className="text-sm font-black text-white font-mono">${clientRefundDollar.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-300 uppercase font-bold block">Transferred to Vendor</span>
                    <span className="text-sm font-black text-white font-mono">${vendorPayoutDollar.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reason note */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Administrative Audit Note *</label>
              <textarea
                rows={2}
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                className="w-full bg-[#0F0C3B] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-[11px] text-indigo-200">
              <Lock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Transfers are processed via Stripe Connect API with real-time webhook audit logs.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                  selectedAction === "release"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : selectedAction === "full_refund"
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {isSubmitting ? (
                  <span>Executing Stripe API...</span>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
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
