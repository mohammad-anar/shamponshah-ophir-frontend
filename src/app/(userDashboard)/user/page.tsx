"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  PlusCircle,
  Clock,
  CheckCircle2,
  Users2,
  ShieldCheck,
  Bookmark,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock,
  Loader2,
  AlertCircle,
  Trash2,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CompareOffersModal from "@/components/user/CompareOffersModal";
import OrderDetailDrawer from "@/components/user/OrderDetailDrawer";
import { useGetClientOverviewQuery } from "@/redux/service/user/userApi";
import { useGetClientOrdersQuery } from "@/redux/service/orders/ordersApi";
import { useGetClientJobsQuery, useCancelJobMutation } from "@/redux/service/jobs/jobsApi";
import { useGetMeQuery } from "@/redux/service/auth/authApi";

export default function ClientDashboardOverview() {
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // RTK Query Hooks
  const { data: meData } = useGetMeQuery();
  const { data: overviewData, isLoading: isOverviewLoading } = useGetClientOverviewQuery();
  const { data: ordersData } = useGetClientOrdersQuery({ limit: 5 });
  const { data: jobsData, isLoading: isJobsLoading } = useGetClientJobsQuery();
  const [cancelJobMutation, { isLoading: isCancellingJob }] = useCancelJobMutation();

  const me = (meData as any)?.data || meData;
  const overview = (overviewData as any)?.data || overviewData;

  const clientProfile = overview?.clientProfile || me?.clientProfile;
  const userName = clientProfile?.displayName || me?.name || "Client Host";

  // Real active orders and open jobs strictly from jobsApi (live client jobs)
  const rawActiveOrders: any[] = overview?.activeOrders || ordersData?.data?.orders || ordersData?.orders || [];
  const clientJobsList: any[] = Array.isArray(jobsData)
    ? jobsData
    : jobsData?.data?.jobs || jobsData?.jobs || jobsData?.data || [];
  const rawOpenJobs: any[] = (jobsData !== undefined ? clientJobsList : overview?.openJobs || []).filter(
    (j: any) => j.status === "OPEN" || !j.status
  );

  // Financial metrics
  const escrowAmount = Number(overview?.escrowInCustody || 0);
  const totalSpent = Number(overview?.totalSpent || 0);
  const completedOrdersCount = Number(overview?.completedOrdersCount || 0);
  const savedVendorsCount = Number(overview?.savedVendorsCount || 0);
  const familyWorkspace = overview?.familyWorkspace;
  const recommendedGigs = overview?.recommendedGigs || [];

  // Handler for opening an order detail drawer with real structure
  const handleOpenOrder = (ord: any) => {
    const title = ord.gig?.title || ord.deliveryNotes || `Order #${ord.orderNumber || ord.id?.slice(-6) || "Milestone"}`;
    const vendorName = ord.vendorProfile?.businessName || ord.vendorProfile?.user?.name || "Verified Vendor";
    const total = `$${Number(ord.grandTotal || ord.subtotal || 0).toFixed(2)}`;
    const eventDate = ord.eventDate
      ? new Date(ord.eventDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
      : "Schedule confirmed";
    const location = ord.vendorProfile?.city ? `${ord.vendorProfile.city}, ${ord.vendorProfile.state || ""}` : "Venue address confirmed";

    const milestones = (ord.milestones || []).map((m: any, idx: number) => ({
      id: m.id,
      name: m.label || m.title || `Milestone ${idx + 1}`,
      amount: `$${Number(m.amount || 0).toFixed(2)}`,
      status: (m.status === "RELEASED" || m.status === "COMPLETED" ? "PAID" : "PENDING") as "PAID" | "PENDING" | "RELEASED",
    }));

    setSelectedOrder({
      id: ord.orderNumber || ord.id,
      vendorName,
      serviceTitle: title,
      totalAmount: total,
      eventDate,
      location,
      milestones: milestones.length > 0 ? milestones : [
        { id: "m-1", name: "Milestone 1 • Escrow Contract Custody", amount: total, status: "PENDING" as const }
      ],
    });
    setOrderDrawerOpen(true);
  };

  const handleOpenCompare = (job: any) => {
    setSelectedJob(job);
    setCompareModalOpen(true);
  };

  const handleCancelJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to cancel the RFP "${jobTitle}"?`)) return;
    try {
      await cancelJobMutation(jobId).unwrap();
      toast.success("RFP cancelled successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel RFP");
    }
  };

  // Dynamic actionable next steps based on real DB status
  const nextSteps: Array<{
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    actionText: string;
    action: () => void;
    btnVariant: "primary" | "amber" | "neutral";
  }> = [];

  // 1. Unpaid order requiring initial milestone payment
  const unpaidOrder = rawActiveOrders.find((ord: any) => ord.status === "PENDING_PAYMENT");
  if (unpaidOrder) {
    nextSteps.push({
      id: `pay-order-${unpaidOrder.id}`,
      icon: "💳",
      title: `Payment required to start order #${unpaidOrder.orderNumber || unpaidOrder.id?.slice(-6)}`,
      subtitle: `Fund Milestone 1 with ${unpaidOrder.vendorProfile?.businessName || "Vendor"} to activate fulfillment`,
      actionText: "Pay to Start",
      btnVariant: "primary",
      action: () => {
        window.location.href = `/checkout?orderId=${encodeURIComponent(unpaidOrder.id)}`;
      },
    });
  }

  // 2. Order with submitted delivery waiting for client approval
  const orderWithPendingMilestone = rawActiveOrders.find((ord: any) =>
    ord.milestones?.some((m: any) => m.status === "PENDING_RELEASE")
  );
  if (orderWithPendingMilestone) {
    const pendingM = orderWithPendingMilestone.milestones?.find((m: any) => m.status === "PENDING_RELEASE");
    const mTitle = pendingM?.label || pendingM?.title || "Milestone Delivery";
    const mAmount = pendingM?.amount ? `$${Number(pendingM.amount).toFixed(2)}` : "";
    const vendor = orderWithPendingMilestone.vendorProfile?.businessName || "Verified Vendor";
    nextSteps.push({
      id: `order-milestone-${orderWithPendingMilestone.id}`,
      icon: "🛡️",
      title: `Delivery submitted for review by ${vendor}`,
      subtitle: `${mTitle} ${mAmount ? `• ${mAmount} scheduled for 7-day hold upon approval` : ""}`,
      actionText: "Approve Delivery",
      btnVariant: "amber",
      action: () => handleOpenOrder(orderWithPendingMilestone),
    });
  }

  // 3. New proposals received on custom RFPs (if any)
  const jobWithOffers = rawOpenJobs.find((j: any) => (j.offers?.length || j._count?.offers || 0) > 0);
  if (jobWithOffers) {
    const count = jobWithOffers.offers?.length || jobWithOffers._count?.offers || 0;
    nextSteps.push({
      id: `review-job-${jobWithOffers.id}`,
      icon: "🎵",
      title: `Review ${count} new proposal${count > 1 ? "s" : ""} for ${jobWithOffers.title}`,
      subtitle: `Target budget: $${Number(jobWithOffers.budgetMin || 0).toLocaleString()} - $${Number(jobWithOffers.budgetMax || 0).toLocaleString()}`,
      actionText: "Review",
      btnVariant: "primary",
      action: () => handleOpenCompare(jobWithOffers),
    });
  }

  if (rawOpenJobs.length === 0 && rawActiveOrders.length === 0) {
    nextSteps.push({
      id: "browse-services",
      icon: "✨",
      title: "Explore curated vendor services",
      subtitle: "Choose from cinematography, live jazz, gourmet catering, and floral design",
      actionText: "Browse",
      btnVariant: "primary",
      action: () => {
        window.location.href = "/services";
      },
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Modals & Drawers */}
      <CompareOffersModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        job={selectedJob}
      />

      <OrderDetailDrawer
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        order={selectedOrder}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#DFB76C] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DFB76C] animate-pulse" />
            CLIENT COMMAND &bull; SERVICES & ESCROW
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 flex items-center gap-2 font-serif">
            Welcome back, {userName}
            {isOverviewLoading && <Loader2 className="w-5 h-5 text-[#DFB76C] animate-spin" />}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Book vendor services, collaborate with your Family Hub, and release milestone funds with 100% escrow protection.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/services"
            className="px-4 py-2 rounded-xl bg-[#16181F] border border-[#26282E] text-xs font-bold text-white hover:bg-[#1E222B] hover:border-[#DFB76C]/40 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>Browse Services</span>
          </Link>
          <Link
            href="/user/post-job"
            className="px-4 py-2 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#0B0C0E]" />
            <span>Post a Job RFP</span>
          </Link>
        </div>
      </div>

      {/* Hero: Active Services Command & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Active Bookings & Escrow Hero Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#121418] rounded-3xl p-6 sm:p-7 border border-[#26282E] shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#DFB76C]/10 via-indigo-950/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Escrow Custody Active
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1A1D24] border border-[#DFB76C]/40 text-[#DFB76C] text-[10px] font-extrabold shadow-2xs">
                {rawActiveOrders.length} Active Booking{rawActiveOrders.length === 1 ? "" : "s"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
              {rawActiveOrders.length > 0
                ? `${rawActiveOrders.length} Vendor Service${rawActiveOrders.length === 1 ? "" : "s"} In Progress`
                : "Ready to Book Your Next Vendor Service"}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {rawActiveOrders.length > 0
                ? "Milestone payments are locked securely in escrow until you inspect and accept deliverables."
                : "Explore top-rated verified cinematographers, musicians, caterers, and floral designers."}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5 mt-5 py-3 border-y border-[#26282E] text-xs">
              <div className="p-2.5 rounded-xl bg-[#16181F] border border-[#26282E]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Escrow Custody</span>
                <span className="font-extrabold text-[#DFB76C] text-base">${escrowAmount.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16181F] border border-[#26282E]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed Orders</span>
                <span className="font-extrabold text-emerald-400 text-base">{completedOrdersCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16181F] border border-[#26282E]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Spent</span>
                <span className="font-extrabold text-white text-base">${totalSpent.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#26282E] flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Link
                href="/services"
                className="px-4 py-2 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/user/family-hub"
                className="text-slate-400 hover:text-[#DFB76C] font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Users2 className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>Family Collaboration Hub</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </Link>
            </div>
            <Link href="/user/orders" className="text-xs font-bold text-[#DFB76C] hover:underline">
              View All Orders &rarr;
            </Link>
          </div>
        </div>

        {/* Next Steps Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#121418] rounded-3xl p-6 border border-[#26282E] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFB76C]" />
                <h3 className="font-bold text-white text-sm">Actionable Next Steps</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                {nextSteps.length} need attention
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {nextSteps.length > 0 ? (
                nextSteps.map((step) => (
                  <div
                    key={step.id}
                    className="p-3 rounded-2xl bg-[#16181F] border border-[#26282E] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-950/60 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {step.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white line-clamp-1">{step.title}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{step.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={step.action}
                      className={cn(
                        "px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors shadow-xs shrink-0 cursor-pointer",
                        step.btnVariant === "primary" && "bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E]",
                        step.btnVariant === "amber" && "bg-amber-600 hover:bg-amber-500 text-white",
                        step.btnVariant === "neutral" && "bg-[#1A1D24] border border-[#26282E] text-slate-200 hover:bg-[#222630]"
                      )}
                    >
                      {step.actionText}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-[#16181F] border border-[#26282E] text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white">All caught up!</p>
                  <p className="text-[10px] text-slate-400">All milestones and vendor schedules are up to date.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#26282E] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Escrow Auto-Protection Active
            </span>
            <Link href="/services" className="font-semibold text-[#DFB76C] hover:underline">
              Browse Catalog &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Orders & Open Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <div className="bg-[#121418] rounded-3xl p-6 border border-[#26282E] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-white text-base">Active Service Orders</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                  {rawActiveOrders.length}
                </span>
              </div>
              <Link href="/user/orders" className="text-xs font-bold text-[#DFB76C] hover:underline flex items-center gap-1">
                View all orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Live contracts backed by Ophir Escrow Vault</p>

            <div className="space-y-3 text-xs">
              {rawActiveOrders.length > 0 ? (
                rawActiveOrders.map((ord: any) => {
                  const title = ord.gig?.title || ord.deliveryNotes || `Order #${ord.orderNumber || ord.id?.slice(-6)}`;
                  const vendor = ord.vendorProfile?.businessName || "Verified Vendor";
                  const total = Number(ord.grandTotal || ord.subtotal || 0).toLocaleString();
                  const milestones = ord.milestones || [];
                  const paidMilestones = milestones.filter(
                    (m: any) => m.status === "RELEASED" || m.status === "COMPLETED"
                  ).length;
                  const totalMilestones = Math.max(milestones.length, 1);
                  const progressPct = Math.round((paidMilestones / totalMilestones) * 100);

                  return (
                    <div
                      key={ord.id}
                      onClick={() => handleOpenOrder(ord)}
                      className="p-3.5 rounded-2xl bg-[#16181F] border border-[#26282E] hover:border-[#DFB76C]/40 transition-all cursor-pointer flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate">{title}</h4>
                          <p className="text-[10px] text-slate-400">Vendor: {vendor}</p>
                        </div>
                        <span className="font-black text-[#DFB76C]">${total}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Milestones: {paidMilestones} of {totalMilestones} released</span>
                          <span className="font-bold text-emerald-400">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#26282E] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-2xl bg-[#16181F] border border-[#26282E] text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-white">No active service orders</p>
                  <p className="text-[11px] text-slate-400">Browse vendor services or post an RFP to get started.</p>
                  <Link
                    href="/services"
                    className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold transition-all cursor-pointer"
                  >
                    Browse Services
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Open Jobs / RFPs */}
        <div className="bg-[#121418] rounded-3xl p-6 border border-[#26282E] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-white text-base">Open Jobs & RFPs</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  {rawOpenJobs.length}
                </span>
              </div>
              <Link href="/user/jobs" className="text-xs font-bold text-[#DFB76C] hover:underline flex items-center gap-1">
                View all jobs <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Competitive proposals submitted by verified vendors</p>

            <div className="space-y-3 text-xs">
              {rawOpenJobs.length > 0 ? (
                rawOpenJobs.map((job: any) => {
                  const offersCount = job.offers?.length || job._count?.offers || 0;
                  const budgetStr = `$${Number(job.budgetMin || 0).toLocaleString()} - $${Number(job.budgetMax || 0).toLocaleString()}`;

                  return (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-2xl bg-[#16181F] border border-[#26282E] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-white truncate">{job.title}</h4>
                        <p className="text-[10px] text-slate-400">
                          Budget: {budgetStr} &bull; {offersCount} proposal{offersCount === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {offersCount > 0 ? (
                          <button
                            onClick={() => handleOpenCompare(job)}
                            className="px-3 py-1.5 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] font-bold text-xs transition-colors cursor-pointer"
                          >
                            Review ({offersCount})
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Awaiting bids</span>
                        )}
                        <button
                          onClick={() => handleCancelJob(job.id, job.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Cancel Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-2xl bg-[#16181F] border border-[#26282E] text-center space-y-2">
                  <PlusCircle className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-white">No open jobs posted</p>
                  <p className="text-[11px] text-slate-400">Post a custom RFP to receive bids from top vendors.</p>
                  <Link
                    href="/user/post-job"
                    className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold transition-all cursor-pointer"
                  >
                    Post an RFP
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
