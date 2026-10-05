"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, User, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "../Logo/Logo";
import { cn } from "@/lib/utils";

export default function ForMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendors?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const occasions = [
    { title: "Weddings & Receptions", href: "/vendors?occasion=weddings" },
    { title: "Birthdays & Anniversaries", href: "/vendors?occasion=birthdays" },
    { title: "Baby Showers & Reveals", href: "/vendors?occasion=babyshowers" },
    { title: "Graduations & Honors", href: "/vendors?occasion=graduations" },
    { title: "Quinceañeras & Cotillions", href: "/vendors?occasion=quinceaneras" },
    { title: "Corporate Events & Galas", href: "/vendors?occasion=corporate" },
  ];

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAE6DF] shadow-xs">
      <div className="px-4 h-[68px] flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="w-8 h-8 rounded-full bg-[#0F1228] text-white flex items-center justify-center text-xs"
          >
            <User className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-800 hover:bg-alabaster-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 bg-white z-50 flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-top-4 duration-200 border-t border-[#EAE6DF]">
          <div className="space-y-5">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors, floral, venues..."
                className="w-full h-11 pl-10 pr-4 text-sm bg-[#F4F2EE] text-obsidian rounded-xl border border-transparent focus:border-gold-500 focus:outline-none"
              />
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-1 font-medium">
              <div>
                <button
                  onClick={() => setIsOccasionsOpen(!isOccasionsOpen)}
                  className="w-full flex items-center justify-between py-3 text-base text-slate-800 border-b border-slate-100"
                >
                  <span>Occasions</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isOccasionsOpen && "rotate-180")} />
                </button>
                {isOccasionsOpen && (
                  <div className="pl-3 py-2 space-y-2 bg-[#F9F8F5] rounded-xl my-2">
                    {occasions.map((occ) => (
                      <Link
                        key={occ.title}
                        href={occ.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 text-sm text-slate-700 hover:text-obsidian"
                      >
                        {occ.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/vendors"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-base border-b border-slate-100 font-semibold",
                  pathname.startsWith("/vendors") ? "text-[#4F46E5]" : "text-slate-800 hover:text-[#4F46E5]"
                )}
              >
                Services Directory
              </Link>

              <Link
                href="/how-it-works"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base text-slate-800 hover:text-[#4F46E5] border-b border-slate-100"
              >
                How It Works
              </Link>

              <Link
                href="/help-center"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base text-slate-800 hover:text-[#4F46E5] border-b border-slate-100"
              >
                Escrow Vault Protection
              </Link>

              <Link
                href="/become-a-vendor"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base text-slate-800 hover:text-[#4F46E5] border-b border-slate-100"
              >
                Become a Vendor
              </Link>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <Link
              href="/vendors?action=post-job"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-center block text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-md transition-all"
            >
              Post a Job
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="py-2.5 text-center text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="py-2.5 text-center text-sm font-bold text-white bg-[#0F0C3B] hover:bg-indigo-900 rounded-xl"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
