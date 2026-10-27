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
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAdminStatsQuery } from "@/redux/service/admin/adminApi";

export default function AdminOperationsOverview() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const { data: statsData, refetch, isFetching } = useGetAdminStatsQuery();

  const stats = statsData?.data || statsData || {};

  const handleSync = () => {
    refetch();
  };

  return (
    <div className="space-y-6 pb-12 text-white">
      {/* Top Title & Operational Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">Operations overview</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30 tracking-wider">
              LIVE POD 01
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
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
              className="appearance-none bg-[#16181F] border border-[#26282E] text-white text-xs font-semibold rounded-lg pl-8 pr-7 py-2 hover:border-[#DFB76C] focus:outline-none focus:border-[#DFB76C] shadow-xs cursor-pointer"
            >
              <option className="bg-[#16181F] text-white">Last 7 days</option>
              <option className="bg-[#16181F] text-white">Last 30 days</option>
              <option className="bg-[#16181F] text-white">This Quarter (Q4)</option>
              <option className="bg-[#16181F] text-white">Year to Date</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#16181F] border border-[#26282E] text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1A1D24] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-400", isFetching && "animate-spin text-[#DFB76C]")} />
            <span className="hidden md:inline">Synced 1m ago</span>
          </button>

          {/* Export Report CTA */}
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold shadow-sm transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: GMV */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Gross Merchandise Volume</span>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-[#DFB76C] border border-[#26282E]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${Number(stats.totalGMV || 284600).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 14%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Platform aggregate lifetime volume</p>
        </div>

        {/* Metric 2: Platform Revenue */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Platform Fee Revenue</span>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-[#DFB76C] border border-[#26282E]">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${Number(stats.platformFees || 14230).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">5% take-rate on contracted gigs</p>
        </div>

        {/* Metric 3: Active Clients */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Active Clients</span>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-purple-400 border border-[#26282E]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {Number(stats.totalClients || 4120).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registered host celebrators</p>
        </div>

        {/* Metric 4: Active Vendors */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Active Vendors</span>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-amber-400 border border-[#26282E]">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {Number(stats.totalVendors || 812).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Curated vendors across all tiers</p>
        </div>

        {/* Metric 5: Open Client RFPs */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Open Client RFPs</span>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-[#DFB76C] border border-[#26282E]">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {Number(stats.openJobs || 96).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400">Live</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Open bidding invitations</p>
        </div>

        {/* Metric 6: Orders in Escrow */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Orders in Escrow</span>
              <span className="text-[9px] font-bold bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30 px-1.5 py-0.2 rounded">Secured</span>
            </div>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-emerald-400 border border-[#26282E]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${Number(stats.escrowLocked || 38900).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats.activeOrders || 42} active orders in custody</p>
        </div>

        {/* Metric 7: Pending Payouts */}
        <div className="bg-[#121418] p-4 rounded-xl border border-[#26282E] shadow-sm hover:border-[#DFB76C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Pending Payouts</span>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-[#DFB76C] border border-[#26282E]">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${Number(stats.pendingPayouts || 9240).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ACH batch disbursements scheduled</p>
        </div>

        {/* Metric 8: Open Disputes */}
        <div className="bg-[#121418] p-4 rounded-xl border border-red-500/40 shadow-sm hover:border-red-500/60 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Open Disputes</span>
              <span className="text-[9px] font-bold bg-rose-950 text-rose-400 border border-rose-800/40 px-1.5 py-0.2 rounded">Priority</span>
            </div>
            <span className="p-1.5 rounded-lg bg-[#16181F] text-rose-400 border border-[#26282E]">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">{stats.openDisputes ?? 4}</span>
            <span className="text-xs text-slate-400">active cases</span>
          </div>
          <p className="text-[11px] text-rose-400 font-medium mt-1">Monitored under 48h SLA</p>
        </div>
      </div>

      {/* Main Charts & Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV by Month Bar Chart (2 columns) */}
        <div className="lg:col-span-2 bg-[#121418] rounded-xl border border-[#26282E] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Performance Trajectory</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h2 className="text-lg font-bold text-white">GMV by Month</h2>
                  <span className="text-xl font-extrabold text-[#DFB76C]">$284.6k</span>
                  <span className="text-xs font-semibold text-emerald-400">— Target: $249.6k (+14.0% ahead of pace)</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#DFB76C]" />
                  <span>Booked Gigs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#1E222B] border border-[#26282E]" />
                  <span>Custom Job Offers</span>
                </div>
              </div>
            </div>

            {/* Simulated Stacked Bar Chart */}
            <div className="mt-8 mb-4 h-48 flex items-end justify-between gap-3 px-2 border-b border-[#26282E] pb-2">
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
                    item.isCurrent ? "text-[#DFB76C] font-bold" : "text-slate-400"
                  )}>
                    {item.total}
                  </span>
                  <div className="w-full max-w-[42px] flex flex-col items-stretch rounded-t overflow-hidden shadow-xs">
                    {/* Custom Offers Bar */}
                    <div 
                      style={{ height: `${item.offers}px` }} 
                      className={cn("w-full transition-all duration-300 group-hover:brightness-125", item.isCurrent ? "bg-[#DFB76C]" : "bg-[#DFB76C]/60")} 
                    />
                    {/* Booked Gigs Bar */}
                    <div 
                      style={{ height: `${item.gigs}px` }} 
                      className={cn("w-full transition-all duration-300 group-hover:brightness-125", item.isCurrent ? "bg-[#1A1D24]" : "bg-[#16181F]")} 
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold mt-1",
                    item.isCurrent ? "text-white font-bold" : "text-slate-400"
                  )}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#26282E] flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Current run rate indicates Q4 projection of <strong className="text-white">$890,000+ GMV</strong>
            </span>
            <Link href="/admin/fees-reports" className="font-semibold text-[#DFB76C] hover:underline flex items-center gap-1">
              View breakdown details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Network Velocity (1 column) */}
        <div className="bg-[#121418] rounded-xl border border-[#26282E] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Network Velocity</p>
              <span className="text-[10px] font-bold bg-[#16181F] text-[#DFB76C] border border-[#26282E] px-2 py-0.5 rounded">4 Weeks</span>
            </div>

            <h3 className="text-base font-bold text-white">New Signups</h3>
            <div className="flex items-baseline gap-4 mt-1 mb-4">
              <div>
                <span className="text-xl font-extrabold text-white">+840</span>
                <span className="text-xs text-slate-400 ml-1">● Clients</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#DFB76C]">+72</span>
                <span className="text-xs text-slate-400 ml-1">● Vendors</span>
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
                    <span className="font-medium text-slate-300">{row.week}</span>
                    <span className="text-slate-400">{row.clients} Clients • {row.vendors} Vendors</span>
                  </div>
                  <div className="h-2 w-full bg-[#16181F] rounded-full overflow-hidden flex border border-[#26282E]">
                    <div style={{ width: `${row.pct}%` }} className="bg-[#DFB76C]" />
                    <div style={{ width: `${100 - row.pct}%` }} className="bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#16181F] border border-[#26282E] flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Supply liquidity index: <strong className="text-white">Optimal</strong></span>
            <span className="font-bold text-[#DFB76C] bg-[#121418] px-2 py-0.5 rounded border border-[#26282E]">96.4% match</span>
          </div>
        </div>
      </div>

      {/* Orders by Occasion & Alerts / Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution: Orders by Occasion */}
        <div className="bg-[#121418] rounded-xl border border-[#26282E] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Category Distribution</p>
              <span className="text-xs text-slate-400 font-semibold">530 Total Bookings</span>
            </div>
            <h3 className="text-base font-bold text-white mb-4">Orders by Occasion</h3>

            <div className="space-y-4 text-xs">
              {[
                { name: "Weddings & Receptions", pct: 42, rev: "$119,532", count: "142 orders", color: "bg-[#DFB76C]" },
                { name: "Birthdays & Milestones", pct: 28, rev: "$79,688", count: "210 orders", color: "bg-amber-500" },
                { name: "Corporate & Galas", pct: 16, rev: "$45,536", count: "58 orders", color: "bg-indigo-400" },
                { name: "Baby Showers & Holuds", pct: 9, rev: "$25,614", count: "84 orders", color: "bg-purple-400" },
                { name: "Quinceañeras & Anniversaries", pct: 5, rev: "$14,230", count: "36 orders", color: "bg-emerald-400" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full", cat.color)} />
                      <span className="font-semibold text-slate-200">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white mr-2">{cat.pct}%</span>
                      <span className="text-slate-400">{cat.rev} • {cat.count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[#16181F] rounded-full overflow-hidden border border-[#26282E]">
                    <div style={{ width: `${cat.pct}%` }} className={cn("h-full rounded-full", cat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#26282E] flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Average Ticket: <strong className="text-white">$536.98 per event</strong></span>
            <button className="font-semibold text-[#DFB76C] hover:underline cursor-pointer">Export by Category →</button>
          </div>
        </div>

        {/* Action Required: Alerts & Escalations */}
        <div className="bg-[#121418] rounded-xl border border-[#26282E] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Action Required</p>
              <span className="text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded-full">4 Pending Actions</span>
            </div>
            <h3 className="text-base font-bold text-white mb-3">Alerts & Escalations</h3>

            <div className="space-y-2.5">
              {/* Alert: Pending Gigs Moderation */}
              {Number(stats.pendingGigs || 0) > 0 && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-amber-900/60 text-amber-300 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-amber-200">
                          {stats.pendingGigs} service {stats.pendingGigs === 1 ? "gig" : "gigs"} pending verification
                        </h4>
                        <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded uppercase">Verification Queue</span>
                      </div>
                      <p className="text-[11px] text-amber-300/80 mt-0.5">Vendor service submissions waiting for admin approval before going live</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/gigs/pending"
                    className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
                  >
                    Audit &amp; Approve →
                  </Link>
                </div>
              )}

              {/* Alert: Service Reports */}
              {Number(stats.pendingReports || 0) > 0 && (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-rose-900/60 text-rose-300 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-rose-200">
                          {stats.pendingReports} urgent user service {stats.pendingReports === 1 ? "report" : "reports"}
                        </h4>
                        <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded uppercase">Safety</span>
                      </div>
                      <p className="text-[11px] text-rose-300/80 mt-0.5">User complaints alleging misleading pricing, policy breaches, or fraud</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/reports"
                    className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
                  >
                    Review Reports →
                  </Link>
                </div>
              )}

              {/* Alert: Open Disputes */}
              {Number(stats.openDisputes || 0) > 0 && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-red-900/60 text-red-300 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-red-200">
                          {stats.openDisputes} order {stats.openDisputes === 1 ? "dispute" : "disputes"} open
                        </h4>
                        <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded uppercase">Escrow SLA</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Disputed milestone orders requiring admin decision and Stripe refund</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/disputes"
                    className="text-xs font-semibold text-white bg-red-600 hover:bg-red-500 px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
                  >
                    Resolve Disputes →
                  </Link>
                </div>
              )}

              {/* Alert 3 */}
              <div className="p-3 rounded-lg bg-[#16181F] border border-[#26282E] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {stats.pendingApprovals ?? 12} vendor applications pending
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Regional vendor onboarding queues awaiting document audit</p>
                  </div>
                </div>
                <Link
                  href="/admin/vendor-approvals"
                  className="text-xs font-semibold text-white bg-[#1A1D24] border border-[#26282E] hover:border-[#DFB76C] hover:text-[#DFB76C] px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>

              {/* Alert 4 */}
              <div className="p-3 rounded-lg bg-[#16181F] border border-[#26282E] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-[#1A1D24] text-amber-400 border border-amber-500/30 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Fraud check flagged 2 orders</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Card velocity check mismatch on orders #OPH-20511, #OPH-20514</p>
                  </div>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-semibold text-white bg-[#1A1D24] border border-[#26282E] hover:border-[#DFB76C] hover:text-[#DFB76C] px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#26282E] flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Automatic triage running • Next scan in 4 mins</span>
            <Link href="/admin/settings" className="font-semibold text-[#DFB76C] hover:underline">
              Manage alert rules →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-[#121418] text-white p-4 sm:p-5 rounded-xl border border-[#26282E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1A1D24] border border-[#DFB76C]/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#DFB76C]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Quick Operations Actions</h4>
            <p className="text-xs text-slate-400">Resolve urgent pipeline bottlenecks across active queues</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <Link
            href="/admin/gigs/pending"
            className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-colors shadow-xs"
          >
            Review Pending Gigs ({stats.pendingGigs || 0})
          </Link>
          <Link
            href="/admin/reports"
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Safety Reports ({stats.pendingReports || 0})
          </Link>
          <Link
            href="/admin/disputes"
            className="px-3.5 py-2 rounded-lg bg-[#16181F] hover:bg-[#1A1D24] border border-[#26282E] text-white text-xs font-bold transition-colors"
          >
            Open Disputes ({stats.openDisputes || 0})
          </Link>
          <Link
            href="/admin/vendor-approvals"
            className="px-3.5 py-2 rounded-lg bg-[#16181F] hover:bg-[#1A1D24] border border-[#26282E] text-white text-xs font-bold transition-colors"
          >
            Approvals ({stats.pendingApprovals || 0})
          </Link>
        </div>
      </div>
    </div>
  );
}
