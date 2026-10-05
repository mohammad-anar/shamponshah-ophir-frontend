"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Eye, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  ArrowUpRight, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Zap,
  BarChart3,
  Award
} from "lucide-react";

export default function VendorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Performance Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Top 10% Seller Rank
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Conversion metrics, profile visibility trends, booking velocity, and client retention rates.
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs focus:outline-none self-start sm:self-auto"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>All Time (2025)</option>
        </select>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Impressions</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-brand-primary">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-[#0F0C3B]">1,480</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Search ranking boost: 1.2x active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proposal Win Rate</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-[#0F0C3B]">42.8%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.5%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">12 bookings from 28 bids submitted</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Value</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-[#0F0C3B]">$1,450</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Up from $1,260 last quarter</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Satisfaction</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-[#0F0C3B]">4.95 / 5</span>
            <span className="text-xs font-bold text-indigo-600">100% On-time</span>
          </div>
          <p className="text-[10px] text-slate-400">0 disputes in 38 completed jobs</p>
        </div>
      </div>

      {/* Funnel & Conversion Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F0C3B]">Client Acquisition Funnel</h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>1. Search Impressions</span>
                <span className="font-bold text-slate-800">1,480 (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>2. Profile & Gig Clicks</span>
                <span className="font-bold text-slate-800">412 (27.8%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[27.8%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>3. Direct Inquiries & Chat</span>
                <span className="font-bold text-slate-800">68 (4.6%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[16.5%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>4. Funded Escrow Bookings</span>
                <span className="font-bold text-emerald-600">12 (17.6% of leads)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[12%]" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FD] rounded-xl border border-slate-100 text-[11px] text-slate-600">
            <strong>Pro Tip:</strong> Replying to inquiries in &lt;15 mins increases booking conversion by 3.2x!
          </div>
        </div>

        {/* Revenue Velocity Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F0C3B]">Gross Revenue Velocity (2025)</h2>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Total: $18,420 Net
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
            {[
              { month: "May", amount: 1800, height: "35%" },
              { month: "Jun", amount: 2400, height: "48%" },
              { month: "Jul", amount: 3200, height: "64%" },
              { month: "Aug", amount: 3900, height: "78%" },
              { month: "Sep", amount: 4600, height: "92%" },
              { month: "Oct", amount: 5000, height: "100%" },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-brand-primary">
                  ${bar.amount}
                </span>
                <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-36 flex items-end">
                  <div 
                    style={{ height: bar.height }} 
                    className="w-full bg-gradient-to-t from-[#0F0C3B] to-indigo-600 rounded-t-lg group-hover:from-indigo-700 group-hover:to-purple-500 transition-all"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#0F0C3B] to-indigo-600" />
              <span>Direct Escrow Milestone Disbursements (Zero Platform Fees)</span>
            </div>
            <span className="font-bold text-[#0F0C3B]">100% Vendor Payout Retained</span>
          </div>
        </div>
      </div>
    </div>
  );
}
