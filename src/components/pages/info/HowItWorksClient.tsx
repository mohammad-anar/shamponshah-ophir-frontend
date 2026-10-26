"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import EscrowRoadmap from "@/components/ui/EscrowRoadmap/EscrowRoadmap";
import FaqAccordion from "@/components/ui/FaqAccordion/FaqAccordion";

export default function HowItWorksPage() {
  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-10 lg:py-16 space-y-16 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#121418] text-[#DFB76C] border border-[#DFB76C]/30 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span>FINANCIAL INTEGRITY & ESCROW PROTOCOL</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
          How Ophir Reserve Works
        </h1>

        <p className="text-[#CBD5E1] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-light">
          We replaced chaotic wire transfers and awkward wedding deposits with an institutional-grade, milestone-based escrow infrastructure.
        </p>
      </section>

      {/* Escrow Roadmap */}
      <EscrowRoadmap />

      {/* 3 Core Pillars */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#121418] border border-[#26282E] space-y-4">
            <span className="font-serif text-3xl font-light text-[#DFB76C]">01</span>
            <h3 className="font-serif font-light text-xl text-white">Contract Lock</h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-light">
              Every deliverable—from hour count to raw footage delivery—is codified in a legally binding, milestone-linked agreement.
            </p>
          </div>

          <div className="p-8 bg-[#121418] border border-[#26282E] space-y-4">
            <span className="font-serif text-3xl font-light text-[#DFB76C]">02</span>
            <h3 className="font-serif font-light text-xl text-white">Segregated Trust Vault</h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-light">
              Your deposit is held in an FDIC-insured trust account, completely protected from marketplace insolvency or unauthorized withdrawal.
            </p>
          </div>

          <div className="p-8 bg-[#121418] border border-[#26282E] space-y-4">
            <span className="font-serif text-3xl font-light text-[#DFB76C]">03</span>
            <h3 className="font-serif font-light text-xl text-white">One-Tap Sign-Off</h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-light">
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
