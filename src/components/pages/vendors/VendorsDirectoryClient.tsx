"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { VENDORS, Vendor } from "@/data/mockData";
import VendorCard from "@/components/ui/VendorCard/VendorCard";
import { cn } from "@/lib/utils";

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
    return VENDORS.filter((v) => {
      // Service match
      if (selectedService !== "all" && selectedService !== "All Services") {
        if (
          !v.category.toLowerCase().includes(selectedService.toLowerCase()) &&
          !v.categoryLabel.toLowerCase().includes(selectedService.toLowerCase())
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
        const matchesTags = v.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.startingPrice - b.startingPrice;
      if (sortBy === "price-high") return b.startingPrice - a.startingPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [selectedService, selectedCity, selectedTier, minRating, searchQuery, sortBy]);

  const handleReset = () => {
    setSelectedService("all");
    setSelectedCity("All Cities");
    setSelectedTier("all");
    setMinRating(0);
    setSearchQuery("");
    setSortBy("recommended");
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 lg:py-12 space-y-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Header Title Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Milestone Escrow Vault Verified • Nationwide Celebration Network</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-obsidian tracking-tight">
            Find trusted event vendors
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Browse 4,200+ verified US photographers, caterers, DJs, florists, and celebration pros backed by milestone escrow protection.
          </p>
        </div>

        {/* Primary Search Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-luxury border border-[#EAE6DF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SERVICE OR CRAFT
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Photography, Floral, DJ..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-obsidian focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CITY OR ZIP
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-obsidian focus:outline-none"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#EAE6DF]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              EVENT AVAILABILITY
            </label>
            <div className="text-xs sm:text-sm font-semibold text-obsidian flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Any Weekend 2025/2026</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-full min-h-[50px] px-6 bg-[#0F1228] hover:bg-[#1A1F40] active:scale-98 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find Artisans</span>
          </button>
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#EAE6DF] shadow-xs">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Service dropdown */}
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <span>Service:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="bg-[#F4F2EE] px-2.5 py-1.5 rounded-lg text-obsidian font-semibold focus:outline-none"
              >
                <option value="all">All Services</option>
                <option value="cinematography">Cinematography & Photo</option>
                <option value="floral">Floral & Stage</option>
                <option value="music">Live Music & DJ</option>
                <option value="catering">Catering & Banquets</option>
                <option value="dessert">Bespoke Cakes</option>
              </select>
            </div>

            {/* Guild Tier dropdown */}
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <span>Guild Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-[#F4F2EE] px-2.5 py-1.5 rounded-lg text-obsidian font-semibold focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="Elite">Elite Guild (Top 2%)</option>
                <option value="Pro">Pro Vendor</option>
                <option value="Rising">Rising Talent</option>
                <option value="Sprout">Sprout (Verified ID)</option>
              </select>
            </div>

            {/* Rating dropdown */}
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <span>Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-[#F4F2EE] px-2.5 py-1.5 rounded-lg text-obsidian font-semibold focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
                <option value={4.9}>4.9+ Stars</option>
              </select>
            </div>

            {/* Verified toggle */}
            <label className="flex items-center gap-2 cursor-pointer ml-2 text-slate-700 font-semibold select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#0F1228] focus:ring-0"
              />
              <span>Verified Vendors Only</span>
            </label>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-obsidian font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            BROWSE BY CITY:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                selectedCity === city
                  ? "bg-[#0F1228] text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-[#EAE6DF] border border-[#EAE6DF]"
              )}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Results Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-obsidian">
              Showing {filteredVendors.length} verified vendors in the United States
            </span>

            {selectedService !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                {selectedService}
                <button onClick={() => setSelectedService("all")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCity !== "All Cities" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                {selectedCity}
                <button onClick={() => setSelectedCity("All Cities")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-lg border border-[#EAE6DF] text-obsidian font-semibold focus:outline-none shadow-2xs"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 bg-white rounded-3xl border border-[#EAE6DF] text-center space-y-4">
            <Sparkles className="w-8 h-8 text-gold-500 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-obsidian">No vendors match your exact filters</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your location or category filters to see more verified master artisans across the network.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Bottom Guild CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F0C3B] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury border border-white/10">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              OPHIR GUILD ACCREDITATION
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Turn your event talent into guaranteed bookings.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Keep 100% of your earnings with zero bidding fees, verified high-budget hosts, and automated milestone escrow protection on every contract.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/become-a-vendor"
              className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all"
            >
              Apply as an Artisan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
