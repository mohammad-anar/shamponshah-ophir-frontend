"use client";

import { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import WithdrawFundsDrawer from "@/components/vendor/WithdrawFundsDrawer";
import SendOfferModal from "@/components/vendor/SendOfferModal";

export default function VendorDashboardOverview() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [sendOfferOpen, setSendOfferOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ title: string; budget: string }>({
    title: "DJ and Emcee for 5th birthday party",
    budget: "$600 – $1,200",
  });

  const handleOpenSendOffer = (title: string, budget: string) => {
    setSelectedJob({ title, budget });
    setSendOfferOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Modals & Drawers */}
      <WithdrawFundsDrawer
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableAmount="540.00"
      />

      <SendOfferModal
        isOpen={sendOfferOpen}
        onClose={() => setSendOfferOpen(false)}
        jobTitle={selectedJob.title}
        clientBudget={selectedJob.budget}
      />

      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PARTY PULSE EVENTS
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-semibold">Chicago, IL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F0C3B] mt-0.5">
            Good morning, Marcus
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You have <strong className="text-[#0F0C3B]">2 orders due this week</strong>. Escrow balance is healthy.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/vendors/1"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F0C3B] hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Preview public profile</span>
          </Link>
          <Link
            href="/vendor/gigs/create"
            className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create new gig</span>
          </Link>
        </div>
      </div>

      {/* Response Rate Alert Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-950">2 new messages are waiting client response</h4>
            <p className="text-[11px] text-amber-800">Reply within 1 hour to keep your response rate above 90% (current: 92%).</p>
          </div>
        </div>
        <Link
          href="/vendor/messages"
          className="px-3.5 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors self-start sm:self-auto"
        >
          Open inbox →
        </Link>
      </div>

      {/* 4 Wallet & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available to Withdraw */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Available to Withdraw</span>
              <Wallet className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">$540</span>
              <span className="text-base font-bold text-slate-400">.00</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Instant payout eligible
            </span>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white text-[11px] font-bold transition-colors shadow-xs"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Card 2: Pending Clearance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending Clearance</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">$360</span>
              <span className="text-base font-bold text-slate-400">.00</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            ⏳ Clears <strong>Sep 28, 2026</strong>
          </div>
        </div>

        {/* Card 3: Locked in Escrow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Locked in Escrow</span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">$1,150</span>
              <span className="text-base font-bold text-slate-400">.00</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>3 active orders</span>
            <span className="font-bold text-indigo-700">Ophir Vault</span>
          </div>
        </div>

        {/* Card 4: Lifetime Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Lifetime Earnings</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-[#0F0C3B]">$2,340</span>
              <span className="text-base font-bold text-slate-400">.00</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-emerald-600 font-bold">+18% this month</span>
            <span className="text-slate-400">14 total gigs</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Earnings Bar Chart & Level Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Earnings Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#0F0C3B] text-base">Earnings</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Festive Season High
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Gross platform revenue over previous months</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
                <button className="px-2.5 py-1 rounded bg-white font-bold text-[#0F0C3B] shadow-xs">6M</button>
                <button className="px-2.5 py-1 rounded hover:text-[#0F0C3B]">12M</button>
                <button className="px-2.5 py-1 rounded hover:text-[#0F0C3B]">All</button>
              </div>
            </div>

            {/* Simulated Chart */}
            <div className="mt-8 mb-4 h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-100 pb-2">
              {[
                { month: "Apr", height: 50, amount: "$300" },
                { month: "May", height: 75, amount: "$420" },
                { month: "Jun", height: 90, amount: "$500" },
                { month: "Jul", height: 65, amount: "$380" },
                { month: "Aug", height: 85, amount: "$460" },
                { month: "Sep", height: 120, amount: "$620 (Current)", isCurrent: true },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className={cn(
                    "text-[10px] font-semibold opacity-75 group-hover:opacity-100",
                    item.isCurrent ? "text-amber-600 font-bold" : "text-slate-400"
                  )}>
                    {item.amount}
                  </span>
                  <div
                    style={{ height: `${item.height}px` }}
                    className={cn(
                      "w-full max-w-[46px] rounded-t transition-all group-hover:brightness-110",
                      item.isCurrent ? "bg-amber-500" : "bg-[#18124E]"
                    )}
                  />
                  <span className={cn("text-xs mt-1 font-semibold", item.isCurrent ? "text-[#0F0C3B]" : "text-slate-500")}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg. order value: <strong className="text-[#0F0C3B]">$390.00</strong></span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Current Month</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#18124E]" /> Cleared</span>
            </div>
          </div>
        </div>

        {/* Level Progress: Rising to Pro (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-[#0F0C3B] text-base">Your Level</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 uppercase">
                RISING
              </span>
            </div>

            <div className="space-y-1.5 my-3">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#0F0C3B]">Progress to Pro Vendor</span>
                <span className="font-extrabold text-amber-600">91%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: "91%" }} className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
              </div>
              <p className="text-[11px] text-slate-500">
                Almost there! Only 2 requirements left before the next cycle.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-700">3 more completed orders</span>
                <span className="font-bold text-[#0F0C3B]">12 / 15</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-700">12 more days active</span>
                <span className="font-bold text-[#0F0C3B]">48 / 60 d</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-indigo-800 block">PRO PERKS PREVIEW</span>
            <p className="text-[11px] text-indigo-950 font-medium">
              Instant 24-hr escrow release • Top-3 featured placement for Chicago DJ inquiries.
            </p>
            <Link href="/vendor/levels" className="text-[11px] font-bold text-brand-primary hover:underline block pt-1">
              View level details →
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Orders & New Job Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0F0C3B] text-base">Active Orders</h3>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">3</span>
            </div>
            <Link href="/vendor/orders" className="text-xs font-bold text-brand-primary hover:underline">
              View all orders →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {/* Order 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#0F0C3B]">Sarah Jenkins</h4>
                  <span className="text-[10px] text-slate-400">#JB-20455</span>
                </div>
                <p className="text-[11px] text-slate-500">Wedding Reception DJ &amp; Sound (4 hrs)</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    Due in 2 days
                  </span>
                  <span className="text-[10px] text-slate-400">Event: Oct 02, 2026</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-[#0F0C3B] block">$550.00</span>
                <Link
                  href="/vendor/orders"
                  className="px-3 py-1 rounded bg-[#0F0C3B] text-white text-[10px] font-bold hover:bg-[#18124E] transition-colors mt-1 inline-block"
                >
                  Open
                </Link>
              </div>
            </div>

            {/* Order 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#0F0C3B]">David &amp; Alicia Vance</h4>
                  <span className="text-[10px] text-slate-400">#JB-20489</span>
                </div>
                <p className="text-[11px] text-slate-500">Anniversary Party Emcee &amp; Uplighting</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    Due in 5 days
                  </span>
                  <span className="text-[10px] text-slate-400">Event: Oct 05, 2026</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-[#0F0C3B] block">$350.00</span>
                <Link
                  href="/vendor/orders"
                  className="px-3 py-1 rounded bg-[#0F0C3B] text-white text-[10px] font-bold hover:bg-[#18124E] transition-colors mt-1 inline-block"
                >
                  Open
                </Link>
              </div>
            </div>

            {/* Order 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#0F0C3B]">Marcus Taylor</h4>
                  <span className="text-[10px] text-slate-400">#JB-20512</span>
                </div>
                <p className="text-[11px] text-slate-500">Emma&apos;s 5th Birthday Ophir - DJ &amp; Games</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                    Milestone 1 Funded
                  </span>
                  <span className="text-[10px] text-slate-400">Event: Oct 12, 2026</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-[#0F0C3B] block">$250.00</span>
                <Link
                  href="/vendor/orders"
                  className="px-3 py-1 rounded bg-[#0F0C3B] text-white text-[10px] font-bold hover:bg-[#18124E] transition-colors mt-1 inline-block"
                >
                  Open
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* New Job Matches Feed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0F0C3B] text-base">New Job Matches</h3>
              <p className="text-[11px] text-slate-400">📍 Chicago, IL • 50mi radius</p>
            </div>
            <Link href="/vendor/find-jobs" className="text-xs font-bold text-brand-primary hover:underline">
              Find more jobs →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {/* Match 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#0F0C3B]">DJ and Emcee for 5th birthday party</h4>
                  <p className="text-[11px] text-slate-500">Chicago, IL • Nov 14, 2026</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  2 credits
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Client Budget</span>
                  <span className="font-extrabold text-[#0F0C3B]">$600 – $1,200</span>
                </div>
                <button
                  onClick={() => handleOpenSendOffer("DJ and Emcee for 5th birthday party", "$600 – $1,200")}
                  className="px-4 py-1.5 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Send offer
                </button>
              </div>
            </div>

            {/* Match 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#0F0C3B]">Wedding DJ with wireless mic setup</h4>
                  <p className="text-[11px] text-slate-500">Naperville, IL • Oct 24, 2026</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  2 credits
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Client Budget</span>
                  <span className="font-extrabold text-[#0F0C3B]">$800 – $1,500</span>
                </div>
                <button
                  onClick={() => handleOpenSendOffer("Wedding DJ with wireless mic setup", "$800 – $1,500")}
                  className="px-4 py-1.5 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Send offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Bid Credits & Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bid Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" /> Bid Credits
            </h4>
          </div>

          <div className="my-3 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-slate-200 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-[#0F0C3B]">16</span>
              <span className="text-[9px] text-slate-400 font-bold">OF 25 LEFT</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Renews 10/01/2026 (9 days)</p>
          </div>

          <Link
            href="/vendor/bid-credits"
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] font-bold text-xs transition-colors"
          >
            Buy more credits
          </Link>
        </div>

        {/* Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs md:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
              <span>📊 Platform Performance SLA</span>
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Pro Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Response rate</span>
                <span className="font-bold text-[#0F0C3B]">92% (Target: ≥90%)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[92%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>On-time delivery</span>
                <span className="font-bold text-[#0F0C3B]">96% (Target: ≥95%)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[96%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Average rating</span>
                <span className="font-bold text-[#0F0C3B]">4.9 ★ (Target: ≥4.8)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[98%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Order completion</span>
                <span className="font-bold text-[#0F0C3B]">100% (Target: ≥95%)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[100%]" />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-2 mt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>All 4 metrics currently meet Pro Vendor tier requirements.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
