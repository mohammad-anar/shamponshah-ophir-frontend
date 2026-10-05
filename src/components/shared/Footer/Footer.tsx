"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Globe, DollarSign, ChevronDown, CheckCircle2 } from "lucide-react";
import Logo from "../Logo/Logo";

export default function Footer() {
  const [currency, setCurrency] = useState("USD ($)");
  const [language, setLanguage] = useState("English (US)");

  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-[#EAE6DF] pt-16 pb-12 text-slate-700">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Brand Header with Logo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-[#EAE6DF]">
          <div className="space-y-2">
            <Logo size="lg" />
            <p className="text-xs text-slate-500 max-w-md">
              The modern milestone &amp; escrow marketplace for milestone events, verified artisans, and family collaborative planning.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/become-a-vendor" 
              className="px-4 py-2 rounded-full bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold transition-all shadow-sm"
            >
              Apply as Vendor
            </Link>
            <Link 
              href="/vendors" 
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#0F0C3B] text-xs font-bold border border-slate-200 transition-all shadow-xs"
            >
              Browse Directory
            </Link>
          </div>
        </div>

        {/* Main Footer Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 xl:gap-10 py-14 border-b border-[#EAE6DF]">
          {/* Col 1: Occasions */}
          <div>
            <h4 className="font-serif text-base font-bold text-obsidian tracking-tight mb-4">
              Occasions
            </h4>
            <ul className="space-y-2.5 text-xs xl:text-sm">
              <li>
                <Link href="/vendors?occasion=weddings" className="hover:text-obsidian hover:underline transition-colors">
                  Grand Weddings & Receptions
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=cultural" className="hover:text-obsidian hover:underline transition-colors">
                  Holud, Mehendi & Sangeet
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=galas" className="hover:text-obsidian hover:underline transition-colors">
                  Cultural Galas & Soirées
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=birthdays" className="hover:text-obsidian hover:underline transition-colors">
                  Milestone Birthdays & Anniversaries
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=corporate" className="hover:text-obsidian hover:underline transition-colors">
                  Executive Banquets & Summits
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-serif text-base font-bold text-obsidian tracking-tight mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs xl:text-sm">
              <li>
                <Link href="/vendors?category=catering" className="hover:text-obsidian hover:underline transition-colors">
                  Artisanal & Heritage Catering
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=floral" className="hover:text-obsidian hover:underline transition-colors">
                  Floral Architecture & Scenography
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=photo" className="hover:text-obsidian hover:underline transition-colors">
                  Fine-Art Cinematography & Photo
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=lighting" className="hover:text-obsidian hover:underline transition-colors">
                  Ambient Stage Lighting & Sound
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=music" className="hover:text-obsidian hover:underline transition-colors">
                  Live Symphony & Cultural Artists
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Clients */}
          <div>
            <h4 className="font-serif text-base font-bold text-obsidian tracking-tight mb-4">
              For Clients
            </h4>
            <ul className="space-y-2.5 text-xs xl:text-sm">
              <li>
                <Link href="/vendors?action=post-job" className="hover:text-obsidian hover:underline transition-colors">
                  Post a Celebration Job
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-obsidian hover:underline transition-colors">
                  Browse Verified Vendors
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-obsidian hover:underline transition-colors">
                  Escrow Vault Protection
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-obsidian hover:underline transition-colors">
                  Custom Milestone Contracts
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-obsidian hover:underline transition-colors">
                  Client Concierge Service
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-obsidian hover:underline transition-colors">
                  Event Budget Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Vendors */}
          <div>
            <h4 className="font-serif text-base font-bold text-obsidian tracking-tight mb-4">
              For Vendors
            </h4>
            <ul className="space-y-2.5 text-xs xl:text-sm">
              <li>
                <Link href="/become-a-vendor" className="hover:text-obsidian hover:underline transition-colors">
                  Apply for Artisan Status
                </Link>
              </li>
              <li>
                <Link href="/become-a-vendor" className="hover:text-obsidian hover:underline transition-colors">
                  Guaranteed Payout Terms
                </Link>
              </li>
              <li>
                <Link href="/become-a-vendor" className="hover:text-obsidian hover:underline transition-colors">
                  Portfolio Showcase Studio
                </Link>
              </li>
              <li>
                <Link href="/become-a-vendor" className="hover:text-obsidian hover:underline transition-colors">
                  Vendor Guild Badge Criteria
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="hover:text-obsidian hover:underline transition-colors">
                  Community Standards
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-obsidian hover:underline transition-colors">
                  Merchant Studio Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company */}
          <div>
            <h4 className="font-serif text-base font-bold text-obsidian tracking-tight mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs xl:text-sm">
              <li>
                <Link href="/about-us" className="hover:text-obsidian hover:underline transition-colors">
                  Our Editorial Ethos
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-obsidian hover:underline transition-colors">
                  Cultural Heritage Story
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-obsidian hover:underline transition-colors">
                  Press & Features
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-obsidian hover:underline transition-colors">
                  Careers <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full font-medium ml-1">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-obsidian hover:underline transition-colors">
                  Contact Hospitality Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: Trust & Security Box */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-obsidian tracking-tight mb-4">
              Trust & Security
            </h4>

            {/* Escrow Badge Card */}
            <div className="p-3.5 bg-white rounded-xl border border-[#EAE6DF] shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-obsidian font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Escrow Protection</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Funds stay secured in segregated FDIC-insured depository accounts and clear exclusively upon client milestone release.
              </p>
            </div>

            {/* Encryption Card */}
            <div className="p-3.5 bg-white rounded-xl border border-[#EAE6DF] shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-obsidian font-bold text-xs">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>256-bit Vault Security</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Military-grade transport encryption and multi-signature release for vendor disbursements.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Selector Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EAE6DF] rounded-lg hover:border-slate-400 text-slate-700 transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language}</span>
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EAE6DF] rounded-lg hover:border-slate-400 text-slate-700 transition-colors">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              <span>{currency}</span>
            </button>

            <Link href="/terms" className="hover:underline hover:text-obsidian">
              Terms of Service
            </Link>
            <Link href="/terms" className="hover:underline hover:text-obsidian">
              Privacy Policy
            </Link>
            <Link href="/help-center" className="hover:underline hover:text-obsidian">
              Escrow Governance
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p>© {new Date().getFullYear()} Ophir Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
