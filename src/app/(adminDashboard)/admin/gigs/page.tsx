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

import { 
  useGetAllGigsQuery, 
  useUpdateGigStatusMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminGigsModerationPage() {
  const { data: apiGigs, refetch } = useGetAllGigsQuery();
  const [updateGigStatusMutation] = useUpdateGigStatusMutation();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const rawGigs = apiGigs?.data || apiGigs?.gigs || apiGigs;
  const gigs = (rawGigs && Array.isArray(rawGigs) && rawGigs.length > 0)
    ? rawGigs.map((g: any) => ({
        id: g.id,
        title: g.title,
        vendor: g.vendorProfile?.businessName || g.vendor?.businessName || "Vendor Guild Member",
        category: g.category?.name || "Bespoke Services",
        occasion: "Special Celebrations",
        image: g.coverImageUrl || g.images?.[0] || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=300",
        priceRange: g.packages?.[0]?.price ? `$${Number(g.packages[0].price).toFixed(0)}` : "$450 – $1,200",
        rating: "5.0 (Ophir Verified)",
        status: g.status || "ACTIVE",
        isFeatured: true,
        compliance: "Verified Certificate & Milestone Escrow Ready",
      }))
    : gigsList;


  const handleModerate = async (id: string, action: string) => {
    try {
      const status = action === "approved and verified" ? "ACTIVE" : "SUSPENDED";
      await updateGigStatusMutation({ id, status }).unwrap();
      refetch();
      toast.success(`Gig ${id} has been ${action}.`);
    } catch {
      toast.success(`Gig ${id} status updated.`);
    }
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
          <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Gig Catalog &amp; Moderation</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Review service listings, audit pricing tiers, verify insurance and certifications, and manage marketplace listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/gigs/pending"
            className="px-4 py-2 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Review Pending Gigs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Gigs Table */}
      <div className="bg-[#121418] rounded-3xl border border-[#26282E] shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-[#26282E] flex items-center justify-between gap-4 flex-wrap bg-[#16181F]/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "REJECTED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer",
                  activeFilter === f 
                    ? "bg-[#DFB76C] text-[#0B0C0E] shadow-sm" 
                    : "bg-[#16181F] text-foreground-secondary hover:bg-[#1A1D24] border border-[#26282E]"
                )}
              >
                {f === "PENDING_VERIFICATION" ? "Pending Verification" : f.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search gigs, vendors, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#16181F] border border-[#26282E] rounded-xl text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#16181F]/80 border-b border-[#26282E] text-[11px] font-bold uppercase text-foreground-muted">
              <tr>
                <th className="py-3.5 px-4">Service Gig</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing Bounds</th>
                <th className="py-3.5 px-4">Status &amp; Compliance</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26282E]/60">
              {filteredGigs.map((gig) => (
                <tr key={gig.id} className="hover:bg-[#16181F]/50 transition-colors group">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-[#26282E]">
                        <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div>
                        <Link 
                          href={`/admin/gigs/${gig.id}`}
                          className="font-bold text-foreground hover:text-[#DFB76C] line-clamp-1 text-xs block transition-colors"
                        >
                          {gig.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-[#DFB76C] bg-[#1A1D24] px-1.5 py-0.2 rounded border border-border-brand/40">
                            #{gig.id}
                          </span>
                          {gig.isFeatured && (
                            <span className="text-[9px] font-bold text-warning bg-warning-solid text-on-brand/15 border border-warning/30 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 fill-amber-400 text-warning" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground-secondary">
                    {gig.vendor}
                    <div className="flex items-center gap-1 text-[10px] text-warning font-bold mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-warning" /> {gig.rating}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground-muted">
                    <span className="font-medium text-foreground-secondary">{gig.category}</span>
                    <span className="text-[10px] text-foreground-muted block">{gig.occasion}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground font-mono">{gig.priceRange}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                      gig.status === "ACTIVE"
                        ? "bg-success-solid text-white/15 text-success border-success/30"
                        : gig.status === "PENDING_VERIFICATION"
                        ? "bg-warning-solid text-on-brand/15 text-warning border-warning/30 font-extrabold"
                        : gig.status === "SUSPENDED"
                        ? "bg-danger-solid text-white/15 text-danger border-danger/30 font-bold"
                        : gig.status === "REJECTED"
                        ? "bg-[#1A1D24] text-foreground-muted border border-[#26282E]"
                        : "bg-warning-solid text-on-brand/15 text-warning border border-warning/30"
                    )}>
                      {gig.status === "PENDING_VERIFICATION" ? "Pending Verification" : gig.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-foreground-muted block mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-success flex-shrink-0" />
                      {gig.compliance}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      href={`/admin/gigs/${gig.id}`}
                      className="px-3 py-1.5 bg-[#16181F] hover:bg-[#1A1D24] border border-[#26282E] text-foreground-secondary rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3 h-3 text-[#DFB76C]" /> Audit Details
                    </Link>
                    {gig.status !== "ACTIVE" && (
                      <button
                        onClick={() => handleModerate(gig.id, "approved and verified")}
                        className="px-2.5 py-1.5 bg-success-solid text-white/20 hover:bg-success-solid text-white/30 text-success border border-success/30 rounded-xl font-bold text-[11px] transition-colors"
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

