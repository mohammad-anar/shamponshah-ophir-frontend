"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Star, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const gigsList = [
  {
    id: "GIG-101",
    title: "High-Energy DJ & Live Interactive MC for Milestone Celebrations",
    vendor: "Party Pulse Events (Marcus Reed)",
    category: "DJs & Emcees",
    occasion: "Birthdays, Weddings",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=300",
    priceRange: "$450 – $1,400",
    rating: "4.9 (124 reviews)",
    status: "ACTIVE",
    isFeatured: true,
    compliance: "Verified Insurance & Audio Specs",
  },
  {
    id: "GIG-102",
    title: "Full-Day 4K Cinema & Drone Coverage with 48h Teaser Reel",
    vendor: "Amina Rahman Visuals",
    category: "Photography & Film",
    occasion: "Weddings, Galas",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=300",
    priceRange: "$1,200 – $2,800",
    rating: "5.0 (89 reviews)",
    status: "ACTIVE",
    isFeatured: true,
    compliance: "FAA Part 107 Drone Certified",
  },
  {
    id: "GIG-103",
    title: "Organic Pastel Floral Balloon Arch & Luxury Photo Backdrops",
    vendor: "Bloom Studio Chicago",
    category: "Decor & Styling",
    occasion: "Baby Showers, Birthdays",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=300",
    priceRange: "$350 – $950",
    rating: "4.8 (64 reviews)",
    status: "PENDING_REVIEW",
    isFeatured: false,
    compliance: "Awaiting material safety spec",
  },
  {
    id: "GIG-104",
    title: "Custom 3-Tier Fondant Sculpted Milestone Cake & Macaron Towers",
    vendor: "Chef Marcus (Sweet Delights)",
    category: "Bakery & Desserts",
    occasion: "Birthdays, Anniversaries",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=300",
    priceRange: "$250 – $650",
    rating: "4.9 (42 reviews)",
    status: "ACTIVE",
    isFeatured: false,
    compliance: "ServSafe Certified Kitchen",
  },
];

export default function AdminGigsModerationPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [gigs, setGigs] = useState(gigsList);

  const handleModerate = (id: string, action: string) => {
    setGigs(gigs.map(g => {
      if (g.id === id) {
        if (action === "approved and verified") return { ...g, status: "ACTIVE" };
        if (action === "flagged for revision") return { ...g, status: "PENDING_REVIEW" };
        if (action === "suspended") return { ...g, status: "SUSPENDED" };
      }
      return g;
    }));
    toast.success(`Gig ${id} has been ${action}.`);
  };

  const filteredGigs = gigs.filter((gig) => {
    const matchesFilter = activeFilter === "ALL" || gig.status === activeFilter;
    const matchesSearch = 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Gig Catalog &amp; Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review service listings, audit pricing tiers, verify insurance and certifications, and manage marketplace listings
          </p>
        </div>
      </div>

      {/* Gigs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-[#F8F9FD]/50">
          <div className="flex items-center gap-2">
            {["ALL", "ACTIVE", "PENDING_REVIEW"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                  activeFilter === f 
                    ? "bg-[#0F0C3B] text-white shadow-xs" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                )}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search gigs, vendors, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#EDE9FE]/40 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Service Gig</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing Bounds</th>
                <th className="py-3.5 px-4">Status &amp; Compliance</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGigs.map((gig) => (
                <tr key={gig.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-200">
                        <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div>
                        <Link 
                          href={`/admin/gigs/${gig.id}`}
                          className="font-bold text-[#0F0C3B] hover:text-brand-primary line-clamp-1 text-xs block transition-colors"
                        >
                          {gig.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-brand-primary bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                            #{gig.id}
                          </span>
                          {gig.isFeatured && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {gig.vendor}
                    <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {gig.rating}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-medium text-[#0F0C3B]">{gig.category}</span>
                    <span className="text-[10px] text-slate-400 block">{gig.occasion}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B] font-mono">{gig.priceRange}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block",
                      gig.status === "ACTIVE" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    )}>
                      {gig.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      {gig.compliance}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      href={`/admin/gigs/${gig.id}`}
                      className="px-3 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3" /> Audit Details
                    </Link>
                    {gig.status !== "ACTIVE" && (
                      <button
                        onClick={() => handleModerate(gig.id, "approved and verified")}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

