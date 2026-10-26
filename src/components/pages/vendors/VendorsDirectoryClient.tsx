"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { VENDORS, Vendor } from "@/data/mockData";
import VendorCard from "@/components/ui/VendorCard/VendorCard";
import Pagination from "@/components/ui/Pagination/Pagination";
import { cn } from "@/lib/utils";
import { useGetVendorsQuery } from "@/redux/service/vendors/vendorsApi";
import { useGetCategoriesQuery } from "@/redux/service/categories/categoriesApi";
import { applySessionSeededRanking } from "@/lib/ranking.engine";

const PAGE_SIZE = 12;

export default function VendorsDirectoryPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || searchParams.get("service") || "all";
  const initialLocation = searchParams.get("location") || "All Cities";

  // Filter states
  const [selectedService, setSelectedService] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialLocation);
  const [selectedTier, setSelectedTier] = useState("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedService, selectedCity, selectedTier, minRating, searchQuery, sortBy]);

  const [sessionSeed, setSessionSeed] = useState<string>("default_session_seed");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let seed = sessionStorage.getItem("ophir_browse_seed");
      if (!seed) {
        seed = "seed_" + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("ophir_browse_seed", seed);
      }
      setSessionSeed(seed);
    }
  }, []);

  // RTK Query hooks
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: apiResponse, isLoading: isVendorsLoading } = useGetVendorsQuery({
    category: selectedService !== "all" ? selectedService : undefined,
    city: selectedCity !== "All Cities" ? selectedCity : undefined,
    tier: selectedTier !== "all" ? selectedTier : undefined,
    search: searchQuery.trim() || undefined,
    seed: sessionSeed,
    sortBy: sortBy !== "recommended" ? sortBy : undefined,
    limit: 50,
  });

  const liveCategories = categoriesData?.data || categoriesData || [];

  const allVendors = useMemo(() => {
    const liveVendors: Vendor[] = Array.isArray(apiResponse?.data)
      ? apiResponse.data
      : Array.isArray(apiResponse?.vendors)
      ? apiResponse.vendors
      : Array.isArray(apiResponse)
      ? apiResponse
      : [];
    if (!liveVendors || liveVendors.length === 0) {
      return VENDORS;
    }
    // Merge live vendors with mock data, ensuring no duplicate IDs
    const liveIds = new Set(liveVendors.map((v) => v.id));
    const uniqueMocks = VENDORS.filter((v) => !liveIds.has(v.id));
    return [...liveVendors, ...uniqueMocks];
  }, [apiResponse]);

  const cities = [
    "All Cities",
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Austin, TX",
    "Atlanta",
    "Miami",
    "Seattle",
    "San Francisco",
  ];

  const filteredVendors = useMemo(() => {
    const baseFiltered = allVendors.filter((v: any) => {
      // Service match
      if (selectedService !== "all" && selectedService !== "All Services") {
        if (
          !v.category?.toLowerCase().includes(selectedService.toLowerCase()) &&
          !v.categoryLabel?.toLowerCase().includes(selectedService.toLowerCase())
        ) {
          return false;
        }
      }

      // City match
      if (selectedCity !== "All Cities") {
        if (!v.location.toLowerCase().includes(selectedCity.toLowerCase().replace(", tx", ""))) {
          return false;
        }
      }

      // Tier match
      if (selectedTier !== "all" && selectedTier !== "All Levels") {
        if (v.guildTier.toLowerCase() !== selectedTier.toLowerCase()) {
          return false;
        }
      }

      // Rating match
      if (minRating > 0 && v.rating < minRating) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesTags = Array.isArray(v.tags) && v.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesTags) return false;
      }

      return true;
    });

    if (sortBy === "price-low") {
      return [...baseFiltered].sort((a: any, b: any) => a.startingPrice - b.startingPrice);
    }
    if (sortBy === "price-high") {
      return [...baseFiltered].sort((a: any, b: any) => b.startingPrice - a.startingPrice);
    }
    if (sortBy === "rating") {
      return [...baseFiltered].sort((a: any, b: any) => b.rating - a.rating);
    }

    // Default view: Deterministic session-seeded fair ranking
    return applySessionSeededRanking(
      baseFiltered,
      (v: any) => ({
        id: v.id,
        deliveryRate: v.onTimeDeliveryPct ?? 98,
        cancelRatio: 2,
        tier: v.guildTier || v.tier || "PRO",
        rating: v.rating ?? 4.9,
        ordersCompleted: v.ordersCompleted ?? v.reviewCount ?? 0,
      }),
      sessionSeed,
      24,
    );
  }, [allVendors, selectedService, selectedCity, selectedTier, minRating, searchQuery, sortBy, sessionSeed]);

  const totalPages = Math.ceil(filteredVendors.length / PAGE_SIZE) || 1;
  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredVendors.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredVendors, currentPage]);

  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredVendors.length);

  const handleReset = () => {
    setSelectedService("all");
    setSelectedCity("All Cities");
    setSelectedTier("all");
    setMinRating(0);
    setSearchQuery("");
    setSortBy("recommended");
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-8 lg:py-12 space-y-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Header Title Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#121418] border border-[#DFB76C]/30 text-[#DFB76C] text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Reserve Artisan Directory • Escrow Safeguarded</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Premier Cultural Artisans
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Browse verified masters of ancestral ceremony, haute couture, celebratory banquets, and fine-art cinematography.
          </p>
        </div>

        {/* Primary Search Bar */}
        <div className="bg-[#121418] rounded-none p-3 sm:p-4 shadow-luxury border border-[#26282E] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          <div className="p-3 bg-[#0B0C0E] rounded-none border border-[#26282E]">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              SERVICE OR CRAFT
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kaiseki, Flamenco, Henna, Couture..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-200 placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#0B0C0E] rounded-none border border-[#26282E]">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              LOCATION OR METRO
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-[#121418] text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#0B0C0E] rounded-none border border-[#26282E]">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              CEREMONIAL AVAILABILITY
            </label>
            <div className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Any Weekend 2025/2026</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-full min-h-[50px] px-6 bg-[#DFB76C] hover:bg-[#ECC870] active:scale-98 text-[#0B0C0E] text-xs font-bold uppercase tracking-widest rounded-none shadow-gold-glow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Artisans</span>
          </button>
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#121418] rounded-none border border-[#26282E] shadow-xl">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Service dropdown */}
            <div className="flex items-center gap-1.5 font-medium text-slate-400">
              <span className="uppercase tracking-wider text-[11px]">Craft:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="bg-[#0B0C0E] px-2.5 py-1.5 rounded-none border border-[#26282E] text-slate-200 font-semibold focus:outline-none"
              >
                <option value="all">All Crafts</option>
                {liveCategories.length > 0 ? (
                  liveCategories.map((cat: any) => (
                    <option key={cat.id} value={cat.slug || cat.name.toLowerCase()} className="bg-[#121418] text-slate-200">
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="cinematography">Fine-Art Cinematography</option>
                    <option value="floral">Floral Scenography</option>
                    <option value="music">Live Symphony & Acoustic</option>
                    <option value="catering">Ancestral Cuisine</option>
                    <option value="dessert">Bespoke Confections</option>
                  </>
                )}
              </select>
            </div>

            {/* Guild Tier dropdown */}
            <div className="flex items-center gap-1.5 font-medium text-slate-400">
              <span className="uppercase tracking-wider text-[11px]">Artisan Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-[#0B0C0E] px-2.5 py-1.5 rounded-none border border-[#26282E] text-slate-200 font-semibold focus:outline-none"
              >
                <option value="all">All Tiers</option>
                <option value="Elite">Elite Artisan (Top 2%)</option>
                <option value="Pro">Master Craftsman</option>
                <option value="Rising">Rising Virtuoso</option>
                <option value="Sprout">Verified Artisan</option>
              </select>
            </div>

            {/* Rating dropdown */}
            <div className="flex items-center gap-1.5 font-medium text-slate-400">
              <span className="uppercase tracking-wider text-[11px]">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-[#0B0C0E] px-2.5 py-1.5 rounded-none border border-[#26282E] text-slate-200 font-semibold focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
                <option value={4.9}>4.9+ Stars</option>
              </select>
            </div>

            {/* Verified toggle */}
            <label className="flex items-center gap-2 cursor-pointer ml-2 text-slate-300 font-semibold select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded-none accent-[#DFB76C]"
              />
              <span className="text-xs">Verified Artisans Only</span>
            </label>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#DFB76C] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-shrink-0">
            METROPOLITAN REGIONS:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "px-3 py-1 rounded-none text-xs font-semibold whitespace-nowrap transition-all border",
                selectedCity === city
                  ? "bg-[#DFB76C] text-[#0B0C0E] border-[#DFB76C] shadow-gold-glow-sm"
                  : "bg-[#121418] text-slate-400 hover:text-[#DFB76C] border-[#26282E] hover:border-[#DFB76C]/40"
              )}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Results Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-200">
              Showing {filteredVendors.length > 0 ? `${startIndex}–${endIndex}` : 0} of {filteredVendors.length} verified artisans
            </span>

            {selectedService !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] border border-[#26282E] text-xs font-medium">
                {selectedService}
                <button onClick={() => setSelectedService("all")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCity !== "All Cities" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] border border-[#26282E] text-xs font-medium">
                {selectedCity}
                <button onClick={() => setSelectedCity("All Cities")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121418] px-3 py-1.5 rounded-none border border-[#26282E] text-slate-200 font-semibold focus:outline-none"
            >
              <option value="recommended">Recommended / Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rating Only</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedVendors.map((vendor: any) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 350, behavior: "smooth" });
              }}
              theme="indigo"
            />
          </div>
        ) : (
          <div className="w-full py-16 bg-[#121418] rounded-none border border-[#26282E] text-center space-y-4">
            <Sparkles className="w-8 h-8 text-[#DFB76C] mx-auto" />
            <h3 className="font-serif font-bold text-xl text-white">No artisans match your exact criteria</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Try adjusting your region or craft filters to discover more master artisans across the Reserve network.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold uppercase tracking-widest rounded-none shadow-gold-glow-sm transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Bottom Guild CTA Banner */}
        <div className="p-8 sm:p-10 rounded-none bg-[#121418] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-[#26282E]">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-[#DFB76C] uppercase tracking-widest">
              THE RESERVE ARTISAN GUILD
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Elevate your craft to the Reserve.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Retain 100% of agreed earnings with zero bidding fees, verified patronage, and guaranteed milestone escrow protection on every ceremony.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register?role=vendor"
              className="px-6 py-3 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] font-bold text-xs uppercase tracking-widest rounded-none shadow-gold-glow-sm transition-all"
            >
              Register as Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
