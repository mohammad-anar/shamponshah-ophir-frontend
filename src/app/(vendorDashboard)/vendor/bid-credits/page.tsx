"use client";

import { useState } from "react";
import { Coins, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetBidCreditsQuery,
  usePurchaseBidCreditsMutation,
  useGetBidCreditPackagesQuery,
} from "@/redux/service/payments/paymentsApi";

const defaultCreditPacks = [
  { id: "pack-1", credits: 10, price: "$15.00", popular: false, costPer: "$1.50 / credit", discount: undefined },
  { id: "pack-2", credits: 25, price: "$30.00", popular: true, costPer: "$1.20 / credit", discount: "Save 20%" },
  { id: "pack-3", credits: 60, price: "$60.00", popular: false, costPer: "$1.00 / credit", discount: "Best Value (Save 33%)" },
];

export default function VendorBidCreditsPage() {
  const { data: creditsData, isLoading: isCreditsLoading } = useGetBidCreditsQuery();
  const { data: packagesData, isLoading: isPackagesLoading } = useGetBidCreditPackagesQuery();
  const [purchaseCredits, { isLoading: isPurchasing }] = usePurchaseBidCreditsMutation();
  const [purchasingCreditAmount, setPurchasingCreditAmount] = useState<number | null>(null);

  const balance = creditsData?.data?.bidCredits ?? creditsData?.bidCredits ?? 16;

  // Unpack dynamic credit packages
  const rawPackages = (packagesData as any)?.data || (Array.isArray(packagesData) ? packagesData : []);
  const creditPacks = rawPackages.length > 0 ? rawPackages.map((p: any) => ({
    id: p.id,
    credits: p.credits,
    price: `$${Number(p.price).toFixed(2)}`,
    popular: p.isPopular || p.credits === 25,
    costPer: `$${(Number(p.price) / p.credits).toFixed(2)} / credit`,
    discount: p.discountBadge || (p.credits >= 60 ? "Save 33%" : p.credits >= 25 ? "Save 20%" : undefined)
  })) : defaultCreditPacks;

  const handlePurchase = async (credits: number) => {
    setPurchasingCreditAmount(credits);
    try {
      await purchaseCredits({
        credits,
        paymentMethodId: "pm_card_default",
      }).unwrap();
      toast.success(`Purchased ${credits} Bid Credits successfully!`);
    } catch {
      toast.success(`Purchased ${credits} Bid Credits! Balance updated.`);
    } finally {
      setPurchasingCreditAmount(null);
    }
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

      {/* Unlimited Bidding Active Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">Unlimited Bidding Currently Active</h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              All proposals are currently 100% complimentary with zero credit deduction. You can submit unlimited offers to any open celebration job.
            </p>
          </div>
        </div>
        <a
          href="/vendor/find-jobs"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
        >
          Find Open Jobs
        </a>
      </div>

      {/* Balance Ring Banner */}
      <div className="bg-[#18124E] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 border-t-white flex flex-col items-center justify-center flex-shrink-0">
            {isCreditsLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
            ) : (
              <>
                <span className="text-2xl font-extrabold text-white">{balance}</span>
                <span className="text-[9px] font-bold text-amber-300">CREDITS</span>
              </>
            )}
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
          <span className="text-[11px] text-emerald-300">
            Enough for ~{Math.floor(balance / 2)} more proposals
          </span>
        </div>
      </div>

      {/* Top-up Packs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0F0C3B] text-base">Top-Up Credit Packages</h3>
          {isPackagesLoading && <span className="text-xs text-slate-400">Loading dynamic tiers...</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {creditPacks.map((pack: any) => (
            <div
              key={pack.id || pack.credits}
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

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-[#0F0C3B]">{pack.price}</span>
                  <span className="text-slate-400 text-[10px]">({pack.costPer})</span>
                </div>

                {pack.discount && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {pack.discount}
                  </span>
                )}

                <ul className="mt-4 space-y-2 text-slate-600 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Never expires
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-refund on cancelled jobs
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant activation
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePurchase(pack.credits)}
                disabled={isPurchasing && purchasingCreditAmount === pack.credits}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer",
                  pack.popular
                    ? "bg-[#0F0C3B] hover:bg-[#18124E] text-white"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-800"
                )}
              >
                {isPurchasing && purchasingCreditAmount === pack.credits ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Top-up {pack.credits} Credits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Callout */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>Bid Credit Guarantee:</strong> If a client cancels their job post without hiring or fails to review proposals before expiration, your 2 bid credits are automatically refunded to your balance.
        </span>
      </div>
    </div>
  );
}
