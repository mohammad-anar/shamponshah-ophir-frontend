"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetFaqsQuery } from "@/redux/service/contact/contactApi";

export default function FaqAccordion() {
  const { data: faqsData, isLoading } = useGetFaqsQuery();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const liveCategories = faqsData?.data || faqsData;
  const liveFaqs = Array.isArray(liveCategories)
    ? liveCategories.flatMap((c: any) => c.questions || [])
    : [];

  const displayFaqs = liveFaqs;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
            GOVERNANCE & PROTOCOLS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground-muted text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about milestone escrow security, vendor vetting, and collaborative planning.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {displayFaqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface border border-border overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-surface-sunken transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base sm:text-lg text-foreground font-light">
                    {faq.q}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 bg-surface-elevated border border-border flex items-center justify-center text-brand transition-transform duration-200 flex-shrink-0",
                      isOpen && "rotate-180 bg-brand text-on-brand"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-foreground-muted leading-relaxed border-t border-border pt-4 font-light animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
