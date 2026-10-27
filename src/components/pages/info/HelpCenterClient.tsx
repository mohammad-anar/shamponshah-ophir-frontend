"use client";

import React, { useState } from "react";
import { Search, HelpCircle, FileText, ArrowRight } from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion/FaqAccordion";
import { useGetFaqsQuery } from "@/redux/service/contact/contactApi";

export default function HelpCenterPage() {
  const { data: faqsData } = useGetFaqsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const liveCategories = faqsData?.data || faqsData || [];
  const allQuestions: { q: string; a: string; category?: string }[] = Array.isArray(liveCategories)
    ? liveCategories.flatMap((c: any) =>
        (c.questions || []).map((q: any) => ({ ...q, category: c.category }))
      )
    : [];

  const matchedQuestions = searchQuery.trim()
    ? allQuestions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
      desc: "Vendor verification steps, guild tiers, background audits, and portfolio checks.",
      articles: 12,
    },
    {
      title: "Dispute Mediation & Refunds",
      desc: "Cancellation policies, non-appearance protection, and Mediation Council rulings.",
      articles: 8,
    },
  ];

  return (
    <div className="w-full bg-background text-foreground min-h-screen py-10 lg:py-16 space-y-16 font-sans selection:bg-brand selection:text-on-brand">
      {/* Search Hero */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface text-brand border border-border-brand/40 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-brand" />
          <span>OPHIR RESERVE KNOWLEDGE BASE</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
          Help Center & Escrow Governance
        </h1>

        <p className="text-foreground-muted text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Search articles, understand milestone payment safeguards, or contact our 24/7 concierge support desk.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. 'How do milestone releases work?')..."
            className="w-full h-14 pl-12 pr-4 bg-surface text-foreground rounded-none border border-border shadow-xl focus:border-border-brand focus:outline-none text-sm placeholder:text-foreground-muted"
          />
        </div>

        {/* Live Search Results Dropdown / Card */}
        {searchQuery.trim().length > 0 && (
          <div className="max-w-2xl mx-auto bg-surface rounded-none border border-border shadow-2xl p-5 text-left space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted border-b border-border pb-2">
              <span className="font-bold text-brand">Search Results ({matchedQuestions.length})</span>
              <button onClick={() => setSearchQuery("")} className="text-foreground-muted hover:text-foreground cursor-pointer">Clear</button>
            </div>
            {matchedQuestions.length === 0 ? (
              <p className="text-xs text-foreground-muted py-3 text-center font-light">
                No exact article matches found for &ldquo;{searchQuery}&rdquo;. Try contacting our 24/7 Concierge Hospitality desk.
              </p>
            ) : (
              <div className="space-y-3 divide-y divide-border max-h-80 overflow-y-auto">
                {matchedQuestions.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-brand tracking-wider">{item.category || "General"}</span>
                    <h4 className="text-xs font-bold text-foreground">{item.q}</h4>
                    <p className="text-xs text-foreground-muted leading-relaxed font-light">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Category Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-6 bg-surface border border-border hover:border-border-brand/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 bg-surface-elevated border border-border flex items-center justify-center text-brand">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-light text-lg text-foreground">
                  {cat.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed font-light">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-2 text-xs font-semibold text-brand flex items-center justify-between border-t border-border">
                <span>{cat.articles} articles</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand" />
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
