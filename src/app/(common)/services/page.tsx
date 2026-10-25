"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  Filter,
  Users2,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";
import { VENDORS } from "@/data/mockData";
import { useGetPublicGigsQuery } from "@/redux/service/gigs/gigsApi";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";

const CATEGORIES = [
  "All Services",
  "Cinematography",
  "Floral Design",
  "Live Music & DJ",
  "Vendor Catering",
  "Lighting & Production",
  "Event Planning",
  "Dessert & Cake",
];

export default function ServicesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "under1000" | "1000-2500" | "over2500">("all");
  const [selectedServiceForHub, setSelectedServiceForHub] = useState<any | null>(null);

  const { data: gigsResp, isLoading: isGigsLoading } = useGetPublicGigsQuery();
  const dbGigs = gigsResp?.data || (Array.isArray(gigsResp) ? gigsResp : []);

  // Merge database gigs with curated mock catalog
  const allServices = useMemo(() => {
    const list: any[] = [];

    // From Database
    if (Array.isArray(dbGigs) && dbGigs.length > 0) {
      dbGigs.forEach((g: any) => {
        const pkg = g.packages?.[0];
        const minPrice = pkg ? Number(pkg.price) : 750;
        list.push({
          id: g.slug || g.id,
          realId: g.id,
          vendorProfileId: g.vendorProfileId,
          packageId: pkg?.id,
          title: g.title,
          category: g.category?.name || "Vendor Service",
          description: g.description,
          startingPrice: minPrice,
          image:
            g.gallery?.[0]?.url ||
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
          vendorName: g.vendorProfile?.businessName || "Verified Vendor",
          vendorAvatar:
            g.vendorProfile?.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          rating: g.vendorProfile?.rating || 4.9,
          reviewCount: g.vendorProfile?.reviewCount || 24,
          tier: g.vendorProfile?.tier || "PRO",
          location: `${g.vendorProfile?.city || "Chicago"}, ${g.vendorProfile?.state || "IL"}`,
          features: pkg?.features || [
            "Full Event Execution & Setup",
            "Dedicated On-site Coordinator",
            "100% Milestone Escrow Protection",
          ],
        });
      });
    }

    // Curated catalog from VENDORS mock data
    VENDORS.forEach((v) => {
      v.packages.forEach((pkg, idx) => {
        list.push({
          id: `${v.id}-pkg-${idx}`,
          realId: `${v.id}-pkg-${idx}`,
          vendorProfileId: v.id,
          packageId: pkg.id,
          title: `${v.name} — ${pkg.title}`,
          category: v.categoryLabel || "Vendor Service",
          description: pkg.description || v.bio,
          startingPrice: pkg.price,
          image: v.galleryImages[idx % v.galleryImages.length] || v.heroImage || v.avatar,
          vendorName: v.name,
          vendorAvatar: v.avatar,
          rating: v.rating,
          reviewCount: v.reviewCount,
          tier: v.guildTier,
          location: v.location,
          features: pkg.features || [
            `${pkg.hours} continuous coverage`,
            `Guaranteed ${pkg.turnaround}`,
            "Escrow Milestone Safety",
          ],
        });
      });
    });

    return list;
  }, [dbGigs]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return allServices.filter((s) => {
      // Category match
      if (selectedCategory !== "All Services") {
        if (!s.category.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 5))) {
          return false;
        }
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesVendor = s.vendorName.toLowerCase().includes(q);
        const matchesCat = s.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesVendor && !matchesCat) return false;
      }
      // Price filter
      if (priceFilter === "under1000" && s.startingPrice >= 1000) return false;
      if (priceFilter === "1000-2500" && (s.startingPrice < 1000 || s.startingPrice > 2500)) return false;
      if (priceFilter === "over2500" && s.startingPrice <= 2500) return false;

      return true;
    });
  }, [allServices, selectedCategory, searchQuery, priceFilter]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Add To Family Hub Modal */}
      {selectedServiceForHub && (
        <AddToFamilyHubModal
          isOpen={Boolean(selectedServiceForHub)}
          onClose={() => setSelectedServiceForHub(null)}
          service={{
            id: selectedServiceForHub.id,
            name: selectedServiceForHub.title,
            category: selectedServiceForHub.category,
            price: selectedServiceForHub.startingPrice,
            vendorName: selectedServiceForHub.vendorName,
            image: selectedServiceForHub.image,
          }}
        />
      )}

      {/* Hero Header */}
      <div className="bg-[#0F0C3B] text-white pt-16 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Vendor Marketplace • 100% Escrow Safeguarded</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight font-serif">
            Book Verified Vendors & Services for Every Life Milestone
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Choose exceptional event photographers, live musicians, gourmet caterers, and floral designers. 
            Recommend services to your Family Hub or book directly with milestone-protected payments.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-3xl">
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 px-3 py-2 w-full text-slate-700">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search cinematography, jazz bands, floral arches, private chefs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-[#0F0C3B] focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 px-2 sm:px-0">
                <select
                  value={priceFilter}
                  onChange={(e: any) => setPriceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">Any Price</option>
                  <option value="under1000">Under $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="over2500">$2,500+</option>
                </select>

                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] text-white text-xs font-bold hover:bg-[#1C1656] transition-all shrink-0 cursor-pointer"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 relative z-10">
        {/* Category Pills Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0F0C3B] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Fast Info */}
        <div className="flex items-center justify-between mt-8 mb-6 text-xs text-slate-500">
          <p>
            Showing <strong className="text-[#0F0C3B] font-bold">{filteredServices.length}</strong> available vendor services
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Escrow Protection Included
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Image & Badges */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top Floating Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#0F0C3B] uppercase tracking-wider shadow-sm">
                    {service.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-slate-950" />
                    {service.rating} ({service.reviewCount})
                  </span>
                </div>

                {/* Bottom Floating Price */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-300 block">Starting at</span>
                    <span className="text-2xl font-black font-serif">${service.startingPrice.toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {service.location}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Vendor Info */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
                      <Image
                        src={service.vendorAvatar}
                        alt={service.vendorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate">{service.vendorName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {service.tier}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <Link href={`/services/${service.id}`} className="block group-hover:text-brand-primary transition-colors">
                    <h3 className="font-serif font-bold text-base text-[#0F0C3B] line-clamp-1">
                      {service.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100">
                    {service.features.slice(0, 3).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/services/${service.id}`}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F0C3B] text-xs font-bold text-center border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/checkout?vendorId=${service.vendorProfileId}&packageId=${service.packageId || ""}`}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0F0C3B] text-xs font-extrabold text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Recommend to Family Hub Button */}
                  <button
                    onClick={() => setSelectedServiceForHub(service)}
                    className="w-full py-2 px-3 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-brand-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Users2 className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Recommend to Family Hub</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto my-12 space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F0C3B]">No matching services found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your keyword search or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Services");
                setSearchQuery("");
                setPriceFilter("all");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#0F0C3B] text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
