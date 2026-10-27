"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  Search, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  MessageSquare, 
  Sparkles,
  ChevronRight,
  Loader2,
  Users2,
} from "lucide-react";
import { useSaveVendorMutation, useGetSavedVendorsQuery } from "@/redux/service/vendors/vendorsApi";
import { toast } from "sonner";

interface SavedVendor {
  id: string;
  slug?: string;
  name: string;
  category: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  location: string;
  startingPrice: number;
  priceUnit: string;
  tier: "Rising Vendor" | "Top Rated" | "Elite Partner";
  image: string;
  specialty: string;
}

export default function UserSavedVendorsPage() {
  const { data: apiSavedData, isLoading } = useGetSavedVendorsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [saveVendor, { isLoading: isRemoving }] = useSaveVendorMutation();

  const rawList = Array.isArray(apiSavedData) ? apiSavedData : (apiSavedData?.data || []);

  const vendors: SavedVendor[] = useMemo(() => {
    return rawList.map((item: any) => {
      const vp = item.vendorProfile || item;
      const cat = vp.categories?.[0]?.category?.name || vp.category?.name || "Event Services";
      const startingPrice = vp.gigs?.[0]?.packages?.[0]?.price
        ? Number(vp.gigs[0].packages[0].price)
        : Number(vp.startingPrice || 0);
      const image =
        vp.portfolio?.[0]?.url ||
        vp.coverUrl ||
        vp.avatarUrl ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800";

      return {
        id: vp.id || item.id,
        slug: vp.slug,
        name: vp.businessName || vp.name || "Vendor Professional",
        category: cat,
        avatar: (vp.businessName || vp.name || "VP").slice(0, 2).toUpperCase(),
        rating: Number(vp.rating || 0),
        reviewsCount: Number(vp.reviewCount || 0),
        location: vp.city ? `${vp.city}${vp.state ? `, ${vp.state}` : ""}` : "Location not listed",
        startingPrice,
        priceUnit: "event",
        tier: vp.tier === "ELITE" ? "Elite Partner" : vp.tier === "PRO" ? "Top Rated" : "Rising Vendor",
        image,
        specialty: vp.bio || vp.tagline || "Vetted event professional on the Ophir platform.",
      };
    });
  }, [rawList]);

  // Dynamically derive available categories from real saved vendors
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    vendors.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return ["All", ...Array.from(set)];
  }, [vendors]);

  const handleRemove = async (id: string, name?: string) => {
    try {
      await saveVendor(id).unwrap();
      toast.success(`Removed ${name || "vendor"} from your saved list`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove vendor from saved list");
    }
  };

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Saved Vendors & Shortlist</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-soft text-foreground">
              {vendors.length} Saved
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Your personal shortlist of vetted professionals. Compare vendor services, check reviews, and book directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            className="px-4 py-2.5 bg-gradient-to-r from-brand to-brand-active hover:from-brand hover:to-brand-active text-foreground rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-foreground" /> Browse All Services
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved vendors or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground-secondary focus:outline-none cursor-pointer"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-surface border border-border rounded-3xl p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-xs text-foreground-muted font-medium">Loading your saved vendors...</p>
        </div>
      ) : filtered.length > 0 ? (
        /* Real Saved Vendors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 w-full bg-surface-sunken overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
                  
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(v.id, v.name)}
                      disabled={isRemoving}
                      className="p-2 rounded-xl bg-surface/90 hover:bg-surface text-foreground-secondary hover:text-danger shadow-xs transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand/90 text-foreground backdrop-blur-xs shadow-xs">
                      {v.tier}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-brand-primary transition-colors">
                        {v.name}
                      </h3>
                      <p className="text-xs text-brand-primary font-semibold mt-0.5">{v.category}</p>
                    </div>

                    <div className="flex items-center text-warning text-xs font-black bg-warning-soft px-2.5 py-1 rounded-xl border border-warning/30">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="ml-1">{v.rating}</span>
                      <span className="text-foreground-muted font-normal ml-0.5">({v.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">
                    {v.specialty}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin className="w-3.5 h-3.5 text-foreground-muted flex-shrink-0" />
                    <span className="truncate">{v.location}</span>
                  </div>

                  <div className="p-3 bg-surface-elevated rounded-2xl border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider">Starting Rate</span>
                      <p className="text-sm font-black text-foreground">
                        ${v.startingPrice.toLocaleString()} <span className="text-xs font-normal text-foreground-muted">/ {v.priceUnit}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-success text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Escrow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                <Link
                  href="/user/messages"
                  className="w-full py-2.5 bg-surface-sunken hover:bg-surface-sunken text-foreground rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </Link>
                <Link
                  href={`/vendors/${v.slug || v.id}`}
                  className="w-full py-2.5 bg-brand hover:bg-info-soft text-foreground rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Clean Real Empty State */
        <div className="bg-surface border border-border rounded-3xl p-14 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-3xl bg-info-soft border border-info/30 flex items-center justify-center text-brand-primary mx-auto">
            <Bookmark className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-foreground">No Saved Vendors Yet</h3>
            <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t shortlisted any vendors yet. Browse through verified event professionals and click the bookmark or heart icon to save your favorites here.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/services"
              className="px-5 py-2.5 bg-brand hover:bg-info-soft text-foreground rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/vendors"
              className="px-4 py-2.5 bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary rounded-xl text-xs font-bold transition-all"
            >
              Browse Vendors
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
