"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Heart, Award } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-10 lg:py-16 space-y-16 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#1A1D24] text-[#DFB76C] text-xs font-bold uppercase tracking-widest border border-[#DFB76C]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR MISSION & ETHOS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15]">
            We help families celebrate without financial friction.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
            Weddings, galas, and cultural milestones represent the emotional pinnacle of family life. We built Ophir Reserve to ensure every dollar is protected and every vendor is celebrated.
          </p>
        </div>
      </section>

      {/* Big Visual Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 relative h-[420px] rounded-none overflow-hidden shadow-2xl border border-[#26282E] bg-[#121418]">
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
              alt="Cultural Gathering"
              fill
              className="object-cover filter brightness-85"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Rooted in tradition. Engineered for modern trust.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              For decades, multi-day celebrations—from South Asian Sangeets and Mexican Quinceañeras to traditional American banquets—have relied on word-of-mouth recommendations and vulnerable cash envelopes.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              Ophir Reserve combines high-touch hospitality concierge with institutional fintech escrow. Both hosts and creators enjoy absolute peace of mind from first booking to final photo delivery.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#121418] rounded-none border border-[#26282E]">
                <span className="font-serif text-2xl font-light text-[#DFB76C] block">18,400+</span>
                <span className="text-xs text-slate-400">Celebrations</span>
              </div>
              <div className="p-4 bg-[#121418] rounded-none border border-[#26282E]">
                <span className="font-serif text-2xl font-light text-emerald-400 block">$48M+</span>
                <span className="text-xs text-slate-400">Vault Secured</span>
              </div>
              <div className="p-4 bg-[#121418] rounded-none border border-[#26282E]">
                <span className="font-serif text-2xl font-light text-white block">50 States</span>
                <span className="text-xs text-slate-400">Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[#121418] rounded-none border border-[#26282E] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-light text-lg text-white">Radical Transparency</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              No hidden fees, no pay-to-play listings, and zero surprises. Flat 5% platform fees for clients and 0% deductions for creators.
            </p>
          </div>

          <div className="p-8 bg-[#121418] rounded-none border border-[#26282E] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1D24] border border-[#26282E] text-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-light text-lg text-white">Cultural Authenticity</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              We honor the diverse rituals, food requirements, and multi-generational needs of all cultural celebration heritages.
            </p>
          </div>

          <div className="p-8 bg-[#121418] rounded-none border border-[#26282E] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-light text-lg text-white">Vendor Meritocracy</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Creators advance through verified on-time deliveries and authentic customer sign-offs, creating real trust in the marketplace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
