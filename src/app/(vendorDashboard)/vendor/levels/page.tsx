"use client";

import { useState } from "react";
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Star, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Lock,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useGetMyVendorProfileQuery } from "@/redux/service/vendors/vendorsApi";

export default function VendorLevelsPage() {
  const { data: rawVendorProfile } = useGetMyVendorProfileQuery();
  const vendorProfile = (rawVendorProfile as any)?.data || rawVendorProfile;

  const currentTier = vendorProfile?.tier ? `${vendorProfile.tier} Vendor` : "Rising Vendor";
  const nextTier = vendorProfile?.tier === "SPROUT" ? "Rising Vendor" : vendorProfile?.tier === "RISING" ? "Top Rated Professional" : "Elite Master Guild";
  const completedJobs = vendorProfile?.ordersCompleted ?? 0;
  const rating = vendorProfile?.rating ?? 0;
  const onTime = vendorProfile?.onTimeDeliveryPct ?? 0;
  const repeatPct = vendorProfile?.repeatClientPct ?? 0;
  const progressPercent = Math.min(100, Math.round((completedJobs / 40) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Vendor Level & Tier Status</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-soft text-foreground">
              Level: {currentTier}
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Complete milestones, maintain high CSAT ratings, and unlock higher search ranking multipliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground-muted">Next Tier Evaluation:</span>
          <span className="px-2.5 py-1 bg-warning-soft text-warning border border-warning/30 rounded-lg text-xs font-bold">
            Nov 01, 2025 (27 Days)
          </span>
        </div>
      </div>


      {/* Main Progression Showcase Card */}
      <div className="bg-gradient-to-r from-surface-elevated via-surface to-background text-foreground rounded-none p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6 border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/10 text-warning text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-warning" /> 91% of requirements completed
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              You are almost a <span className="text-warning">{nextTier}</span>!
            </h2>
            <p className="text-xs text-info max-w-xl">
              Only 2 more completed orders needed before the November evaluation cycle to unlock the Gold Crown badge and Instant Payouts.
            </p>
          </div>

          <div className="p-4 bg-surface/10 rounded-2xl border border-border flex flex-col items-center justify-center text-center flex-shrink-0">
            <Award className="w-10 h-10 text-warning" />
            <span className="text-sm font-black text-foreground mt-1">Top Rated</span>
            <span className="text-[10px] text-warning font-bold">Next Unlocked Level</span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-info">Current Level: Rising (L2)</span>
            <span className="text-warning font-mono text-sm">91% Progress</span>
          </div>
          <div className="w-full h-4 bg-background/40 rounded-full p-0.5 border border-border">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-warning to-brand-active rounded-full shadow-md transition-all duration-1000"
            />
          </div>
        </div>
      </div>

      {/* 4 Core Evaluation Criteria Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Criteria 1 */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground">38</span>
              <span className="text-xs text-foreground-muted font-bold">/ 40 required</span>
            </div>
            <p className="text-[11px] text-warning font-bold mt-1">2 orders remaining</p>
          </div>
          <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div className="h-full bg-warning-solid text-on-brand rounded-full w-[95%]" />
          </div>
        </div>

        {/* Criteria 2 */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase">Gross Earnings</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-success">$18,420</span>
              <span className="text-xs text-foreground-muted font-bold">/ $10k min</span>
            </div>
            <p className="text-[11px] text-success font-bold mt-1">✓ Goal exceeded (+84%)</p>
          </div>
          <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div className="h-full bg-success-solid text-foreground rounded-full w-full" />
          </div>
        </div>

        {/* Criteria 3 */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase">Review Rating</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground">4.95</span>
              <span className="text-xs text-foreground-muted font-bold">/ 4.85 min</span>
            </div>
            <p className="text-[11px] text-success font-bold mt-1">✓ 5.0 Star Target</p>
          </div>
          <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div className="h-full bg-success-solid text-foreground rounded-full w-full" />
          </div>
        </div>

        {/* Criteria 4 */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase">Dispute Rate</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-success">0.0%</span>
              <span className="text-xs text-foreground-muted font-bold">&lt; 1.0% max</span>
            </div>
            <p className="text-[11px] text-success font-bold mt-1">✓ Zero disputes logged</p>
          </div>
          <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div className="h-full bg-success-solid text-foreground rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Tier Perks & Powers Roadmap */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-foreground">Tier Benefits Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Level 1 */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground-secondary">Newbie Vendor</span>
              <span className="text-[10px] text-foreground-muted">Tier 1</span>
            </div>
            <ul className="space-y-1.5 text-foreground-secondary text-[11px]">
              <li>✓ Basic marketplace profile</li>
              <li>✓ Standard 5-day escrow payouts</li>
              <li>✓ Standard support ticketing</li>
            </ul>
          </div>

          {/* Level 2 (Current) */}
          <div className="p-4 rounded-xl bg-info-soft/70 border-2 border-brand-primary space-y-3 relative">
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-brand-primary text-foreground text-[10px] font-extrabold rounded-full">
              CURRENT LEVEL
            </span>
            <div className="flex items-center justify-between">
              <span className="font-black text-foreground">Rising Vendor</span>
              <span className="text-[10px] font-bold text-brand-primary">Tier 2</span>
            </div>
            <ul className="space-y-1.5 text-foreground-secondary text-[11px] font-medium">
              <li>✓ Rising Star badge on all gigs</li>
              <li>✓ 1.2x search visibility multiplier</li>
              <li>✓ 48-hour escrow expedited payouts</li>
              <li>✓ 15 Monthly free bid credits</li>
            </ul>
          </div>

          {/* Level 3 (Next) */}
          <div className="p-4 rounded-xl bg-warning-soft/60 border border-warning/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-warning">Top Rated Pro</span>
              <span className="text-[10px] font-bold text-warning">Tier 3 (91% Ready)</span>
            </div>
            <ul className="space-y-1.5 text-warning text-[11px] font-medium">
              <li>👑 Gold Crown Top Rated badge</li>
              <li>⭐ 2.0x Top-Shelf search boost</li>
              <li>⚡ Instant next-day bank transfers</li>
              <li>💼 50 Monthly free bid credits</li>
              <li>🤝 Dedicated account manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
