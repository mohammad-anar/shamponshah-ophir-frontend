"use client";

import React, { useState } from "react";
import { Search, HelpCircle, FileText, ArrowRight } from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion/FaqAccordion";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Escrow Vault & Payouts",
      desc: "How deposits are locked, milestone release protocols, and FDIC insurance.",
      articles: 14,
    },
    {
      title: "Client & Family Hub",
      desc: "Inviting family members, democratic upvoting, and splitting payments.",
      articles: 9,
    },
    {
      title: "Vendor Vetting & Badges",
      desc: "Artisan verification steps, guild tiers, background audits, and portfolio checks.",
      articles: 12,
    },
    {
      title: "Dispute Mediation & Refunds",
      desc: "Cancellation policies, non-appearance protection, and Mediation Council rulings.",
      articles: 8,
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 lg:py-16 space-y-16">
      {/* Search Hero */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>OPHIR RESERVE KNOWLEDGE BASE</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-obsidian tracking-tight">
          Help Center & Escrow Governance
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Search articles, understand milestone payment safeguards, or contact our 24/7 concierge support desk.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. 'How do milestone releases work?')..."
            className="w-full h-14 pl-12 pr-4 bg-white text-obsidian rounded-2xl border border-[#EAE6DF] shadow-luxury focus:border-gold-500 focus:outline-none text-sm"
          />
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs hover:border-gold-400 hover:shadow-luxury transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] flex items-center justify-center text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-obsidian">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-2 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>{cat.articles} articles</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Component */}
      <FaqAccordion />
    </div>
  );
}
