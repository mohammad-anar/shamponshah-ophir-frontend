"use client";

import { useState } from "react";
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
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface SavedVendor {
  id: string;
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

const mockSavedVendors: SavedVendor[] = [
  {
    id: "v1",
    name: "Windy City Sound DJ",
    category: "Music & Entertainment",
    avatar: "WC",
    rating: 4.95,
    reviewsCount: 124,
    location: "Chicago, IL (Will Travel 60 mi)",
    startingPrice: 1200,
    priceUnit: "event",
    tier: "Top Rated",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    specialty: "High-energy multi-genre party DJ with wireless sound & uplighting package.",
  },
  {
    id: "v2",
    name: "Lumina Cinematic Films",
    category: "Photography & Cinema",
    avatar: "LC",
    rating: 5.0,
    reviewsCount: 88,
    location: "Chicago, IL",
    startingPrice: 2800,
    priceUnit: "day",
    tier: "Elite Partner",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80",
    specialty: "Documentary-style 4K cinema with licensed aerial drone cinematography.",
  },
  {
    id: "v3",
    name: "Velvet Bloom Florals",
    category: "Decor & Floral Design",
    avatar: "VB",
    rating: 4.88,
    reviewsCount: 65,
    location: "Naperville, IL",
    startingPrice: 1500,
    priceUnit: "setup",
    tier: "Rising Vendor",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80",
    specialty: "Bespoke ceremony arches, organic cascading runners, and bridal floral sets.",
  },
  {
    id: "v4",
    name: "Gourmet Bites & Bar Co.",
    category: "Catering & Bar Service",
    avatar: "GB",
    rating: 4.92,
    reviewsCount: 110,
    location: "Evanston, IL",
    startingPrice: 65,
    priceUnit: "guest",
    tier: "Top Rated",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80",
    specialty: "Farm-to-table farm grazing tables and custom signature cocktail mixology.",
  }
];

export default function UserSavedVendorsPage() {
  const [vendors, setVendors] = useState<SavedVendor[]>(mockSavedVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleRemove = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  const filtered = vendors.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Saved Vendors & Shortlist</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              {vendors.length} Saved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare your shortlisted professionals, check availability calendars, or request customized quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/user/post-job"
            className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Post a Job for All
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved vendors or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F8F9FD] border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Music & Entertainment">Music & Entertainment</option>
            <option value="Photography & Cinema">Photography & Cinema</option>
            <option value="Decor & Floral Design">Decor & Floral Design</option>
            <option value="Catering & Bar Service">Catering & Bar Service</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(v.id)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 shadow-sm transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0F0C3B]/90 text-white backdrop-blur-xs shadow-xs">
                      {v.tier}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#0F0C3B]">{v.name}</h3>
                      <p className="text-xs text-brand-primary font-semibold mt-0.5">{v.category}</p>
                    </div>

                    <div className="flex items-center text-amber-500 text-xs font-black bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="ml-1">{v.rating}</span>
                      <span className="text-slate-400 font-normal ml-0.5">({v.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {v.specialty}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{v.location}</span>
                  </div>

                  <div className="p-3 bg-[#F8F9FD] rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starting Rate</span>
                      <p className="text-sm font-black text-[#0F0C3B]">
                        ${v.startingPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {v.priceUnit}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
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
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </Link>
                <Link
                  href={`/vendors/${v.id}`}
                  className="w-full py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  View Catalog <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F0C3B]">No Saved Vendors Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't bookmarked any vendors matching your criteria yet. Explore our curated catalog of event artisans.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F0C3B] text-white rounded-xl text-xs font-bold mt-2"
          >
            Explore Vendors
          </Link>
        </div>
      )}
    </div>
  );
}
