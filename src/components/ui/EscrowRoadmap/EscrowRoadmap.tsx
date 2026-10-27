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
      num: "01",
      title: "Paid & Held",
      desc: "Funds locked in FDIC-insured trust vaults. Artisan is verified and milestone is secured.",
      icon: Lock,
    },
    {
      num: "02",
      title: "Execution",
      desc: "Master artisan arrives, setups scenography, and executes ceremonial deliverables.",
      icon: CalendarCheck,
    },
    {
      num: "03",
      title: "Delivery",
      desc: "Final deliverables, raw assets, or banquet sign-offs are submitted for inspection.",
      icon: PackageCheck,
    },
    {
      num: "04",
      title: "Client Approval",
      desc: "You review and sign off on completed services with complete autonomy and peace of mind.",
      icon: CheckCircle2,
    },
    {
      num: "05",
      title: "Funds Released",
      desc: "Ophir Reserve releases 100% of fees to artisan. Zero disputes, zero transaction friction.",
      icon: Banknote,
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-background border-y border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-brand border border-border-brand/40 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-brand" />
            <span>Ophir Escrow Vault Protocol</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
            How Your Investment Remains 100% Safe
          </h2>

          <p className="text-foreground-muted text-sm sm:text-base leading-relaxed font-light">
            Unlike legacy unbacked deposits, Ophir Reserve locks contracted funds in segregated, FDIC-insured depository accounts released strictly upon your sign-off.
          </p>
        </div>

        {/* 5-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-surface p-5 sm:p-6 border border-border hover:border-border-brand/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-surface-elevated border border-border text-brand flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <span className="text-[11px] font-bold text-brand tracking-widest uppercase">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-serif font-light text-base sm:text-lg text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-xs text-foreground-muted leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border text-[10px] font-semibold text-success flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  <span>Vault Guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Strip */}
        <div className="p-5 bg-surface border border-border text-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-elevated text-brand border border-border flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-light text-base text-foreground">
                Independent Mediation Council
              </h4>
              <p className="text-xs text-foreground-muted font-light">
                Full 100% money-back escrow refund guarantee if an artisan fails to perform contracted milestone services.
              </p>
            </div>
          </div>

          <Link
            href="/help-center"
            className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-md"
          >
            <span>Read Escrow Terms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
