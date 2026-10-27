"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Plus,
  Coins,
  Star,
  MessageSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WithdrawFundsDrawer from "@/components/vendor/WithdrawFundsDrawer";
import SendOfferModal from "@/components/vendor/SendOfferModal";
import { useGetVendorOverviewQuery } from "@/redux/service/user/userApi";
import {
  useGetMyVendorProfileQuery,
  useGetVendorAnalyticsQuery,
} from "@/redux/service/vendors/vendorsApi";
import { useGetVendorEarningsQuery } from "@/redux/service/payments/paymentsApi";
import { useGetVendorOrdersQuery } from "@/redux/service/orders/ordersApi";
import {
  useGetVendorFindJobsQuery,
  useGetVendorOffersQuery,
} from "@/redux/service/jobs/jobsApi";

export default function VendorDashboardOverview() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [sendOfferOpen, setSendOfferOpen] = useState(false);
  const [locallyOfferedJobIds, setLocallyOfferedJobIds] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<"6M" | "12M" | "All">("6M");
  const [selectedJob, setSelectedJob] = useState<{ id?: string; title: string; budget: string }>({
    id: undefined,
    title: "Artisanal Celebration Experience",
    budget: "$600 – $1,200",
  });

  // RTK Query Hooks connected to live APIs
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetVendorAnalyticsQuery(timeframe);
  const { data: overviewData, isLoading: isOverviewLoading, refetch: refetchOverview } = useGetVendorOverviewQuery();
  const { data: myProfileData } = useGetMyVendorProfileQuery();
  const { data: earningsData } = useGetVendorEarningsQuery();
  const { data: ordersData } = useGetVendorOrdersQuery({ limit: 5 });
  const { data: findJobsData, refetch: refetchJobs } = useGetVendorFindJobsQuery({ limit: 10, excludeOffered: true });
  const { data: offersData, refetch: refetchOffers } = useGetVendorOffersQuery();

  const overview = overviewData?.data || overviewData;
  const analytics = analyticsData?.data || analyticsData;
  const vendorProfile = myProfileData?.data || myProfileData || overview?.vendorProfile;
  const earnings = earningsData?.data || earningsData || {};

  // Live order list
  const liveOrders = ordersData?.data?.orders || ordersData?.orders || overview?.activeOrders || [];

  // Track all job IDs where this vendor has already sent an offer
  const submittedJobIdSet = useMemo(() => {
    const ids = new Set<string>(locallyOfferedJobIds);
    const rawOffers =
      (Array.isArray(offersData?.data) && offersData.data) ||
      (Array.isArray(offersData?.offers) && offersData.offers) ||
      (Array.isArray(offersData) && offersData) ||
      [];
    for (const off of rawOffers) {
      if (off?.jobId) ids.add(String(off.jobId));
      if (off?.job?.id) ids.add(String(off.job.id));
    }
    return ids;
  }, [locallyOfferedJobIds, offersData]);

  // Live job postings: ONLY OPEN jobs, strictly excluding any jobs where offer has been sent
  const rawCandidateJobs: any[] =
    (Array.isArray(findJobsData?.data?.jobs) && findJobsData.data.jobs) ||
    (Array.isArray(findJobsData?.jobs) && findJobsData.jobs) ||
    (Array.isArray(findJobsData?.data) && findJobsData.data) ||
    (Array.isArray(overview?.recentJobs) && overview.recentJobs) ||
    [];

  const liveJobs = rawCandidateJobs.filter((job: any) => {
    if (!job) return false;
    // 1. Must be OPEN status (if status is provided)
    if (job.status && job.status !== "OPEN") return false;
    // 2. Must not have submitted an offer (flagged by backend find-jobs)
    if (job.hasSubmittedOffer) return false;
    // 3. Must not have offers from this vendor
    if (Array.isArray(job.offers) && job.offers.length > 0) return false;
    // 4. Must not be in vendor's submitted offers list
    if (job.id && submittedJobIdSet.has(String(job.id))) return false;
    return true;
  });

  // Live financial balances
  const availableAmount = Number(
    earnings?.availableBalance ?? overview?.availableBalance ?? 0
  ).toFixed(2);
  const pendingAmount = Number(
    earnings?.pendingBalance ?? overview?.pendingBalance ?? 0
  ).toFixed(2);
  const escrowAmount = Number(
    earnings?.escrowBalance ?? overview?.escrowBalance ?? 0
  ).toFixed(2);
  const lifetimeAmount = Number(
    earnings?.totalEarned ?? overview?.totalEarned ?? analytics?.totalEarned ?? 0
  ).toFixed(2);

  // Profile details
  const businessName = vendorProfile?.businessName || vendorProfile?.name || "Vendor Studio";
  const locationCity = vendorProfile?.city ? `${vendorProfile.city}, ${vendorProfile.state || "IL"}` : "Chicago, IL";
  const vendorGreetingName = vendorProfile?.businessName ? vendorProfile.businessName.split(" ")[0] : "Partner";

  // Dynamic Chart Data from Analytics API
  const monthlyRevenue: {
    month: string;
    amount: string;
    rawAmount?: number;
    height: number;
    isCurrent?: boolean;
  }[] = analytics?.monthlyRevenue || [
    { month: "May", height: 50, amount: "$300" },
    { month: "Jun", height: 75, amount: "$420" },
    { month: "Jul", height: 90, amount: "$500" },
    { month: "Aug", height: 65, amount: "$380" },
    { month: "Sep", height: 85, amount: "$460" },
    { month: "Oct", height: 120, amount: "$620 (Current)", isCurrent: true },
  ];

  const avgOrderValue = analytics?.avgOrderValue ? `$${Number(analytics.avgOrderValue).toFixed(2)}` : "$390.00";

  // Dynamic Level Progression
  const levelProgress = analytics?.levelProgress || {
    currentTier: vendorProfile?.tier || "RISING",
    nextTier: vendorProfile?.tier === "SPROUT" ? "Rising Vendor" : vendorProfile?.tier === "RISING" ? "Pro Vendor" : "Elite Vendor",
    progressPercent: 91,
    ordersCompleted: vendorProfile?.ordersCompleted || liveOrders.length || 12,
    targetOrders: 15,
    daysActive: 48,
    targetDays: 60,
    remainingOrders: 3,
    remainingDays: 12,
  };

  const handleOpenSendOffer = (title: string, budget: string, id?: string) => {
    setSelectedJob({ id, title, budget });
    setSendOfferOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Modals & Drawers */}
      <WithdrawFundsDrawer
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableAmount={availableAmount}
      />

      <SendOfferModal
        isOpen={sendOfferOpen}
        onClose={() => {
          setSendOfferOpen(false);
          refetchJobs();
          refetchOverview();
          refetchOffers();
        }}
        jobId={selectedJob.id}
        jobTitle={selectedJob.title}
        clientBudget={selectedJob.budget}
        onOfferSent={() => {
          if (selectedJob.id) {
            setLocallyOfferedJobIds((prev) => [...prev, selectedJob.id!]);
          }
          refetchJobs();
          refetchOverview();
          refetchOffers();
        }}
      />

      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
              {businessName}
            </span>
            <span className="text-foreground-secondary">•</span>
            <span className="text-xs text-foreground-secondary font-semibold">{locationCity}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F0C3B] mt-0.5">
            Good morning, {vendorGreetingName}
          </h1>
          <p className="text-xs text-foreground-muted mt-1">
            You have <strong className="text-[#0F0C3B]">{liveOrders.length} active orders</strong> in your fulfillment queue. Escrow balance is healthy.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={vendorProfile?.slug ? `/vendors/profile/${vendorProfile.slug}` : "/vendors"}
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-[#0F0C3B] hover:bg-surface-elevated shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" />
            <span>Preview public profile</span>
          </Link>
          <Link
            href="/vendor/gigs/create"
            className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-foreground text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create new gig</span>
          </Link>
        </div>
      </div>

      {/* Profile Completion Prompt Banner (Shown for newly registered or incomplete vendor profiles) */}
      {(!vendorProfile?.bio || !vendorProfile?.avatarUrl || !vendorProfile?.stripeAccountId) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0F0C3B] to-[#1E1854] text-foreground shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#2D266E]">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#DFB76C] text-[10px] font-extrabold uppercase tracking-wider border border-border-brand/40">
              <Sparkles className="w-3 h-3 text-[#DFB76C]" />
              <span>Complete Your Artisan Studio Profile</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-foreground">
              Unlock Direct Milestone Inquiries &amp; Escrow Bookings
            </h3>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              Add your craft biography, portfolio showcase, service category, and connect Stripe payout setup to boost your ranking and start receiving client milestone bookings.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link
              href="/vendor/profile"
              className="px-4 py-2.5 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/vendor/payout-settings"
              className="px-4 py-2.5 rounded-xl bg-surface/10 hover:bg-surface/20 text-foreground text-xs font-semibold border border-border-strong transition-all"
            >
              Payout Setup
            </Link>
          </div>
        </div>
      )}

      {/* Response Rate Alert Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-950">Active inquiry messages pending response</h4>
            <p className="text-[11px] text-amber-800">
              Reply promptly within 1 hour to keep your response rate high (current: {vendorProfile?.responseRate || analytics?.responseRate || 94}%).
            </p>
          </div>
        </div>
        <Link
          href="/vendor/messages"
          className="px-3.5 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          Open inbox →
        </Link>
      </div>

      {/* 4 Wallet & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available to Withdraw */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-[10px] font-bold uppercase tracking-wider">Available to Withdraw</span>
              <Wallet className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">${availableAmount.split('.')[0]}</span>
              <span className="text-base font-bold text-foreground-muted">.{availableAmount.split('.')[1] || '00'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-[10px] text-success font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success-solid text-white" /> Instant payout eligible
            </span>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-foreground text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Card 2: Pending Clearance */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending Clearance</span>
              <Clock className="w-4 h-4 text-warning" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">${pendingAmount.split('.')[0]}</span>
              <span className="text-base font-bold text-foreground-muted">.{pendingAmount.split('.')[1] || '00'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border text-[10px] text-foreground-muted">
            ⏳ Clears upon client milestone approval
          </div>
        </div>

        {/* Card 3: Locked in Escrow */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-[10px] font-bold uppercase tracking-wider">Locked in Escrow</span>
              <ShieldCheck className="w-4 h-4 text-info" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">${escrowAmount.split('.')[0]}</span>
              <span className="text-base font-bold text-foreground-muted">.{escrowAmount.split('.')[1] || '00'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-foreground-muted">
            <span>{liveOrders.length} active orders</span>
            <span className="font-bold text-indigo-700">Ophir Vault</span>
          </div>
        </div>

        {/* Card 4: Lifetime Earnings */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-[10px] font-bold uppercase tracking-wider">Lifetime Earnings</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">${lifetimeAmount.split('.')[0]}</span>
              <span className="text-base font-bold text-foreground-muted">.{lifetimeAmount.split('.')[1] || '00'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
            <span className="text-success font-bold">+18% this season</span>
            <span className="text-foreground-muted">
              {vendorProfile?.ordersCompleted || analytics?.ordersCompleted || liveOrders.length || 14} completed gigs
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Earnings Bar Chart & Level Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Earnings Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#0F0C3B] text-base">Earnings Revenue</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Active Milestone Volume
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted">Gross platform revenue over previous months</p>
              </div>

              {/* Timeframe switch buttons */}
              <div className="flex items-center gap-1 bg-surface-sunken p-0.5 rounded-lg text-[11px] font-semibold text-foreground-secondary">
                {(["6M", "12M", "All"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={cn(
                      "px-2.5 py-1 rounded transition-colors cursor-pointer",
                      timeframe === tf
                        ? "bg-surface font-bold text-[#0F0C3B] shadow-xs"
                        : "hover:text-[#0F0C3B]"
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Chart Bars */}
            <div className="mt-8 mb-4 h-44 flex items-end justify-between gap-2.5 px-2 border-b border-border pb-2">
              {monthlyRevenue.map((item, idx) => (
                <div key={`${item.month}-${idx}`} className="flex-1 flex flex-col items-center gap-1 group">
                  <span
                    className={cn(
                      "text-[10px] font-semibold opacity-75 group-hover:opacity-100 transition-opacity",
                      item.isCurrent ? "text-amber-600 font-bold" : "text-foreground-muted"
                    )}
                  >
                    {item.amount}
                  </span>
                  <div
                    style={{ height: `${item.height}px` }}
                    className={cn(
                      "w-full max-w-[46px] rounded-t transition-all duration-300 group-hover:brightness-110",
                      item.isCurrent ? "bg-warning-solid text-on-brand shadow-xs" : "bg-[#18124E]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs mt-1 font-semibold",
                      item.isCurrent ? "text-[#0F0C3B] font-bold" : "text-foreground-muted"
                    )}
                  >
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-foreground-muted">
            <span>
              Avg. order value: <strong className="text-[#0F0C3B]">{avgOrderValue}</strong>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-warning-solid text-on-brand" /> Current Month
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#18124E]" /> Settled Months
              </span>
            </div>
          </div>
        </div>

        {/* Payout & Marketplace Status (4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-info" />
                <h3 className="font-bold text-[#0F0C3B] text-base">Payout &amp; Escrow Health</h3>
              </div>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                vendorProfile?.stripeAccountId
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              )}>
                {vendorProfile?.stripeAccountId ? "Stripe Connected" : "Connect Needed"}
              </span>
            </div>

            <div className="space-y-2.5 my-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span className="text-foreground-secondary">Active In-Escrow</span>
                <span className="font-bold text-[#0F0C3B]">${escrowAmount}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span className="text-foreground-secondary">Waiting 7-Day Release</span>
                <span className="font-bold text-amber-600">${pendingAmount}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span className="text-foreground-secondary">Available in Stripe</span>
                <span className="font-bold text-success">${availableAmount}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-indigo-800 block">7-DAY CUSTODY PROTECTION</span>
            <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
              Client-approved milestone funds are securely held in platform custody for 7 days before direct transfer to your connected Stripe account.
            </p>
            <div className="flex items-center justify-between pt-1">
              <Link href="/vendor/earnings" className="text-[11px] font-bold text-brand-primary hover:underline block">
                View scheduled releases →
              </Link>
              <Link href="/vendor/payout-settings" className="text-[11px] font-bold text-foreground-muted hover:text-foreground hover:underline block">
                Payout settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Orders & New Job Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0F0C3B] text-base">Active Orders</h3>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {liveOrders.length}
              </span>
            </div>
            <Link href="/vendor/orders" className="text-xs font-bold text-brand-primary hover:underline">
              View all orders →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {liveOrders.length > 0 ? (
              liveOrders.slice(0, 3).map((ord: any) => {
                const title = ord.service || ord.gig?.title || ord.package?.title || "Milestone Fulfillment";
                const clientName = ord.client || ord.clientProfile?.displayName || "Verified Client";
                const orderNum = ord.orderNumber ? `#${ord.orderNumber}` : `#${ord.id?.slice(-6)}`;
                const amount = ord.totalAmount || `$${Number(ord.grandTotal || ord.subtotal || 0).toFixed(2)}`;
                const eventDate = ord.eventDate ? new Date(ord.eventDate).toLocaleDateString() : "Scheduled";
                const milestoneCount = ord.milestones?.length || 2;

                return (
                  <div key={ord.id} className="p-3.5 rounded-xl border border-border bg-[#F8F9FD]/60 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#0F0C3B]">{clientName}</h4>
                        <span className="text-[10px] text-foreground-muted">{orderNum}</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted line-clamp-1">{title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {milestoneCount} Milestones
                        </span>
                        <span className="text-[10px] text-foreground-muted">Event: {eventDate}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-extrabold text-[#0F0C3B] block">{amount}</span>
                      <Link
                        href="/vendor/orders"
                        className="px-3 py-1 rounded bg-[#0F0C3B] text-foreground text-[10px] font-bold hover:bg-[#18124E] transition-colors mt-1 inline-block"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-foreground-muted">
                <p>No active orders in progress right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* New Job Matches Feed */}
        <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0F0C3B] text-base">New Job Matches</h3>
              <p className="text-[11px] text-foreground-muted">📍 {locationCity} • Active Requests</p>
            </div>
            <Link href="/vendor/find-jobs" className="text-xs font-bold text-brand-primary hover:underline">
              Find more jobs →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {liveJobs.length > 0 ? (
              liveJobs.slice(0, 3).map((job: any) => {
                const title = job.title;
                const budget = job.budget || (job.budgetMin && job.budgetMax ? `$${job.budgetMin} – $${job.budgetMax}` : "$600 – $1,200");
                const location = job.location || (job.clientProfile?.city ? `${job.clientProfile.city}, ${job.clientProfile.state || "IL"}` : locationCity);
                const dateText = job.eventDate ? new Date(job.eventDate).toLocaleDateString() : "Upcoming";

                return (
                  <div key={job.id} className="p-3.5 rounded-xl border border-border bg-[#F8F9FD]/60 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-[#0F0C3B] line-clamp-1">{title}</h4>
                        <p className="text-[11px] text-foreground-muted">{location} • {dateText}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 flex-shrink-0">
                        Open Request
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-foreground-muted font-semibold block">Client Budget</span>
                        <span className="font-extrabold text-[#0F0C3B]">{budget}</span>
                      </div>
                      <button
                        onClick={() => handleOpenSendOffer(title, budget, job.id)}
                        className="px-4 py-1.5 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-foreground font-bold text-xs transition-colors shadow-xs cursor-pointer"
                      >
                        Send offer
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-foreground-muted">
                <p>No new job postings match your exact filters today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
