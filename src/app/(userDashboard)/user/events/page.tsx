"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Users2, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserEventsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">My Milestone Events</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your celebration timelines, collaborative guest lists, and vendor contracts
          </p>
        </div>

        <Link
          href="/user/post-job"
          className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" /> Plan New Celebration
        </Link>
      </div>

      {/* Primary Hero Event */}
      <div className="bg-[#18124E] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[#0F0C3B] text-[10px] font-extrabold uppercase">
                Active Celebration
              </span>
              <span className="text-xs text-indigo-200">54 days remaining</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Emma&apos;s 5th Birthday Gala
            </h2>
            <p className="text-xs text-indigo-200">
              Carnival Fairytale Theme • Lincoln Park Conservatory, Chicago, IL
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs text-indigo-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Event Date</span>
                <span className="font-bold text-white">Nov 14, 2026</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Services Booked</span>
                <span className="font-bold text-amber-300">3 of 5 (60%)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Escrow Protected</span>
                <span className="font-bold text-emerald-300">$1,480.00</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[180px]">
            <Link
              href="/user/jobs"
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0F0C3B] text-xs font-bold text-center transition-colors shadow-sm"
            >
              Review Open Offers (5)
            </Link>
            <Link
              href="/user/family-hub"
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center transition-colors"
            >
              Open Family Board
            </Link>
          </div>
        </div>
      </div>

      {/* Past / Draft Events Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-[#0F0C3B] text-base">Other Celebrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Past Event • Oct 2025</span>
              <h4 className="font-bold text-[#0F0C3B] text-sm mt-0.5">Carter Family 10th Anniversary</h4>
              <p className="text-slate-500 mt-1">4 Artisans Hired • 100% Escrow Released</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50">
              View Recap
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase">Draft • Summer 2027</span>
              <h4 className="font-bold text-[#0F0C3B] text-sm mt-0.5">Lake Geneva Weekend Retreat</h4>
              <p className="text-slate-500 mt-1">Collaborative planning in Family Hub</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-indigo-50 text-brand-primary font-bold hover:bg-indigo-100">
              Resume Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
