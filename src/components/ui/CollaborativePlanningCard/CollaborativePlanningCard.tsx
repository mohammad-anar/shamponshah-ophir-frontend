"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ThumbsUp,
  ThumbsDown,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  PlayCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function CollaborativePlanningCard() {
  const [upvotes, setUpvotes] = useState({
    cinema: 4,
    floral: 3,
  });
  const [hasVoted, setHasVoted] = useState({
    cinema: true,
    floral: true,
  });

  const [fundedAmount, setFundedAmount] = useState(3400);
  const totalTarget = 4250;
  const fundedPercent = Math.min(100, Math.round((fundedAmount / totalTarget) * 100));

  const handleVote = (type: "cinema" | "floral") => {
    if (hasVoted[type]) {
      setUpvotes((prev) => ({ ...prev, [type]: prev[type] - 1 }));
      setHasVoted((prev) => ({ ...prev, [type]: false }));
      toast.info("Vote removed");
    } else {
      setUpvotes((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      setHasVoted((prev) => ({ ...prev, [type]: true }));
      toast.success("Family vote recorded!");
    }
  };

  const handleFundEscrow = () => {
    setFundedAmount(totalTarget);
    toast.success("Escrow target 100% funded and locked into Vault!");
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-[#FAF9F6] to-[#F3EFE8]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Descriptive Story & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Created for Modern Celebrations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight leading-[1.15]">
              Plan together. <br className="hidden sm:inline" />
              Pay together.
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              No more chaotic group texts, lost attachments, or awkward spreadsheets. Invite parents, spouses, and wedding parties to collaborate seamlessly.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-obsidian">
                    Collaborative Shared Board
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Pin favorite vendors, video samples, and floral menus into one cohesive interactive space.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-obsidian">
                    Democratic Upvotes & Consensus
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Family members vote 👍 or 👎 on shortlisted vendors before any binding contracts are signed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-obsidian">
                    Split Vault Payments
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Family members pledge and fund custom shares directly into the escrow pool with itemized receipts.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/register/select-role"
                className="px-6 py-3.5 bg-[#0F1228] hover:bg-[#1A1F40] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Start a Family Board</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => toast.info("Opening 2-Minute Guided Interactive Overview...")}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 border border-[#E2DDD3] text-slate-800 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-amber-600" />
                <span>Watch 2-Min Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Shared Workspace Card */}
          <div className="lg:col-span-6">
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-luxury-lg border border-[#EAE6DF] space-y-6">
              {/* Workspace Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE6DF]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    SHARED WORKSPACE
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-obsidian">
                    The Johnson Family Wedding Hub
                  </h3>
                  <span className="text-xs text-slate-500">Austin, TX • Oct 18, 2025</span>
                </div>

                {/* Family Avatars */}
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#0F1228] text-white font-bold text-xs flex items-center justify-center">
                    M
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                    D
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                    E
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    +2
                  </div>
                </div>
              </div>

              {/* Shortlisted Vendors List */}
              <div className="space-y-3">
                {/* Vendor 1 */}
                <div className="p-4 rounded-2xl bg-[#F9F8F5] border border-[#EAE6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:border-gold-400">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-xs flex-shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200&auto=format&fit=crop"
                        alt="Lumina Cinema Studios"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-obsidian">
                        Lumina Cinema Studios
                      </h4>
                      <p className="text-xs text-slate-500">Lead Cinematographer • $2,450</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleVote("cinema")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{upvotes.cinema} of 4 Approved</span>
                    </button>
                  </div>
                </div>

                {/* Vendor 2 */}
                <div className="p-4 rounded-2xl bg-[#F9F8F5] border border-[#EAE6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:border-gold-400">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-xs flex-shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop"
                        alt="Velvet & Bloom Design"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-obsidian">
                        Velvet & Bloom Design
                      </h4>
                      <p className="text-xs text-slate-500">Floral Mandap Package • $1,800</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleVote("floral")}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>{upvotes.floral} of 4 Voted</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Escrow Pool Target Progress */}
              <div className="p-5 rounded-2xl bg-[#0F1228] text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-300 uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>ESCROW POOL TARGET</span>
                  </div>
                  <span className="font-serif font-bold text-lg text-gold-300">
                    ${totalTarget.toLocaleString()} Total
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${fundedPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>${fundedAmount.toLocaleString()} funded by 3 family members</span>
                  <span className="font-bold text-gold-400">{fundedPercent}% funded</span>
                </div>

                {/* Fund CTA */}
                <button
                  type="button"
                  onClick={handleFundEscrow}
                  className="w-full h-11 mt-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 active:scale-99 text-obsidian font-bold text-xs rounded-xl shadow-gold-glow-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {fundedPercent === 100
                      ? "Escrow Target 100% Locked in Vault"
                      : `Fund & Lock ($${fundedAmount.toLocaleString()} into Escrow)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
