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
  ShieldCheck,
  Sparkles,
  Lock,
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
    if (serviceInput.trim()) params.set("search", serviceInput.trim());
    if (cultureInput.trim()) params.set("culture", cultureInput.trim());
    if (locationInput.trim()) params.set("location", locationInput.trim());
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      {/* =========================================================================
          1. HERO SECTION (MINIMAL LUXURY)
          Atmospheric ballroom backdrop, bold gold serif headline & sharp search bar
         ========================================================================= */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#26282E]">
        {/* Background Ballroom Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=85"
            alt="Ophir Reserve Grand Celebration"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-[0.35] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/40 to-[#0B0C0E]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,12,14,0.75)_100%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121418]/90 border border-[#DFB76C]/30 text-[#DFB76C] text-[11px] font-bold uppercase tracking-[0.25em] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>The Private Cultural Reserve</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.08em] sm:tracking-[0.12em] text-[#DFB76C] uppercase leading-[1.15] max-w-4xl drop-shadow-[0_4px_24px_rgba(223,183,108,0.25)]">
            Curated Culture. Exceptional Connections.
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#CBD5E1] font-light tracking-[0.06em] max-w-2xl leading-relaxed">
            The private enclave of vetted cultural artisans, master caterers, and milestone celebrations under 100% escrow protection.
          </p>

          {/* Floating Sharp Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 sm:mt-12 w-full max-w-4xl bg-[#121418] border border-[#26282E] shadow-2xl p-2 sm:p-2.5 grid grid-cols-1 md:grid-cols-12 gap-2"
          >
            {/* Field 1: Service */}
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-[#0B0C0E] border border-[#26282E] focus-within:border-[#DFB76C] transition-colors">
              <Utensils className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                placeholder="Service (Catering, Floral, Music...)"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none"
              />
            </div>

            {/* Field 2: Culture */}
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-[#0B0C0E] border border-[#26282E] focus-within:border-[#DFB76C] transition-colors">
              <Globe className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <input
                type="text"
                value={cultureInput}
                onChange={(e) => setCultureInput(e.target.value)}
                placeholder="Culture (African, South Asian...)"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none"
              />
            </div>

            {/* Field 3: Location */}
            <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 bg-[#0B0C0E] border border-[#26282E] focus-within:border-[#DFB76C] transition-colors">
              <MapPin className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="City or Metro Area"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none"
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
          2. THE HERITAGE RESERVE (CURATED COLLECTION)
          3 iconic tall cards with deep charcoal backgrounds & champagne gold accents
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#26282E]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
              The Heritage Reserve
            </p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight">
              Curated Cultural Traditions
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFB76C] hover:text-[#ECC870] transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: African Heritage */}
          <Link
            href="/services?culture=African"
            className="group relative h-[460px] sm:h-[500px] bg-[#121418] border border-[#26282E] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 hover:border-[#DFB76C]/70 hover:shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
              alt="African Heritage Ceremonies"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-[0.72] group-hover:brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C] block">
                Heritage Enclave
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white group-hover:text-[#DFB76C] transition-colors">
                African Heritage
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed line-clamp-2">
                Royal wedding customs, rhythmic gala ensembles, and artisanal ancestral culinary banquets.
              </p>
            </div>
          </Link>

          {/* Card 2: South Asian Heritage */}
          <Link
            href="/services?culture=South+Asian"
            className="group relative h-[460px] sm:h-[500px] bg-[#121418] border border-[#26282E] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 hover:border-[#DFB76C]/70 hover:shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
              alt="South Asian Heritage Celebrations"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.72] group-hover:brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C] block">
                Heritage Enclave
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white group-hover:text-[#DFB76C] transition-colors">
                South Asian Heritage
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed line-clamp-2">
                Palatial floral scenography, fine-art cinema, and intricate multi-day matrimonial ceremonies.
              </p>
            </div>
          </Link>

          {/* Card 3: Latino Heritage */}
          <Link
            href="/services?culture=Latino"
            className="group relative h-[460px] sm:h-[500px] bg-[#121418] border border-[#26282E] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 hover:border-[#DFB76C]/70 hover:shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
              alt="Latino Heritage & Hacienda Celebrations"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.72] group-hover:brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C] block">
                Heritage Enclave
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white group-hover:text-[#DFB76C] transition-colors">
                Latino Heritage
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed line-clamp-2">
                Quinceañera excellence, hacienda unions, vibrant mariachi orchestrations, and culinary feasts.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. THE PROTOCOL / THE ART OF PLANNING
          Clean 3-pillar breakdown: Vetted Artisans, 100% Escrow, and Flawless Delivery
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#26282E]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 3 Pillars */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
                The Protocol
              </p>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F4F6] tracking-tight">
                The Art of Planning
              </h2>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-5 bg-[#121418] border border-[#26282E]">
                <div className="w-9 h-9 bg-[#DFB76C] text-[#0B0C0E] font-bold text-xs flex items-center justify-center shrink-0">
                  01
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base tracking-wider uppercase text-white">
                    Cultural Nuance & Blueprint
                  </h3>
                  <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
                    Identify your specific heritage customs, dietary traditions, and sacred milestones with precision.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-5 bg-[#121418] border border-[#26282E]">
                <div className="w-9 h-9 border border-[#DFB76C] text-[#DFB76C] font-bold text-xs flex items-center justify-center shrink-0">
                  02
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base tracking-wider uppercase text-white">
                    Vetted Master Artisans
                  </h3>
                  <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
                    Connect with peer-reviewed caterers, musicians, cinematographers, and floral architects.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-5 bg-[#121418] border border-[#26282E]">
                <div className="w-9 h-9 border border-emerald-500 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  03
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base tracking-wider uppercase text-white">
                    100% Escrow Protection
                  </h3>
                  <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
                    Deposits remain locked in FDIC-insured trust vaults, released strictly upon your milestone approval.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Moodboard Visual */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[480px] border border-[#26282E] overflow-hidden bg-[#121418]">
            <Image
              src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=85"
              alt="Art of Planning Flatlay"
              fill
              className="object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0B0C0E]/85 backdrop-blur-md border border-[#26282E] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#DFB76C]">
                <ShieldCheck className="w-4 h-4 text-[#DFB76C]" />
                <span>Protected Escrow Architecture</span>
              </div>
              <span className="text-[11px] text-[#CBD5E1]">FDIC-Insured Trust</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE ENCLAVE CTA (FOR PATRONS & ARTISANS)
          Minimal atmospheric courtyard banner with two sharp CTAs
         ========================================================================= */}
      <section className="relative w-full py-24 sm:py-32 px-6 lg:px-12 overflow-hidden border-b border-[#26282E]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2400&q=85"
            alt="Palace Courtyard Night"
            fill
            className="object-cover object-center filter brightness-[0.3] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <div className="max-w-xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#DFB76C]">
              Join The Reserve
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.15]">
              Elevate Your Celebration or Craft.
            </h2>
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed">
              Whether you are curating a milestone ceremony or represent world-class cultural artistry, Ophir Reserve provides unparalleled trust and access.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/signup?role=vendor"
                className="px-7 py-3 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md"
              >
                Become a Vendor
              </Link>
              <Link
                href="/services"
                className="px-7 py-3 border border-[#DFB76C]/60 hover:border-[#DFB76C] hover:bg-[#DFB76C]/10 text-xs font-semibold tracking-[0.2em] uppercase text-[#DFB76C] transition-all duration-300"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
