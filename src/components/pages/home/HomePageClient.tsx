"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Globe,
  Utensils,
  ArrowRight,
  Handshake,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Hero Search states
  const [serviceInput, setServiceInput] = useState("");
  const [cultureInput, setCultureInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceInput) params.set("search", serviceInput);
    if (cultureInput) params.set("culture", cultureInput);
    if (locationInput) params.set("location", locationInput);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      {/* =========================================================================
          1. HERO SECTION
          Atmospheric chandelier ballroom backdrop with gold serif headline & sharp search bar
         ========================================================================= */}
      <section className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-[#26282E]">
        {/* Background Ballroom Image with Dark Luxury Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=85"
            alt="Ophir Reserve Ballroom"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.08]"
          />
          {/* Obsidian Noir gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/40 to-[#0B0C0E]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,12,14,0.7)_100%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center">
          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.08em] sm:tracking-[0.12em] text-[#DFB76C] uppercase leading-[1.15] max-w-5xl drop-shadow-[0_4px_24px_rgba(223,183,108,0.25)]">
            Curated Culture. Exceptional Connections.
          </h1>

          {/* Luxury Subtitle (optional subtle tagline) */}
          <p className="mt-6 text-sm sm:text-base text-slate-300 font-light tracking-[0.08em] max-w-2xl uppercase">
            The private reserve of vetted cultural artisans, master caterers, and milestone celebrations.
          </p>

          {/* Floating Sharp Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-12 sm:mt-16 w-full max-w-4xl bg-[#121418]/90 backdrop-blur-md border border-[#26282E] shadow-2xl p-2 sm:p-2.5 grid grid-cols-1 md:grid-cols-12 gap-2"
          >
            {/* Field 1: Service */}
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-[#0B0C0E]/60 border border-[#26282E]/70 focus-within:border-[#DFB76C] transition-colors">
              <Utensils className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                placeholder="Service (Catering, Floral, Music...)"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Field 2: Culture */}
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-[#0B0C0E]/60 border border-[#26282E]/70 focus-within:border-[#DFB76C] transition-colors">
              <Globe className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <input
                type="text"
                value={cultureInput}
                onChange={(e) => setCultureInput(e.target.value)}
                placeholder="Culture (African, South Asian...)"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Field 3: Location */}
            <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 bg-[#0B0C0E]/60 border border-[#26282E]/70 focus-within:border-[#DFB76C] transition-colors">
              <MapPin className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-1">
              <button
                type="submit"
                className="w-full h-full min-h-[46px] bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md active:translate-y-0.5"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =========================================================================
          2. THE COLLECTION / Explore the Heritage
          3 tall sharp cards with rich photography & cultural narratives
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#26282E]">
        <div className="mb-14 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
            The Collection
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight">
            Explore the Heritage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: African Heritage */}
          <Link
            href="/services?culture=African"
            className="group relative h-[480px] sm:h-[540px] bg-[#121418] border border-[#26282E] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 hover:border-[#DFB76C]/60 hover:shadow-2xl hover:shadow-[#DFB76C]/5"
          >
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
              alt="African Heritage"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-[0.72] group-hover:brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
            <div className="relative z-10 space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F3F4F6] group-hover:text-[#DFB76C] transition-colors">
                African Heritage
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed line-clamp-2">
                Vibrant traditions, rhythmic celebrations, and the timeless customs of royal heritage ceremonies.
              </p>
            </div>
          </Link>

          {/* Card 2: South Asian Heritage */}
          <Link
            href="/services?culture=South+Asian"
            className="group relative h-[480px] sm:h-[540px] bg-[#121418] border border-[#26282E] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 hover:border-[#DFB76C]/60 hover:shadow-2xl hover:shadow-[#DFB76C]/5"
          >
            <Image
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
              alt="South Asian Heritage"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.72] group-hover:brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
            <div className="relative z-10 space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F3F4F6] group-hover:text-[#DFB76C] transition-colors">
                South Asian Heritage
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed line-clamp-2">
                The grandeur of royal courts, intricate artistry, and centuries of exquisite wedding rituals.
              </p>
            </div>
          </Link>

          {/* Card 3: Latino Heritage */}
          <Link
            href="/services?culture=Latino"
            className="group relative h-[480px] sm:h-[540px] bg-[#121418] border border-[#26282E] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 hover:border-[#DFB76C]/60 hover:shadow-2xl hover:shadow-[#DFB76C]/5"
          >
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
              alt="Latino Heritage"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.72] group-hover:brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
            <div className="relative z-10 space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F3F4F6] group-hover:text-[#DFB76C] transition-colors">
                Latino Heritage
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed line-clamp-2">
                Warmth, family, and the passionate spirit of celebration across haciendas, fiestas, and sacred unions.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. THE RESERVE / Premier Artisans
          Sharp artisan cards with cultural badges, tags, and "DISCOVER →" buttons
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#26282E]">
        <div className="mb-14 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
            The Reserve
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight">
            Premier Artisans
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Artisan 1: East Asian Heritage */}
          <div className="bg-[#121418] border border-[#26282E] p-4 flex flex-col justify-between group hover:border-[#DFB76C]/60 transition-colors">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#16181F]">
              <Image
                src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80"
                alt="East Asian Heritage"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
            </div>
            <div className="pt-6 pb-2 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C]">
                  East Asian
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F3F4F6] mt-1">
                  East Asian Heritage
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#26282E] text-slate-300">
                    Chinese Tea Ceremony
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#26282E] text-slate-300">
                    Traditional Hanbok
                  </span>
                </div>
              </div>
              <Link
                href="/services?culture=East+Asian"
                className="w-full py-3 border border-[#DFB76C]/40 hover:border-[#DFB76C] hover:bg-[#DFB76C]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFB76C] text-center transition-all duration-300 block mt-4"
              >
                Discover →
              </Link>
            </div>
          </div>

          {/* Artisan 2: Island Rhythms */}
          <div className="bg-[#121418] border border-[#26282E] p-4 flex flex-col justify-between group hover:border-[#DFB76C]/60 transition-colors">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#16181F]">
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                alt="Island Rhythms"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
            </div>
            <div className="pt-6 pb-2 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C]">
                  Caribbean
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F3F4F6] mt-1">
                  Island Rhythms
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#26282E] text-slate-300">
                    Beachside Gala
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#26282E] text-slate-300">
                    Heritage Carnival
                  </span>
                </div>
              </div>
              <Link
                href="/services?culture=Caribbean"
                className="w-full py-3 border border-[#DFB76C]/40 hover:border-[#DFB76C] hover:bg-[#DFB76C]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFB76C] text-center transition-all duration-300 block mt-4"
              >
                Discover →
              </Link>
            </div>
          </div>

          {/* Artisan 3: Latino Passions */}
          <div className="bg-[#121418] border border-[#26282E] p-4 flex flex-col justify-between group hover:border-[#DFB76C]/60 transition-colors">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#16181F]">
              <Image
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
                alt="Latino Passions"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
            </div>
            <div className="pt-6 pb-2 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C]">
                  Latino
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F3F4F6] mt-1">
                  Latino Passions
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#26282E] text-slate-300">
                    Quinceañera Elite
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#26282E] text-slate-300">
                    Hacienda Weddings
                  </span>
                </div>
              </div>
              <Link
                href="/services?culture=Latino"
                className="w-full py-3 border border-[#DFB76C]/40 hover:border-[#DFB76C] hover:bg-[#DFB76C]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFB76C] text-center transition-all duration-300 block mt-4"
              >
                Discover →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFB76C] hover:text-[#ECC870] transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          4. THE PROCESS / The Art of Planning
          Numbered step-by-step cultural blueprint & luxury moodboard visual
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#26282E]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Numbered Process */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
                The Process
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight">
                The Art of Planning
              </h2>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-[#DFB76C] text-[#0B0C0E] font-bold text-xs flex items-center justify-center shrink-0 mt-1 shadow-md">
                  1
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg tracking-wider uppercase text-[#F3F4F6]">
                    Cultural Blueprint
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    We begin by deep-diving into your heritage requirements, identifying the specific cultural nuances that will define your celebration&apos;s soul.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-[#DFB76C] text-[#DFB76C] font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                  2
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg tracking-wider uppercase text-[#F3F4F6]">
                    Artisan Selection
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Match with our vetted reserve of artisans who don&apos;t just provide services, but understand the emotional weight of your traditions.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-[#DFB76C] text-[#DFB76C] font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                  3
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg tracking-wider uppercase text-[#F3F4F6]">
                    Elite Collaboration
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Manage your entire event lifecycle through our bespoke dashboard, designed for seamless communication and elite transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Moodboard Flatlay */}
          <div className="lg:col-span-6 relative h-[480px] sm:h-[560px] border border-[#26282E] overflow-hidden bg-[#121418]">
            <Image
              src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=85"
              alt="The Art of Planning Moodboard"
              fill
              className="object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW THE RESERVE WORKS
          Sharp bento grid with Discover, Connect, Reserve & Secure Transactions
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#26282E]">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight">
            How the Reserve Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tile 1: DISCOVER (Spans 6 cols, full height on left) */}
          <div className="md:col-span-6 bg-[#121418] border border-[#26282E] p-8 sm:p-12 flex flex-col justify-between hover:border-[#DFB76C]/60 transition-colors min-h-[380px]">
            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#DFB76C] mb-8">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light tracking-[0.15em] text-[#F3F4F6] uppercase">
                Discover
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-md">
              Access a curated ecosystem of world-class vendors, each vetted for their cultural expertise and high-end service standards.
            </p>
          </div>

          {/* Right Sub-Grid: Spans 6 cols */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tile 2: CONNECT */}
            <div className="bg-[#16181F] border border-[#26282E] p-6 sm:p-8 flex flex-col items-center text-center justify-center space-y-4 hover:border-[#DFB76C]/60 transition-colors min-h-[180px]">
              <Handshake className="w-7 h-7 text-[#DFB76C]" />
              <h3 className="font-serif text-base tracking-[0.15em] text-[#F3F4F6] uppercase">
                Connect
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed">
                Direct lines to elite artisans around the globe.
              </p>
            </div>

            {/* Tile 3: RESERVE */}
            <div className="bg-[#16181F] border border-[#26282E] p-6 sm:p-8 flex flex-col items-center text-center justify-center space-y-4 hover:border-[#DFB76C]/60 transition-colors min-h-[180px]">
              <CalendarCheck className="w-7 h-7 text-[#DFB76C]" />
              <h3 className="font-serif text-base tracking-[0.15em] text-[#F3F4F6] uppercase">
                Reserve
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed">
                Secure dates with priority booking access.
              </p>
            </div>

            {/* Tile 4: SECURE TRANSACTIONS (Spans full width of right col) */}
            <div className="sm:col-span-2 bg-[#121418] border border-[#26282E] p-6 sm:p-8 flex flex-col justify-center space-y-3 hover:border-[#DFB76C]/60 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#DFB76C]" />
                <h3 className="font-serif text-base tracking-[0.15em] text-[#F3F4F6] uppercase">
                  Secure Transactions
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed">
                Escrow-protected payments for absolute peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOR ARTISANS / Elevate Your Artistry to the Reserve
          Atmospheric evening courtyard banner with sharp CTA buttons
         ========================================================================= */}
      <section className="relative w-full py-28 sm:py-36 px-6 lg:px-12 overflow-hidden border-b border-[#26282E]">
        {/* Background Banquet Courtyard Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2400&q=85"
            alt="Palace Courtyard"
            fill
            className="object-cover object-center filter brightness-[0.32] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
              For Artisans
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight leading-[1.15]">
              Elevate Your Artistry to the Reserve.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-lg">
              We are looking for elite service providers who specialize in cultural excellence. Join our exclusive network of vetted heritage experts.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/register?role=vendor"
                className="px-8 py-3.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-lg"
              >
                Apply to Join
              </Link>
              <Link
                href="/vendor/gigs"
                className="px-8 py-3.5 border border-[#DFB76C]/60 hover:border-[#DFB76C] hover:bg-[#DFB76C]/10 text-xs font-semibold tracking-[0.2em] uppercase text-[#DFB76C] transition-all duration-300 cursor-pointer"
              >
                Vendor Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
