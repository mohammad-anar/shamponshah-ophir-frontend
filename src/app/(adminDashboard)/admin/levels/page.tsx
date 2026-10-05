"use client";

import { useState } from "react";
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Edit3, 
  Save, 
  Plus, 
  Sparkles,
  Percent,
  Star,
  X,
  Layers,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LevelTier {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  minCompletedOrders: number;
  minEarnings: number;
  minRating: number;
  maxDisputeRate: number;
  platformFeeDiscount: number; // e.g. 0% -> 35%
  perks: string[];
  activeVendors: number;
}

const initialTiers: LevelTier[] = [
  {
    id: "newbie",
    name: "Newbie Artisan",
    badge: "Newbie",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
    minCompletedOrders: 0,
    minEarnings: 0,
    minRating: 0,
    maxDisputeRate: 5.0,
    platformFeeDiscount: 0,
    perks: [
      "Standard marketplace listing",
      "Standard payout processing (5 business days)",
      "Standard client chat support"
    ],
    activeVendors: 420,
  },
  {
    id: "rising",
    name: "Rising Vendor",
    badge: "Rising Star",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    minCompletedOrders: 10,
    minEarnings: 2500,
    minRating: 4.6,
    maxDisputeRate: 2.5,
    platformFeeDiscount: 10,
    perks: [
      "Rising Star profile badge",
      "Priority in local search ranking (1.2x boost)",
      "48-hour escrow expedited releases",
      "Monthly free bid credits pack (15 credits)"
    ],
    activeVendors: 184,
  },
  {
    id: "top-rated",
    name: "Top Rated Professional",
    badge: "Top Rated ★",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    minCompletedOrders: 40,
    minEarnings: 10000,
    minRating: 4.85,
    maxDisputeRate: 1.0,
    platformFeeDiscount: 20,
    perks: [
      "Gold Top Rated crown badge",
      "Search ranking top-shelf multiplier (2.0x)",
      "Instant ACH next-day payouts",
      "Dedicated account concierge",
      "50 Monthly bid credits"
    ],
    activeVendors: 62,
  },
  {
    id: "elite-partner",
    name: "Elite Enterprise Partner",
    badge: "Elite Master 👑",
    badgeBg: "bg-amber-50 text-amber-900 border-amber-300",
    minCompletedOrders: 100,
    minEarnings: 35000,
    minRating: 4.95,
    maxDisputeRate: 0.5,
    platformFeeDiscount: 35,
    perks: [
      "Direct VIP enterprise leads matching",
      "Featured on homepage showcase",
      "Same-day zero-fee payouts",
      "Unlimited free bidding",
      "Direct WhatsApp VIP support hotline"
    ],
    activeVendors: 19,
  },
];

export default function AdminLevelsPage() {
  const [tiers, setTiers] = useState<LevelTier[]>(initialTiers);
  const [editingTier, setEditingTier] = useState<LevelTier | null>(null);

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    setTiers(tiers.map((t) => (t.id === editingTier.id ? editingTier : t)));
    toast.success(`Level tier "${editingTier.name}" criteria updated successfully.`);
    setEditingTier(null);
  };

  const handleRunRecalculation = () => {
    toast.success("Automated vendor tier evaluation engine triggered. 685 active accounts updated.");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Vendor Level Architecture
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
              Tier Progression System
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Define eligibility criteria, automated monthly tier progressions, commission discounts, and reputation badges
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRunRecalculation}
            className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" /> 
            <span>Run Automated Evaluation</span>
          </button>
        </div>
      </div>

      {/* Tiers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className="bg-white border border-slate-200 hover:border-brand-primary/40 rounded-3xl p-5 flex flex-col justify-between relative shadow-xs hover:shadow-lg transition-all space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold border",
                  tier.badgeBg
                )}>
                  {tier.badge}
                </span>
                <button
                  onClick={() => setEditingTier(tier)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Configure Tier Rules"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-[#0F0C3B]">{tier.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{tier.activeVendors} active vendors enrolled</p>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-2 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-[11px] text-slate-500">Min Orders:</span>
                  <span className="font-bold text-[#0F0C3B]">{tier.minCompletedOrders} jobs</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-[11px] text-slate-500">Min Gross Volume:</span>
                  <span className="font-bold text-emerald-700 font-mono">${tier.minEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-[11px] text-slate-500">Min Review Score:</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 
                    {tier.minRating > 0 ? tier.minRating.toFixed(2) : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-[11px] text-slate-500">Max Dispute Rate:</span>
                  <span className="font-bold text-rose-700">&le; {tier.maxDisputeRate}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 pt-1.5 border-t border-slate-200">
                  <span className="text-[11px] text-brand-primary font-bold">Platform Fee Discount:</span>
                  <span className="font-black text-brand-primary">{tier.platformFeeDiscount}% OFF</span>
                </div>
              </div>

              {/* Perks List */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tier Perks &amp; Powers</p>
                <div className="space-y-1">
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setEditingTier(tier)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-brand-primary" /> Configure Tier Rules
            </button>
          </div>
        ))}
      </div>

      {/* Edit Tier Configuration Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 text-slate-800 shadow-2xl border border-slate-200 animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0F0C3B] flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-primary" /> Configure {editingTier.name}
              </h2>
              <button 
                onClick={() => setEditingTier(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tier Display Title</label>
                <input
                  type="text"
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Completed Orders</label>
                  <input
                    type="number"
                    value={editingTier.minCompletedOrders}
                    onChange={(e) => setEditingTier({ ...editingTier, minCompletedOrders: Number(e.target.value) })}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Gross Volume ($)</label>
                  <input
                    type="number"
                    value={editingTier.minEarnings}
                    onChange={(e) => setEditingTier({ ...editingTier, minEarnings: Number(e.target.value) })}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Rating (1.00 - 5.00)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingTier.minRating}
                    onChange={(e) => setEditingTier({ ...editingTier, minRating: Number(e.target.value) })}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fee Discount (% OFF)</label>
                  <input
                    type="number"
                    value={editingTier.platformFeeDiscount}
                    onChange={(e) => setEditingTier({ ...editingTier, platformFeeDiscount: Number(e.target.value) })}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" /> Save Tier Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
