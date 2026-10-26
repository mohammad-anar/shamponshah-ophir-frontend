"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, X, Loader2 } from "lucide-react";
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
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Query matching services from backend /gigs
  const { data: rawGigs, isFetching: isSearchingGigs } = useGetPublicGigsQuery(
    { search: debouncedQuery, limit: 10 },
    { skip: !debouncedQuery || debouncedQuery.length === 0 }
  );

  const matchingServices = (rawGigs as any)?.data || (Array.isArray(rawGigs) ? rawGigs : []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/vendors?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-[#0B0C0E]/95 backdrop-blur-md border-b border-[#26282E] shadow-2xl transition-all">
      <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo & Global Search */}
        <div className="flex items-center gap-6">
          <Logo />

          <div ref={searchContainerRef} className="relative w-64 xl:w-80">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DFB76C]" />
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
                placeholder="Search artisans, traditions, services..."
                className="w-full h-9 pl-9 pr-9 text-xs bg-[#121418] hover:bg-[#16181F] focus:bg-[#121418] text-white placeholder:text-[#94A3B8] rounded-none border border-[#26282E] focus:border-[#DFB76C] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Dropdown with max height = 1/3 of screen */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-[#121418] rounded-none shadow-2xl border border-[#26282E] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header */}
                <div className="px-3.5 py-2 bg-[#0B0C0E] border-b border-[#26282E] flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Matching Artisans & Services</span>
                  {isSearchingGigs && (
                    <span className="flex items-center gap-1 text-[#DFB76C]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Searching...
                    </span>
                  )}
                </div>

                {/* Scrollable list with max height 1/3 of viewport */}
                <div 
                  className="overflow-y-auto divide-y divide-[#1A1D24]"
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
                          className="p-3 block hover:bg-[#1A1D24] transition-colors group cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-200 group-hover:text-[#DFB76C] transition-colors line-clamp-1 font-serif">
                                {service.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                {service.category?.name && (
                                  <span className="inline-block px-1.5 py-0.5 rounded-none bg-[#1E222A] text-[#DFB76C] font-medium text-[10px] uppercase tracking-wider">
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
                                <span className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">Starts at</span>
                                <span className="text-xs font-bold text-[#DFB76C] font-mono">${price}</span>
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
                  className="block px-3.5 py-2.5 bg-[#0B0C0E] hover:bg-[#16181F] text-xs font-bold text-[#DFB76C] text-center border-t border-[#26282E] transition-colors uppercase tracking-widest"
                >
                  View all results for &quot;{searchQuery}&quot; &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 xl:gap-3">
          <Link
            href="/services"
            className={cn(
              "px-3 py-1.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors",
              pathname.startsWith("/services")
                ? "text-[#DFB76C] font-bold"
                : "text-slate-300 hover:text-[#DFB76C]"
            )}
          >
            Services
          </Link>

          <Link
            href="/vendors"
            className={cn(
              "px-3 py-1.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors",
              pathname.startsWith("/vendors")
                ? "text-[#DFB76C] font-bold"
                : "text-slate-300 hover:text-[#DFB76C]"
            )}
          >
            Artisans
          </Link>

          <Link
            href="/how-it-works"
            className={cn(
              "px-3 py-1.5 text-xs uppercase tracking-[0.18em] font-medium text-slate-300 hover:text-[#DFB76C] transition-colors",
              pathname === "/how-it-works" && "text-[#DFB76C] font-bold"
            )}
          >
            Process
          </Link>

          <Link
            href="/help-center"
            className={cn(
              "px-3 py-1.5 text-xs uppercase tracking-[0.18em] font-medium text-slate-300 hover:text-[#DFB76C] transition-colors",
              pathname === "/help-center" && "text-[#DFB76C] font-bold"
            )}
          >
            Vault
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {user?.id ? (
            <>
              <Link
                href={dashboardLink}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#DFB76C] bg-[#121418] hover:bg-[#1A1D24] border border-[#26282E] rounded-none transition-all"
              >
                Dashboard
              </Link>

              <Link
                href={dashboardLink}
                aria-label="Account Profile"
                className="w-8 h-8 rounded-none bg-[#1A1D24] border border-[#26282E] hover:border-[#DFB76C] text-[#DFB76C] flex items-center justify-center font-bold text-xs transition-colors"
                title={user?.name || user?.email || "Account Profile"}
              >
                {userInitials || <User className="w-4 h-4" />}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-xs uppercase tracking-[0.18em] font-semibold text-slate-300 hover:text-[#DFB76C] transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0B0C0E] bg-[#DFB76C] hover:bg-[#ECC870] rounded-none transition-all shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
