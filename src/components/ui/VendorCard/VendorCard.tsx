"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Heart, MapPin, CheckCircle2, ArrowRight, Sparkles, Users2 } from "lucide-react";
import { Vendor } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";

interface VendorCardProps {
  vendor: Vendor;
  variant?: "default" | "compact";
}

export default function VendorCard({ vendor, variant = "default" }: VendorCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success(`Saved ${vendor.name} to your shortlist!`);
    } else {
      toast.info(`Removed ${vendor.name} from shortlist.`);
    }
  };

  const getTierBadge = () => {
    switch (vendor.guildTier) {
      case "Elite":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-brand-primary text-[10px] font-bold tracking-wide border border-indigo-200">
            <Sparkles className="w-3 h-3 text-brand-primary" />
            <span>Elite Vendor {vendor.badgePercent && `• ${vendor.badgePercent}`}</span>
          </span>
        );
      case "Pro":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#0F0C3B] text-[10px] font-bold tracking-wide border border-indigo-200">
            <ShieldCheck className="w-3 h-3 text-brand-primary" />
            <span>Pro Vendor</span>
          </span>
        );
      case "Rising":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold tracking-wide border border-amber-200">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Rising Vendor</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wide border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified Artisan</span>
          </span>
        );
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:border-brand-primary/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        {/* Top Image & Overlays */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
          <Link href={`/vendors/${vendor.id}`}>
            <Image
              src={vendor.heroImage}
              alt={vendor.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Gradient Shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-xs pointer-events-auto">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Escrow Protected</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={() => setIsFamilyModalOpen(true)}
                title="Add to Family Hub"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-[#0F0C3B] hover:text-brand-primary shadow-xs transition-colors"
              >
                <Users2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFavorite}
                aria-label="Save to shortlist"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 shadow-xs transition-colors"
              >
                <Heart className={cn("w-4 h-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "")} />
              </button>
            </div>
          </div>

          {/* Bottom Location */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-amber-400" />
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
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-xs bg-slate-200 flex-shrink-0">
                  <Image
                    src={vendor.avatar}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs text-brand-primary font-bold truncate max-w-[140px]">
                  {vendor.categoryLabel}
                </span>
              </div>

              <div>{getTierBadge()}</div>
            </div>

            {/* Title / Name */}
            <Link href={`/vendors/${vendor.id}`}>
              <h3 className="font-bold text-base text-[#0F0C3B] group-hover:text-brand-primary transition-colors line-clamp-1">
                {vendor.name}
              </h3>
            </Link>

            {/* Short Bio */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {vendor.title}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{vendor.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400">({vendor.reviewCount} verified reviews)</span>
            </div>
          </div>

          {/* Bottom Price & View Profile CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Starting from
              </span>
              <span className="font-black text-lg text-[#0F0C3B]">
                ${vendor.startingPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsFamilyModalOpen(true)}
                className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 text-brand-primary hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Users2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add to Hub</span>
              </button>

              <Link
                href={`/vendors/${vendor.id}`}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-xs transition-all flex items-center gap-1"
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
            name: `${vendor.name} - ${vendor.categoryLabel}`,
            category: vendor.categoryLabel,
            price: vendor.startingPrice,
            vendorName: vendor.name,
            image: vendor.heroImage,
          }}
        />
      )}
    </>
  );
}
