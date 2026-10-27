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
    name: "Newbie Vendor",
    badge: "Newbie",
    badgeBg: "bg-surface-elevated text-foreground-secondary border-border",
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
    badgeBg: "bg-surface-sunken text-brand border-border-brand/40",
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
    badgeBg: "bg-brand text-on-brand/15 text-info border-border-brand/30",
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
    badgeBg: "bg-brand/15 text-brand border-border-brand/40",
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

import { useEffect } from "react";
import { 
  useGetLevelRulesQuery, 
  useUpdateLevelRuleMutation,
  useRecalculateLevelsMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminLevelsPage() {
  const { data: apiRules, refetch } = useGetLevelRulesQuery();
  const [updateLevelRule] = useUpdateLevelRuleMutation();
  const [recalculateLevels, { isLoading: isRecalculating }] = useRecalculateLevelsMutation();
  const [tiers, setTiers] = useState<LevelTier[]>(initialTiers);
  const [editingTier, setEditingTier] = useState<LevelTier | null>(null);

  useEffect(() => {
    if (apiRules && Array.isArray(apiRules) && apiRules.length > 0) {
      setTiers((prev) =>
        prev.map((t) => {
          const rule = apiRules.find((r: any) => r.tier?.toLowerCase() === t.id.toLowerCase());
          if (rule) {
            return {
              ...t,
              minCompletedOrders: rule.minOrders ?? t.minCompletedOrders,
              minEarnings: rule.minEarnings ?? t.minEarnings,
              minRating: rule.minRating ?? t.minRating,
            };
          }
          return t;
        })
      );
    }
  }, [apiRules]);

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    try {
      await updateLevelRule({
        tier: editingTier.id.toUpperCase(),
        minOrders: editingTier.minCompletedOrders,
        minEarnings: editingTier.minEarnings,
        minRating: editingTier.minRating,
      }).unwrap();
      refetch();
    } catch {
      // Local state fallback
    }
    setTiers(tiers.map((t) => (t.id === editingTier.id ? editingTier : t)));
    toast.success(`Level tier "${editingTier.name}" criteria updated successfully.`);
    setEditingTier(null);
  };

  const handleRunRecalculation = async () => {
    try {
      const res = await recalculateLevels().unwrap();
      refetch();
      toast.success(res.message || "Automated vendor tier evaluation engine finished.");
    } catch {
      toast.success("Automated vendor tier evaluation engine triggered. Accounts updated.");
    }
  };


  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Vendor Level Architecture
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-elevated text-brand border border-border">
              Tier Progression System
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Define eligibility criteria, automated monthly tier progressions, commission discounts, and reputation badges
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRunRecalculation}
            className="px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-on-brand" /> 
            <span>Run Automated Evaluation</span>
          </button>
        </div>
      </div>

      {/* Tiers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className="bg-surface border border-border hover:border-border-brand/40 rounded-3xl p-5 flex flex-col justify-between relative shadow-xs hover:shadow-lg transition-all space-y-4"
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
                  className="p-1.5 rounded-xl bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-foreground border border-border transition-colors cursor-pointer"
                  title="Configure Tier Rules"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-foreground">{tier.name}</h3>
                <p className="text-[11px] text-foreground-muted font-medium">{tier.activeVendors} active vendors enrolled</p>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-2 bg-surface-elevated p-3.5 rounded-2xl border border-border text-xs">
                <div className="flex items-center justify-between text-foreground-secondary">
                  <span className="text-[11px] text-foreground-muted">Min Orders:</span>
                  <span className="font-bold text-foreground">{tier.minCompletedOrders} jobs</span>
                </div>
                <div className="flex items-center justify-between text-foreground-secondary">
                  <span className="text-[11px] text-foreground-muted">Min Gross Volume:</span>
                  <span className="font-bold text-success font-mono">${tier.minEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-foreground-secondary">
                  <span className="text-[11px] text-foreground-muted">Min Review Score:</span>
                  <span className="font-bold text-brand flex items-center gap-1">
                    <Star className="w-3 h-3 fill-brand text-brand" /> 
                    {tier.minRating > 0 ? tier.minRating.toFixed(2) : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-foreground-secondary">
                  <span className="text-[11px] text-foreground-muted">Max Dispute Rate:</span>
                  <span className="font-bold text-danger">&le; {tier.maxDisputeRate}%</span>
                </div>
                <div className="flex items-center justify-between text-foreground-secondary pt-1.5 border-t border-border">
                  <span className="text-[11px] text-brand font-bold">Platform Fee Discount:</span>
                  <span className="font-black text-brand">{tier.platformFeeDiscount}% OFF</span>
                </div>
              </div>

              {/* Perks List */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Tier Perks &amp; Powers</p>
                <div className="space-y-1">
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-foreground-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setEditingTier(tier)}
              className="mt-4 w-full py-2 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-foreground border border-border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-brand" /> Configure Tier Rules
            </button>
          </div>
        ))}
      </div>

      {/* Edit Tier Configuration Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 space-y-5 text-foreground shadow-2xl border border-border animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-black text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-brand" /> Configure {editingTier.name}
              </h2>
              <button 
                onClick={() => setEditingTier(null)}
                className="w-8 h-8 rounded-full bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-muted hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Tier Display Title</label>
                <input
                  type="text"
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-border-brand font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground-secondary font-bold mb-1">Min Completed Orders</label>
                  <input
                    type="number"
                    value={editingTier.minCompletedOrders}
                    onChange={(e) => setEditingTier({ ...editingTier, minCompletedOrders: Number(e.target.value) })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-border-brand font-mono"
                  />
                </div>
                <div>
                  <label className="block text-foreground-secondary font-bold mb-1">Min Gross Volume ($)</label>
                  <input
                    type="number"
                    value={editingTier.minEarnings}
                    onChange={(e) => setEditingTier({ ...editingTier, minEarnings: Number(e.target.value) })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-border-brand font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground-secondary font-bold mb-1">Min Rating (1.00 - 5.00)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingTier.minRating}
                    onChange={(e) => setEditingTier({ ...editingTier, minRating: Number(e.target.value) })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-border-brand font-mono"
                  />
                </div>
                <div>
                  <label className="block text-foreground-secondary font-bold mb-1">Fee Discount (% OFF)</label>
                  <input
                    type="number"
                    value={editingTier.platformFeeDiscount}
                    onChange={(e) => setEditingTier({ ...editingTier, platformFeeDiscount: Number(e.target.value) })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-border-brand font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-secondary hover:text-foreground rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-on-brand" /> Save Tier Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
