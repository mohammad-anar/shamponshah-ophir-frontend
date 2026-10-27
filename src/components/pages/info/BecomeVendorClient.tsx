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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useSubmitVendorApplicationMutation } from "@/redux/service/contact/contactApi";

export default function BecomeVendorPage() {
  const [vendorName, setVendorName] = useState("");
  const [category, setCategory] = useState("cinematography");
  const [city, setCity] = useState("Austin, TX");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [submitApplication, { isLoading: isSubmitting }] = useSubmitVendorApplicationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await submitApplication({
        businessName: vendorName,
        category,
        city,
        portfolioUrl: portfolioLink,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      }).unwrap();

      const appId = res?.applicationId || `OPH-GUILD-${Date.now().toString(36).toUpperCase()}`;
      setApplicationId(appId);
      setSubmitted(true);
      toast.success(`Application #${appId} submitted for council review!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-10 lg:py-16 space-y-16 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#1A1D24] text-[#DFB76C] text-xs font-bold uppercase tracking-widest border border-border-brand/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN THE OPHIR RESERVE GUILD</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight leading-[1.15]">
              Keep 100% of your fee. Never chase an invoice again.
            </h1>

            <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg leading-relaxed font-light">
              Ophir Reserve is the premier escrow-secured marketplace for elite event artisans. Clients lock milestones before you lift a finger, and payouts release seamlessly on sign-off.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#121418] rounded-none border border-[#26282E] shadow-sm">
                <span className="font-serif text-2xl sm:text-3xl font-light text-success block">0%</span>
                <span className="text-xs text-foreground-muted font-medium">Commission Fee</span>
              </div>
              <div className="p-4 bg-[#121418] rounded-none border border-[#26282E] shadow-sm">
                <span className="font-serif text-2xl sm:text-3xl font-light text-[#DFB76C] block">100%</span>
                <span className="text-xs text-foreground-muted font-medium">Escrow Backed</span>
              </div>
              <div className="p-4 bg-[#121418] rounded-none border border-[#26282E] shadow-sm">
                <span className="font-serif text-2xl sm:text-3xl font-light text-foreground block">4.96</span>
                <span className="text-xs text-foreground-muted font-medium">Artisan Score</span>
              </div>
            </div>
          </div>

          {/* Quick Application Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-5">
              {!submitted ? (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#DFB76C] tracking-[0.2em]">
                      DIRECT GUILD FAST-TRACK
                    </span>
                    <h3 className="font-serif text-2xl font-light text-foreground">
                      Apply for Artisan Status
                    </h3>
                    <p className="text-xs text-foreground-muted font-light">
                      Council review takes 24–48 hours for verified heritage pros.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground-secondary">Studio / Business Name</label>
                      <input
                        type="text"
                        required
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="e.g. Celestial Floral Atelier"
                        className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground-secondary">Creative Craft</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none cursor-pointer"
                      >
                        <option value="cinematography">Cinematography & Photo</option>
                        <option value="floral">Floral & Stage Scenography</option>
                        <option value="music">Live Symphony & Ceremonial Music</option>
                        <option value="catering">Artisanal Catering & Kaiseki</option>
                        <option value="planning">Milestone Heritage Planning</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground-secondary">Primary Metro City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Austin, TX"
                        className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground-secondary">Contact Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vendor@studio.com"
                          className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-foreground-secondary">Phone (Optional)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (512) 555-0144"
                          className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground-secondary">Website or Instagram Portfolio</label>
                      <input
                        type="url"
                        required
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 mt-2 bg-[#DFB76C] hover:bg-[#ECC870] active:scale-99 text-[#0B0C0E] font-bold text-xs uppercase tracking-wider rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0B0C0E]" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application for Review</span>
                          <ArrowRight className="w-4 h-4 text-[#0B0C0E]" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-none bg-[#0D211A] text-success border border-success/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    {applicationId && (
                      <span className="text-[11px] font-mono font-bold text-[#DFB76C] bg-[#1A1D24] px-3 py-1 rounded-none border border-border-brand/40">
                        APPLICATION #{applicationId}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-light text-foreground pt-1">Application Received</h3>
                  </div>
                  <p className="text-xs text-foreground-muted font-light">
                    Our curation council will review your portfolio and send verification details to <strong className="text-foreground">{email || "your email"}</strong> within 24–48 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <Link
                      href="/register/select-role"
                      className="inline-block px-5 py-2.5 bg-[#DFB76C] text-[#0B0C0E] text-xs font-bold uppercase tracking-wider rounded-none"
                    >
                      Complete Profile
                    </Link>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setVendorName("");
                        setPortfolioLink("");
                      }}
                      className="text-xs font-semibold text-foreground-muted hover:text-[#DFB76C]"
                    >
                      Submit another application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars for Vendors */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[#121418] rounded-none border border-[#26282E] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-light text-lg text-foreground">Guaranteed Milestone Deposits</h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed font-light">
              Every booking is locked into the Escrow Vault before you begin. No bounced checks, no 90-day net terms, and zero awkward financial reminders.
            </p>
          </div>

          <div className="p-8 bg-[#121418] rounded-none border border-[#26282E] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1D24] border border-[#26282E] text-success flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-light text-lg text-foreground">Zero Creator Commissions</h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed font-light">
              We never take a percentage of your artistic labor. You keep 100% of your invoiced rate with free direct ACH bank payouts.
            </p>
          </div>

          <div className="p-8 bg-[#121418] rounded-none border border-[#26282E] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-light text-lg text-foreground">Merit Guild Badges</h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed font-light">
              Level up to Elite as you deliver flawless milestones. Top tier artisans receive exclusive high-ticket milestone ceremony invitations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
