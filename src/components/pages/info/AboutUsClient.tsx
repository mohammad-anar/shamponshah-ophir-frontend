"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Heart, Award } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 lg:py-16 space-y-16">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR MISSION & ETHOS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-obsidian tracking-tight leading-[1.15]">
            We help families celebrate without financial friction.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Weddings, galas, and cultural milestones represent the emotional pinnacle of family life. We built Ophir Reserve to ensure every dollar is protected and every artisan is celebrated.
          </p>
        </div>
      </section>

      {/* Big Visual Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 relative h-[420px] rounded-3xl overflow-hidden shadow-luxury border border-[#EAE6DF]">
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
              alt="Cultural Gathering"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
              Rooted in tradition. Engineered for modern trust.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              For decades, multi-day celebrations—from South Asian Sangeets and Mexican Quinceañeras to traditional American banquets—have relied on word-of-mouth recommendations and vulnerable cash envelopes.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ophir Reserve combines high-touch hospitality concierge with institutional fintech escrow. Both hosts and creators enjoy absolute peace of mind from first booking to final photo delivery.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-[#EAE6DF]">
                <span className="font-serif text-2xl font-bold text-obsidian block">18,400+</span>
                <span className="text-xs text-slate-500">Celebrations</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#EAE6DF]">
                <span className="font-serif text-2xl font-bold text-emerald-600 block">$48M+</span>
                <span className="text-xs text-slate-500">Vault Secured</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#EAE6DF]">
                <span className="font-serif text-2xl font-bold text-amber-600 block">50 States</span>
                <span className="text-xs text-slate-500">Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-obsidian">Radical Transparency</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No hidden fees, no pay-to-play listings, and zero surprises. Flat 5% platform fees for clients and 0% deductions for creators.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-obsidian">Cultural Authenticity</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We honor the diverse rituals, food requirements, and multi-generational needs of all cultural celebration heritages.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-obsidian">Artisan Meritocracy</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Creators advance through verified on-time deliveries and authentic customer sign-offs, creating real trust in the marketplace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
