"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWithdrawEarningsMutation } from "@/redux/service/payments/paymentsApi";

interface WithdrawFundsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount?: string;
}

export default function WithdrawFundsDrawer({
  isOpen,
  onClose,
  availableAmount = "0.00"
}: WithdrawFundsDrawerProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(availableAmount);
  const [payoutMethod, setPayoutMethod] = useState<"instant" | "standard">("standard");
  const [withdrawEarnings, { isLoading }] = useWithdrawEarningsMutation();
  useEffect(() => setWithdrawAmount(availableAmount), [availableAmount, isOpen]);

  if (!isOpen) return null;

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > Number(availableAmount)) {
      toast.error("Enter an amount within your available Stripe balance.");
      return;
    }
    try {
      await withdrawEarnings({ amount, speed: payoutMethod }).unwrap();
      toast.success("Payout request sent to Stripe Connect.");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Stripe could not create this payout.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-elevated">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-success-soft text-success">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Withdraw Funds</h3>
              <p className="text-[11px] text-foreground-muted">Payout from your connected Stripe balance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground-secondary hover:bg-surface-sunken"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Balance card */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Available to Withdraw</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">${availableAmount}</span>
              <span className="text-xs font-bold text-success bg-success-soft px-2 py-0.5 rounded-full">
                Cleared
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted">Stripe may take additional time to deposit a payout to your bank.</p>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Amount to withdraw ($)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-foreground-muted text-sm">$</span>
              <input
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Destination Bank Account */}
          <div className="space-y-2">
            <label className="block font-bold text-foreground">Destination Account</label>
            <div className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-info-soft text-info flex items-center justify-center font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Stripe connected account</h4>
                  <p className="text-[11px] text-foreground-muted">Manage bank details in Stripe Express</p>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Options */}
          <div className="space-y-2">
            <label className="block font-bold text-foreground">Payout Speed</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod("instant")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  payoutMethod === "instant"
                    ? "bg-info-soft/60 border-brand-primary ring-2 ring-indigo-50"
                    : "bg-surface border-border hover:bg-surface-elevated"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Instant</span>
                </div>
                <p className="text-[10px] text-foreground-muted mt-1">If enabled for your account; fees and timing vary.</p>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod("standard")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  payoutMethod === "standard"
                    ? "bg-info-soft/60 border-brand-primary ring-2 ring-indigo-50"
                    : "bg-surface border-border hover:bg-surface-elevated"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Standard</span>
                </div>
                <p className="text-[10px] text-foreground-muted mt-1">Availability and timing are set by Stripe.</p>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border text-[11px] text-foreground-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
            <span>Stripe will show the payout status and any applicable payout fee.</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-border bg-surface">
          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isLoading ? "Sending to Stripe..." : `Request payout $${withdrawAmount}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
