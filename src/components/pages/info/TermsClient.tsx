"use client";

import React from "react";
import { Scale } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-10 lg:py-16 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#121418] text-[#DFB76C] border border-border-brand/40 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>LEGAL & GOVERNANCE PROTOCOL</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-light text-foreground tracking-tight">
            Terms of Service & Escrow Governance
          </h1>

          <p className="text-[#CBD5E1] text-xs sm:text-sm font-light">
            Last Updated: January 1, 2026 • Document Version 3.4
          </p>
        </div>

        <div className="bg-[#121418] p-8 sm:p-12 border border-[#26282E] space-y-8 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-light text-foreground">
              1. The Ophir Trust Vault & Milestone Escrow Protocol
            </h2>
            <p>
              Ophir Reserve Technologies Inc. operates as a technology facilitator providing segregated escrow vault services. When a client books an artisan through Ophir Reserve, 100% of contracted funds are placed into an independent FDIC-insured depository account.
            </p>
            <p>
              Funds are held under strict programmatic lock and disbursed solely according to the contracted milestone schedule:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#CBD5E1]">
              <li><strong className="text-foreground">Milestone 1 (Retainer):</strong> Locks the calendar date. Released upon agreement or held until event commencement.</li>
              <li><strong className="text-foreground">Milestone 2 (Day-of Execution):</strong> Disbursed upon verified physical presence and execution of scheduled services.</li>
              <li><strong className="text-foreground">Milestone 3 (Final Deliverable Sign-Off):</strong> Disbursed exclusively upon written client approval of raw/edited assets, media, or floral/catering wrap-up.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[#26282E] pt-6">
            <h2 className="font-serif text-lg sm:text-xl font-light text-foreground">
              2. Flat 5% Platform Concierge Fee
            </h2>
            <p>
              Clients pay a flat 5% platform fee on confirmed bookings. This fee funds our bank-grade encryption infrastructure, 24/7 concierge response teams, and Independent Mediation Council guarantees. Artisans receive 100% of their invoiced fees with zero platform commission deductions.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#26282E] pt-6">
            <h2 className="font-serif text-lg sm:text-xl font-light text-foreground">
              3. Independent Mediation Council & Dispute Resolution
            </h2>
            <p>
              In the unlikely event of an artisan non-appearance, force majeure event, or material breach of contract, our Independent Mediation Council reviews recorded contracts, timestamped communications, and evidence within 48 hours. If breach is determined, the client receives an immediate 100% escrow refund.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#26282E] pt-6">
            <h2 className="font-serif text-lg sm:text-xl font-light text-foreground">
              4. Guild Verification & Background Standards
            </h2>
            <p>
              All listed artisans maintain verified government identities, commercial general liability insurance minimums ($1M+ for high-hazard staging), and raw portfolio authenticity checks.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
