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

export default function VendorLevelsPage() {
  const currentTier = "Rising Vendor";
  const nextTier = "Top Rated Professional";
  const progressPercent = 91;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Vendor Level & Tier Status</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Level 2: Rising Vendor
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete milestones, maintain high CSAT ratings, and unlock higher search ranking multipliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Next Tier Evaluation:</span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold">
            Nov 01, 2025 (27 Days)
          </span>
        </div>
      </div>

      {/* Main Progression Showcase Card */}
      <div className="bg-gradient-to-r from-[#0F0C3B] via-[#18124E] to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 91% of requirements completed
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              You are almost a <span className="text-amber-400">{nextTier}</span>!
            </h2>
            <p className="text-xs text-indigo-200 max-w-xl">
              Only 2 more completed orders needed before the November evaluation cycle to unlock the Gold Crown badge and Instant Payouts.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center flex-shrink-0">
            <Award className="w-10 h-10 text-amber-400" />
            <span className="text-sm font-black text-white mt-1">Top Rated</span>
            <span className="text-[10px] text-amber-300 font-bold">Next Unlocked Level</span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-200">Current Level: Rising (L2)</span>
            <span className="text-amber-300 font-mono text-sm">91% Progress</span>
          </div>
          <div className="w-full h-4 bg-black/40 rounded-full p-0.5 border border-white/10">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-md transition-all duration-1000"
            />
          </div>
        </div>
      </div>

      {/* 4 Core Evaluation Criteria Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Criteria 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0F0C3B]">38</span>
              <span className="text-xs text-slate-400 font-bold">/ 40 required</span>
            </div>
            <p className="text-[11px] text-amber-600 font-bold mt-1">2 orders remaining</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[95%]" />
          </div>
        </div>

        {/* Criteria 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Gross Earnings</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">$18,420</span>
              <span className="text-xs text-slate-400 font-bold">/ $10k min</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ Goal exceeded (+84%)</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>

        {/* Criteria 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Review Rating</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0F0C3B]">4.95</span>
              <span className="text-xs text-slate-400 font-bold">/ 4.85 min</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ 5.0 Star Target</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>

        {/* Criteria 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Dispute Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">0.0%</span>
              <span className="text-xs text-slate-400 font-bold">&lt; 1.0% max</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ Zero disputes logged</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Tier Perks & Powers Roadmap */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-[#0F0C3B]">Tier Benefits Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Level 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Newbie Artisan</span>
              <span className="text-[10px] text-slate-500">Tier 1</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li>✓ Basic marketplace profile</li>
              <li>✓ Standard 5-day escrow payouts</li>
              <li>✓ Standard support ticketing</li>
            </ul>
          </div>

          {/* Level 2 (Current) */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border-2 border-brand-primary space-y-3 relative">
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-brand-primary text-white text-[10px] font-extrabold rounded-full">
              CURRENT LEVEL
            </span>
            <div className="flex items-center justify-between">
              <span className="font-black text-[#0F0C3B]">Rising Vendor</span>
              <span className="text-[10px] font-bold text-brand-primary">Tier 2</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px] font-medium">
              <li>✓ Rising Star badge on all gigs</li>
              <li>✓ 1.2x search visibility multiplier</li>
              <li>✓ 48-hour escrow expedited payouts</li>
              <li>✓ 15 Monthly free bid credits</li>
            </ul>
          </div>

          {/* Level 3 (Next) */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-950">Top Rated Pro</span>
              <span className="text-[10px] font-bold text-amber-700">Tier 3 (91% Ready)</span>
            </div>
            <ul className="space-y-1.5 text-amber-900 text-[11px] font-medium">
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
