"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Star,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Layers,
  Tag,
  Loader2,
  ShieldCheck,
  Package,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useGetGigBySlugQuery } from "@/redux/service/gigs/gigsApi";
import { cn } from "@/lib/utils";

export default function VendorGigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gigId = params?.id as string;

  const { data: gigResponse, isLoading, isError } = useGetGigBySlugQuery(gigId, {
    skip: !gigId,
  });

  const gig = (gigResponse as any)?.data || gigResponse;

  const [activePackageTab, setActivePackageTab] = useState(0);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-foreground-muted gap-3 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="font-semibold text-foreground-secondary">Loading service details...</span>
      </div>
    );
  }

  if (isError || !gig) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-surface border border-border rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#0F0C3B]">Service Listing Not Found</h2>
          <p className="text-xs text-foreground-muted mt-1">
            We couldn&apos;t load the gig details for ID: <code className="font-mono text-foreground-secondary">{gigId}</code>
          </p>
        </div>
        <Link
          href="/vendor/gigs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F0C3B] text-foreground text-xs font-bold hover:bg-[#18124E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Gigs</span>
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof gig.category === "object"
      ? gig.category?.name || "Event Service"
      : gig.category || "Celebration Craft";

  const packages = Array.isArray(gig.packages) && gig.packages.length > 0 ? gig.packages : [];
  const gallery = Array.isArray(gig.gallery) && gig.gallery.length > 0 ? gig.gallery : [];

  const startingPrice =
    packages.length > 0
      ? `$${packages[0]?.price}`
      : gig.startingPrice || "$450.00";

  const activePackage = packages[activePackageTab] || packages[0];
  const coverImage =
    gallery.length > 0
      ? gallery[selectedGalleryIdx]?.url || gallery[0]?.url
      : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-xs">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/vendor/gigs"
            className="p-2 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary transition-colors cursor-pointer"
            title="Back to my gigs list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {gig.status || "ACTIVE"}
              </span>
              <span className="text-[11px] font-semibold text-foreground-muted">
                ID: {gig.id}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0F0C3B] mt-1 line-clamp-1">
              {gig.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {gig.slug && (
            <Link
              href={`/gigs/${gig.slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" />
              <span>Buyer View</span>
            </Link>
          )}

          <Link
            href={`/vendor/gigs/${gig.id || gigId}/edit`}
            className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-foreground font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-warning" />
            <span>Edit Gig</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-brand-primary" /> Total Orders
          </span>
          <p className="text-xl font-black text-[#0F0C3B]">
            {gig.orderCount || gig._count?.orders || gig.ordersCompleted || 0}
          </p>
          <span className="text-[10px] text-success font-medium">Fulfilled via escrow</span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1">
            <Eye className="w-3 h-3 text-indigo-500" /> Marketplace Views
          </span>
          <p className="text-xl font-black text-[#0F0C3B]">
            {gig.viewCount || gig.views || 0}
          </p>
          <span className="text-[10px] text-foreground-muted font-medium">Unique buyer impressions</span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1">
            <Star className="w-3 h-3 text-warning fill-amber-500" /> Client Rating
          </span>
          <p className="text-xl font-black text-[#0F0C3B] flex items-center gap-1">
            {gig.rating || gig.avgRating || "5.0"}
            <span className="text-xs font-normal text-foreground-muted">
              ({gig._count?.gigReviews || 0} reviews)
            </span>
          </p>
          <span className="text-[10px] text-amber-700 font-medium">Verified customer score</span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1">
            <Package className="w-3 h-3 text-success" /> Base Price
          </span>
          <p className="text-xl font-black text-[#0F0C3B]">{startingPrice}</p>
          <span className="text-[10px] text-foreground-muted font-medium">{packages.length} tier options</span>
        </div>
      </div>

      {/* 2-Column Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Media Gallery & Service Description */}
        <div className="lg:col-span-8 space-y-6">
          {/* Gallery Showcase Card */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs space-y-3 p-4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-foreground text-[10px] font-bold px-2.5 py-1 rounded-md">
                {categoryName}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {gallery.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={cn(
                      "w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer",
                      selectedGalleryIdx === idx
                        ? "border-[#0F0C3B] ring-2 ring-indigo-200"
                        : "border-border opacity-70 hover:opacity-100"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Gallery thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Card */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B] uppercase tracking-wider">
                Service Description &amp; Scope
              </h2>
              <div className="h-[2px] w-8 bg-brand-primary mt-1" />
            </div>

            <p className="text-foreground-secondary leading-relaxed text-xs whitespace-pre-line">
              {gig.description}
            </p>

            {/* Tags */}
            {Array.isArray(gig.tags) && gig.tags.length > 0 && (
              <div className="pt-4 border-t border-border space-y-2">
                <span className="text-[10px] font-bold uppercase text-foreground-muted block">
                  Search &amp; Discovery Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {gig.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-surface-sunken text-foreground-secondary font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-foreground-muted" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Package Tiers Inspector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#0F0C3B] uppercase tracking-wider">
                Pricing Packages
              </h2>
              <span className="text-[10px] text-foreground-muted font-bold">
                {packages.length} Tiers Available
              </span>
            </div>

            {/* Package Tabs */}
            {packages.length > 1 && (
              <div className="grid grid-cols-3 gap-1 bg-surface-sunken p-1 rounded-xl">
                {packages.map((pkg: any, idx: number) => (
                  <button
                    key={pkg.id || idx}
                    type="button"
                    onClick={() => setActivePackageTab(idx)}
                    className={cn(
                      "py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer text-center truncate px-1",
                      activePackageTab === idx
                        ? "bg-surface text-[#0F0C3B] shadow-xs"
                        : "text-foreground-muted hover:text-[#0F0C3B]"
                    )}
                  >
                    {pkg.title?.split(" ")[0] || `Tier ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            {/* Active Package Details */}
            {activePackage ? (
              <div className="space-y-4 pt-1">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-bold text-[#0F0C3B] text-sm">
                      {activePackage.title}
                    </h3>
                    <p className="text-[11px] text-foreground-muted mt-0.5">
                      {activePackage.description}
                    </p>
                  </div>
                  <span className="text-xl font-black text-[#0F0C3B]">
                    ${activePackage.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-foreground-secondary bg-surface-elevated p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{activePackage.hours || "4 hours"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-success" />
                    <span>{activePackage.turnaround || "3 days turnaround"}</span>
                  </div>
                </div>

                {/* Features list */}
                {Array.isArray(activePackage.features) && activePackage.features.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Included Deliverables
                    </span>
                    <ul className="space-y-2">
                      {activePackage.features.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-foreground-secondary">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2 text-amber-900 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      All milestone payments are locked in FDIC-insured escrow before job commencement.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-foreground-muted text-center py-4">No package configured</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
