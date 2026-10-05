"use client";

import { useState } from "react";
import { Coins, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const creditPacks = [
  { credits: 10, price: "$15.00", popular: false, costPer: "$1.50 / credit" },
  { credits: 25, price: "$30.00", popular: true, costPer: "$1.20 / credit", discount: "Save 20%" },
  { credits: 60, price: "$60.00", popular: false, costPer: "$1.00 / credit", discount: "Best Value (Save 33%)" },
];

export default function VendorBidCreditsPage() {
  const [balance, setBalance] = useState(16);

  const handlePurchase = (credits: number) => {
    setBalance(balance + credits);
    toast.success(`Purchased ${credits} Bid Credits! New balance: ${balance + credits} credits.`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">Bid Credits &amp; Allowances</h1>
          <p className="text-xs text-slate-500 mt-1">
            Credits allow you to submit targeted proposals to active client celebration RFPs
          </p>
        </div>
      </div>

      {/* Balance Ring Banner */}
      <div className="bg-[#18124E] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 border-t-white flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-2xl font-extrabold text-white">{balance}</span>
            <span className="text-[9px] font-bold text-amber-300">CREDITS</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300">Monthly Allowance Status</span>
            <h3 className="text-lg font-bold text-white mt-0.5">25 Monthly Credits Renew in 9 Days</h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Pro Vendors receive 50 complimentary credits per monthly cycle.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-indigo-200 block">Avg proposal cost: <strong>2 Credits</strong></span>
          <span className="text-[11px] text-emerald-300">Enough for ~8 more proposals</span>
        </div>
      </div>

      {/* Top-up Packs */}
      <div className="space-y-4">
        <h3 className="font-bold text-[#0F0C3B] text-base">Top-Up Credit Packages</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {creditPacks.map((pack) => (
            <div
              key={pack.credits}
              className={cn(
                "bg-white p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative shadow-xs transition-all",
                pack.popular ? "border-amber-400 ring-2 ring-amber-100 shadow-md" : "border-slate-200"
              )}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500 text-[#0F0C3B]">
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <h4 className="font-extrabold text-[#0F0C3B] text-base">{pack.credits} Bid Credits</h4>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#0F0C3B]">{pack.price}</span>
                  <span className="text-slate-400 text-[11px]">{pack.costPer}</span>
                </div>
                {pack.discount && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {pack.discount}
                  </span>
                )}
              </div>

              <button
                onClick={() => handlePurchase(pack.credits)}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5",
                  pack.popular
                    ? "bg-[#0F0C3B] hover:bg-[#18124E] text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-[#0F0C3B]"
                )}
              >
                <span>Purchase Pack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
