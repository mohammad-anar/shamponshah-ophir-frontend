"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Scale,
  DollarSign,
  Download,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOperationsOverview() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Operational Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#0F0C3B]">Operations overview</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 tracking-wider">
              LIVE POD 01
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live platform pulse, escrow liquidity, and operational SLAs
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Timeframe Dropdown */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Select report time range"
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-8 pr-7 py-2 hover:border-slate-300 focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Quarter (Q4)</option>
              <option>Year to Date</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-400", isSyncing && "animate-spin text-brand-primary")} />
            <span className="hidden md:inline">Synced 1m ago</span>
          </button>

          {/* Export Report CTA */}
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F0C3B] text-white text-xs font-semibold hover:bg-[#18124E] shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: GMV */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Gross Merchandise Volume</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">$284,600</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 14%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">vs. $249,640 last period</p>
        </div>

        {/* Metric 2: Platform Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Platform Fee Revenue</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">$14,230</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 14%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">5% take-rate on contracted gigs</p>
        </div>

        {/* Metric 3: Active Clients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Active Clients</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">4,120</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">642 booked this month</p>
        </div>

        {/* Metric 4: Active Vendors */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Active Vendors</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">812</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">184 Pro • 426 Rising • 202 New</p>
        </div>

        {/* Metric 5: Open Client RFPs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Open Client RFPs</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">96</span>
            <span className="text-xs font-semibold text-slate-500">-2%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">312 total bids active</p>
        </div>

        {/* Metric 6: Orders in Escrow */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Orders in Escrow</span>
              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">Secured</span>
            </div>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">$38,900</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">42 orders secured in custody</p>
        </div>

        {/* Metric 7: Pending Payouts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Pending Payouts</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F0C3B]">$9,240</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">18 disbursements scheduled</p>
        </div>

        {/* Metric 8: Open Disputes */}
        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs hover:border-red-300 transition-all bg-red-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Open Disputes</span>
              <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.2 rounded">Priority</span>
            </div>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">4</span>
            <span className="text-xs text-slate-600">active cases</span>
          </div>
          <p className="text-[11px] text-red-600 font-medium mt-1">1 nearing 48h SLA</p>
        </div>
      </div>

      {/* Main Charts & Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV by Month Bar Chart (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Performance Trajectory</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h2 className="text-lg font-bold text-[#0F0C3B]">GMV by Month</h2>
                  <span className="text-xl font-extrabold text-[#0F0C3B]">$284.6k</span>
                  <span className="text-xs font-semibold text-emerald-600">— Target: $249.6k (+14.0% ahead of pace)</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#0F0C3B]" />
                  <span>Booked Gigs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-600" />
                  <span>Custom Job Offers</span>
                </div>
              </div>
            </div>

            {/* Simulated Stacked Bar Chart */}
            <div className="mt-8 mb-4 h-48 flex items-end justify-between gap-3 px-2 border-b border-slate-100 pb-2">
              {[
                { month: "May", gigs: 60, offers: 25, total: "$182k" },
                { month: "Jun", gigs: 75, offers: 32, total: "$210k" },
                { month: "Jul", gigs: 85, offers: 40, total: "$235k" },
                { month: "Aug", gigs: 90, offers: 48, total: "$252k" },
                { month: "Sep", gigs: 95, offers: 55, total: "$268k" },
                { month: "Oct", gigs: 110, offers: 65, total: "$284.6k", isCurrent: true },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className={cn(
                    "text-[10px] font-semibold transition-opacity opacity-75 group-hover:opacity-100",
                    item.isCurrent ? "text-amber-600 font-bold" : "text-slate-500"
                  )}>
                    {item.total}
                  </span>
                  <div className="w-full max-w-[42px] flex flex-col items-stretch rounded-t overflow-hidden shadow-xs">
                    {/* Custom Offers Bar */}
                    <div 
                      style={{ height: `${item.offers}px` }} 
                      className={cn("w-full transition-all duration-300 group-hover:brightness-110", item.isCurrent ? "bg-amber-500" : "bg-amber-700/80")} 
                    />
                    {/* Booked Gigs Bar */}
                    <div 
                      style={{ height: `${item.gigs}px` }} 
                      className={cn("w-full transition-all duration-300 group-hover:brightness-110", item.isCurrent ? "bg-[#0F0C3B]" : "bg-[#18124E]")} 
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold mt-1",
                    item.isCurrent ? "text-[#0F0C3B] font-bold" : "text-slate-600"
                  )}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Current run rate indicates Q4 projection of <strong className="text-[#0F0C3B]">$890,000+ GMV</strong>
            </span>
            <Link href="/admin/fees-reports" className="font-semibold text-brand-primary hover:underline flex items-center gap-1">
              View breakdown details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Network Velocity (1 column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Network Velocity</p>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">4 Weeks</span>
            </div>

            <h3 className="text-base font-bold text-[#0F0C3B]">New Signups</h3>
            <div className="flex items-baseline gap-4 mt-1 mb-4">
              <div>
                <span className="text-xl font-extrabold text-[#0F0C3B]">+840</span>
                <span className="text-xs text-slate-500 ml-1">● Clients</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-amber-600">+72</span>
                <span className="text-xs text-slate-500 ml-1">● Vendors</span>
              </div>
            </div>

            {/* Weekly bars */}
            <div className="space-y-3 text-xs">
              {[
                { week: "W38 (Sep 29 - Oct 5)", clients: 192, vendors: 16, pct: 75 },
                { week: "W39 (Oct 6 - Oct 12)", clients: 208, vendors: 18, pct: 82 },
                { week: "W40 (Oct 13 - Oct 19)", clients: 216, vendors: 19, pct: 88 },
                { week: "W41 (Oct 20 - Oct 26)", clients: 224, vendors: 19, pct: 94 },
              ].map((row) => (
                <div key={row.week} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{row.week}</span>
                    <span className="text-slate-500">{row.clients} Clients • {row.vendors} Vendors</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${row.pct}%` }} className="bg-[#0F0C3B]" />
                    <div style={{ width: `${100 - row.pct}%` }} className="bg-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-medium">Supply liquidity index: <strong>Optimal</strong></span>
            <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">96.4% match</span>
          </div>
        </div>
      </div>

      {/* Orders by Occasion & Alerts / Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution: Orders by Occasion */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Category Distribution</p>
              <span className="text-xs text-slate-500 font-semibold">530 Total Bookings</span>
            </div>
            <h3 className="text-base font-bold text-[#0F0C3B] mb-4">Orders by Occasion</h3>

            <div className="space-y-4 text-xs">
              {[
                { name: "Weddings & Receptions", pct: 42, rev: "$119,532", count: "142 orders", color: "bg-[#0F0C3B]" },
                { name: "Birthdays & Milestones", pct: 28, rev: "$79,688", count: "210 orders", color: "bg-amber-600" },
                { name: "Corporate & Galas", pct: 16, rev: "$45,536", count: "58 orders", color: "bg-slate-600" },
                { name: "Baby Showers & Holuds", pct: 9, rev: "$25,614", count: "84 orders", color: "bg-amber-400" },
                { name: "Quinceañeras & Anniversaries", pct: 5, rev: "$14,230", count: "36 orders", color: "bg-indigo-600" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full", cat.color)} />
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#0F0C3B] mr-2">{cat.pct}%</span>
                      <span className="text-slate-500">{cat.rev} • {cat.count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${cat.pct}%` }} className={cn("h-full rounded-full", cat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Average Ticket: <strong>$536.98 per event</strong></span>
            <button className="font-semibold text-brand-primary hover:underline">Export by Category →</button>
          </div>
        </div>

        {/* Action Required: Alerts & Escalations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Action Required</p>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">4 Pending Actions</span>
            </div>
            <h3 className="text-base font-bold text-[#0F0C3B] mb-3">Alerts & Escalations</h3>

            <div className="space-y-2.5">
              {/* Alert 1 */}
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-amber-100 text-amber-800 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F0C3B]">3 vendor payout accounts need re-verification</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Stripe escrow KYC flag on accounts scheduled &gt;$10k</p>
                  </div>
                </div>
                <Link
                  href="/admin/payouts"
                  className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>

              {/* Alert 2 */}
              <div className="p-3 rounded-lg bg-red-50/50 border border-red-200/80 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-red-100 text-red-800 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-red-900">1 dispute is past its 3-day SLA</h4>
                      <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded uppercase">Overdue</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Case #DS-1049 (Windy City Sound vs Marcus - $2,400 hold)</p>
                  </div>
                </div>
                <Link
                  href="/admin/disputes"
                  className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>

              {/* Alert 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-800 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F0C3B]">12 vendor applications pending over 48 hours</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Chicago and Atlanta regional queues awaiting background check</p>
                  </div>
                </div>
                <Link
                  href="/admin/vendor-approvals"
                  className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>

              {/* Alert 4 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-amber-100 text-amber-800 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F0C3B]">Fraud check flagged 2 orders</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Card velocity check mismatch on orders #JB-20511, #JB-20514</p>
                  </div>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Automatic triage running • Next scan in 4 mins</span>
            <Link href="/admin/settings" className="font-semibold text-slate-600 hover:underline">
              Manage alert rules →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-[#0F0C3B] text-white p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Quick Operations Actions</h4>
            <p className="text-xs text-indigo-200/80">Resolve urgent pipeline bottlenecks across active queues</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <Link
            href="/admin/vendor-approvals"
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Review vendor approvals (12)
          </Link>
          <Link
            href="/admin/disputes"
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            View open disputes (4)
          </Link>
          <button className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">
            Export finance report (.csv)
          </button>
        </div>
      </div>
    </div>
  );
}
