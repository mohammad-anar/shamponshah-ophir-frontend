"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import EscrowRoadmap from "@/components/ui/EscrowRoadmap/EscrowRoadmap";
import FaqAccordion from "@/components/ui/FaqAccordion/FaqAccordion";

export default function HowItWorksPage() {
  return (
    <div className="w-full bg-background text-foreground min-h-screen py-10 lg:py-16 space-y-16 font-sans selection:bg-brand selection:text-on-brand">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface text-brand border border-border-brand/40 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span>FINANCIAL INTEGRITY & ESCROW PROTOCOL</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
          How Ophir Reserve Works
        </h1>

        <p className="text-foreground-muted text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-light">
          We replaced chaotic wire transfers and awkward wedding deposits with an institutional-grade, milestone-based escrow infrastructure.
        </p>
      </section>

      {/* Escrow Roadmap */}
      <EscrowRoadmap />

      {/* 3 Core Pillars */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-surface border border-border space-y-4">
            <span className="font-serif text-3xl font-light text-brand">01</span>
            <h3 className="font-serif font-light text-xl text-foreground">Contract Lock</h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed font-light">
              Every deliverable—from hour count to raw footage delivery—is codified in a legally binding, milestone-linked agreement.
            </p>
          </div>

          <div className="p-8 bg-surface border border-border space-y-4">
            <span className="font-serif text-3xl font-light text-brand">02</span>
            <h3 className="font-serif font-light text-xl text-foreground">Segregated Trust Vault</h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed font-light">
              Your deposit is held in an FDIC-insured trust account, completely protected from marketplace insolvency or unauthorized withdrawal.
            </p>
          </div>

          <div className="p-8 bg-surface border border-border space-y-4">
            <span className="font-serif text-3xl font-light text-brand">03</span>
            <h3 className="font-serif font-light text-xl text-foreground">One-Tap Sign-Off</h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed font-light">
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
