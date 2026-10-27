"use client";

import Link from "next/link";
import {
  Sparkles,
  Plus,
  Star,
  Loader2,
  PackageOpen,
  ArrowRight,
  Eye,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { useGetVendorGigsQuery, useDeleteGigMutation } from "@/redux/service/gigs/gigsApi";

export default function VendorGigsPage() {
  const { data: apiGigsData, isLoading, refetch } = useGetVendorGigsQuery();
  const [deleteGig, { isLoading: isDeleting }] = useDeleteGigMutation();

  // Safely extract gigs array from all possible API response shapes
  const liveGigs: any[] = Array.isArray(apiGigsData)
    ? apiGigsData
    : Array.isArray(apiGigsData?.data)
    ? apiGigsData.data
    : Array.isArray(apiGigsData?.gigs)
    ? apiGigsData.gigs
    : Array.isArray(apiGigsData?.data?.gigs)
    ? apiGigsData.data.gigs
    : [];

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to archive this service gig?")) return;
    try {
      await deleteGig(id).unwrap();
      toast.success("Gig archived successfully");
      refetch();
    } catch {
      toast.error("Failed to archive gig");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Service Gigs</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Manage your active marketplace listings, pricing packages, and discovery performance
          </p>
        </div>

        <Link
          href="/vendor/gigs/create"
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Gig
        </Link>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-foreground-muted gap-3 text-xs">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <span className="font-medium text-foreground-secondary">Loading your service gigs...</span>
        </div>
      ) : liveGigs.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-info-soft border border-info/30 flex items-center justify-center mx-auto text-brand-primary">
            <PackageOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No Service Gigs Yet</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              You haven&apos;t published any service listings yet. Create your first gig with custom
              package tiers and start getting event bookings from clients.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/vendor/gigs/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-warning" />
              <span>Create Your First Gig</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {liveGigs.map((gig: any) => {
            const price =
              gig.startingPrice ||
              (gig.packages?.[0]?.price ? `$${gig.packages[0].price}` : "$450.00");
            const rating = gig.rating || gig.avgRating || "5.0";
            const orders = gig.ordersCompleted || gig.orderCount || gig._count?.orders || 0;
            const views = gig.views || gig.viewCount || 0;
            const coverImage =
              gig.gallery?.[0]?.url ||
              gig.images?.[0] ||
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80";

            const categoryName =
              typeof gig.category === "object"
                ? gig.category?.name || "Event Service"
                : gig.category || "Celebration Craft";

            return (
              <div
                key={gig.id}
                className="bg-surface rounded-2xl border border-border shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Gig Cover Image */}
                <div className="relative aspect-video w-full bg-surface-sunken overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={gig.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {gig.status === "PENDING_VERIFICATION" ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-warning-solid text-on-brand text-on-brand shadow-sm flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-sunken" />
                        Pending Verification
                      </span>
                    ) : gig.status === "REJECTED" ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-danger-solid text-foreground text-foreground shadow-sm flex items-center gap-1">
                        Rejected
                      </span>
                    ) : gig.status === "SUSPENDED" ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-surface-sunken text-danger border border-danger/30 shadow-sm flex items-center gap-1">
                        Suspended
                      </span>
                    ) : gig.status === "ACTIVE" ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-success-solid text-foreground text-foreground shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success/30" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-brand/80 backdrop-blur-xs text-foreground">
                        {gig.status || "ACTIVE"}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(gig.id, e)}
                      disabled={isDeleting}
                      title="Archive Gig"
                      className="w-7 h-7 rounded-full bg-surface/80 hover:bg-danger hover:text-foreground backdrop-blur-xs text-foreground-secondary flex items-center justify-center transition-colors shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Gig Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                      {categoryName}
                    </span>
                    <h3 className="font-bold text-foreground text-sm mt-1 line-clamp-2 leading-snug">
                      {gig.title}
                    </h3>
                    {gig.status === "REJECTED" && gig.rejectionReason && (
                      <div className="mt-2 p-2 rounded-lg bg-danger-soft border border-danger/30 text-danger text-[11px] leading-tight">
                        <span className="font-bold block text-danger mb-0.5">Admin Rejection Reason:</span>
                        {gig.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-border text-center bg-surface-elevated/60 rounded-xl">
                    <div>
                      <span className="text-foreground-muted text-[9px] uppercase font-bold block">
                        Orders
                      </span>
                      <span className="font-bold text-foreground text-xs">{orders}</span>
                    </div>
                    <div>
                      <span className="text-foreground-muted text-[9px] uppercase font-bold block">
                        Rating
                      </span>
                      <span className="font-bold text-warning text-xs flex items-center justify-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-warning fill-amber-500" /> {rating}
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted text-[9px] uppercase font-bold block">
                        Views
                      </span>
                      <span className="font-bold text-foreground text-xs flex items-center justify-center gap-0.5">
                        <Eye className="w-2.5 h-2.5 text-foreground-muted" /> {views}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[9px] text-foreground-muted uppercase font-bold block">
                        Starting at
                      </span>
                      <span className="text-base font-extrabold text-foreground">{price}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/vendor/gigs/${gig.id || gig.slug}`}
                        className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-surface-elevated text-foreground-secondary font-bold transition-colors text-[11px]"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/vendor/gigs/${gig.id || gig.slug}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-brand hover:bg-surface-sunken text-foreground font-bold transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-warning" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
