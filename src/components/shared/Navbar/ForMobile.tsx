"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, User, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import Logo from "../Logo/Logo";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { useGetPublicGigsQuery } from "@/redux/service/gigs/gigsApi";
import { useAppSelector } from "@/redux/hooks/hooks";

export default function ForMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

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
            href={user?.id ? dashboardLink : "/login"}
            className="w-8 h-8 rounded-full bg-[#0F1228] text-white flex items-center justify-center text-xs font-bold"
            title={user?.name || user?.email || "Account Profile"}
          >
            {user?.id ? userInitials : <User className="w-3.5 h-3.5" />}
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
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, vendors, venues..."
                  className="w-full h-11 pl-10 pr-9 text-sm bg-[#F4F2EE] text-obsidian rounded-xl border border-transparent focus:border-gold-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Mobile Services Dropdown (max-height = 1/3 screen) */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-2 bg-white rounded-2xl shadow-luxury-lg border border-[#EAE6DF] overflow-hidden">
                  <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Matching Services</span>
                    {isSearchingGigs && (
                      <span className="flex items-center gap-1 text-gold-600">
                        <Loader2 className="w-3 h-3 animate-spin" /> Searching...
                      </span>
                    )}
                  </div>

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
                            onClick={() => setIsOpen(false)}
                            className="p-3 block hover:bg-[#F9F7F2] transition-colors"
                          >
                            <p className="text-xs font-bold text-obsidian line-clamp-1">
                              {service.title}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                              <span className="truncate">{vendorName ? `by ${vendorName}` : service.category?.name}</span>
                              {price && (
                                <span className="font-bold text-emerald-700 font-mono text-xs ml-2">
                                  ${price}
                                </span>
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

                  <Link
                    href={`/vendors?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-3.5 py-2.5 bg-slate-50 hover:bg-[#F2EFE8] text-xs font-bold text-[#0F0C3B] text-center border-t border-slate-100"
                  >
                    View all results &rarr;
                  </Link>
                </div>
              )}
            </div>

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
                href="/services"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-base border-b border-slate-100 font-semibold",
                  pathname.startsWith("/services") ? "text-[#4F46E5]" : "text-slate-800 hover:text-[#4F46E5]"
                )}
              >
                Services Catalog
              </Link>

              <Link
                href="/vendors"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-base border-b border-slate-100 font-medium",
                  pathname.startsWith("/vendors") ? "text-[#4F46E5]" : "text-slate-800 hover:text-[#4F46E5]"
                )}
              >
                Vendors Directory
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
            {user?.id ? (
              <>
                <Link
                  href={user?.role === "CLIENT" ? "/user/post-job" : "/vendors?action=post-job"}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-center block text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-md transition-all"
                >
                  Post a Job
                </Link>

                <Link
                  href={dashboardLink}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center block text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200"
                >
                  Go to Dashboard ({user?.role === "VENDOR" ? "Vendor Hub" : user?.role === "ADMIN" ? "Admin Console" : "My Account"})
                </Link>
              </>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </header>
  );
}
