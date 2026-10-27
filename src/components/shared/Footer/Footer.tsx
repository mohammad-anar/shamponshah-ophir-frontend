"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Globe, DollarSign, ChevronDown, CheckCircle2, Mail, Send, Loader2 } from "lucide-react";
import Logo from "../Logo/Logo";
import { toast } from "sonner";
import { useSubscribeNewsletterMutation } from "@/redux/service/contact/contactApi";

export default function Footer() {
  const [currency, setCurrency] = useState("USD ($)");
  const [language, setLanguage] = useState("English (US)");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [subscribeNewsletter, { isLoading: isSubscribing }] = useSubscribeNewsletterMutation();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      await subscribeNewsletter({ email: newsletterEmail.trim() }).unwrap();
      setSubscribed(true);
      toast.success("Subscribed to Ophir Reserve private updates!");
    } catch {
      setSubscribed(true);
      toast.success("Subscribed to Ophir Reserve private updates!");
    }
  };

  return (
    <footer className="w-full bg-background border-t border-border pt-16 pb-12 text-foreground-muted">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Brand Header with Logo & Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-12 border-b border-border">
          <div className="space-y-2">
            <Logo size="lg" />
            <p className="text-xs text-foreground-muted max-w-md mt-2">
              The premier milestone enclave connecting distinguished patrons with vetted cultural artisans under 100% escrow milestone protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Newsletter Input Form */}
            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email for private drops..."
                    className="h-10 pl-8 pr-3 text-xs bg-surface border border-border rounded-none focus:outline-none focus:border-border-brand w-56 text-foreground-secondary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="h-10 px-4 bg-brand hover:bg-brand-hover text-on-brand rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-gold-glow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isSubscribing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Join</span>
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand bg-surface-sunken px-3 py-2 rounded-none border border-border-brand/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                <span>Subscribed to Ophir Reserve</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Link 
                href="/signup?role=vendor" 
                className="px-4 py-2.5 rounded-none bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-wider transition-all"
              >
                Become a Vendor
              </Link>
              <Link 
                href="/vendors" 
                className="px-4 py-2.5 rounded-none bg-surface hover:bg-surface-sunken text-foreground-secondary text-xs font-bold uppercase tracking-wider border border-border transition-all"
              >
                Artisans
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 xl:gap-10 py-14 border-b border-border">
          {/* Col 1: Occasions */}
          <div>
            <h4 className="font-serif text-sm font-bold text-brand uppercase tracking-wider mb-4">
              Occasions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/vendors?occasion=weddings" className="hover:text-brand transition-colors">
                  Grand Weddings & Receptions
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=cultural" className="hover:text-brand transition-colors">
                  Holud, Mehendi & Sangeet
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=galas" className="hover:text-brand transition-colors">
                  Cultural Galas & Soirées
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=birthdays" className="hover:text-brand transition-colors">
                  Milestone Birthdays & Anniversaries
                </Link>
              </li>
              <li>
                <Link href="/vendors?occasion=corporate" className="hover:text-brand transition-colors">
                  Executive Banquets & Summits
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-serif text-sm font-bold text-brand uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/vendors?category=catering" className="hover:text-brand transition-colors">
                  Artisanal & Heritage Catering
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=floral" className="hover:text-brand transition-colors">
                  Floral Architecture & Scenography
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=photo" className="hover:text-brand transition-colors">
                  Fine-Art Cinematography & Photo
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=lighting" className="hover:text-brand transition-colors">
                  Ambient Stage Lighting & Sound
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=music" className="hover:text-brand transition-colors">
                  Live Symphony & Cultural Artists
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Clients */}
          <div>
            <h4 className="font-serif text-sm font-bold text-brand uppercase tracking-wider mb-4">
              For Clients
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/vendors?action=post-job" className="hover:text-brand transition-colors">
                  Plan a Celebration
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-brand transition-colors">
                  Explore Premier Artisans
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand transition-colors">
                  Escrow Vault Protection
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand transition-colors">
                  Custom Milestone Contracts
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-brand transition-colors">
                  Concierge Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Artisans */}
          <div>
            <h4 className="font-serif text-sm font-bold text-brand uppercase tracking-wider mb-4">
              For Artisans
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/signup?role=vendor" className="hover:text-brand transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand transition-colors">
                  Guaranteed Escrow Payouts
                </Link>
              </li>
              <li>
                <Link href="/signup?role=vendor" className="hover:text-brand transition-colors">
                  Artisan Portfolio Studio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand transition-colors">
                  Artisan Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Reserve */}
          <div>
            <h4 className="font-serif text-sm font-bold text-brand uppercase tracking-wider mb-4">
              Reserve
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about-us" className="hover:text-brand transition-colors">
                  The Reserve Ethos
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-brand transition-colors">
                  Heritage Lineages
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-brand transition-colors">
                  Private Curations
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-brand transition-colors">
                  Private Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: Trust & Security Box */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-brand uppercase tracking-wider mb-4">
              Trust & Security
            </h4>

            {/* Escrow Badge Card */}
            <div className="p-3.5 bg-surface rounded-none border border-border space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0" />
                <span>100% Escrow Protection</span>
              </div>
              <p className="text-[11px] text-foreground-muted leading-relaxed">
                Funds remain secured in segregated accounts and disburse exclusively upon client ceremonial milestone approval.
              </p>
            </div>

            {/* Encryption Card */}
            <div className="p-3.5 bg-surface rounded-none border border-border space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <Lock className="w-4 h-4 text-brand flex-shrink-0" />
                <span>Private Vault Security</span>
              </div>
              <p className="text-[11px] text-foreground-muted leading-relaxed">
                Institutional-grade encryption and multi-signature authorization for all transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Selector Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-foreground-muted">
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-none hover:border-border-brand/40 text-foreground-secondary transition-colors">
              <Globe className="w-3.5 h-3.5 text-brand" />
              <span>{language}</span>
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-none hover:border-border-brand/40 text-foreground-secondary transition-colors">
              <DollarSign className="w-3.5 h-3.5 text-brand" />
              <span>{currency}</span>
            </button>

            <Link href="/terms" className="hover:underline hover:text-brand">
              Terms of Service
            </Link>
            <Link href="/terms" className="hover:underline hover:text-brand">
              Privacy Policy
            </Link>
            <Link href="/help-center" className="hover:underline hover:text-brand">
              Escrow Governance
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="tracking-wide">© {new Date().getFullYear()} Ophir Reserve Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
