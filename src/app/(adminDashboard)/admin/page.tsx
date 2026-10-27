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
    <div className="space-y-6 pb-12 text-foreground">
      {/* Top Title & Operational Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-foreground">Operations overview</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-surface-sunken text-brand border border-border-brand/40 tracking-wider">
              LIVE POD 01
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
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
              className="appearance-none bg-surface-elevated border border-border text-foreground text-xs font-semibold rounded-lg pl-8 pr-7 py-2 hover:border-border-brand focus:outline-none focus:border-border-brand shadow-xs cursor-pointer"
            >
              <option className="bg-surface-elevated text-foreground">Last 7 days</option>
              <option className="bg-surface-elevated text-foreground">Last 30 days</option>
              <option className="bg-surface-elevated text-foreground">This Quarter (Q4)</option>
              <option className="bg-surface-elevated text-foreground">Year to Date</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-foreground-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated border border-border text-xs font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-sunken shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-foreground-muted", isFetching && "animate-spin text-brand")} />
            <span className="hidden md:inline">Synced 1m ago</span>
          </button>

          {/* Export Report CTA */}
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold shadow-sm transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: GMV */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Gross Merchandise Volume</span>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-brand border border-border">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${Number(stats.totalGMV || 284600).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 14%
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Platform aggregate lifetime volume</p>
        </div>

        {/* Metric 2: Platform Revenue */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Platform Fee Revenue</span>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-brand border border-border">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${Number(stats.platformFees || 14230).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">5% take-rate on contracted gigs</p>
        </div>

        {/* Metric 3: Active Clients */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Active Clients</span>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-info border border-border">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {Number(stats.totalClients || 4120).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 8%
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Registered host celebrators</p>
        </div>

        {/* Metric 4: Active Vendors */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Active Vendors</span>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-warning border border-border">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {Number(stats.totalVendors || 812).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Curated vendors across all tiers</p>
        </div>

        {/* Metric 5: Open Client RFPs */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Open Client RFPs</span>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-brand border border-border">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {Number(stats.openJobs || 96).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-success">Live</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Open bidding invitations</p>
        </div>

        {/* Metric 6: Orders in Escrow */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Orders in Escrow</span>
              <span className="text-[9px] font-bold bg-surface-sunken text-brand border border-border-brand/40 px-1.5 py-0.2 rounded">Secured</span>
            </div>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-success border border-border">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${Number(stats.escrowLocked || 38900).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">{stats.activeOrders || 42} active orders in custody</p>
        </div>

        {/* Metric 7: Pending Payouts */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-border-brand/40 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Pending Payouts</span>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-brand border border-border">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${Number(stats.pendingPayouts || 9240).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">ACH batch disbursements scheduled</p>
        </div>

        {/* Metric 8: Open Disputes */}
        <div className="bg-surface p-4 rounded-xl border border-danger/30 shadow-sm hover:border-danger/30 transition-all">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Open Disputes</span>
              <span className="text-[9px] font-bold bg-danger-soft text-danger border border-danger/30/40 px-1.5 py-0.2 rounded">Priority</span>
            </div>
            <span className="p-1.5 rounded-lg bg-surface-elevated text-danger border border-border">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-danger">{stats.openDisputes ?? 4}</span>
            <span className="text-xs text-foreground-muted">active cases</span>
          </div>
          <p className="text-[11px] text-danger font-medium mt-1">Monitored under 48h SLA</p>
        </div>
      </div>

      {/* Main Charts & Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV by Month Bar Chart (2 columns) */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Performance Trajectory</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h2 className="text-lg font-bold text-foreground">GMV by Month</h2>
                  <span className="text-xl font-extrabold text-brand">$284.6k</span>
                  <span className="text-xs font-semibold text-success">— Target: $249.6k (+14.0% ahead of pace)</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-foreground-secondary">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-brand" />
                  <span>Booked Gigs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-surface-sunken border border-border" />
                  <span>Custom Job Offers</span>
                </div>
              </div>
            </div>

            {/* Simulated Stacked Bar Chart */}
            <div className="mt-8 mb-4 h-48 flex items-end justify-between gap-3 px-2 border-b border-border pb-2">
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
                    item.isCurrent ? "text-brand font-bold" : "text-foreground-muted"
                  )}>
                    {item.total}
                  </span>
                  <div className="w-full max-w-[42px] flex flex-col items-stretch rounded-t overflow-hidden shadow-xs">
                    {/* Custom Offers Bar */}
                    <div 
                      style={{ height: `${item.offers}px` }} 
                      className={cn("w-full transition-all duration-300 group-hover:brightness-125", item.isCurrent ? "bg-brand" : "bg-brand/60")} 
                    />
                    {/* Booked Gigs Bar */}
                    <div 
                      style={{ height: `${item.gigs}px` }} 
                      className={cn("w-full transition-all duration-300 group-hover:brightness-125", item.isCurrent ? "bg-surface-sunken" : "bg-surface-elevated")} 
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold mt-1",
                    item.isCurrent ? "text-foreground font-bold" : "text-foreground-muted"
                  )}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-foreground-muted flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-success" />
              Current run rate indicates Q4 projection of <strong className="text-foreground">$890,000+ GMV</strong>
            </span>
            <Link href="/admin/fees-reports" className="font-semibold text-brand hover:underline flex items-center gap-1">
              View breakdown details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Network Velocity (1 column) */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Network Velocity</p>
              <span className="text-[10px] font-bold bg-surface-elevated text-brand border border-border px-2 py-0.5 rounded">4 Weeks</span>
            </div>

            <h3 className="text-base font-bold text-foreground">New Signups</h3>
            <div className="flex items-baseline gap-4 mt-1 mb-4">
              <div>
                <span className="text-xl font-extrabold text-foreground">+840</span>
                <span className="text-xs text-foreground-muted ml-1">● Clients</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-brand">+72</span>
                <span className="text-xs text-foreground-muted ml-1">● Vendors</span>
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
                    <span className="font-medium text-foreground-secondary">{row.week}</span>
                    <span className="text-foreground-muted">{row.clients} Clients • {row.vendors} Vendors</span>
                  </div>
                  <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden flex border border-border">
                    <div style={{ width: `${row.pct}%` }} className="bg-brand" />
                    <div style={{ width: `${100 - row.pct}%` }} className="bg-surface-elevated" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-surface-elevated border border-border flex items-center justify-between text-xs">
            <span className="text-foreground-secondary font-medium">Supply liquidity index: <strong className="text-foreground">Optimal</strong></span>
            <span className="font-bold text-brand bg-surface px-2 py-0.5 rounded border border-border">96.4% match</span>
          </div>
        </div>
      </div>

      {/* Orders by Occasion & Alerts / Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution: Orders by Occasion */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Category Distribution</p>
              <span className="text-xs text-foreground-muted font-semibold">530 Total Bookings</span>
            </div>
            <h3 className="text-base font-bold text-foreground mb-4">Orders by Occasion</h3>

            <div className="space-y-4 text-xs">
              {[
                { name: "Weddings & Receptions", pct: 42, rev: "$119,532", count: "142 orders", color: "bg-brand" },
                { name: "Birthdays & Milestones", pct: 28, rev: "$79,688", count: "210 orders", color: "bg-warning-solid text-on-brand" },
                { name: "Corporate & Galas", pct: 16, rev: "$45,536", count: "58 orders", color: "bg-info" },
                { name: "Baby Showers & Holuds", pct: 9, rev: "$25,614", count: "84 orders", color: "bg-brand" },
                { name: "Quinceañeras & Anniversaries", pct: 5, rev: "$14,230", count: "36 orders", color: "bg-success-solid text-foreground" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full", cat.color)} />
                      <span className="font-semibold text-foreground-secondary">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground mr-2">{cat.pct}%</span>
                      <span className="text-foreground-muted">{cat.rev} • {cat.count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden border border-border">
                    <div style={{ width: `${cat.pct}%` }} className={cn("h-full rounded-full", cat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-foreground-muted font-medium">Average Ticket: <strong className="text-foreground">$536.98 per event</strong></span>
            <button className="font-semibold text-brand hover:underline cursor-pointer">Export by Category →</button>
          </div>
        </div>

        {/* Action Required: Alerts & Escalations */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-wider uppercase text-foreground-muted">Action Required</p>
              <span className="text-[10px] font-bold bg-danger-soft text-danger border border-danger/30/40 px-2 py-0.5 rounded-full">4 Pending Actions</span>
            </div>
            <h3 className="text-base font-bold text-foreground mb-3">Alerts & Escalations</h3>

            <div className="space-y-2.5">
              {/* Alert: Pending Gigs Moderation */}
              {Number(stats.pendingGigs || 0) > 0 && (
                <div className="p-3 rounded-lg bg-warning-soft text-warning border border-warning/50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-warning-soft text-warning mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-warning">
                          {stats.pendingGigs} service {stats.pendingGigs === 1 ? "gig" : "gigs"} pending verification
                        </h4>
                        <span className="text-[9px] font-bold bg-warning-solid text-on-brand text-on-brand px-1.5 py-0.2 rounded uppercase">Verification Queue</span>
                      </div>
                      <p className="text-[11px] text-warning/80 mt-0.5">Vendor service submissions waiting for admin approval before going live</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/gigs/pending"
                    className="text-xs font-bold text-on-brand bg-warning-solid text-on-brand hover:bg-warning px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
                  >
                    Audit &amp; Approve →
                  </Link>
                </div>
              )}

              {/* Alert: Service Reports */}
              {Number(stats.pendingReports || 0) > 0 && (
                <div className="p-3 rounded-lg bg-danger-soft text-danger border border-danger/30/50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-danger-soft text-danger mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-danger">
                          {stats.pendingReports} urgent user service {stats.pendingReports === 1 ? "report" : "reports"}
                        </h4>
                        <span className="text-[9px] font-bold bg-danger-solid text-foreground text-foreground px-1.5 py-0.2 rounded uppercase">Safety</span>
                      </div>
                      <p className="text-[11px] text-danger/80 mt-0.5">User complaints alleging misleading pricing, policy breaches, or fraud</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/reports"
                    className="text-xs font-bold text-foreground bg-danger-solid text-foreground hover:bg-danger-solid text-foreground px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
                  >
                    Review Reports →
                  </Link>
                </div>
              )}

              {/* Alert: Open Disputes */}
              {Number(stats.openDisputes || 0) > 0 && (
                <div className="p-3 rounded-lg bg-danger-soft text-danger border border-danger/50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-danger-soft text-danger mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-danger">
                          {stats.openDisputes} order {stats.openDisputes === 1 ? "dispute" : "disputes"} open
                        </h4>
                        <span className="text-[9px] font-bold bg-danger text-foreground px-1.5 py-0.2 rounded uppercase">Escrow SLA</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted mt-0.5">Disputed milestone orders requiring admin decision and Stripe refund</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/disputes"
                    className="text-xs font-semibold text-foreground bg-danger hover:bg-danger-solid text-foreground px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
                  >
                    Resolve Disputes →
                  </Link>
                </div>
              )}

              {/* Alert 3 */}
              <div className="p-3 rounded-lg bg-surface-elevated border border-border flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-surface-sunken text-brand border border-border-brand/40 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {stats.pendingApprovals ?? 12} vendor applications pending
                    </h4>
                    <p className="text-[11px] text-foreground-muted mt-0.5">Regional vendor onboarding queues awaiting document audit</p>
                  </div>
                </div>
                <Link
                  href="/admin/vendor-approvals"
                  className="text-xs font-semibold text-foreground bg-surface-sunken border border-border hover:border-border-brand hover:text-brand px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>

              {/* Alert 4 */}
              <div className="p-3 rounded-lg bg-surface-elevated border border-border flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-surface-sunken text-warning border border-warning/30 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Fraud check flagged 2 orders</h4>
                    <p className="text-[11px] text-foreground-muted mt-0.5">Card velocity check mismatch on orders #OPH-20511, #OPH-20514</p>
                  </div>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-semibold text-foreground bg-surface-sunken border border-border hover:border-border-brand hover:text-brand px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                >
                  Review →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-foreground-muted text-[11px]">Automatic triage running • Next scan in 4 mins</span>
            <Link href="/admin/settings" className="font-semibold text-brand hover:underline">
              Manage alert rules →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-surface text-foreground p-4 sm:p-5 rounded-xl border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-sunken border border-border-brand/40 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Quick Operations Actions</h4>
            <p className="text-xs text-foreground-muted">Resolve urgent pipeline bottlenecks across active queues</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <Link
            href="/admin/gigs/pending"
            className="px-3.5 py-2 rounded-lg bg-warning-solid text-on-brand hover:bg-warning text-on-brand text-xs font-extrabold transition-colors shadow-xs"
          >
            Review Pending Gigs ({stats.pendingGigs || 0})
          </Link>
          <Link
            href="/admin/reports"
            className="px-3.5 py-2 rounded-lg bg-danger-solid text-foreground hover:bg-danger-solid text-foreground text-foreground text-xs font-bold transition-colors shadow-xs"
          >
            Safety Reports ({stats.pendingReports || 0})
          </Link>
          <Link
            href="/admin/disputes"
            className="px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground text-xs font-bold transition-colors"
          >
            Open Disputes ({stats.openDisputes || 0})
          </Link>
          <Link
            href="/admin/vendor-approvals"
            className="px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground text-xs font-bold transition-colors"
          >
            Approvals ({stats.pendingApprovals || 0})
          </Link>
        </div>
      </div>
    </div>
  );
}
