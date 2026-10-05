"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  CalendarCheck,
  PackageCheck,
  CheckCircle2,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Scale,
} from "lucide-react";

export default function EscrowRoadmap() {
  const steps = [
    {
      num: "STEP 01",
      title: "Paid & Held",
      desc: "Funds locked in FDIC-insured vault. Vendor is alerted that milestone is secured.",
      icon: Lock,
      color: "bg-purple-100 text-purple-700",
    },
    {
      num: "STEP 02",
      title: "In Progress",
      desc: "Vendor arrives, sets up, and executes event deliverables per contract.",
      icon: CalendarCheck,
      color: "bg-amber-100 text-amber-700",
    },
    {
      num: "STEP 03",
      title: "Delivered",
      desc: "Final media files, raw photos, or catering wrap-up submitted for review.",
      icon: PackageCheck,
      color: "bg-blue-100 text-blue-700",
    },
    {
      num: "STEP 04",
      title: "Client Sign–Off",
      desc: "You inspect and approve the completed service. Request revisions if needed.",
      icon: CheckCircle2,
      color: "bg-orange-100 text-orange-700",
    },
    {
      num: "STEP 05",
      title: "Funds Released",
      desc: "Ophir Reserve immediately disburses 100% of vendor fee. Zero late payment disputes.",
      icon: Banknote,
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-white border-y border-[#EAE6DF]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3730A3]" />
            <span>Utsob Escrow Vault Protocol</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
            How your money stays 100% safe
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Unlike traditional vendor hiring where cash or unbacked deposits carry full risk, Ophir Reserve locks funds in a segregated, FDIC-insured trust account until you sign off.
          </p>
        </div>

        {/* 5-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#FAF9F6] rounded-2xl p-5 sm:p-6 border border-[#EAE6DF] hover:border-gold-400 hover:shadow-luxury transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center shadow-2xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-obsidian">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE6DF]/60 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Vault Guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1228] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-luxury">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">
                Independent Mediation Council
              </h4>
              <p className="text-xs text-slate-300">
                Full money-back refund guarantee if a creator fails to show or breaches contracted terms.
              </p>
            </div>
          </div>

          <Link
            href="/help-center"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Read Escrow Terms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
