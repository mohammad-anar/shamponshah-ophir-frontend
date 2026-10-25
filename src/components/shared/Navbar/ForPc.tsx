"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, User, ShieldCheck, Sparkles, PlusCircle, Menu, X, Loader2 } from "lucide-react";
import Logo from "../Logo/Logo";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { useGetPublicGigsQuery } from "@/redux/service/gigs/gigsApi";
import { useAppSelector } from "@/redux/hooks/hooks";

export default function ForPc() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const occasionsContainerRef = useRef<HTMLDivElement>(null);
  const occasionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const token = useAppSelector((state) => state.auth.accessToken);
  const { data: meData } = useGetMeQuery(undefined, { skip: !token });
  const user = meData?.data || meData;
  const role = user?.role;
  const dashboardLink = role === "VENDOR" ? "/vendor" : role === "ADMIN" ? "/admin" : "/user";
  const userInitials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  // Debounce search query by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Occasions dropdown hover handlers with graceful delay
  const handleOccasionsMouseEnter = () => {
    if (occasionsTimeoutRef.current) {
      clearTimeout(occasionsTimeoutRef.current);
      occasionsTimeoutRef.current = null;
    }
    setIsOccasionsOpen(true);
  };

  const handleOccasionsMouseLeave = () => {
    if (occasionsTimeoutRef.current) {
      clearTimeout(occasionsTimeoutRef.current);
    }
    occasionsTimeoutRef.current = setTimeout(() => {
      setIsOccasionsOpen(false);
    }, 300);
  };

  const handleOccasionsToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (occasionsTimeoutRef.current) {
      clearTimeout(occasionsTimeoutRef.current);
      occasionsTimeoutRef.current = null;
    }
    setIsOccasionsOpen((prev) => !prev);
  };

  // Query matching services from backend /gigs
  const { data: rawGigs, isFetching: isSearchingGigs } = useGetPublicGigsQuery(
    { search: debouncedQuery, limit: 10 },
    { skip: !debouncedQuery || debouncedQuery.length === 0 }
  );

  const matchingServices = (rawGigs as any)?.data || (Array.isArray(rawGigs) ? rawGigs : []);

  // Close search & occasions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (occasionsContainerRef.current && !occasionsContainerRef.current.contains(e.target as Node)) {
        if (occasionsTimeoutRef.current) {
          clearTimeout(occasionsTimeoutRef.current);
          occasionsTimeoutRef.current = null;
        }
        setIsOccasionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (occasionsTimeoutRef.current) {
        clearTimeout(occasionsTimeoutRef.current);
      }
    };
  }, []);

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
    setIsSearchOpen(false);
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

          <div ref={searchContainerRef} className="relative w-64 xl:w-96">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchOpen(true);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="Search services, vendors, venues..."
                className="w-full h-10 pl-9 pr-9 text-xs xl:text-sm bg-[#F4F2EE] hover:bg-[#EFECE6] focus:bg-white text-obsidian placeholder:text-slate-400 rounded-full border border-transparent focus:border-gold-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Dropdown with max height = 1/3 of screen */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-luxury-xl border border-[#EAE6DF] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header */}
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Matching Services</span>
                  {isSearchingGigs && (
                    <span className="flex items-center gap-1 text-gold-600">
                      <Loader2 className="w-3 h-3 animate-spin" /> Searching...
                    </span>
                  )}
                </div>

                {/* Scrollable list with max height 1/3 of viewport */}
                <div 
                  className="overflow-y-auto divide-y divide-slate-100"
                  style={{ maxHeight: "33.33vh" }}
                >
                  {matchingServices.length > 0 ? (
                    matchingServices.map((service: any) => {
                      const vendorSlug = service.vendorProfile?.slug || service.vendorProfileId;
                      const vendorName = service.vendorProfile?.businessName || service.vendorProfile?.name;
                      const price = service.basePrice || service.startingPrice || service.packages?.[0]?.price;
                      const targetUrl = vendorSlug 
                        ? `/vendors/${vendorSlug}?service=${encodeURIComponent(service.slug || service.title)}` 
                        : `/vendors?q=${encodeURIComponent(service.title)}`;

                      return (
                        <Link
                          key={service.id}
                          href={targetUrl}
                          onClick={() => {
                            setIsSearchOpen(false);
                          }}
                          className="p-3 block hover:bg-[#F9F7F2] transition-colors group cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-obsidian group-hover:text-gold-600 transition-colors line-clamp-1">
                                {service.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                {service.category?.name && (
                                  <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                                    {service.category.name}
                                  </span>
                                )}
                                {vendorName && (
                                  <span className="truncate">by {vendorName}</span>
                                )}
                              </div>
                            </div>
                            {price && (
                              <div className="text-right flex-shrink-0">
                                <span className="text-[10px] text-slate-400 block font-medium">Starts at</span>
                                <span className="text-xs font-bold text-emerald-700 font-mono">${price}</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  ) : !isSearchingGigs ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No services matching &quot;{searchQuery}&quot;
                    </div>
                  ) : null}
                </div>

                {/* Footer link to full search */}
                <Link
                  href={`/vendors?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="block px-3.5 py-2.5 bg-slate-50 hover:bg-[#F2EFE8] text-xs font-bold text-[#0F0C3B] hover:text-gold-600 text-center border-t border-slate-100 transition-colors"
                >
                  View all results for &quot;{searchQuery}&quot; &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 xl:gap-2">
          {/* Occasions Dropdown */}
          <div
            ref={occasionsContainerRef}
            className="relative"
            onMouseEnter={handleOccasionsMouseEnter}
            onMouseLeave={handleOccasionsMouseLeave}
          >
            <button
              type="button"
              onClick={handleOccasionsToggle}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-obsidian rounded-lg transition-colors cursor-pointer select-none",
                isOccasionsOpen && "text-obsidian bg-alabaster-200"
              )}
            >
              <span>Occasions</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", isOccasionsOpen && "rotate-180")} />
            </button>

            {isOccasionsOpen && (
              <div
                className="absolute top-full left-0 pt-2 w-64 z-50 transition-all duration-200"
                onMouseEnter={handleOccasionsMouseEnter}
                onMouseLeave={handleOccasionsMouseLeave}
              >
                {/* Invisible hover bridge to prevent cursor gap */}
                <div className="absolute -top-3 left-0 right-0 h-3" />

                <div className="bg-white rounded-2xl shadow-luxury-lg border border-[#EAE6DF] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Occasion
                  </div>
                  {occasions.map((occ) => (
                    <Link
                      key={occ.title}
                      href={occ.href}
                      onClick={() => {
                        if (occasionsTimeoutRef.current) {
                          clearTimeout(occasionsTimeoutRef.current);
                          occasionsTimeoutRef.current = null;
                        }
                        setIsOccasionsOpen(false);
                      }}
                      className="block px-3.5 py-2 text-xs xl:text-sm text-slate-700 hover:bg-[#F9F7F2] hover:text-obsidian font-medium transition-colors"
                    >
                      {occ.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/services"
            className={cn(
              "px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors",
              pathname.startsWith("/services")
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/50"
            )}
          >
            Services
          </Link>

          <Link
            href="/vendors"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
              pathname.startsWith("/vendors")
                ? "text-[#4F46E5] font-bold"
                : "text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/50"
            )}
          >
            Vendors
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
          {user?.id ? (
            <>
              <Link
                href={dashboardLink}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all shadow-2xs"
              >
                Dashboard
              </Link>

              <Link
                href={user?.role === "CLIENT" ? "/user/post-job" : "/vendors?action=post-job"}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 rounded-lg shadow-sm hover:shadow-indigo-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>Post a Job</span>
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}

          {user?.id && <Link
            href={user?.id ? dashboardLink : "/login"}
            aria-label="Account Profile"
            className="w-9 h-9 rounded-full bg-[#0F0C3B] hover:bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs transition-colors shadow-xs"
            title={user?.name || user?.email || "Account Profile"}
          >
            {user?.id ? userInitials : <User className="w-4 h-4" />}
          </Link>}
        </div>
      </div>
    </header>
  );
}
