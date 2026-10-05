"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  DollarSign,
  Award,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function BecomeVendorPage() {
  const [vendorName, setVendorName] = useState("");
  const [category, setCategory] = useState("cinematography");
  const [city, setCity] = useState("Austin, TX");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Guild application submitted for council review!");
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 lg:py-16 space-y-16">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider border border-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN THE OPHIR ARTISAN GUILD</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-obsidian tracking-tight leading-[1.12]">
              Keep 100% of your fee. Never chase an invoice again.
            </h1>

            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Ophir Reserve is the premier escrow-secured marketplace for elite event pros. Clients lock milestones before you lift a finger, and payouts release seamlessly on sign-off.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-[#EAE6DF] shadow-xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-600 block">0%</span>
                <span className="text-xs text-slate-500 font-medium">Gig Commission</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#EAE6DF] shadow-xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-obsidian block">100%</span>
                <span className="text-xs text-slate-500 font-medium">Escrow Backed</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#EAE6DF] shadow-xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 block">4.96</span>
                <span className="text-xs text-slate-500 font-medium">Guild Score</span>
              </div>
            </div>
          </div>

          {/* Quick Application Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury-lg border border-[#EAE6DF] space-y-5">
              {!submitted ? (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">
                      DIRECT GUILD FAST-TRACK
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-obsidian">
                      Apply for Artisan Status
                    </h3>
                    <p className="text-xs text-slate-500">
                      Council review takes 24–48 hours for verified pros.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Studio / Business Name</label>
                      <input
                        type="text"
                        required
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="e.g. Celestial Floral Atelier"
                        className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Creative Craft</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                      >
                        <option value="cinematography">Cinematography & Photo</option>
                        <option value="floral">Floral & Stage Scenography</option>
                        <option value="music">Live Symphony & DJ</option>
                        <option value="catering">Artisanal Catering</option>
                        <option value="planning">Milestone Event Planning</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Primary Metro City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Austin, TX"
                        className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Website or Instagram Portfolio</label>
                      <input
                        type="url"
                        required
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 mt-2 bg-[#0F1228] hover:bg-[#1A1F40] active:scale-99 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Submit Application for Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-obsidian">Application Received</h3>
                  <p className="text-xs text-slate-500">
                    Our curation council will review your portfolio and send verification details to your email within 24 hours.
                  </p>
                  <Link
                    href="/register/select-role"
                    className="inline-block px-5 py-2.5 bg-[#0F1228] text-white text-xs font-semibold rounded-xl"
                  >
                    Complete Host & Vendor Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars for Vendors */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-obsidian">Guaranteed Milestone Deposits</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every booking is locked into the Utsob Trust Vault before you arrive. No bounced checks, no 90-day net terms, and zero awkward financial reminders.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-obsidian">Zero Creator Commissions</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We never take a percentage of your artistic labor. You keep 100% of your invoiced rate with free direct ACH bank payouts.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-obsidian">Merit Guild Badges</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Level up from Sprout to Elite as you deliver flawless milestones. Top tier artisans receive exclusive high-ticket gala invitations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
