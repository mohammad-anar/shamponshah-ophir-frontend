"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import EscrowRoadmap from "@/components/ui/EscrowRoadmap/EscrowRoadmap";
import FaqAccordion from "@/components/ui/FaqAccordion/FaqAccordion";

export default function HowItWorksPage() {
  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 lg:py-16 space-y-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FINANCIAL INTEGRITY & ESCROW PROTOCOL</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-obsidian tracking-tight">
          How Ophir Reserve Works
        </h1>

        <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
          We replaced chaotic wire transfers and awkward wedding deposits with a military-grade, milestone-based escrow infrastructure.
        </p>
      </section>

      {/* Escrow Roadmap */}
      <EscrowRoadmap />

      {/* 3 Core Pillars */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-gold-500">01</span>
            <h3 className="font-serif font-bold text-xl text-obsidian">Contract Lock</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every deliverable—from hour count to raw footage delivery—is codified in a legally binding, milestone-linked agreement.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-gold-500">02</span>
            <h3 className="font-serif font-bold text-xl text-obsidian">Segregated Trust Vault</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your deposit is held in an FDIC-insured trust account, completely protected from marketplace insolvency or unauthorized withdrawal.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-gold-500">03</span>
            <h3 className="font-serif font-bold text-xl text-obsidian">One-Tap Sign-Off</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You inspect the work on event day or upon media delivery and authorize payouts with full autonomy and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqAccordion />
    </div>
  );
}
