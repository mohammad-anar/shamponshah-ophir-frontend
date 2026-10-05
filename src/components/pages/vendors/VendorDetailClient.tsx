"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Heart,
  Share2,
  Mail,
  ArrowRight,
  Sparkles,
  Camera,
  Check,
  ChevronRight,
  Eye,
  AlertCircle,
  Users2,
} from "lucide-react";
import { VENDORS, Vendor } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = (params?.id as string) || "golden-hour-photo";

  const vendor: Vendor =
    VENDORS.find((v) => v.id === vendorId) || VENDORS[0];

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPackage, setSelectedPackage] = useState(vendor.packages[0]?.id || "");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(18);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [serviceToAdd, setServiceToAdd] = useState<{
    id: string;
    name: string;
    category: string;
    price: number;
    vendorName: string;
  }>({
    id: vendor.id,
    name: `${vendor.name} - ${vendor.categoryLabel}`,
    category: vendor.categoryLabel,
    price: vendor.startingPrice,
    vendorName: vendor.name,
  });

  const handleBookPackage = (pkgId: string) => {
    router.push(`/checkout?vendorId=${vendor.id}&packageId=${pkgId}`);
  };

  const handleAddPackageToHub = (pkg: any) => {
    setServiceToAdd({
      id: pkg.id,
      name: `${pkg.title} (${vendor.name})`,
      category: vendor.categoryLabel,
      price: pkg.price,
      vendorName: vendor.name,
    });
    setIsFamilyModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-20">
      {/* Top Hero Banner Image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-slate-900">
        <Image
          src={vendor.heroImage}
          alt={vendor.name}
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/30" />

        <div className="absolute bottom-4 right-6 text-white text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          📍 {vendor.location}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 -mt-16 sm:-mt-20 relative z-10 space-y-8">
        {/* Header Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100 flex-shrink-0">
                <Image
                  src={vendor.avatar}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
                    {vendor.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold border border-indigo-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{vendor.guildTierLabel}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  {vendor.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {vendor.location}
                  </span>
                  <span>•</span>
                  <span>Member since 2021</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">
                    Typically responds in {vendor.responseSpeed}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <button
                onClick={() => {
                  setServiceToAdd({
                    id: vendor.id,
                    name: `${vendor.name} - Full Service`,
                    category: vendor.categoryLabel,
                    price: vendor.startingPrice,
                    vendorName: vendor.name,
                  });
                  setIsFamilyModalOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-brand-primary text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Users2 className="w-3.5 h-3.5" />
                <span>Add to Family Hub</span>
              </button>

              <button
                onClick={() => handleBookPackage(vendor.packages[0]?.id || "default")}
                className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Invite to My Job
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-[#F4F2EE] hover:bg-[#EAE6DF] rounded-xl text-slate-700 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? "Removed from favorites" : "Added to favorites!");
                }}
                className="p-2.5 bg-[#F4F2EE] hover:bg-[#EAE6DF] rounded-xl text-slate-700 hover:text-red-500 transition-colors"
                aria-label="Favorite"
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")} />
              </button>
            </div>
          </div>

          {/* 5 Stats Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 border-t border-[#EAE6DF]">
            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                ORDERS COMPLETED
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.ordersCompleted}
              </div>
              <div className="text-[11px] text-slate-500">All milestone events</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                CLIENT RATING
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{vendor.rating} / 5.0</span>
              </div>
              <div className="text-[11px] text-slate-500">{vendor.reviewCount} verified reviews</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                RESPONSE TIME
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.responseSpeed}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Instant alert enabled</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                ON-TIME DELIVERY
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.onTimeDelivery}
              </div>
              <div className="text-[11px] text-slate-500">Sneak peeks in 48 hrs</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                REPEAT CLIENTS
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.repeatClients}
              </div>
              <div className="text-[11px] text-slate-500">Family milestones</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#EAE6DF] overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "overview", label: "Overview" },
            { id: "packages", label: `Services (${vendor.packages.length || 3})` },
            { id: "portfolio", label: `Portfolio (${vendor.galleryImages.length * 8})` },
            { id: "reviews", label: `Reviews (${vendor.reviewCount})` },
            { id: "about", label: "About & Equipment" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "border-[#0F0C3B] text-[#0F0C3B]"
                  : "border-transparent text-slate-500 hover:text-obsidian"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Bio, Packages, Gallery, Reviews */}
          <div className="lg:col-span-8 space-y-10">
            {/* About & Ethos Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
              <h2 className="font-serif text-2xl font-bold text-obsidian">
                About Maya & {vendor.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {vendor.bio}
              </p>

              {/* Guarantees Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#EAE6DF]">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-obsidian">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="text-[11px] text-slate-500">$2M Commercial Policy</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-obsidian">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Verified Identity</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Background Checked</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-obsidian">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Ophir Escrow</span>
                  </div>
                  <div className="text-[11px] text-slate-500">100% Release Certainty</div>
                </div>
              </div>
            </div>

            {/* Popular Packages & Rates Section */}
            <div id="packages" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-obsidian">
                    Popular Packages & Rates
                  </h2>
                  <p className="text-xs text-slate-500">
                    All bookings run via Ophir Escrow Milestone Vault
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {vendor.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={cn(
                      "bg-white rounded-3xl p-6 sm:p-7 shadow-luxury border transition-all space-y-4",
                      pkg.isPopular ? "border-brand-primary ring-1 ring-brand-primary" : "border-[#EAE6DF]"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        {pkg.isPopular && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" /> Popular Choice
                          </span>
                        )}
                        <h3 className="font-serif text-xl font-bold text-obsidian">
                          {pkg.title}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-obsidian block">
                          ${pkg.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400">Starting rate</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Features list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pkg.hours}</span>
                      </div>
                      {pkg.photosCount && (
                        <div className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pkg.photosCount}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{pkg.turnaround}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-brand-primary">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                        <span>{pkg.escrowSplit}</span>
                      </div>
                    </div>

                    {/* Reserve CTA */}
                    <div className="pt-3 border-t border-[#EAE6DF] flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-400">100% Escrow Protected</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddPackageToHub(pkg)}
                          className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-brand-primary text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Users2 className="w-3.5 h-3.5" />
                          <span>Add to Hub</span>
                        </button>

                        <button
                          onClick={() => handleBookPackage(pkg.id)}
                          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <span>Reserve Package</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Gallery Grid */}
            <div id="portfolio" className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-obsidian">
                    Portfolio Highlights
                  </h2>
                  <p className="text-xs text-slate-500">
                    Recent ceremonies, celebrations, and setups
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {vendor.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#EAE6DF] group cursor-pointer"
                    onClick={() => toast.info("Viewing photo...")}
                  >
                    <Image
                      src={img}
                      alt="Portfolio photo"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Client Reviews */}
            <div id="reviews" className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-obsidian">
                    Verified Client Reviews
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authenticated bookings confirmed via milestone payouts
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span>{vendor.rating}</span>
                  <span className="text-xs text-slate-400 font-normal">({vendor.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {vendor.reviewsList.map((rev, idx) => (
                  <div key={idx} className="space-y-3 pb-6 border-b border-[#EAE6DF] last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-serif font-bold text-sm text-obsidian">
                          {rev.author}
                        </h4>
                        <span className="text-[11px] text-slate-400">{rev.event}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Escrow Booking Widget */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury-lg border border-[#EAE6DF] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    PACKAGES STARTING FROM
                  </span>
                  <span className="font-serif text-3xl font-bold text-obsidian">
                    ${vendor.startingPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-slate-400">/ event</span>
              </div>

              {/* 100% Escrow Callout */}
              <div className="p-3.5 rounded-2xl bg-[#EDE9FE] border border-indigo-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Escrow Protected</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Funds are held in FDIC-insured depository accounts and cleared strictly upon your signed milestone approval.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    setServiceToAdd({
                      id: vendor.id,
                      name: `${vendor.name} - Full Service Package`,
                      category: vendor.categoryLabel,
                      price: vendor.startingPrice,
                      vendorName: vendor.name,
                    });
                    setIsFamilyModalOpen(true);
                  }}
                  className="w-full h-11 bg-indigo-50 hover:bg-indigo-100 text-brand-primary font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users2 className="w-4 h-4" />
                  <span>Add to Family Hub Shortlist</span>
                </button>

                <button
                  onClick={() => handleBookPackage(vendor.packages[0]?.id || "default")}
                  className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-99 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Request a Custom Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Family Hub Modal */}
      {isFamilyModalOpen && (
        <AddToFamilyHubModal
          isOpen={isFamilyModalOpen}
          onClose={() => setIsFamilyModalOpen(false)}
          service={serviceToAdd}
        />
      )}
    </div>
  );
}
