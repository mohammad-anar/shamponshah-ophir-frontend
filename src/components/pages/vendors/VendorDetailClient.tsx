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
      label: `Services (${servicesList.length > 0 ? servicesList.length : packagesList.length})`,
    },
    { id: "portfolio", label: `Portfolio (${galleryList.length})` },
    { id: "reviews", label: `Reviews (${reviewsList.length || vendor.reviewCount || 0})` },
    { id: "about", label: "About & Equipment" },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-20">
      {/* Top Hero Banner Image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-slate-900 overflow-hidden">
        <Image
          src={vendor.heroImage || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80"}
          alt={vendor.name}
          fill
          priority
          className="object-cover opacity-85 transition-transform duration-700 hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/30" />

        <div className="absolute bottom-4 right-6 text-white text-xs bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>{vendor.location}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 -mt-16 sm:-mt-20 relative z-10 space-y-8">
        {/* Header Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100 flex-shrink-0">
                <Image
                  src={vendor.avatar || "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80"}
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
                    <span>{vendor.guildTierLabel || "Elite Level"}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                  {vendor.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {vendor.location}
                  </span>
                  <span>•</span>
                  <span>Member since {memberYear}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">
                    Typically responds in {vendor.responseSpeed || "within 1 hour"}
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
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-brand-primary text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Users2 className="w-3.5 h-3.5" />
                <span>Add to Family Hub</span>
              </button>

              <button
                onClick={() => handleBookPackage(packagesList[0]?.id || "default")}
                className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Reserve Consultation
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-[#F4F2EE] hover:bg-[#EAE6DF] rounded-xl text-slate-700 transition-colors cursor-pointer"
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
                className="p-2.5 bg-[#F4F2EE] hover:bg-[#EAE6DF] rounded-xl text-slate-700 hover:text-red-500 transition-colors cursor-pointer"
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
                {vendor.ordersCompleted || 35}
              </div>
              <div className="text-[11px] text-slate-500">Milestone gala events</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                CLIENT RATING
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"} / 5.0</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {reviewsList.length || vendor.reviewCount || 1} verified reviews
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                RESPONSE TIME
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.responseSpeed || "within 1 hour"}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Instant alert dispatch</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                ON-TIME DELIVERY
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.onTimeDelivery || "99%"}
              </div>
              <div className="text-[11px] text-slate-500">Punctual arrival guarantee</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                REPEAT CLIENTS
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {vendor.repeatClients || "85%"}
              </div>
              <div className="text-[11px] text-slate-500">Milestone celebrations</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#EAE6DF] overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer",
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
          {/* Left Column (8 cols): Tab-based dynamic rendering */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* About & Ethos Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold text-obsidian">
                      About {vendor.name}
                    </h2>
                    <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ophir Vetted Vendor</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {vendor.bio ||
                      "Michelin-trained culinary team creating tailored 3-course plated dining and elevated cocktail hour grazing for luxury weddings and corporate galas."}
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

                {/* Popular Packages & Rates Section Preview */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-obsidian">
                        Featured Packages & Rates
                      </h2>
                      <p className="text-xs text-slate-500">
                        All bookings secured via Ophir Escrow Milestone Vault
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("packages")}
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        View All Services ({servicesList.length > 0 ? servicesList.length : packagesList.length})
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {packagesList.map((pkg: any) => (
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
                              ${Number(pkg.price).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-400">Fixed rate</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Features list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{pkg.hours || "4-6 hours"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{pkg.turnaround || "24-48 hours delivery"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-brand-primary sm:col-span-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                            <span>{pkg.escrowSplit || "50% Milestone Deposit • 50% Final Release"}</span>
                          </div>
                        </div>

                        {/* Reserve CTA */}
                        <div className="pt-3 border-t border-[#EAE6DF] flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400">100% Escrow Protected</span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddPackageToHub(pkg)}
                              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-brand-primary text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users2 className="w-3.5 h-3.5" />
                              <span>Add to Hub</span>
                            </button>

                            <button
                              onClick={() => handleBookPackage(pkg.id)}
                              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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

                {/* Portfolio Gallery Highlights Preview */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-obsidian">
                        Portfolio Highlights
                      </h2>
                      <p className="text-xs text-slate-500">
                        Recent culinary setups, banquets, and celebration service
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("portfolio")}
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({galleryList.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {galleryList.slice(0, 6).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#EAE6DF] group cursor-pointer"
                        onClick={() => setActiveLightboxImg(img)}
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

                {/* Verified Client Reviews Preview */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-obsidian">
                        Verified Client Reviews
                      </h2>
                      <p className="text-xs text-slate-500">
                        Authenticated bookings confirmed via Ophir milestone payouts
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({reviewsList.length || 1} verified)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviewsList.slice(0, 3).map((rev: any, idx: number) => (
                      <div key={idx} className="space-y-3 pb-6 border-b border-[#EAE6DF] last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-serif font-bold text-sm text-obsidian">
                              {rev.author}
                            </h4>
                            <span className="text-[11px] text-slate-400">{rev.event} • {rev.date}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                          &ldquo;{rev.text}&rdquo;
                        </p>

                        {rev.reply && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                            <span className="font-bold text-obsidian flex items-center gap-1">
                              <span>Reply from {rev.reply.author}:</span>
                            </span>
                            <p className="italic text-slate-600">{rev.reply.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 2. SERVICES (PACKAGES) TAB */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-obsidian">
                        Vendor Services & Event Packages
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        All bookings run strictly via the Ophir Escrow Milestone Vault with 100% fund safety.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-brand-primary text-xs font-bold rounded-full">
                      {servicesList.length > 0 ? servicesList.length : packagesList.length} Options Available
                    </span>
                  </div>
                </div>

                {/* If servicesList exists (multiple culinary services) */}
                {servicesList.length > 0 ? (
                  <div className="space-y-6">
                    {servicesList.map((service: any) => (
                      <div
                        key={service.id}
                        className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                                {service.title}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                              {service.description}
                            </p>
                            {service.tags && service.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {service.tags.map((tag: string, tIdx: number) => (
                                  <span
                                    key={tIdx}
                                    className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              STARTING FROM
                            </span>
                            <span className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
                              ${Number(service.startingPrice || 750).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Package Tiers within Service */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#EAE6DF]">
                          {(service.packages || []).map((pkg: any) => (
                            <div
                              key={pkg.id}
                              className={cn(
                                "p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4",
                                pkg.isPopular
                                  ? "bg-indigo-50/40 border-brand-primary ring-1 ring-brand-primary"
                                  : "bg-[#FAF9F6] border-[#EAE6DF]"
                              )}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-serif font-bold text-base text-obsidian">
                                    {pkg.title}
                                  </h4>
                                  {pkg.isPopular && (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <div className="font-serif text-2xl font-bold text-obsidian">
                                  ${Number(pkg.price).toLocaleString()}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {pkg.description}
                                </p>

                                <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{pkg.hours || "4-6 Hours"}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{pkg.turnaround || "24-48 Hours"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                                <button
                                  onClick={() => handleBookPackage(pkg.id)}
                                  className="w-full py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Reserve Tier</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleAddPackageToHub(pkg)}
                                  className="w-full py-1.5 bg-white hover:bg-slate-100 text-brand-primary text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
                              ${Number(pkg.price).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-400">Fixed rate</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="pt-3 border-t border-[#EAE6DF] flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400">100% Escrow Protected</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddPackageToHub(pkg)}
                              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-brand-primary text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users2 className="w-3.5 h-3.5" />
                              <span>Add to Hub</span>
                            </button>
                            <button
                              onClick={() => handleBookPackage(pkg.id)}
                              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-obsidian">
                      Portfolio & Showcase Gallery
                    </h2>
                    <p className="text-xs text-slate-500">
                      Verified culinary presentations, private dinners, and gala setups
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {galleryList.length} High-Resolution Photos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryList.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#EAE6DF] group cursor-pointer bg-slate-100"
                      onClick={() => setActiveLightboxImg(img)}
                    >
                      <Image
                        src={img}
                        alt={`Portfolio piece ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 text-center">
                        <Eye className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Enlarge View</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-obsidian">
                      Verified Client Reviews
                    </h2>
                    <p className="text-xs text-slate-500">
                      Reviews authenticated via completed Ophir Escrow milestone releases
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200 px-4 py-2.5 rounded-2xl">
                    <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                    <div>
                      <div className="font-serif text-xl font-bold text-amber-900 leading-tight">
                        {vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"} / 5.0
                      </div>
                      <div className="text-[11px] text-amber-700">
                        {reviewsList.length || 1} verified client {reviewsList.length === 1 ? "review" : "reviews"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Listing */}
                <div className="space-y-6">
                  {reviewsList.length > 0 ? (
                    reviewsList.map((rev: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-brand-primary font-bold flex items-center justify-center text-sm border border-indigo-200">
                              {rev.author ? rev.author.charAt(0) : "C"}
                            </div>
                            <div>
                              <div className="font-serif font-bold text-sm text-obsidian flex items-center gap-1.5">
                                <span>{rev.author}</span>
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verified Host</span>
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">{rev.event}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            {rev.date && (
                              <span className="text-xs text-slate-400">({rev.date})</span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic pl-1">
                          &ldquo;{rev.text}&rdquo;
                        </p>

                        {rev.reply && (
                          <div className="mt-3 p-3.5 bg-white rounded-xl border border-[#EAE6DF] text-xs text-slate-600 space-y-1">
                            <div className="font-bold text-obsidian flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Vendor Response ({rev.reply.author}):</span>
                            </div>
                            <p className="text-slate-600 italic">{rev.reply.text}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-sm font-semibold text-slate-700">
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

            {/* 5. ABOUT & EQUIPMENT TAB */}
            {activeTab === "about" && (
              <div className="space-y-6">
                {/* Detailed Ethos */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                  <h2 className="font-serif text-2xl font-bold text-obsidian">
                    About {vendor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {vendor.bio ||
                      "Michelin-trained culinary team creating tailored 3-course plated dining and elevated cocktail hour grazing for luxury weddings and corporate galas."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EAE6DF]">
                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-obsidian">
                        <UtensilsCrossed className="w-4 h-4 text-brand-primary" />
                        <span>Culinary Philosophy</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Seasonal farm-to-table sourcing, handcrafted scratch preparation, and dietary customization including vegan, gluten-free, and kosher-style accommodations.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-obsidian">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Logistics & On-Site Prep</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Temperature-controlled mobile transport, insulated warming and cooling cambros, and full breakdown leaving the host venue spotless.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Standards & Certifications */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
                  <h3 className="font-serif text-xl font-bold text-obsidian">
                    Standards, Insurance & Escrow Guarantees
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-obsidian">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>$2,000,000 Insurance</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Full Commercial General Liability policy. Certificates of Insurance (COI) issued directly to event venues.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-obsidian">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>Food Handler Certified</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        ServSafe certified managers and licensed commercial kitchen prep protocols with strict allergen separation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-obsidian">
                        <Lock className="w-4 h-4 text-amber-600" />
                        <span>Ophir Escrow Vault</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        100% deposit protection. Payouts are held in escrow and released solely upon client milestone approval.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Territory & Operations */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-4">
                  <h3 className="font-serif text-xl font-bold text-obsidian">
                    Service Radius & Operations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-obsidian block">Base Location</span>
                        <span>{vendor.location} (Servicing up to {vendor.serviceRadius || 50} miles)</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-obsidian block">Response Speed</span>
                        <span>{vendor.responseSpeed || "Within 1 hour"} with priority milestone dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Escrow Booking Widget */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury-lg border border-[#EAE6DF] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    SERVICES STARTING FROM
                  </span>
                  <span className="font-serif text-3xl font-bold text-obsidian">
                    ${Number(vendor.startingPrice || 750).toLocaleString()}
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
                      name: `${vendor.name} - Full Service`,
                      category: vendor.categoryLabel,
                      price: vendor.startingPrice,
                      vendorName: vendor.name,
                    });
                    setIsFamilyModalOpen(true);
                  }}
                  className="w-full h-11 bg-indigo-50 hover:bg-indigo-100 text-brand-primary font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users2 className="w-4 h-4" />
                  <span>Add to Family Hub Shortlist</span>
                </button>

                <button
                  onClick={() => handleBookPackage(packagesList[0]?.id || "default")}
                  className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-99 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Reserve Package via Escrow</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#EAE6DF] space-y-2 text-center">
                <span className="text-[11px] text-slate-400 block">
                  Have special dietary or setup requirements?
                </span>
                <Link
                  href={`/user/messages?vendorId=${vendor.id}`}
                  className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Message Vendor</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Portfolio */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-[65vh] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
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
              className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
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
