"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  ChevronRight, 
  Plus, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import CompareOffersModal from "@/components/user/CompareOffersModal";

export default function UserJobsPage() {
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      <CompareOffersModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">My Open Jobs &amp; RFPs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare received artisan proposals, review equipment checklists, and accept contracts into escrow
          </p>
        </div>

        <Link
          href="/user/post-job"
          className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" /> Post Another Job
        </Link>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {/* Job 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  5 New Offers
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Bidding closes in 48 hours
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F0C3B] mt-1.5">
                High-Energy DJ &amp; Emcee for Emma&apos;s 5th Birthday Party
              </h3>
              <p className="text-slate-500 mt-0.5">
                Target: Nov 14, 2026 • Lincoln Park, Chicago • 40 guests
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
              <span className="text-lg font-extrabold text-[#0F0C3B]">$400 - $600</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs border-2 border-white">
                  SC
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs border-2 border-white">
                  WC
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs border-2 border-white">
                  PP
                </div>
              </div>
              <div>
                <span className="font-bold text-[#0F0C3B] block">3 Top-Rated Candidates Recommended</span>
                <span className="text-[11px] text-slate-500">Windy City Sound ($850), Party Pulse ($720), Spin City ($1,150)</span>
              </div>
            </div>

            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Compare Offers Side-by-Side</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Job 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  3 New Offers
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Bidding closes in 5 days
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F0C3B] mt-1.5">
                Catering &amp; Finger Foods for 40 Guests (Kids &amp; Parents)
              </h3>
              <p className="text-slate-500 mt-0.5">
                Target: Nov 14, 2026 • Lincoln Park, Chicago • 40 guests
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
              <span className="text-lg font-extrabold text-[#0F0C3B]">$800 - $1,200</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-600 font-medium">3 proposals received from local licensed caterers</span>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0F0C3B] font-bold text-xs transition-colors shadow-xs"
            >
              Review Proposals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
