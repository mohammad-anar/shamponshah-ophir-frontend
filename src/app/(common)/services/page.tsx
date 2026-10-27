"use client";

import { useState, useMemo, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useGetPublicGigsQuery } from "@/redux/service/gigs/gigsApi";
import { useGetCategoriesQuery } from "@/redux/service/categories/categoriesApi";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";
import Pagination from "@/components/ui/Pagination/Pagination";
import { useTrackImpression, trackClick } from "@/lib/tracking";
import { applySessionSeededRanking } from "@/lib/ranking.engine";

const PAGE_SIZE = 9;

export default function ServicesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "under1000" | "1000-2500" | "over2500">("all");
  const [selectedServiceForHub, setSelectedServiceForHub] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceFilter]);

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

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: gigsResp, isLoading: isGigsLoading } = useGetPublicGigsQuery({ 
    limit: 100,
    seed: sessionSeed,
  });
  const dbGigs = gigsResp?.data || (Array.isArray(gigsResp) ? gigsResp : []);

  const apiCategories = useMemo(() => {
    const raw = Array.isArray(categoriesData)
      ? categoriesData
      : Array.isArray((categoriesData as any)?.data)
      ? (categoriesData as any).data
      : [];
    if (raw.length > 0) {
      return ["All Services", ...raw.map((c: any) => c.name)];
    }
    return [
      "All Services",
      "Photography & Cinema",
      "Music & Entertainment",
      "Floral & Event Decor",
      "Catering & Artisanal Dining",
      "Craft Bartending & Mixology",
      "Cakes & Milestone Desserts",
    ];
  }, [categoriesData]);

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
          category: typeof g.category === "object" ? g.category?.name : (g.category || "Vendor Service"),
          tags: Array.isArray(g.tags) ? g.tags : [],
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

    return list;
  }, [dbGigs]);

  // Filtered services
  const filteredServices = useMemo(() => {
    const baseFiltered = allServices.filter((s: any) => {
      // Category match
      if (selectedCategory !== "All Services") {
        const catLower = (s.category || "").toLowerCase();
        const selLower = selectedCategory.toLowerCase();
        const matchesCategory =
          catLower.includes(selLower) ||
          selLower.includes(catLower) ||
          (selLower.includes("music") && (catLower.includes("music") || catLower.includes("dj"))) ||
          (selLower.includes("photo") && (catLower.includes("photo") || catLower.includes("cinema"))) ||
          (selLower.includes("cater") && catLower.includes("cater")) ||
          (selLower.includes("cake") && (catLower.includes("cake") || catLower.includes("dessert")));
        if (!matchesCategory) return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title?.toLowerCase().includes(q);
        const matchesVendor = s.vendorName?.toLowerCase().includes(q);
        const matchesCat = s.category?.toLowerCase().includes(q);
        const matchesTags = Array.isArray(s.tags) && s.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesVendor && !matchesCat && !matchesTags) return false;
      }
      // Price filter
      if (priceFilter === "under1000" && s.startingPrice >= 1000) return false;
      if (priceFilter === "1000-2500" && (s.startingPrice < 1000 || s.startingPrice > 2500)) return false;
      if (priceFilter === "over2500" && s.startingPrice <= 2500) return false;

      return true;
    });

    return applySessionSeededRanking(
      baseFiltered,
      (s: any) => ({
        id: s.id,
        deliveryRate: 98,
        cancelRatio: 2,
        tier: s.tier || "PRO",
        rating: s.rating ?? 4.9,
        ordersCompleted: s.reviewCount ?? 0,
      }),
      sessionSeed,
      24,
    );
  }, [allServices, selectedCategory, searchQuery, priceFilter, sessionSeed]);

  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE) || 1;
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredServices.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredServices, currentPage]);

  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredServices.length);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
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
      <div className="bg-background border-b border-border text-foreground pt-16 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-brand-active/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border-brand/40 text-brand text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Reserve Collection • 100% Escrow Safeguarded</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight font-serif text-foreground">
            Curated Artisans & Ceremonial Mastercraft
          </h1>

          <p className="text-foreground-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            Discover verified culinary masters, ancestral attire weavers, ceremonial musicians, and fine-art cinematographers. 
            Recommend services to your Collaborative Hub or reserve with milestone-protected payments.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-3xl">
            <div className="bg-surface rounded-none p-2 border border-border shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 px-3 py-2 w-full text-foreground-secondary">
                <Search className="w-5 h-5 text-foreground-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Search ceremony, kaiseki, flamenco, fine-art attire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm bg-transparent text-foreground-secondary focus:outline-none placeholder:text-foreground-muted"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 px-2 sm:px-0">
                <select
                  value={priceFilter}
                  onChange={(e: any) => setPriceFilter(e.target.value)}
                  className="px-3 py-2 rounded-none bg-background border border-border text-xs font-semibold text-foreground-secondary focus:outline-none cursor-pointer"
                >
                  <option value="all">Any Price</option>
                  <option value="under1000">Under $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="over2500">$2,500+</option>
                </select>

                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-none bg-brand text-on-brand text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-all shrink-0 cursor-pointer shadow-gold-glow-sm"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 relative z-10">
        {/* Category Pills Bar */}
        <div className="bg-surface rounded-none p-3 shadow-md border border-border flex items-center gap-2 overflow-x-auto scrollbar-none">
          {apiCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-brand text-on-brand border-border-brand shadow-gold-glow-sm"
                    : "bg-background text-foreground-muted border-border hover:text-brand hover:border-border-brand/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Fast Info */}
        <div className="flex items-center justify-between mt-8 mb-6 text-xs text-foreground-muted">
          <p>
            Showing <strong className="text-brand font-bold">{filteredServices.length > 0 ? `${startIndex}–${endIndex}` : 0}</strong> of{" "}
            <strong className="text-brand font-bold">{filteredServices.length}</strong> available ceremonial services
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-brand bg-surface px-2.5 py-1 rounded-none border border-border-brand/40 uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              Escrow Protection Included
            </span>
          </div>
        </div>

        {/* Services Grid or Loading */}
        {isGigsLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-xs text-foreground-muted uppercase tracking-widest font-semibold">
              Loading ceremonial artisan services...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.map((service) => (
                <TrackedServiceCard
                  key={service.id}
                  service={service}
                  onOpenHub={(s) => setSelectedServiceForHub(s)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 340, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}

        {!isGigsLoading && filteredServices.length === 0 && (
          <div className="p-16 text-center bg-surface rounded-none border border-border shadow-xl max-w-lg mx-auto my-12 space-y-3">
            <Search className="w-10 h-10 text-foreground-secondary mx-auto" />
            <h3 className="text-base font-bold text-foreground font-serif">No matching services found</h3>
            <p className="text-xs text-foreground-muted">
              Try adjusting your keyword search or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Services");
                setSearchQuery("");
                setPriceFilter("all");
              }}
              className="mt-2 px-4 py-2 rounded-none bg-brand text-on-brand text-xs font-bold uppercase tracking-widest cursor-pointer shadow-gold-glow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TrackedServiceCard({
  service,
  onOpenHub,
}: {
  service: any;
  onOpenHub: (service: any) => void;
}) {
  const cardRef = useTrackImpression("GIG", service.realId || service.id);

  return (
    <div
      ref={cardRef}
      className="bg-surface rounded-none overflow-hidden border border-border hover:border-border-brand/40 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
    >
      {/* Image & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-background">
        <Link
          href={`/services/${service.id}`}
          onClick={() => trackClick("GIG", service.realId || service.id)}
          className="absolute inset-0 z-0"
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-none bg-background/85 backdrop-blur-md text-[10px] font-bold text-brand uppercase tracking-widest border border-border-brand/40 shadow-sm pointer-events-auto">
            {service.category}
          </span>
          <span className="px-2 py-0.5 rounded-none bg-surface-sunken text-brand border border-border text-[10px] font-bold flex items-center gap-1 shadow-sm pointer-events-auto">
            <Star className="w-3 h-3 fill-brand text-brand" />
            {service.rating} ({service.reviewCount})
          </span>
        </div>

        {/* Bottom Floating Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-foreground pointer-events-none">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-foreground-muted block font-bold">Starting at</span>
            <span className="text-2xl font-bold font-mono text-brand">${service.startingPrice.toLocaleString()}</span>
          </div>
          <span className="text-[11px] font-medium text-foreground-secondary flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            {service.location}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Vendor Info */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="relative w-7 h-7 rounded-none overflow-hidden border border-border shrink-0 bg-background">
              <Image
                src={service.vendorAvatar}
                alt={service.vendorName}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-bold text-foreground-secondary truncate">{service.vendorName}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-surface-sunken text-brand border border-border-brand/40 rounded-none uppercase tracking-wider">
              {service.tier}
            </span>
          </div>

          {/* Title & Description */}
          <Link
            href={`/services/${service.id}`}
            onClick={() => trackClick("GIG", service.realId || service.id)}
            className="block group-hover:text-brand transition-colors"
          >
            <h3 className="font-serif font-bold text-base text-foreground group-hover:text-brand transition-colors line-clamp-1">
              {service.title}
            </h3>
          </Link>
          <p className="text-xs text-foreground-muted mt-1 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Feature Bullets */}
          <div className="mt-3.5 space-y-1.5 pt-3 border-t border-border">
            {service.features.slice(0, 3).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-foreground-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="truncate">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card CTA Actions */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/services/${service.id}`}
              onClick={() => trackClick("GIG", service.realId || service.id)}
              className="px-3 py-2 rounded-none bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary text-xs font-bold text-center border border-border hover:border-border-brand/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/checkout?vendorId=${service.vendorProfileId}&packageId=${service.packageId || ""}`}
              onClick={() => trackClick("GIG", service.realId || service.id, { action: "book_now" })}
              className="px-3 py-2 rounded-none bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-wider text-center shadow-gold-glow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommend to Family Hub Button */}
          <button
            onClick={() => onOpenHub(service)}
            className="w-full py-2 px-3 rounded-none border border-border bg-surface-sunken hover:bg-surface-sunken hover:border-border-brand/40 text-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Users2 className="w-3.5 h-3.5 text-brand" />
            <span>Recommend to Family Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
