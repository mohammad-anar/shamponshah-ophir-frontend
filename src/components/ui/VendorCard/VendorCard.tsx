"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Heart, MapPin, CheckCircle2, ArrowRight, Sparkles, Users2 } from "lucide-react";
import type { Vendor } from "@/types/vendor.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";
import { useSaveVendorMutation, useGetSavedVendorsQuery } from "@/redux/service/vendors/vendorsApi";
import { useTrackImpression, trackClick } from "@/lib/tracking";

interface VendorCardProps {
  vendor: Vendor;
  variant?: "default" | "compact";
}

export default function VendorCard({ vendor, variant = "default" }: VendorCardProps) {
  const cardRef = useTrackImpression("VENDOR", vendor.id);
  const [saveVendor] = useSaveVendorMutation();
  const { data: savedData } = useGetSavedVendorsQuery();
  const savedList = Array.isArray(savedData) ? savedData : (savedData?.data || []);
  const isSavedInDb = savedList.some((s: any) => s.id === vendor.id || (s.vendorProfile && s.vendorProfile.id === vendor.id));

  const [isFavorite, setIsFavorite] = useState(isSavedInDb);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);

  useEffect(() => {
    setIsFavorite(isSavedInDb);
  }, [isSavedInDb]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await saveVendor(vendor.id).unwrap();
      const nowSaved = res?.saved !== undefined ? res.saved : !isFavorite;
      setIsFavorite(nowSaved);
      if (nowSaved) {
        toast.success(`Saved ${vendor.name} to your shortlist!`);
      } else {
        toast.info(`Removed ${vendor.name} from shortlist.`);
      }
    } catch {
      toast.error("Please login as a client to save vendors.");
    }
  };

  const getTierBadge = () => {
    switch (vendor.guildTier) {
      case "Elite":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-brand-soft text-brand text-[10px] font-bold tracking-widest uppercase border border-border-brand/40">
            <Sparkles className="w-3 h-3 text-brand" />
            <span>Elite Artisan</span>
          </span>
        );
      case "Pro":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-surface-sunken text-brand text-[10px] font-bold tracking-widest uppercase border border-border">
            <ShieldCheck className="w-3 h-3 text-brand" />
            <span>Master Craftsman</span>
          </span>
        );
      case "Rising":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-surface-sunken text-warning text-[10px] font-bold tracking-widest uppercase border border-warning/30">
            <Star className="w-3 h-3 fill-amber-400 text-warning" />
            <span>Rising Master</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-success-soft text-success text-[10px] font-bold tracking-widest uppercase border border-success/30">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <span>Verified Artisan</span>
          </span>
        );
    }
  };

  return (
    <>
      <div 
        ref={cardRef}
        className="group relative bg-surface rounded-none overflow-hidden border border-border hover:border-border-brand/40 shadow-lg transition-all duration-300 flex flex-col justify-between"
      >
        {/* Top Image & Overlays */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-background">
          <Link href={`/vendors/${vendor.id}`} onClick={() => trackClick("VENDOR", vendor.id)}>
            <Image
              src={vendor.heroImage}
              alt={vendor.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Gradient Shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-none bg-background/85 backdrop-blur-md text-brand text-[10px] font-bold uppercase tracking-wider border border-border-brand/40 pointer-events-auto">
              <ShieldCheck className="w-3 h-3 text-brand" />
              <span>Escrow Vault</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={() => setIsFamilyModalOpen(true)}
                title="Add to Collaborative Hub"
                className="w-8 h-8 rounded-none bg-background/85 hover:bg-surface-sunken border border-border hover:border-border-brand/40 backdrop-blur-md flex items-center justify-center text-foreground-secondary hover:text-brand transition-colors"
              >
                <Users2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFavorite}
                aria-label="Save to shortlist"
                className="w-8 h-8 rounded-none bg-background/85 hover:bg-surface-sunken border border-border hover:border-border-brand/40 backdrop-blur-md flex items-center justify-center text-foreground-secondary hover:text-danger transition-colors"
              >
                <Heart className={cn("w-4 h-4 transition-colors", isFavorite ? "fill-red-500 text-danger" : "")} />
              </button>
            </div>
          </div>

          {/* Bottom Location */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-background/85 backdrop-blur-md text-foreground-secondary text-[10px] font-medium uppercase tracking-wider border border-border">
              <MapPin className="w-3 h-3 text-brand" />
              <span>{vendor.location}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Avatar & Tier */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-none overflow-hidden border border-border bg-surface-sunken flex-shrink-0">
                  <Image
                    src={vendor.avatar}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[11px] text-brand font-semibold uppercase tracking-wider truncate max-w-[140px]">
                  {vendor.categoryLabel}
                </span>
              </div>

              <div>{getTierBadge()}</div>
            </div>

            {/* Title / Name */}
            <Link href={`/vendors/${vendor.id}`}>
              <h3 className="font-serif font-bold text-base text-foreground group-hover:text-brand transition-colors line-clamp-1">
                {vendor.name}
              </h3>
            </Link>

            {/* Short Bio */}
            <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
              {vendor.title}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center gap-1 text-brand font-bold">
                <Star className="w-3.5 h-3.5 fill-brand text-brand" />
                <span>{vendor.rating.toFixed(1)}</span>
              </div>
              <span className="text-foreground-muted">({vendor.reviewCount} verified ceremonies)</span>
            </div>
          </div>

          {/* Bottom Price & View Profile CTA */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-foreground-muted font-bold">
                Starting from
              </span>
              <span className="font-mono font-bold text-lg text-brand">
                ${vendor.startingPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFamilyModalOpen(true)}
                className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none bg-surface-sunken text-foreground-secondary hover:text-foreground hover:bg-surface-sunken border border-border transition-colors flex items-center gap-1"
              >
                <Users2 className="w-3.5 h-3.5 text-brand" />
                <span className="hidden sm:inline">Hub</span>
              </button>

              <Link
                href={`/vendors/${vendor.id}`}
                className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-none bg-brand hover:bg-brand-hover text-on-brand shadow-gold-glow-sm transition-all flex items-center gap-1"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add To Family Hub Modal */}
      {isFamilyModalOpen && (
        <AddToFamilyHubModal
          isOpen={isFamilyModalOpen}
          onClose={() => setIsFamilyModalOpen(false)}
          service={{
            id: vendor.id,
            name: `${vendor.name} - ${vendor.categoryLabel || vendor.category || "Vendor"}`,
            category: vendor.categoryLabel || vendor.category || "Vendor",
            price: vendor.startingPrice,
            vendorName: vendor.name,
            image: vendor.heroImage,
          }}
        />
      )}
    </>
  );
}
