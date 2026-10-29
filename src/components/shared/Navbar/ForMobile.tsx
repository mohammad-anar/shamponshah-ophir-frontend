"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, User, Loader2 } from "lucide-react";
import Logo from "../Logo/Logo";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { useGetPublicGigsQuery } from "@/redux/service/gigs/gigsApi";
import { useAppSelector } from "@/redux/hooks/hooks";

export default function ForMobile() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-2xl">
      <div className="px-4 h-[68px] flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <Link
            href={user?.id ? dashboardLink : "/login"}
            className="w-8 h-8 rounded-none bg-surface-sunken border border-border text-brand flex items-center justify-center text-xs font-bold"
            title={user?.name || user?.email || "Account Profile"}
          >
            {user?.id ? userInitials : <User className="w-3.5 h-3.5" />}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-none text-foreground-secondary hover:text-brand transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 bg-background z-50 flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-top-4 duration-200 border-t border-border">
          <div className="space-y-5">
            {/* Mobile Search */}
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artisans, traditions, services..."
                  className="w-full h-10 pl-10 pr-9 text-xs bg-surface text-foreground placeholder:text-foreground-muted rounded-none border border-border focus:border-border-brand focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Mobile Services Dropdown (max-height = 1/3 screen) */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-2 bg-surface rounded-none shadow-2xl border border-border overflow-hidden">
                  <div className="px-3.5 py-2 bg-background border-b border-border flex items-center justify-between text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                    <span>Matching Artisans & Services</span>
                    {isSearchingGigs && (
                      <span className="flex items-center gap-1 text-brand">
                        <Loader2 className="w-3 h-3 animate-spin" /> Searching...
                      </span>
                    )}
                  </div>

                  <div 
                    className="overflow-y-auto divide-y divide-surface-sunken"
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
                            className="p-3 block hover:bg-surface-sunken transition-colors"
                          >
                            <p className="text-xs font-bold text-foreground-secondary line-clamp-1 font-serif">
                              {service.title}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-foreground-muted mt-1">
                              <span className="truncate">{vendorName ? `by ${vendorName}` : service.category?.name}</span>
                              {price && (
                                <span className="font-bold text-brand font-mono text-xs ml-2">
                                  ${price}
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })
                    ) : !isSearchingGigs ? (
                      <div className="p-4 text-center text-xs text-foreground-muted">
                        No services matching &quot;{searchQuery}&quot;
                      </div>
                    ) : null}
                  </div>

                  <Link
                    href={`/vendors?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-3.5 py-2.5 bg-background hover:bg-surface-elevated text-xs font-bold text-brand text-center border-t border-border uppercase tracking-wider"
                  >
                    View all results &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1 font-medium">
              <Link
                href="/services"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-xs uppercase tracking-widest border-b border-border",
                  pathname.startsWith("/services") ? "text-brand font-bold" : "text-foreground-secondary hover:text-brand"
                )}
              >
                Services Catalog
              </Link>

              <Link
                href="/cultural-traditions"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-xs uppercase tracking-widest border-b border-border",
                  pathname.startsWith("/cultural-traditions") ? "text-brand font-bold" : "text-foreground-secondary hover:text-brand"
                )}
              >
                Cultural Traditions
              </Link>

              <Link
                href="/vendors"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-xs uppercase tracking-widest border-b border-border",
                  pathname.startsWith("/vendors") ? "text-brand font-bold" : "text-foreground-secondary hover:text-brand"
                )}
              >
                Premier Artisans
              </Link>

              <Link
                href="/how-it-works"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-xs uppercase tracking-widest text-foreground-secondary hover:text-brand border-b border-border"
              >
                The Process
              </Link>

              <Link
                href="/help-center"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-xs uppercase tracking-widest text-foreground-secondary hover:text-brand border-b border-border"
              >
                Escrow Vault
              </Link>

              <Link
                href="/signup?role=vendor"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-xs uppercase tracking-widest text-brand font-bold border-b border-border"
              >
                Become a Vendor
              </Link>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-6 border-t border-border">
            {user?.id ? (
              <Link
                href={dashboardLink}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-center block text-xs font-bold uppercase tracking-wider text-brand bg-surface hover:bg-surface-sunken rounded-none border border-border"
              >
                Dashboard ({user?.role === "VENDOR" ? "Artisan Portal" : user?.role === "ADMIN" ? "Admin Console" : "Client Portal"})
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-foreground-secondary bg-surface border border-border hover:bg-surface-sunken rounded-none"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?role=client"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-xs font-bold uppercase tracking-widest text-on-brand bg-brand hover:bg-brand-hover rounded-none"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
