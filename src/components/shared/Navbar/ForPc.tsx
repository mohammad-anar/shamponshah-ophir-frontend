"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, User, ShieldCheck, Sparkles, PlusCircle, Menu, X } from "lucide-react";
import Logo from "../Logo/Logo";
import { cn } from "@/lib/utils";

export default function ForPc() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);

  const occasions = [
    { title: "Weddings & Receptions", href: "/vendors?occasion=weddings" },
    { title: "Birthdays & Anniversaries", href: "/vendors?occasion=birthdays" },
    { title: "Baby Showers & Reveals", href: "/vendors?occasion=babyshowers" },
    { title: "Graduations & Honors", href: "/vendors?occasion=graduations" },
    { title: "Quinceañeras & Cotillions", href: "/vendors?occasion=quinceaneras" },
    { title: "Corporate Events & Galas", href: "/vendors?occasion=corporate" },
    { title: "Theater & Stage Shows", href: "/vendors?occasion=theater" },
    { title: "Holiday Parties & Galas", href: "/vendors?occasion=holiday" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendors?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/vendors");
    }
  };

  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAE6DF] shadow-xs transition-all">
      <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo & Global Search */}
        <div className="flex items-center gap-6">
          <Logo />

          <form onSubmit={handleSearchSubmit} className="relative w-64 xl:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors, floral, venues..."
              className="w-full h-10 pl-9 pr-4 text-xs xl:text-sm bg-[#F4F2EE] hover:bg-[#EFECE6] focus:bg-white text-obsidian placeholder:text-slate-400 rounded-full border border-transparent focus:border-gold-500 focus:outline-none transition-all"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 xl:gap-2">
          {/* Occasions Dropdown */}
          <div className="relative" onMouseLeave={() => setIsOccasionsOpen(false)}>
            <button
              onClick={() => setIsOccasionsOpen(!isOccasionsOpen)}
              onMouseEnter={() => setIsOccasionsOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-obsidian rounded-lg transition-colors",
                isOccasionsOpen && "text-obsidian bg-alabaster-200"
              )}
            >
              <span>Occasions</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", isOccasionsOpen && "rotate-180")} />
            </button>

            {isOccasionsOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-luxury-lg border border-[#EAE6DF] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Occasion
                </div>
                {occasions.map((occ) => (
                  <Link
                    key={occ.title}
                    href={occ.href}
                    onClick={() => setIsOccasionsOpen(false)}
                    className="block px-3.5 py-2 text-xs xl:text-sm text-slate-700 hover:bg-[#F9F7F2] hover:text-obsidian font-medium transition-colors"
                  >
                    {occ.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/vendors"
            className={cn(
              "px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors",
              pathname.startsWith("/vendors")
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/50"
            )}
          >
            Services
          </Link>

          <Link
            href="/how-it-works"
            className={cn(
              "px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/50 rounded-lg transition-colors",
              pathname === "/how-it-works" && "text-[#4F46E5] font-bold"
            )}
          >
            How It Works
          </Link>

          <Link
            href="/help-center"
            className={cn(
              "px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/50 rounded-lg transition-colors",
              pathname === "/help-center" && "text-[#4F46E5] font-bold"
            )}
          >
            Escrow Vault
          </Link>

          <Link
            href="/become-a-vendor"
            className={cn(
              "px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/50 rounded-lg transition-colors",
              pathname === "/become-a-vendor" && "text-[#4F46E5] font-bold"
            )}
          >
            Become a Vendor
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-semibold text-slate-800 hover:text-[#4F46E5] hover:bg-indigo-50/50 rounded-lg transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-[#4F46E5] bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-all shadow-xs"
          >
            Join
          </Link>

          <Link
            href="/vendors?action=post-job"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 rounded-lg shadow-sm hover:shadow-indigo-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Post a Job</span>
          </Link>

          <Link
            href="/login"
            aria-label="Account Profile"
            className="w-9 h-9 rounded-full bg-[#0F0C3B] hover:bg-[#4F46E5] text-white flex items-center justify-center transition-colors shadow-xs"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
