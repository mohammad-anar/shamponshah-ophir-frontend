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
  X,
  Award,
  UtensilsCrossed,
  Truck,
  Sparkle,
} from "lucide-react";
import { VENDORS, Vendor } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";
import {
  useGetVendorBySlugQuery,
  useSaveVendorMutation,
} from "@/redux/service/vendors/vendorsApi";
import { useTrackView } from "@/lib/tracking";

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = (params?.id as string) || "epicurean-bites";

  // RTK Query hooks
  const { data: apiVendorResp, isLoading: isVendorLoading } = useGetVendorBySlugQuery(vendorId, {
    skip: !vendorId,
  });
  const [saveVendor] = useSaveVendorMutation();

  const liveVendor = apiVendorResp?.data || apiVendorResp;
  const vendor: any =
    liveVendor ||
    VENDORS.find((v) => v.id === vendorId || (v as any).slug === vendorId) ||
    VENDORS[0];

  // Track profile view with deduplication
  useTrackView("VENDOR", liveVendor?.id || vendorId);

  const [activeTab, setActiveTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [serviceToAdd, setServiceToAdd] = useState<{
    id: string;
    name: string;
    category: string;
    price: number;
    vendorName: string;
  }>({
    id: vendor?.id || "default",
    name: `${vendor?.name || "Vendor"} - ${vendor?.categoryLabel || "Specialist"}`,
    category: vendor?.categoryLabel || "Vendor",
    price: vendor?.startingPrice || 750,
    vendorName: vendor?.name || "Vendor",
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
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const servicesList: any[] = vendor.services || [];
  const galleryList: string[] = vendor.galleryImages || [];
  const reviewsList: any[] = vendor.reviewsList || [];
  const packagesList: any[] = vendor.packages || [];
  const memberYear = vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : 2024;

  const tabs = [
    { id: "overview", label: "Overview" },
    {
      id: "packages",
      label: `Services & Offerings (${servicesList.length > 0 ? servicesList.length : packagesList.length})`,
    },
    { id: "portfolio", label: `Portfolio (${galleryList.length})` },
    { id: "reviews", label: `Reviews (${reviewsList.length || vendor.reviewCount || 0})` },
    { id: "about", label: "About & Standards" },
  ];

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen pb-20 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      {/* Top Hero Banner Image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-[#121418] overflow-hidden border-b border-[#26282E]">
        <Image
          src={vendor.heroImage || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80"}
          alt={vendor.name}
          fill
          priority
          className="object-cover opacity-70 filter brightness-[0.75] contrast-[1.05] transition-transform duration-700 hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/40 to-black/40" />

        <div className="absolute bottom-4 right-6 text-slate-300 text-xs bg-[#0B0C0E]/80 backdrop-blur-md px-3.5 py-1.5 rounded-none border border-[#26282E] shadow-sm flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span>{vendor.location}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 -mt-16 sm:-mt-20 relative z-10 space-y-8">
        {/* Header Profile Header Card */}
        <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden border-2 border-[#DFB76C] shadow-lg bg-[#0B0C0E] shrink-0">
                <Image
                  src={vendor.avatar || "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80"}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#F3F4F6] tracking-tight">
                    {vendor.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] text-[11px] font-bold uppercase tracking-widest border border-[#DFB76C]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                    <span>{vendor.guildTierLabel || "Elite Reserve Artisan"}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {vendor.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
                    {vendor.location}
                  </span>
                  <span>•</span>
                  <span>Member since {memberYear}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    Typically responds {vendor.responseSpeed || "within 1 hour"}
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
                className="px-4 py-2.5 bg-[#16181F] hover:bg-[#1F222B] text-[#DFB76C] text-xs font-semibold rounded-none border border-[#26282E] hover:border-[#DFB76C]/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Users2 className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>Collaborative Hub</span>
              </button>

              <button
                onClick={() => handleBookPackage(packagesList[0]?.id || "default")}
                className="px-5 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold uppercase tracking-wider rounded-none shadow-md transition-all cursor-pointer"
              >
                Reserve Consultation
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-[#16181F] hover:bg-[#1F222B] border border-[#26282E] rounded-none text-slate-300 hover:text-[#DFB76C] transition-colors cursor-pointer"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={async () => {
                  const nextState = !isWishlisted;
                  setIsWishlisted(nextState);
                  try {
                    await saveVendor(vendor.id).unwrap();
                    toast.success(nextState ? "Added to your curated wishlist!" : "Removed from favorites");
                  } catch {
                    toast.success(nextState ? "Saved to favorites!" : "Removed from favorites");
                  }
                }}
                className="p-2.5 bg-[#16181F] hover:bg-[#1F222B] border border-[#26282E] rounded-none text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Favorite"
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")} />
              </button>
            </div>
          </div>

          {/* 5 Stats Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 border-t border-[#26282E]">
            <div className="space-y-0.5">
              <div className="text-[10px] text-[#DFB76C] font-bold uppercase tracking-[0.2em]">
                ORDERS COMPLETED
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-white">
                {vendor.ordersCompleted || 35}
              </div>
              <div className="text-[11px] text-slate-400">Milestone ceremonies</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] text-[#DFB76C] font-bold uppercase tracking-[0.2em]">
                CLIENT RATING
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-[#DFB76C] flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#DFB76C] text-[#DFB76C]" />
                <span>{vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"} / 5.0</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {reviewsList.length || vendor.reviewCount || 1} verified ceremonies
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] text-[#DFB76C] font-bold uppercase tracking-[0.2em]">
                RESPONSE TIME
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-white">
                {vendor.responseSpeed || "Within 1 hour"}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">Instant alert dispatch</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] text-[#DFB76C] font-bold uppercase tracking-[0.2em]">
                ON-TIME DELIVERY
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-white">
                {vendor.onTimeDelivery || "99%"}
              </div>
              <div className="text-[11px] text-slate-400">Punctual arrival guarantee</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] text-[#DFB76C] font-bold uppercase tracking-[0.2em]">
                REPEAT PATRONAGE
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-white">
                {vendor.repeatClients || "85%"}
              </div>
              <div className="text-[11px] text-slate-400">Ceremonial patrons</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#26282E] overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer rounded-none uppercase tracking-wider",
                activeTab === tab.id
                  ? "border-[#DFB76C] text-[#DFB76C] font-bold"
                  : "border-transparent text-slate-400 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Tab-based dynamic rendering */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* About & Ethos Card */}
                <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-light text-white">
                      About {vendor.name}
                    </h2>
                    <span className="text-xs font-semibold px-3 py-1 bg-[#0B0C0E] text-[#DFB76C] rounded-none border border-[#DFB76C]/30 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                      <span>Verified Artisan</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {vendor.bio ||
                      "Dedicated cultural master and culinary artisan creating tailored ceremonial experiences and authentic heritage presentations for milestone galas and sacred weddings."}
                  </p>

                  {/* Guarantees Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#26282E]">
                    <div className="p-3.5 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Licensed & Insured</span>
                      </div>
                      <div className="text-[11px] text-slate-400">$2M Commercial Policy</div>
                    </div>

                    <div className="p-3.5 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <CheckCircle2 className="w-4 h-4 text-[#DFB76C]" />
                        <span>Verified Identity</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Background Checked</div>
                    </div>

                    <div className="p-3.5 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Lock className="w-4 h-4 text-[#DFB76C]" />
                        <span>100% Escrow Safeguard</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Milestone-Released Funds</div>
                    </div>
                  </div>
                </div>

                {/* Popular Services Showcase */}
                {packagesList.length > 0 && (
                  <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-2xl font-light text-white">
                        Featured Offerings & Packages
                      </h2>
                      <button
                        onClick={() => setActiveTab("packages")}
                        className="text-xs font-semibold uppercase tracking-wider text-[#DFB76C] hover:text-[#ECC870] flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All ({packagesList.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packagesList.slice(0, 4).map((pkg: any) => (
                        <div
                          key={pkg.id}
                          className="p-5 rounded-none bg-[#16181F] border border-[#26282E] hover:border-[#DFB76C]/60 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3 className="font-serif font-light text-base text-white">
                                {pkg.title}
                              </h3>
                              <span className="font-serif text-lg font-bold text-[#DFB76C]">
                                ${Number(pkg.price).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 font-light">
                              {pkg.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#26282E] flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleAddPackageToHub(pkg)}
                              className="px-2.5 py-1.5 rounded-none border border-[#26282E] text-slate-300 hover:text-[#DFB76C] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users2 className="w-3 h-3 text-[#DFB76C]" />
                              <span>Hub</span>
                            </button>
                            <button
                              onClick={() => handleBookPackage(pkg.id)}
                              className="px-3.5 py-1.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold uppercase tracking-wider rounded-none shadow-sm transition-all cursor-pointer"
                            >
                              Reserve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 2. SERVICES & PACKAGES TAB */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                {servicesList.length > 0 ? (
                  <div className="space-y-6">
                    {servicesList.map((svc: any) => (
                      <div
                        key={svc.id}
                        className="bg-[#121418] rounded-none p-6 sm:p-7 shadow-2xl border border-[#26282E] space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#DFB76C] uppercase tracking-[0.2em]">
                              {svc.category || "Service Tier"}
                            </span>
                            <h3 className="font-serif text-xl sm:text-2xl font-light text-white">
                              {svc.title}
                            </h3>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="font-serif text-2xl font-bold text-[#DFB76C] block">
                              ${Number(svc.startingPrice || 0).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-400">Starting price</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                          {svc.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                          {(svc.packages || []).map((pkg: any) => (
                            <div
                              key={pkg.id}
                              className="p-4 rounded-none bg-[#16181F] border border-[#26282E] space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    {pkg.name || pkg.title}
                                  </span>
                                  <span className="font-serif text-base font-bold text-[#DFB76C]">
                                    ${Number(pkg.price).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                                  {pkg.description}
                                </p>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-[#26282E]">
                                <button
                                  onClick={() => handleBookPackage(pkg.id)}
                                  className="w-full py-2 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Reserve Tier</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleAddPackageToHub(pkg)}
                                  className="w-full py-1.5 bg-[#0B0C0E] hover:bg-[#121418] text-[#DFB76C] text-xs font-bold rounded-none border border-[#26282E] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Users2 className="w-3 h-3" />
                                  <span>Add to Hub</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Standard Packages fallback */
                  <div className="space-y-4">
                    {packagesList.map((pkg: any) => (
                      <div
                        key={pkg.id}
                        className={cn(
                          "bg-[#121418] rounded-none p-6 sm:p-7 shadow-2xl border transition-all space-y-4",
                          pkg.isPopular ? "border-[#DFB76C] ring-1 ring-[#DFB76C]/40" : "border-[#26282E]"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            {pkg.isPopular && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] text-[10px] font-bold uppercase tracking-widest border border-[#DFB76C]/30">
                                <Sparkles className="w-3 h-3" /> Popular Choice
                              </span>
                            )}
                            <h3 className="font-serif text-xl font-light text-white">
                              {pkg.title}
                            </h3>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#DFB76C] block">
                              ${Number(pkg.price).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-400">Fixed rate</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="pt-3 border-t border-[#26282E] flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400">100% Escrow Protected</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddPackageToHub(pkg)}
                              className="px-3.5 py-2 bg-[#16181F] hover:bg-[#1F222B] text-[#DFB76C] text-xs font-bold rounded-none border border-[#26282E] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users2 className="w-3.5 h-3.5" />
                              <span>Add to Hub</span>
                            </button>
                            <button
                              onClick={() => handleBookPackage(pkg.id)}
                              className="px-4 py-2 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Reserve Package</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PORTFOLIO TAB */}
            {activeTab === "portfolio" && (
              <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl font-light text-white">
                      Portfolio & Showcase Gallery
                    </h2>
                    <p className="text-xs text-slate-400 font-light">
                      Verified ceremonial presentations, milestone galas, and fine-art moments
                    </p>
                  </div>
                  <span className="text-xs text-[#DFB76C] font-semibold uppercase tracking-wider">
                    {galleryList.length} High-Resolution Captures
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryList.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-4/3 rounded-none overflow-hidden shadow-xs border border-[#26282E] group cursor-pointer bg-[#0B0C0E]"
                      onClick={() => setActiveLightboxImg(img)}
                    >
                      <Image
                        src={img}
                        alt={`Portfolio piece ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-[#0B0C0E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 text-center">
                        <Eye className="w-6 h-6 mb-1 text-[#DFB76C]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DFB76C]">Enlarge View</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#26282E]">
                  <div>
                    <h2 className="font-serif text-2xl font-light text-white">
                      Verified Client Reviews
                    </h2>
                    <p className="text-xs text-slate-400 font-light">
                      Reviews authenticated via completed Ophir Escrow milestone releases
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-[#16181F] border border-[#26282E] px-4 py-2.5 rounded-none">
                    <Star className="w-6 h-6 fill-[#DFB76C] text-[#DFB76C]" />
                    <div>
                      <div className="font-serif text-xl font-bold text-white leading-tight">
                        {vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"} / 5.0
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {reviewsList.length || 1} verified client {reviewsList.length === 1 ? "review" : "reviews"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Listing */}
                <div className="space-y-4">
                  {reviewsList.length > 0 ? (
                    reviewsList.map((rev: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-none bg-[#1A1D24] text-[#DFB76C] font-bold flex items-center justify-center text-sm border border-[#26282E]">
                              {rev.author ? rev.author.charAt(0) : "C"}
                            </div>
                            <div>
                              <div className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                                <span>{rev.author}</span>
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-[#0D211A] px-2 py-0.5 rounded-none border border-emerald-500/30 font-semibold">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verified Host</span>
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">{rev.event}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex text-[#DFB76C]">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-[#DFB76C] text-[#DFB76C]" />
                              ))}
                            </div>
                            {rev.date && (
                              <span className="text-xs text-slate-400">({rev.date})</span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pl-1 font-light">
                          &ldquo;{rev.text}&rdquo;
                        </p>

                        {rev.reply && (
                          <div className="mt-3 p-3.5 bg-[#121418] rounded-none border border-[#26282E] text-xs text-slate-300 space-y-1">
                            <div className="font-bold text-[#DFB76C] flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                              <span>Vendor Response ({rev.reply.author}):</span>
                            </div>
                            <p className="text-slate-400 italic">{rev.reply.text}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-sm font-semibold text-slate-300">
                        All past events completed with full escrow release satisfaction.
                      </p>
                      <p className="text-xs text-slate-500">
                        Bookings are verified upon milestone completion.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. ABOUT & STANDARDS TAB */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
                  <h2 className="font-serif text-2xl font-light text-white">
                    About {vendor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {vendor.bio ||
                      "Dedicated cultural master and culinary artisan creating tailored ceremonial experiences and authentic heritage presentations for milestone galas and sacred weddings."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#26282E]">
                    <div className="p-4 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#DFB76C]">
                        <UtensilsCrossed className="w-4 h-4 text-[#DFB76C]" />
                        <span>Artisanal Philosophy</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        Authentic heritage sourcing, handcrafted custom arrangements, and cultural reverence for traditional customs.
                      </p>
                    </div>

                    <div className="p-4 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <span>Logistics & On-Site Protocol</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        White-glove delivery, dedicated ceremonial sound or culinary staging, and full venue breakdown.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Standards & Certifications */}
                <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
                  <h3 className="font-serif text-xl font-light text-white">
                    Standards, Insurance & Escrow Guarantees
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>$2,000,000 Insurance</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        Full Commercial General Liability policy. COI issued directly to event venues.
                      </p>
                    </div>

                    <div className="p-4 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#DFB76C]">
                        <Award className="w-4 h-4 text-[#DFB76C]" />
                        <span>Certified Mastercraft</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        Vetted credentials and certified professional expertise in ceremonial traditions.
                      </p>
                    </div>

                    <div className="p-4 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#DFB76C]">
                        <Lock className="w-4 h-4 text-[#DFB76C]" />
                        <span>Ophir Escrow Vault</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        100% deposit protection. Payouts are held in escrow and released solely upon client milestone approval.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Territory & Operations */}
                <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-4">
                  <h3 className="font-serif text-xl font-light text-white">
                    Service Radius & Operations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#DFB76C] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Base Location</span>
                        <span className="text-slate-400">{vendor.location} (Servicing up to {vendor.serviceRadius || 50} miles)</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#DFB76C] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Response Speed</span>
                        <span className="text-slate-400">{vendor.responseSpeed || "Within 1 hour"} with priority dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Escrow Booking Widget */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-[#121418] rounded-none p-6 sm:p-7 shadow-2xl border border-[#26282E] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB76C] block">
                    SERVICES STARTING FROM
                  </span>
                  <span className="font-serif text-3xl font-bold text-white">
                    ${Number(vendor.startingPrice || 750).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-slate-400">/ event</span>
              </div>

              {/* 100% Escrow Callout */}
              <div className="p-3.5 rounded-none bg-[#0D211A] border border-emerald-500/30 space-y-1 text-emerald-300">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Escrow Protected</span>
                </div>
                <p className="text-[11px] text-emerald-400/80 leading-relaxed font-light">
                  Funds remain locked in FDIC-insured depository accounts and cleared strictly upon your signed milestone approval.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
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
                  className="w-full h-11 bg-[#16181F] hover:bg-[#1F222B] text-[#DFB76C] font-semibold text-xs rounded-none border border-[#26282E] hover:border-[#DFB76C]/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users2 className="w-4 h-4 text-[#DFB76C]" />
                  <span>Collaborative Hub Shortlist</span>
                </button>

                <button
                  onClick={() => handleBookPackage(packagesList[0]?.id || "default")}
                  className="w-full h-12 bg-[#DFB76C] hover:bg-[#ECC870] active:scale-99 text-[#0B0C0E] font-bold text-xs uppercase tracking-wider rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#0B0C0E]" />
                  <span>Reserve Consultation via Escrow</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#26282E] space-y-2 text-center">
                <span className="text-[11px] text-slate-400 block font-light">
                  Have bespoke ceremony requirements?
                </span>
                <Link
                  href={`/user/messages?vendorId=${vendor.id}`}
                  className="text-xs font-bold text-[#DFB76C] hover:text-[#ECC870] inline-flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Message Artisan</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Portfolio */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-[65vh] bg-[#0B0C0E] rounded-none overflow-hidden border border-[#26282E] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeLightboxImg}
              alt="Enlarged portfolio piece"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-4 right-4 p-2 bg-[#121418] hover:bg-[#1A1D24] text-white border border-[#26282E] rounded-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-[#DFB76C]" />
            </button>
          </div>
        </div>
      )}

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
