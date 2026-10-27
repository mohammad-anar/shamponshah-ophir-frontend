"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Eye, 
  MousePointerClick, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  Filter, 
  ArrowUpRight, 
  BarChart3, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  RefreshCw,
  UserCheck,
  TrendingUp,
  Percent,
  Search
} from "lucide-react";
import { useGetVendorComprehensiveAnalyticsQuery } from "@/redux/service/analytics/analyticsApi";
import { useGetMyVendorProfileQuery } from "@/redux/service/vendors/vendorsApi";

type TimeRangeOption = "7D" | "30D" | "90D";
type ChartMetric = "earnings" | "traffic" | "orders";

export default function VendorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("30D");
  const [selectedGigId, setSelectedGigId] = useState<string>("ALL");
  const [activeChartMetric, setActiveChartMetric] = useState<ChartMetric>("earnings");
  const [gigSearchQuery, setGigSearchQuery] = useState("");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const { data: vendorProfileData } = useGetMyVendorProfileQuery();
  const vendorProfile = vendorProfileData?.data || vendorProfileData;

  const { 
    data: analyticsResponse, 
    isLoading, 
    isFetching, 
    refetch 
  } = useGetVendorComprehensiveAnalyticsQuery({
    range: timeRange,
    gigId: selectedGigId !== "ALL" ? selectedGigId : undefined,
  });

  const analytics = analyticsResponse?.data || analyticsResponse || {};
  const summary = analytics?.summary || {};
  const timeSeries = useMemo(() => (analytics?.timeSeries || []) as Array<{
    date: string;
    formattedDate: string;
    impressions: number;
    clicks: number;
    views: number;
    orders: number;
    earnings: number;
  }>, [analytics?.timeSeries]);

  const gigBreakdown = useMemo(() => (analytics?.gigBreakdown || []) as Array<{
    id: string;
    title: string;
    slug?: string;
    status: string;
    category: string;
    coverImage: string;
    startingPrice: string;
    impressions: number;
    clicks: number;
    ctr: number;
    views: number;
    orders: number;
    earnings: number;
    conversionRate: number;
  }>, [analytics?.gigBreakdown]);

  // Filtered gigs for table
  const filteredGigs = useMemo(() => {
    if (!gigSearchQuery.trim()) return gigBreakdown;
    const q = gigSearchQuery.toLowerCase();
    return gigBreakdown.filter(
      (g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
    );
  }, [gigBreakdown, gigSearchQuery]);

  // Chart data calculations
  const maxChartValue = useMemo(() => {
    if (!timeSeries.length) return 100;
    if (activeChartMetric === "earnings") {
      const maxVal = Math.max(...timeSeries.map((t) => t.earnings), 0);
      return maxVal > 0 ? maxVal * 1.15 : 100;
    }
    if (activeChartMetric === "traffic") {
      const maxVal = Math.max(...timeSeries.map((t) => Math.max(t.impressions, t.clicks)), 0);
      return maxVal > 0 ? maxVal * 1.15 : 50;
    }
    const maxVal = Math.max(...timeSeries.map((t) => t.orders), 0);
    return maxVal > 0 ? maxVal * 1.25 : 10;
  }, [timeSeries, activeChartMetric]);

  const totalChartSum = useMemo(() => {
    if (!timeSeries.length) return 0;
    if (activeChartMetric === "earnings") {
      return timeSeries.reduce((acc, t) => acc + t.earnings, 0);
    }
    if (activeChartMetric === "traffic") {
      return timeSeries.reduce((acc, t) => acc + t.clicks, 0);
    }
    return timeSeries.reduce((acc, t) => acc + t.orders, 0);
  }, [timeSeries, activeChartMetric]);

  return (
    <div className="space-y-7 pb-12">
      {/* ── Top Header & Global Date / Gig Filters ────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border/80 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Performance & Analytics
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-info border border-info/30/60">
              <Sparkles className="w-3.5 h-3.5 text-warning" />
              {vendorProfile?.tier || "Professional Seller"}
            </span>
            {isFetching && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-info animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Updating...
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-muted mt-1.5 max-w-2xl">
            Live Fiverr-style seller analytics: monitor gig impressions, buyer click-through rates, profile views, order conversions, and net revenue velocity.
          </p>
        </div>

        {/* Date Filter & Gig Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 7D / 30D / 90D Switcher */}
          <div className="inline-flex p-1 bg-surface-sunken rounded-xl border border-border/70">
            {(["7D", "30D", "90D"] as TimeRangeOption[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                  timeRange === r
                    ? "bg-brand text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/60"
                }`}
              >
                {r === "7D" ? "Last 7 Days" : r === "30D" ? "Last 30 Days" : "Last 90 Days"}
              </button>
            ))}
          </div>

          {/* Gig Dropdown Filter */}
          <div className="relative min-w-[210px]">
            <select
              value={selectedGigId}
              onChange={(e) => setSelectedGigId(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 pr-8 text-xs font-bold text-foreground-secondary shadow-xs focus:outline-none focus:ring-2 focus:ring-focus-ring/20 cursor-pointer appearance-none"
            >
              <option value="ALL">All Gigs & Services ({gigBreakdown.length})</option>
              {gigBreakdown.map((gig) => (
                <option key={gig.id} value={gig.id}>
                  {gig.title.length > 32 ? gig.title.slice(0, 32) + "..." : gig.title}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-foreground-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh analytics data"
            className="p-2 rounded-xl bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── 8 Fiverr-Style Core KPI Cards ─────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Gig Impressions */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-info/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Gig Impressions
              </span>
              <div className="p-2 rounded-xl bg-info-soft text-info">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {isLoading ? "..." : (summary.gigImpressions ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border flex items-center justify-between">
            <span>Search & category views</span>
            <span className="font-bold text-info text-[10px] bg-info-soft px-1.5 py-0.5 rounded">
              Organic
            </span>
          </p>
        </div>

        {/* 2. Clicks & CTR */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-info/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Gig Clicks & CTR
              </span>
              <div className="p-2 rounded-xl bg-brand-soft text-brand">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {isLoading ? "..." : (summary.gigClicks ?? 0).toLocaleString()}
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-brand-soft text-brand">
                {summary.ctr ?? 0}% CTR
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border">
            Card click-to-impression ratio
          </p>
        </div>

        {/* 3. Profile Views */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-info/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Profile Views
              </span>
              <div className="p-2 rounded-xl bg-info-soft text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {isLoading ? "..." : (summary.profileViews ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border flex items-center justify-between">
            <span>Direct vendor page visits</span>
            <span className="font-bold text-blue-600 text-[10px]">Verified</span>
          </p>
        </div>

        {/* 4. Orders & Conversion Rate */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-info/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Orders & Conversion
              </span>
              <div className="p-2 rounded-xl bg-success-soft text-success">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {isLoading ? "..." : (summary.totalOrders ?? 0)}
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-success-soft text-success">
                {summary.conversionRate ?? 0}% Conv.
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border">
            {summary.completedOrders ?? 0} successfully delivered
          </p>
        </div>

        {/* 5. Total Net Earnings */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-info/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Net Earnings
              </span>
              <div className="p-2 rounded-xl bg-warning-soft text-warning">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                ${isLoading ? "..." : Number(summary.totalEarnings ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border flex items-center justify-between">
            <span>Avg Order Value:</span>
            <span className="font-bold text-foreground">${summary.avgOrderValue ?? 0}</span>
          </p>
        </div>

        {/* 6. Order Completion / Delivery Rate */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-info/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Delivery Rate
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-teal-600">
                {isLoading ? "..." : `${summary.completionRate ?? 100}%`}
              </span>
              <span className="text-[10px] font-bold text-foreground-muted">Target &gt;95%</span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border">
            Completed vs cancelled orders
          </p>
        </div>

        {/* 7. Cancelled Orders & Ratio */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-danger/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Cancelled Orders
              </span>
              <div className="p-2 rounded-xl bg-danger-soft text-danger">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-danger">
                {isLoading ? "..." : (summary.cancelledOrders ?? 0)}
              </span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                (summary.cancellationRatio ?? 0) > 10 ? "bg-danger-soft text-danger" : "bg-surface-sunken text-foreground-secondary"
              }`}>
                {summary.cancellationRatio ?? 0}% Ratio
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border">
            Keep cancellation ratio under 5%
          </p>
        </div>

        {/* 8. Disputed Orders */}
        <div className="bg-surface p-5 rounded-2xl border border-border/90 shadow-xs hover:border-warning/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-foreground-muted uppercase">
                Disputed Orders
              </span>
              <div className={`p-2 rounded-xl ${
                (summary.disputedOrders ?? 0) > 0 ? "bg-warning-soft text-warning" : "bg-success-soft text-success"
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl font-black ${
                (summary.disputedOrders ?? 0) > 0 ? "text-warning" : "text-foreground"
              }`}>
                {isLoading ? "..." : (summary.disputedOrders ?? 0)}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (summary.disputedOrders ?? 0) === 0 ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
              }`}>
                {(summary.disputedOrders ?? 0) === 0 ? "Clean Record" : "Action Needed"}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted mt-3 pt-2 border-t border-border">
            {(summary.disputedOrders ?? 0) === 0 ? "Zero customer escalations" : "Review in resolution center"}
          </p>
        </div>
      </div>

      {/* ── Time-Series Analytics Chart & Funnel ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interactive Chart (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-border/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-info" />
                <h2 className="text-base font-black text-foreground">
                  Trend & Velocity
                </h2>
              </div>
              <p className="text-xs text-foreground-muted mt-0.5">
                Daily breakdown over the selected {timeRange === "7D" ? "7 days" : timeRange === "30D" ? "30 days" : "90 days"}
              </p>
            </div>

            {/* Metric Mode Selector */}
            <div className="inline-flex p-1 bg-surface-sunken rounded-xl border border-border/70 self-start sm:self-auto">
              <button
                onClick={() => setActiveChartMetric("earnings")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeChartMetric === "earnings"
                    ? "bg-brand text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                Earnings ($)
              </button>
              <button
                onClick={() => setActiveChartMetric("traffic")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeChartMetric === "traffic"
                    ? "bg-brand text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                Traffic (Impr & Clicks)
              </button>
              <button
                onClick={() => setActiveChartMetric("orders")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeChartMetric === "orders"
                    ? "bg-brand text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          {/* Interactive Chart Bars */}
          <div className="relative pt-6">
            {/* Tooltip Card on Hover */}
            {hoveredPointIndex !== null && timeSeries[hoveredPointIndex] && (
              <div className="absolute top-0 right-4 bg-brand text-foreground px-3.5 py-2 rounded-xl text-xs shadow-lg pointer-events-none z-10 flex items-center gap-3">
                <span className="font-bold text-foreground-secondary">
                  {timeSeries[hoveredPointIndex].formattedDate}
                </span>
                <span className="h-3 w-px bg-slate-600" />
                {activeChartMetric === "earnings" && (
                  <span className="font-black text-success">
                    ${timeSeries[hoveredPointIndex].earnings.toLocaleString()} Earned
                  </span>
                )}
                {activeChartMetric === "traffic" && (
                  <span className="font-bold text-purple-300">
                    {timeSeries[hoveredPointIndex].impressions} Impr · {timeSeries[hoveredPointIndex].clicks} Clicks
                  </span>
                )}
                {activeChartMetric === "orders" && (
                  <span className="font-black text-warning">
                    {timeSeries[hoveredPointIndex].orders} Orders
                  </span>
                )}
              </div>
            )}

            {/* SVG Bars Container */}
            <div className="h-56 flex items-end gap-1.5 sm:gap-2 pb-2 border-b border-border">
              {timeSeries.map((point, idx) => {
                let barHeightPct = 5;
                if (activeChartMetric === "earnings") {
                  barHeightPct = maxChartValue > 0 ? Math.max((point.earnings / maxChartValue) * 100, 4) : 4;
                } else if (activeChartMetric === "traffic") {
                  const combined = Math.max(point.impressions, point.clicks);
                  barHeightPct = maxChartValue > 0 ? Math.max((combined / maxChartValue) * 100, 4) : 4;
                } else {
                  barHeightPct = maxChartValue > 0 ? Math.max((point.orders / maxChartValue) * 100, 4) : 4;
                }

                const isHovered = hoveredPointIndex === idx;

                return (
                  <div
                    key={point.date}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  >
                    {/* Bar visualization */}
                    <div className="w-full bg-surface-elevated hover:bg-surface-sunken rounded-t-lg flex items-end h-44 overflow-hidden">
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          activeChartMetric === "earnings"
                            ? isHovered
                              ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                              : "bg-gradient-to-t from-brand to-brand"
                            : activeChartMetric === "traffic"
                            ? isHovered
                              ? "bg-gradient-to-t from-purple-700 to-indigo-400"
                              : "bg-gradient-to-t from-indigo-700 to-purple-500"
                            : isHovered
                            ? "bg-gradient-to-t from-brand to-amber-400"
                            : "bg-gradient-to-t from-slate-700 to-brand-active"
                        }`}
                      />
                    </div>

                    {/* Date label (skip some labels if 90D to prevent overlap) */}
                    {(timeRange === "7D" || (timeRange === "30D" && idx % 4 === 0) || (timeRange === "90D" && idx % 10 === 0)) ? (
                      <span className="text-[10px] font-bold text-foreground-muted mt-2 truncate w-full text-center">
                        {point.formattedDate}
                      </span>
                    ) : (
                      <span className="text-[10px] text-transparent mt-2 select-none">.</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-foreground-muted">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-gradient-to-r from-brand to-brand" />
                  <span>
                    Total in period:{" "}
                    <strong className="text-foreground">
                      {activeChartMetric === "earnings"
                        ? `$${totalChartSum.toLocaleString()}`
                        : activeChartMetric === "traffic"
                        ? `${totalChartSum.toLocaleString()} clicks`
                        : `${totalChartSum} orders`}
                    </strong>
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-foreground-muted">
                Hover over bars to inspect daily metrics
              </span>
            </div>
          </div>
        </div>

        {/* Conversion & Funnel Breakdown (1 col) */}
        <div className="bg-surface border border-border/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand" />
              <h2 className="text-base font-black text-foreground">
                Acquisition Funnel
              </h2>
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">
              Buyer drop-off across discovery, intent, and bookings
            </p>
          </div>

          <div className="space-y-4 text-xs py-2">
            {/* Step 1: Impressions */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-foreground-secondary">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-info-soft text-info text-[10px] flex items-center justify-center font-black">1</span>
                  Search Impressions
                </span>
                <span className="font-black text-foreground">
                  {(summary.gigImpressions ?? 0).toLocaleString()} (100%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-sunken rounded-full overflow-hidden">
                <div className="h-full bg-brand text-on-brand rounded-full w-full" />
              </div>
            </div>

            {/* Step 2: Clicks */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-foreground-secondary">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-brand-soft text-brand text-[10px] flex items-center justify-center font-black">2</span>
                  Card Clicks (CTR)
                </span>
                <span className="font-black text-foreground">
                  {(summary.gigClicks ?? 0).toLocaleString()} ({summary.ctr ?? 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-sunken rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(Math.max(summary.ctr || 0, 5), 100)}%` }} 
                  className="h-full bg-brand text-on-brand rounded-full transition-all duration-500" 
                />
              </div>
            </div>

            {/* Step 3: Profile & Gig Views */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-foreground-secondary">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-info-soft text-blue-700 text-[10px] flex items-center justify-center font-black">3</span>
                  Deep Details Views
                </span>
                <span className="font-black text-foreground">
                  {(summary.totalViews ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-sunken rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(Math.max(((summary.totalViews || 0) / Math.max(summary.gigImpressions || 1, 1)) * 100, 8), 100)}%` }} 
                  className="h-full bg-info-solid text-foreground rounded-full transition-all duration-500" 
                />
              </div>
            </div>

            {/* Step 4: Orders Placed */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-foreground-secondary">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-success-soft text-success text-[10px] flex items-center justify-center font-black">4</span>
                  Funded Orders
                </span>
                <span className="font-black text-success">
                  {summary.totalOrders ?? 0} ({summary.conversionRate ?? 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-sunken rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(Math.max((summary.conversionRate || 0) * 4, 6), 100)}%` }} 
                  className="h-full bg-success-solid text-foreground rounded-full transition-all duration-500" 
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-xl border border-info/30/80 text-[11px] text-foreground-secondary leading-relaxed">
            <strong className="text-info font-bold">Pro Growth Tip:</strong>{" "}
            High CTR with low conversion indicates buyers are intrigued by your thumbnail, but may hesitate at your package prices or FAQ clarity.
          </div>
        </div>
      </div>

      {/* ── Gig-Wise Performance Breakdown Table ─────────────── */}
      <div className="bg-surface border border-border/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-info" />
              <h2 className="text-base font-black text-foreground">
                Gig-Wise Performance Breakdown
              </h2>
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">
              Individual performance metrics, impressions, clicks, orders and revenue per service.
            </p>
          </div>

          {/* Search Table */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search your gigs..."
              value={gigSearchQuery}
              onChange={(e) => setGigSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-3.5 py-1.5 text-xs font-bold text-foreground-secondary placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-focus-ring/20"
            />
            <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-elevated/70 border-b border-border/80 text-[11px] font-black uppercase tracking-wider text-foreground-muted">
                <th className="py-3.5 px-5">Gig / Service Details</th>
                <th className="py-3.5 px-4 text-right">Impressions</th>
                <th className="py-3.5 px-4 text-right">Clicks</th>
                <th className="py-3.5 px-4 text-right">CTR</th>
                <th className="py-3.5 px-4 text-right">Views</th>
                <th className="py-3.5 px-4 text-right">Orders</th>
                <th className="py-3.5 px-4 text-right">Conversion</th>
                <th className="py-3.5 px-5 text-right">Revenue</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs font-semibold text-foreground-secondary">
              {filteredGigs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-foreground-muted">
                    <p className="font-bold text-foreground-muted">No services or gigs found</p>
                    <p className="text-xs mt-1">Create or activate a service to start tracking live metrics.</p>
                  </td>
                </tr>
              ) : (
                filteredGigs.map((gig) => (
                  <tr key={gig.id} className="hover:bg-surface-elevated/60 transition-colors">
                    {/* Gig Details */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-sunken shrink-0 border border-border/60">
                          <Image
                            src={gig.coverImage}
                            alt={gig.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 max-w-[260px]">
                          <p className="font-black text-foreground truncate hover:text-info transition-colors">
                            {gig.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-foreground-muted font-medium">
                              {gig.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                              gig.status === "ACTIVE" 
                                ? "bg-success-soft text-success border border-success/30/50" 
                                : "bg-warning-soft text-warning border border-warning/30/50"
                            }`}>
                              {gig.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Impressions */}
                    <td className="py-4 px-4 text-right font-bold text-foreground">
                      {gig.impressions.toLocaleString()}
                    </td>

                    {/* Clicks */}
                    <td className="py-4 px-4 text-right font-bold text-foreground">
                      {gig.clicks.toLocaleString()}
                    </td>

                    {/* CTR */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-brand bg-brand-soft px-2 py-0.5 rounded-full border border-purple-200/60 text-[11px]">
                        {gig.ctr}%
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-right font-bold text-foreground">
                      {gig.views.toLocaleString()}
                    </td>

                    {/* Orders */}
                    <td className="py-4 px-4 text-right font-black text-foreground">
                      {gig.orders}
                    </td>

                    {/* Conversion */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-success text-xs">
                        {gig.conversionRate}%
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="py-4 px-5 text-right font-black text-foreground">
                      ${gig.earnings.toLocaleString()}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/services/${gig.slug || gig.id}`}
                          target="_blank"
                          title="View live service page"
                          className="p-1.5 rounded-lg bg-surface-sunken hover:bg-info-soft hover:text-info text-foreground-secondary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setSelectedGigId(gig.id)}
                          title="Filter dashboard for this gig"
                          className="px-2 py-1 rounded-lg bg-info-soft hover:bg-info-soft text-info text-[10px] font-black transition-colors"
                        >
                          Focus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-surface-elevated/70 border-t border-border/80 flex items-center justify-between text-xs text-foreground-muted">
          <span>
            Showing <strong>{filteredGigs.length}</strong> of <strong>{gigBreakdown.length}</strong> gigs
          </span>
          <span className="text-[11px] font-medium text-foreground-muted">
            Deduplicated and aggregated daily for sub-second query performance
          </span>
        </div>
      </div>
    </div>
  );
}
