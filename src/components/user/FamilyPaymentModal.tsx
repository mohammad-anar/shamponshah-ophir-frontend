"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  DollarSign, 
  Sparkles,
  Users2,
  Building,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface FamilyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    vendorName: string;
    totalPrice: number;
    amountPaid: number;
  };
  onPaymentSuccess: (serviceId: string, amount: number, contributorName: string) => void;
}

export default function FamilyPaymentModal({
  isOpen,
  onClose,
  service,
  onPaymentSuccess,
}: FamilyPaymentModalProps) {
  const remainingBalance = Math.max(0, service.totalPrice - service.amountPaid);
  
  const [paymentType, setPaymentType] = useState<"custom" | "full">("custom");
  const [customAmount, setCustomAmount] = useState(
    remainingBalance > 500 ? "300.00" : remainingBalance.toFixed(2)
  );
  const [contributorName, setContributorName] = useState("Emily Carter");
  const [personalMessage, setPersonalMessage] = useState("Happy to chip in for the sound & DJ setup! 🎉");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const payableAmount = paymentType === "full" ? remainingBalance : Number(customAmount) || 0;
  const clientFee = +(payableAmount * 0.05).toFixed(2);
  const totalCharged = +(payableAmount + clientFee).toFixed(2);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payableAmount <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }
    if (payableAmount > remainingBalance) {
      toast.error(`Payment cannot exceed the remaining balance of $${remainingBalance.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success(`Stripe Escrow payment of $${payableAmount.toLocaleString()} processed successfully!`);
      onPaymentSuccess(service.id, payableAmount, contributorName);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8F9FD]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Stripe Protected Escrow
              </span>
              <h3 className="text-sm font-bold text-[#0F0C3B] mt-0.5">Family Co-Payment / Contribution</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Service & Funding Meter */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200/80 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#0F0C3B]">{service.title}</h4>
                <p className="text-[11px] text-slate-500">By {service.vendorName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">Remaining Due</span>
                <span className="text-sm font-black text-rose-600 font-mono">
                  ${remainingBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Funded so far: ${service.amountPaid.toLocaleString()}</span>
                <span>Total: ${service.totalPrice.toLocaleString()}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (service.amountPaid / service.totalPrice) * 100)}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-4">
            {/* Choose Payment Option */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType("custom")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentType === "custom"
                    ? "bg-[#EDE9FE] border-brand-primary ring-1 ring-brand-primary font-bold text-[#0F0C3B]"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-[10px] text-slate-500 block uppercase">Option 1</span>
                <span>Custom Split Amount</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("full")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentType === "full"
                    ? "bg-[#EDE9FE] border-brand-primary ring-1 ring-brand-primary font-bold text-[#0F0C3B]"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-[10px] text-slate-500 block uppercase">Option 2</span>
                <span>Pay Full Remaining (${remainingBalance.toLocaleString()})</span>
              </button>
            </div>

            {/* Custom Amount Input */}
            {paymentType === "custom" && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  How much would you like to contribute? ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    max={remainingBalance}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-black text-[#0F0C3B] focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[100, 250, 500].filter(a => a <= remainingBalance).map(preset => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setCustomAmount(preset.toFixed(2))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                    >
                      +${preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contributor details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name (For receipt)</label>
                <input
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cheer Message (Optional)</label>
                <input
                  type="text"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Stripe Card Fields */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-primary" /> Stripe Card Payment
                </span>
                <span className="text-[10px] text-slate-400 font-mono">256-bit SSL</span>
              </div>

              <div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono text-center font-bold"
                />
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVC"
                  className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono text-center font-bold"
                />
              </div>
            </div>

            {/* Fee summary */}
            <div className="p-3 bg-[#EDE9FE]/60 rounded-xl border border-indigo-100 space-y-1 text-slate-700 text-[11px]">
              <div className="flex justify-between">
                <span>Contribution toward vendor:</span>
                <span className="font-bold text-[#0F0C3B]">${payableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Client platform service fee (5%):</span>
                <span className="font-bold text-[#0F0C3B]">${clientFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-indigo-200 font-bold text-xs text-[#0F0C3B]">
                <span>Total charged to card:</span>
                <span className="font-mono text-brand-primary font-black">${totalCharged.toFixed(2)}</span>
              </div>
            </div>

            {/* Process Button */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || isSuccess}
                className="px-6 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <span>Contacting Stripe Escrow...</span>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Payment Escrowed!</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pay ${totalCharged.toFixed(2)} with Stripe</span>
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
