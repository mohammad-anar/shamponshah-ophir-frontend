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
  DollarSign,
  ChevronRight,
  ArrowRight,
  Star,
  MessageSquare,
  Sparkles,
  Lock,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import CompareOffersModal from "@/components/user/CompareOffersModal";
import OrderDetailDrawer from "@/components/user/OrderDetailDrawer";

export default function ClientDashboardOverview() {
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleOpenOrder = (orderData: any) => {
    setSelectedOrder(orderData);
    setOrderDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Modals & Drawers */}
      <CompareOffersModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      <OrderDetailDrawer
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        order={selectedOrder}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            DASHBOARD • CELEBRATION COMMAND
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F0C3B] mt-1">
            Good morning, Emily
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your event is <strong className="text-[#0F0C3B]">54 days away</strong>. All milestone payments are safeguarded in escrow.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/user/events"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F0C3B] hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            <span>Timeline View</span>
          </Link>
          <Link
            href="/user/post-job"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0F0C3B] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F0C3B]" />
            <span>Post a Job</span>
          </Link>
        </div>
      </div>

      {/* Hero: Primary Upcoming Celebration & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Emma's 5th Birthday Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#18124E] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Background sparkles decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Primary Upcoming Celebration
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[#0F0C3B] text-[10px] font-extrabold shadow-xs">
                54 days to go
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Emma&apos;s 5th Birthday
            </h2>
            <p className="text-xs text-indigo-200 mt-1">
              Carnival Fairytale Theme • 40 Family &amp; Friends
            </p>

            <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-white/10 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-100">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>11/14/2026</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-100 truncate">
                <span>📍 Chicago (Lincoln Park)</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-100">
                <Users2 className="w-3.5 h-3.5 text-amber-300" />
                <span>40 guests</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200 text-[11px] font-medium">Service booking progress</span>
                <span className="font-bold text-amber-300">3 of 5 services booked (60%)</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[60%]" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Link
                href="/user/events"
                className="px-4 py-2 rounded-xl bg-white text-[#0F0C3B] font-bold hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Open event</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button className="text-indigo-200 hover:text-white font-semibold transition-colors">
                Manage invites
              </button>
            </div>
            <span className="text-indigo-300 text-[11px]">Est. budget: <strong>$3,500</strong></span>
          </div>
        </div>

        {/* Next Steps Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                <h3 className="font-bold text-[#0F0C3B] text-sm">Next steps</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                3 need attention
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Task 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    🎵
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F0C3B]">Review 5 new offers on Birthday DJ</h4>
                    <p className="text-[10px] text-slate-500">Received today • $400-$600 range</p>
                  </div>
                </div>
                <button
                  onClick={() => setCompareModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-[11px] transition-colors shadow-xs"
                >
                  Review
                </button>
              </div>

              {/* Task 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    🎂
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F0C3B]">Approve delivery for Decor milestone 2</h4>
                    <p className="text-[10px] text-slate-500">Milestone 2 ready • $425 release</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenOrder({
                    id: "JB-20448",
                    vendorName: "Bloom Studio Chicago",
                    serviceTitle: "Pastel Balloon Arch & Floral Milestone",
                    totalAmount: "$850.00",
                    eventDate: "Nov 14, 2026",
                    location: "Lincoln Park Conservatory",
                    milestones: [
                      { name: "Deposit (50%)", amount: "$425.00", status: "PAID" },
                      { name: "Final Delivery (50%)", amount: "$425.00", status: "PENDING" },
                    ]
                  })}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                >
                  Approve
                </button>
              </div>

              {/* Task 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F0C3B]">Complete your event details</h4>
                    <p className="text-[10px] text-slate-500">Venue address needed for dispatch</p>
                  </div>
                </div>
                <Link
                  href="/user/events"
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-100 transition-colors"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Escrow Auto-Protection Active
            </span>
            <Link href="/user/events" className="font-semibold text-brand-primary hover:underline">
              View All Tasks (7)
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Orders & Open Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders (3) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F0C3B] text-base">Active Orders</h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">3</span>
              </div>
              <Link href="/user/orders" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                View all orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Live contracts backed by Ophir Escrow Vault</p>

            <div className="space-y-3 text-xs">
              {/* Order 1 */}
              <div
                onClick={() => handleOpenOrder({
                  id: "JB-20455",
                  vendorName: "Bloom Studio Chicago",
                  serviceTitle: "Floral & Pastel Balloon Arch",
                  totalAmount: "$850.00",
                  eventDate: "Nov 14, 2026",
                  location: "Lincoln Park Conservatory",
                  milestones: [
                    { name: "Design Concept Approval", amount: "$280.00", status: "PAID" },
                    { name: "Floral Sourcing", amount: "$285.00", status: "PAID" },
                    { name: "On-site Installation", amount: "$285.00", status: "PENDING" },
                  ]
                })}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer bg-[#F8F9FD]/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    🌸
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F0C3B]">Decor by Bloom</h4>
                    <p className="text-[11px] text-slate-500">Floral &amp; Pastel Balloon Arch • Bloom Studio Chicago</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Escrow Milestone 3/5:</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#0F0C3B] block">$850</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    In Delivery
                  </span>
                </div>
              </div>

              {/* Order 2 */}
              <div
                onClick={() => handleOpenOrder({
                  id: "JB-20448",
                  vendorName: "Amina Rahman",
                  serviceTitle: "Photography & Reel Coverage",
                  totalAmount: "$1,200.00",
                  eventDate: "Nov 14, 2026",
                  location: "Lincoln Park",
                  milestones: [
                    { name: "Initial Retainer", amount: "$300.00", status: "PAID" },
                    { name: "Shot List Confirmation", amount: "$300.00", status: "PAID" },
                    { name: "Event Coverage", amount: "$300.00", status: "PAID" },
                    { name: "Edited Gallery & Reels", amount: "$300.00", status: "PENDING" },
                  ]
                })}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer bg-[#F8F9FD]/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    📷
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F0C3B]">Golden Hour Visuals</h4>
                    <p className="text-[11px] text-slate-500">Photography &amp; Reel Coverage • Amina Rahman</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Escrow Milestone 4/5:</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#0F0C3B] block">$1,200</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    Escrow Locked
                  </span>
                </div>
              </div>

              {/* Order 3 */}
              <div
                onClick={() => handleOpenOrder({
                  id: "JB-20432",
                  vendorName: "Chef Marcus",
                  serviceTitle: "Custom 2-Tier Birthday Cake",
                  totalAmount: "$350.00",
                  eventDate: "Nov 14, 2026",
                  location: "Lincoln Park",
                  milestones: [
                    { name: "Design Finalized", amount: "$175.00", status: "PAID" },
                    { name: "Delivery & Setup", amount: "$175.00", status: "PENDING" },
                  ]
                })}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer bg-[#F8F9FD]/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    🎂
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F0C3B]">Sweet Delights Bakery</h4>
                    <p className="text-[11px] text-slate-500">Custom 2-Tier Birthday Cake • Chef Marcus</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Escrow Milestone 2/5:</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#0F0C3B] block">$350</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Order Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Open Jobs (2 active) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F0C3B] text-base">My Open Jobs</h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">2 active</span>
              </div>
              <Link
                href="/user/post-job"
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-brand-primary font-bold text-xs transition-colors flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> New Job
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Vendors actively pitching customized proposals</p>

            <div className="space-y-3 text-xs">
              {/* Job 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        5 New Offers
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 48h left
                      </span>
                    </div>
                    <h4 className="font-bold text-[#0F0C3B] text-sm mt-1">Kids Birthday DJ &amp; Interactive Games</h4>
                    <p className="text-[11px] text-slate-500">Emma&apos;s 5th • Est. 3 hours sound, kid dances &amp; bubble machine</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
                    <span className="text-base font-extrabold text-[#0F0C3B]">$400 - $600</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">D</div>
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">M</div>
                    <div className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">+3</div>
                  </div>

                  <button
                    onClick={() => setCompareModalOpen(true)}
                    className="px-4 py-1.5 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>View 5 Offers</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Job 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        3 New Offers
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 5 days left
                      </span>
                    </div>
                    <h4 className="font-bold text-[#0F0C3B] text-sm mt-1">Catering &amp; Finger Foods for 40 Guests</h4>
                    <p className="text-[11px] text-slate-500">Mini sliders, fruit platters, samosas &amp; celebration mocktails</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
                    <span className="text-base font-extrabold text-[#0F0C3B]">$800 - $1,200</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">C</div>
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">F</div>
                    <div className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">+1</div>
                  </div>

                  <button
                    onClick={() => setCompareModalOpen(true)}
                    className="px-4 py-1.5 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>View 3 Offers</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Average proposal response time: <strong>3.2 hours</strong></span>
            <Link href="/user/jobs" className="font-semibold text-brand-primary hover:underline">
              Manage all RFPs →
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Widgets Grid: Family Hub, Saved Vendors, Escrow Custody */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Family Planning Hub */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F0C3B] text-sm">Family Planning Hub</h4>
                  <p className="text-[10px] text-slate-400">Collaborative decision board</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>

            <div className="flex items-center gap-2 my-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">D</div>
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">G</div>
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">R</div>
              </div>
              <span className="text-xs text-slate-600 font-medium">3 active members</span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 text-xs text-amber-900 font-medium flex items-center gap-2">
              <span>🗳️</span>
              <span>2 new votes on DJ playlist &amp; songs</span>
            </div>
          </div>

          <Link href="/user/family-hub" className="mt-4 text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            Open Family Board <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Saved Vendors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F0C3B] text-sm">Saved Vendors</h4>
                  <p className="text-[10px] text-slate-400">Your personal shortlist</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">12 saved</span>
            </div>

            <p className="text-xs text-slate-600 my-2">12 curated artisans across Chicago ready for quick-invite or custom quotes.</p>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">Photographers (4)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">Bakers (3)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">+5 more</span>
            </div>
          </div>

          <Link href="/user/saved-vendors" className="mt-4 text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            Browse shortlist <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Escrow Balance Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F0C3B] text-sm">Ophir Escrow Vault</h4>
                  <p className="text-[10px] text-slate-400">Protected client pool</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% Protected</span>
            </div>

            <div className="my-2">
              <span className="text-2xl font-extrabold text-[#0F0C3B]">$1,480.00</span>
              <span className="text-[11px] text-slate-500 block">In Active Custody</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>Funds release only upon your milestone approval</span>
            </div>
          </div>

          <Link href="/user/payments" className="mt-4 text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            View escrow ledger <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Spending Summary & Recommended Carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recommended for Emma's Birthday (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0F0C3B] text-base flex items-center gap-1.5">
                <span>🪄 Recommended for Emma&apos;s Birthday</span>
              </h3>
              <p className="text-xs text-slate-400">Highly rated local entertainers based on your event guest count &amp; theme</p>
            </div>
            <Link href="/vendors" className="text-xs font-bold text-brand-primary hover:underline">
              View all matches →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { name: "Sparkle Smiles Face Paint", tag: "Pro Artisan", rating: "4.9", price: "$180", badge: "Hypoallergenic • 6 yrs exp" },
              { name: "Twist & Shout Balloon Art", tag: "Top Rated", rating: "5.0", price: "$210", badge: "Interactive twisting show" },
              { name: "Magic Leo Illusionist", tag: "Popular", rating: "4.9", price: "$275", badge: "45 min interactive act" },
              { name: "Retro Snap Photo Kiosk", tag: "Instant Print", rating: "4.8", price: "$320", badge: "Unlimited digital & prints" },
            ].map((artisan) => (
              <div key={artisan.name} className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FD]/60 flex flex-col justify-between space-y-3 hover:border-indigo-300 transition-all">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-100 text-indigo-800">
                    {artisan.tag}
                  </span>
                  <h4 className="font-bold text-[#0F0C3B] text-xs mt-2 line-clamp-1">{artisan.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{artisan.badge}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">FROM</span>
                    <span className="font-extrabold text-[#0F0C3B]">{artisan.price}</span>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-[#0F0C3B] text-white text-[10px] font-bold hover:bg-[#18124E] transition-colors">
                    Quick Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Summary Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#0F0C3B] text-base">Spending summary</h3>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">69% Allocated</span>
            </div>

            {/* Circular summary representation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full border-8 border-indigo-600 border-t-amber-500 border-r-purple-500 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400">Total</span>
                <span className="text-sm font-extrabold text-[#0F0C3B]">$2,400</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" /> Photo
                  </span>
                  <span className="font-bold text-[#0F0C3B]">$1,200</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Decor
                  </span>
                  <span className="font-bold text-[#0F0C3B]">$850</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Cake
                  </span>
                  <span className="font-bold text-[#0F0C3B]">$350</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-200">
                  <span className="text-slate-400">Remaining</span>
                  <span className="font-bold text-amber-600">$1,100</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/user/payments"
            className="w-full py-2 rounded-xl bg-[#0F0C3B] text-white text-xs font-bold hover:bg-[#18124E] transition-colors text-center block"
          >
            Manage Event Budget →
          </Link>
        </div>
      </div>
    </div>
  );
}
