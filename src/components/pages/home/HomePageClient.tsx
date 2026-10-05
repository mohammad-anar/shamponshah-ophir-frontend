"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Lock,
  Percent,
  Headphones,
  ArrowRight,
  Star,
  CheckCircle2,
  ChevronRight,
  Award,
  Layers,
} from "lucide-react";
import { OCCASIONS, VENDORS } from "@/data/mockData";
import OccasionCard from "@/components/ui/OccasionCard/OccasionCard";
import VendorCard from "@/components/ui/VendorCard/VendorCard";
import CollaborativePlanningCard from "@/components/ui/CollaborativePlanningCard/CollaborativePlanningCard";
import EscrowRoadmap from "@/components/ui/EscrowRoadmap/EscrowRoadmap";
import FaqAccordion from "@/components/ui/FaqAccordion/FaqAccordion";
import CookieBanner from "@/components/ui/CookieBanner/CookieBanner";
import heroCollageImg from "@/assets/herosection/hero-collage.png";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();

  // Hero Search states
  const [occasionInput, setOccasionInput] = useState("Weddings & Reception");
  const [serviceInput, setServiceInput] = useState("Cinematography & Photo");
  const [dateInput, setDateInput] = useState("Oct 18, 2025");
  const [locationInput, setLocationInput] = useState("Austin, TX");

  // Two ways to hire tab
  const [hireMode, setHireMode] = useState<"browse" | "post">("browse");

  // Popular services filter tab
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredVendors = selectedCategory === "all"
    ? VENDORS
    : VENDORS.filter((v) => {
        if (selectedCategory === "cinematography") return v.category === "cinematography";
        if (selectedCategory === "floral") return v.category === "floral";
        if (selectedCategory === "music") return v.category === "music";
        if (selectedCategory === "catering") return v.category === "catering";
        return true;
      });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/vendors?occasion=${encodeURIComponent(occasionInput)}&service=${encodeURIComponent(
        serviceInput
      )}&location=${encodeURIComponent(locationInput)}`
    );
  };

  return (
    <div className="w-full bg-[#FAF9F6] text-obsidian flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-8 pb-16 lg:py-20 overflow-hidden bg-gradient-to-b from-[#F7F5EE] to-[#FAF9F6]">
        {/* Subtle Background Ambience */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 z-10">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6DF] shadow-xs text-xs font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-800">100% Escrow-Protected Marketplace</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">US Event Network</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-obsidian leading-[1.12] tracking-tight">
                Every celebration deserves the right people.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                Discover vetted caterers, cinematographers, florists, and live entertainment with guaranteed milestone escrow protection across 50 states.
              </p>

              {/* Search Widget */}
              <form
                onSubmit={handleHeroSearch}
                className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-luxury-lg border border-[#EAE6DF] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  {/* Field 1: Occasion */}
                  <div className="p-2.5 sm:p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF] focus-within:border-gold-500 transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      OCCASION
                    </label>
                    <input
                      type="text"
                      value={occasionInput}
                      onChange={(e) => setOccasionInput(e.target.value)}
                      placeholder="e.g. Weddings & Reception"
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-obsidian focus:outline-none"
                    />
                  </div>

                  {/* Field 2: Service */}
                  <div className="p-2.5 sm:p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF] focus-within:border-gold-500 transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      SERVICE
                    </label>
                    <input
                      type="text"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      placeholder="e.g. Cinematography"
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-obsidian focus:outline-none"
                    />
                  </div>

                  {/* Field 3: Date */}
                  <div className="p-2.5 sm:p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF] focus-within:border-gold-500 transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      EVENT DATE
                    </label>
                    <input
                      type="text"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      placeholder="Select Date"
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-obsidian focus:outline-none"
                    />
                  </div>

                  {/* Field 4: City / ZIP */}
                  <div className="p-2.5 sm:p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF] focus-within:border-gold-500 transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      CITY / ZIP
                    </label>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="City or ZIP"
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-obsidian focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit button & tags row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                      POPULAR:
                    </span>
                    <button
                      type="button"
                      onClick={() => setServiceInput("Wedding photographers")}
                      className="hover:text-obsidian hover:underline"
                    >
                      Wedding photographers
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setServiceInput("Birthday DJs")}
                      className="hover:text-obsidian hover:underline"
                    >
                      Birthday DJs
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setServiceInput("Baby shower decor")}
                      className="hover:text-obsidian hover:underline"
                    >
                      Baby shower decor
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 h-11 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 text-amber-300" />
                    <span>Find Artisans</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
                <Image
                  src={heroCollageImg}
                  alt="Curated Celebration Milestones and Verified Artisans"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS RIBBON */}
      <section className="w-full bg-white border-y border-[#EAE6DF] py-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-obsidian">
                  Secure Escrow Payments
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Funds locked safely in Utsob Vault, disbursed solely upon milestone sign-off.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-obsidian">
                  Verified Artisans
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Identity, portfolio audits, and past client interviews vetted by our council.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Percent className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-obsidian">
                  Flat 5% Platform Fee
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Radically transparent client rates. Creators keep 100% of their invoiced fees.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-obsidian">
                  Real Human Concierge
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Live US-based event coordinators available 7 days a week to handle logistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. START WITH YOUR OCCASION */}
      <section id="occasions" className="w-full py-16 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                CURATED CELEBRATIONS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
                Start with your occasion
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Explore verified specialized creatives tailored to the exact traditions and demands of your event.
              </p>
            </div>

            <Link
              href="/vendors"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F1228] hover:text-gold-600 hover:underline"
            >
              <span>See all 14 occasions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Occasions 8-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OCCASIONS.map((occ) => (
              <OccasionCard key={occ.id} occasion={occ} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TWO WAYS TO HIRE WITH ZERO FRICTION */}
      <section className="w-full py-16 lg:py-24 bg-white border-t border-[#EAE6DF]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              STREAMLINED PROCESS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
              Two ways to hire with zero friction
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Whether you prefer exploring flat-rate curated packages or receiving competitive proposals from top regional talent.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="inline-flex items-center p-1.5 bg-[#F4F2EE] rounded-xl border border-[#EAE6DF] mt-2">
              <button
                onClick={() => setHireMode("browse")}
                className={cn(
                  "px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all",
                  hireMode === "browse" ? "bg-[#4F46E5] text-white shadow-xs" : "text-slate-600 hover:text-[#4F46E5]"
                )}
              >
                Browse &amp; Book Direct
              </button>
              <button
                onClick={() => setHireMode("post")}
                className={cn(
                  "px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all",
                  hireMode === "post" ? "bg-[#4F46E5] text-white shadow-xs" : "text-slate-600 hover:text-[#4F46E5]"
                )}
              >
                Post a Job &amp; Get Offers
              </button>
            </div>
          </div>

          {/* 3 Step Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 border border-[#EAE6DF] space-y-4 shadow-xs">
              <span className="font-serif text-3xl font-bold text-indigo-600 block">01</span>
              <h3 className="font-serif text-xl font-bold text-obsidian">
                Compare Verified Portfolios
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filter by verified photos, flat-rate pricing tiers, verified reviews, and real equipment specs across 8 US regions.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Real unedited raw footage checks</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 border border-[#EAE6DF] space-y-4 shadow-xs">
              <span className="font-serif text-3xl font-bold text-indigo-600 block">02</span>
              <h3 className="font-serif text-xl font-bold text-obsidian">
                Deposit in Escrow Vault
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lock booking retainers and milestone funds safely into the FDIC-insured Utsob Vault. Your vendor sees guaranteed backing.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>256-Bit bank grade vault held</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 border border-[#EAE6DF] space-y-4 shadow-xs">
              <span className="font-serif text-3xl font-bold text-indigo-600 block">03</span>
              <h3 className="font-serif text-xl font-bold text-obsidian">
                Approve &amp; Release
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Inspect completed performance, high-res photo deliveries, or day-of logistics. Release funds with one simple tap.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Client final sign-off power</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all"
            >
              <span>Explore All Gigs &amp; Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. POPULAR SERVICES THIS MONTH */}
      <section className="w-full py-16 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                TOP BOOKINGS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
                Popular services this month
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Fully transparent packages guaranteed by our milestone release protocol.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-[#EAE6DF] shadow-2xs">
              {[
                { id: "all", label: "All Services" },
                { id: "cinematography", label: "Cinematography" },
                { id: "floral", label: "Floral & Stage" },
                { id: "music", label: "Live Music" },
                { id: "catering", label: "Catering" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
                    selectedCategory === tab.id
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#4F46E5]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vendors 4x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. COLLABORATIVE FAMILY PLANNING SECTION */}
      <CollaborativePlanningCard />

      {/* 7. 5-STEP ESCROW PROCESS */}
      <EscrowRoadmap />

      {/* 8. GUILD TIERS & SPOTLIGHT */}
      <section className="w-full py-16 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              MERIT & RELIABILITY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
              Built on punctuality and client trust
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Every creator advances strictly by verified milestone execution, never paid placement.
            </p>
          </div>

          {/* 4 Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Level 1: Sprout */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span>Level 1 • Sprout</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-obsidian">Identity Verified</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Background checks completed, government ID verified, 0-4 milestone deliveries.
              </p>
            </div>

            {/* Level 2: Rising */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                <span>Level 2 • Rising</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-obsidian">Proven Reliability</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                5+ completed contracts, minimum 4.7+ rating, and 95%+ on-time arrival rate.
              </p>
            </div>

            {/* Level 3: Pro */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full">
                <span>Level 3 • Pro</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-obsidian">Master Artisan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                20+ completed events, 4.8+ rating, mandatory contingency emergency backup crew.
              </p>
            </div>

            {/* Level 4: Elite */}
            <div className="bg-white rounded-2xl p-6 border border-amber-300 bg-gradient-to-b from-white to-[#FEFDF9] space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Level 4 • Elite</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-obsidian">Top 2% Tier</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                50+ weddings/galas, 4.95+ average, priority instant payout escrow clearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. HOST STORIES & TESTIMONIALS */}
      <section className="w-full py-16 lg:py-24 bg-white border-t border-[#EAE6DF]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              HOST STORIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
              Peace of mind for life&apos;s largest milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story 1 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 border border-[#EAE6DF] space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;Having our $6,000 photographer fee held in escrow gave my parents total peace of mind. The photos were breathtaking, and releasing payment with one tap felt empowering.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#EAE6DF] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0F1228] text-white font-bold text-xs flex items-center justify-center">
                  SE
                </div>
                <div>
                  <h4 className="font-bold text-xs text-obsidian">Sarah & Ethan M.</h4>
                  <span className="text-[11px] text-slate-400">Wedding in Napa Valley, CA</span>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 border border-[#EAE6DF] space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;Booked a 7-piece brass band in under 2 hours for our Chicago annual gala. Transparent 5% platform fee and zero hidden markup made accounting effortless.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#EAE6DF] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  MK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-obsidian">Marcus K.</h4>
                  <span className="text-[11px] text-slate-400">Corporate Gala in Chicago, IL</span>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 border border-[#EAE6DF] space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;The Family Planning board allowed my sisters in New York and Texas to vote on stage decor and split payments into the vault instantly. No more awkward Venmo chases!&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#EAE6DF] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  ER
                </div>
                <div>
                  <h4 className="font-bold text-xs text-obsidian">Elena R.</h4>
                  <span className="text-[11px] text-slate-400">Quinceañera in Miami, FL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ARTISAN CTA BANNER */}
      <section className="w-full py-16 lg:py-20 bg-[#0F1228] text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-[#0F1228] via-[#161B38] to-[#0F1228] border border-white/15 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>For Event Professionals & Creatives</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Turn your talent into guaranteed bookings.
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                Join 4,200+ vetted event professionals earning with guaranteed milestone escrow deposits and zero payment disputes. Keep 100% of your invoiced fee.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 flex-shrink-0 w-full sm:w-auto">
              <Link
                href="/become-a-vendor"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] active:scale-98 text-slate-950 font-bold text-sm rounded-xl shadow-gold-glow transition-all text-center"
              >
                Start Selling as an Artisan
              </Link>

              <Link
                href="/how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all text-center"
              >
                See How Payouts Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <FaqAccordion />

      {/* 12. COOKIE CONSENT BANNER */}
      <CookieBanner />
    </div>
  );
}
