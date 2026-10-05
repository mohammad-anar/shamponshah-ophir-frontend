"use client";

import { useState } from "react";
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  Building2, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WithdrawFundsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount?: string;
}

export default function WithdrawFundsDrawer({
  isOpen,
  onClose,
  availableAmount = "540.00"
}: WithdrawFundsDrawerProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(availableAmount);
  const [payoutMethod, setPayoutMethod] = useState<"instant" | "standard">("instant");

  if (!isOpen) return null;

  const handleWithdraw = () => {
    toast.success(`Withdrawal of $${withdrawAmount} initiated to Chase Bank (•••• 4812)!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#F8F9FD]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F0C3B] text-base">Withdraw Funds</h3>
              <p className="text-[11px] text-slate-500">Stripe Connect Instant Settlement</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Balance card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Available to Withdraw</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">${availableAmount}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Cleared
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Pending clearance: $360.00 (Clears Sep 28) • Escrow: $1,150.00
            </p>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F0C3B]">Amount to withdraw ($)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">$</span>
              <input
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Destination Bank Account */}
          <div className="space-y-2">
            <label className="block font-bold text-[#0F0C3B]">Destination Account</label>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F0C3B]">Chase Checking</h4>
                  <p className="text-[11px] text-slate-400">•••• 4812 • Verified</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Default
              </span>
            </div>
          </div>

          {/* Speed Options */}
          <div className="space-y-2">
            <label className="block font-bold text-[#0F0C3B]">Payout Speed</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod("instant")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  payoutMethod === "instant"
                    ? "bg-indigo-50/60 border-brand-primary ring-2 ring-indigo-50"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F0C3B]">Instant (1-30 min)</span>
                  <span className="text-[10px] font-bold text-indigo-600">Free</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Direct debit card transfer</p>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod("standard")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  payoutMethod === "standard"
                    ? "bg-indigo-50/60 border-brand-primary ring-2 ring-indigo-50"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F0C3B]">Standard (1-2 days)</span>
                  <span className="text-[10px] font-bold text-slate-400">Free</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Standard ACH bank transfer</p>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Encrypted bank rails via Stripe Treasury • 0% vendor transaction fee</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-slate-200 bg-white">
          <button
            onClick={handleWithdraw}
            className="w-full py-3 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Transfer ${withdrawAmount} Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
