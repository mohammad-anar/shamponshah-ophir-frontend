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
  Loader2,
} from "lucide-react";
import type { Vendor } from "@/types/vendor.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";
import {
  useGetVendorBySlugQuery,
  useSaveVendorMutation,
} from "@/redux/service/vendors/vendorsApi";
import { useTrackView } from "@/lib/tracking";
import { getVendorLevelConfig } from "@/config/vendor-levels.config";

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = (params?.id as string) || "";

  // RTK Query hooks
  const { data: apiVendorResp, isLoading: isVendorLoading } = useGetVendorBySlugQuery(vendorId, {
    skip: !vendorId,
  });
  const [saveVendor] = useSaveVendorMutation();

  const liveVendor = apiVendorResp?.data || apiVendorResp;
  const vendor: any = liveVendor;

  // Dynamic Level Config & Theme
  const tierKey = liveVendor?.tier || vendor?.guildTier || vendor?.tier || "PRO";
  const levelConfig = getVendorLevelConfig(tierKey);
  const { theme: levelTheme, title: levelTitle, badgeLabel: levelBadgeLabel, perks: levelPerks, levelNumber } = levelConfig;

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
  } | null>(null);

  if (isVendorLoading) {
    return (
      <div className="min-h-[75vh] bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-xs uppercase tracking-widest text-foreground-muted font-bold">
          Loading master artisan profile...
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-[75vh] bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-none bg-surface border border-border flex items-center justify-center text-brand">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-light text-foreground">Artisan Profile Not Found</h1>
        <p className="text-xs text-foreground-muted max-w-md">
          The vendor profile you are looking for may not exist, is under review, or the link is incorrect.
        </p>
        <Link
          href="/vendors"
          className="mt-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-widest shadow-gold-glow-sm"
        >
          Browse Artisan Directory
        </Link>
      </div>
    );
  }

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
    <div className="w-full bg-background text-foreground min-h-screen pb-20 font-sans selection:bg-brand selection:text-on-brand">
      {/* Top Hero Banner Image with Level-Based Ambient Accent Overlay */}
      <div 
        className="relative w-full h-64 sm:h-80 lg:h-96 bg-surface overflow-hidden border-b transition-colors duration-500"
        style={{ borderBottomColor: levelTheme.accentBorder }}
      >
        <Image
          src={vendor.heroImage || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80"}
          alt={vendor.name}
          fill
          priority
          className="object-cover opacity-70 filter brightness-[0.75] contrast-[1.05] transition-transform duration-700 hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/40" />
        {/* Ambient level accent glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-700"
          style={{ background: levelTheme.heroOverlay }}
        />

        <div className="absolute bottom-4 right-6 text-foreground-secondary text-xs bg-background/80 backdrop-blur-md px-3.5 py-1.5 rounded-none border border-border shadow-sm flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" style={{ color: levelTheme.accentColor }} />
          <span>{vendor.location}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 -mt-16 sm:-mt-20 relative z-10 space-y-8">
        {/* Header Profile Header Card */}
        <div 
          className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border space-y-6 transition-all duration-500"
          style={{ borderColor: levelTheme.accentBorder }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div 
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden border-2 shadow-lg bg-background shrink-0 transition-all duration-500"
                style={{ 
                  borderColor: levelTheme.accentColor,
                  boxShadow: `0 0 25px ${levelTheme.glowColor}` 
                }}
              >
                <Image
                  src={vendor.avatar || "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80"}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl font-light text-foreground tracking-tight">
                    {vendor.name}
                  </h1>
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-bold uppercase tracking-widest border transition-colors duration-500"
                    style={{
                      backgroundColor: levelTheme.badgeBg,
                      borderColor: levelTheme.accentBorder,
                      color: levelTheme.accentColor,
                    }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: levelTheme.accentColor }} />
                    <span>{levelBadgeLabel}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-foreground-secondary max-w-xl leading-relaxed">
                  {vendor.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" style={{ color: levelTheme.accentColor }} />
                    {vendor.location}
                  </span>
                  <span>•</span>
                  <span>Member since {memberYear}</span>
                  <span>•</span>
                  <span className="text-success font-medium">
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
                className="px-4 py-2.5 bg-surface-elevated hover:bg-surface-sunken text-xs font-semibold rounded-none border transition-colors flex items-center gap-1.5 cursor-pointer"
                style={{
                  color: levelTheme.accentColor,
                  borderColor: levelTheme.accentBorder,
                }}
              >
                <Users2 className="w-3.5 h-3.5" style={{ color: levelTheme.accentColor }} />
                <span>Collaborative Hub</span>
              </button>

              <button
                onClick={() => handleBookPackage(packagesList[0]?.id || "default")}
                style={{ backgroundColor: levelTheme.accentColor }}
                className="px-5 py-2.5 text-on-brand text-xs font-bold uppercase tracking-wider rounded-none shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                Reserve Consultation
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-surface-elevated hover:bg-surface-sunken border border-border rounded-none text-foreground-secondary hover:text-brand transition-colors cursor-pointer"
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
                className="p-2.5 bg-surface-elevated hover:bg-surface-sunken border border-border rounded-none text-foreground-secondary hover:text-danger transition-colors cursor-pointer"
                aria-label="Favorite"
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-danger")} />
              </button>
            </div>
          </div>

          {/* Level Progression & Active Perks Banner */}
          <div 
            className="flex flex-wrap items-center justify-between gap-3 p-3.5 border rounded-none text-xs transition-colors duration-500"
            style={{
              backgroundColor: levelTheme.badgeBg,
              borderColor: levelTheme.accentBorder,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span 
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: levelTheme.accentColor }}
              />
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                {levelTitle} (Level {levelNumber})
              </span>
              <span className="text-foreground-muted hidden sm:inline">•</span>
              <span className="text-foreground-secondary hidden sm:inline text-[11px]">
                {levelConfig.tagline}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {levelPerks.map((perk, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 border"
                  style={{
                    borderColor: levelTheme.accentBorder,
                    color: levelTheme.accentColor,
                  }}
                >
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>

          {/* 5 Stats Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 border-t border-border">
            <div className="space-y-0.5">
              <div 
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: levelTheme.accentColor }}
              >
                ORDERS COMPLETED
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-foreground">
                {vendor.ordersCompleted || 35}
              </div>
              <div className="text-[11px] text-foreground-muted">Milestone ceremonies</div>
            </div>

            <div className="space-y-0.5">
              <div 
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: levelTheme.accentColor }}
              >
                CLIENT RATING
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light flex items-center gap-1.5" style={{ color: levelTheme.accentColor }}>
                <Star className="w-4 h-4" style={{ color: levelTheme.accentColor, fill: levelTheme.accentColor }} />
                <span>{vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"} / 5.0</span>
              </div>
              <div className="text-[11px] text-foreground-muted">
                {reviewsList.length || vendor.reviewCount || 1} verified ceremonies
              </div>
            </div>

            <div className="space-y-0.5">
              <div 
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: levelTheme.accentColor }}
              >
                RESPONSE TIME
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-foreground">
                {vendor.responseSpeed || "Within 1 hour"}
              </div>
              <div className="text-[11px] text-success font-medium">Instant alert dispatch</div>
            </div>

            <div className="space-y-0.5">
              <div 
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: levelTheme.accentColor }}
              >
                ON-TIME DELIVERY
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-foreground">
                {vendor.onTimeDelivery || "99%"}
              </div>
              <div className="text-[11px] text-foreground-muted">Punctual arrival guarantee</div>
            </div>

            <div className="space-y-0.5">
              <div 
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: levelTheme.accentColor }}
              >
                REPEAT PATRONAGE
              </div>
              <div className="font-serif text-xl sm:text-2xl font-light text-foreground">
                {vendor.repeatClients || "85%"}
              </div>
              <div className="text-[11px] text-foreground-muted">Ceremonial patrons</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={isActive ? { borderBottomColor: levelTheme.accentColor, color: levelTheme.accentColor } : {}}
                className={cn(
                  "px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer rounded-none uppercase tracking-wider",
                  isActive
                    ? "font-bold"
                    : "border-transparent text-foreground-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Tab-based dynamic rendering */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* About & Ethos Card */}
                <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-light text-foreground">
                      About {vendor.name}
                    </h2>
                    <span className="text-xs font-semibold px-3 py-1 bg-background text-brand rounded-none border border-border-brand/40 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                      <span>Verified Artisan</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed font-light">
                    {vendor.bio ||
                      "Dedicated cultural master and culinary artisan creating tailored ceremonial experiences and authentic heritage presentations for milestone galas and sacred weddings."}
                  </p>

                  {/* Guarantees Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                    <div className="p-3.5 rounded-none bg-background border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        <span>Licensed & Insured</span>
                      </div>
                      <div className="text-[11px] text-foreground-muted">$2M Commercial Policy</div>
                    </div>

                    <div className="p-3.5 rounded-none bg-background border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        <span>Verified Identity</span>
                      </div>
                      <div className="text-[11px] text-foreground-muted">Background Checked</div>
                    </div>

                    <div className="p-3.5 rounded-none bg-background border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Lock className="w-4 h-4 text-brand" />
                        <span>100% Escrow Safeguard</span>
                      </div>
                      <div className="text-[11px] text-foreground-muted">Milestone-Released Funds</div>
                    </div>
                  </div>
                </div>

                {/* Popular Services Showcase */}
                {packagesList.length > 0 && (
                  <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-2xl font-light text-foreground">
                        Featured Offerings & Packages
                      </h2>
                      <button
                        onClick={() => setActiveTab("packages")}
                        className="text-xs font-semibold uppercase tracking-wider text-brand hover:text-brand-hover flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All ({packagesList.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packagesList.slice(0, 4).map((pkg: any) => (
                        <div
                          key={pkg.id}
                          className="p-5 rounded-none bg-surface-elevated border border-border hover:border-border-brand/40 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3 className="font-serif font-light text-base text-foreground">
                                {pkg.title}
                              </h3>
                              <span className="font-serif text-lg font-bold text-brand">
                                ${Number(pkg.price).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-foreground-muted line-clamp-2 font-light">
                              {pkg.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleAddPackageToHub(pkg)}
                              className="px-2.5 py-1.5 rounded-none border border-border text-foreground-secondary hover:text-brand text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users2 className="w-3 h-3 text-brand" />
                              <span>Hub</span>
                            </button>
                            <button
                              onClick={() => handleBookPackage(pkg.id)}
                              className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-wider rounded-none shadow-sm transition-all cursor-pointer"
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
                        className="bg-surface rounded-none p-6 sm:p-7 shadow-2xl border border-border space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">
                              {svc.category || "Service Tier"}
                            </span>
                            <h3 className="font-serif text-xl sm:text-2xl font-light text-foreground">
                              {svc.title}
                            </h3>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="font-serif text-2xl font-bold text-brand block">
                              ${Number(svc.startingPrice || 0).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-foreground-muted">Starting price</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-foreground-secondary font-light leading-relaxed">
                          {svc.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                          {(svc.packages || []).map((pkg: any) => (
                            <div
                              key={pkg.id}
                              className="p-4 rounded-none bg-surface-elevated border border-border space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                                    {pkg.name || pkg.title}
                                  </span>
                                  <span className="font-serif text-base font-bold text-brand">
                                    ${Number(pkg.price).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-[11px] text-foreground-muted leading-relaxed font-light">
                                  {pkg.description}
                                </p>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-border">
                                <button
                                  onClick={() => handleBookPackage(pkg.id)}
                                  className="w-full py-2 bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Reserve Tier</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleAddPackageToHub(pkg)}
                                  className="w-full py-1.5 bg-background hover:bg-surface text-brand text-xs font-bold rounded-none border border-border transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
                          "bg-surface rounded-none p-6 sm:p-7 shadow-2xl border transition-all space-y-4",
                          pkg.isPopular ? "border-border-brand ring-1 ring-focus-ring/40" : "border-border"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            {pkg.isPopular && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-surface-sunken text-brand text-[10px] font-bold uppercase tracking-widest border border-border-brand/40">
                                <Sparkles className="w-3 h-3" /> Popular Choice
                              </span>
                            )}
                            <h3 className="font-serif text-xl font-light text-foreground">
                              {pkg.title}
                            </h3>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="font-serif text-2xl sm:text-3xl font-bold text-brand block">
                              ${Number(pkg.price).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-foreground-muted">Fixed rate</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-foreground-secondary font-light leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                          <span className="text-xs text-foreground-muted">100% Escrow Protected</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddPackageToHub(pkg)}
                              className="px-3.5 py-2 bg-surface-elevated hover:bg-surface-sunken text-brand text-xs font-bold rounded-none border border-border transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users2 className="w-3.5 h-3.5" />
                              <span>Add to Hub</span>
                            </button>
                            <button
                              onClick={() => handleBookPackage(pkg.id)}
                              className="px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
              <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl font-light text-foreground">
                      Portfolio & Showcase Gallery
                    </h2>
                    <p className="text-xs text-foreground-muted font-light">
                      Verified ceremonial presentations, milestone galas, and fine-art moments
                    </p>
                  </div>
                  <span className="text-xs text-brand font-semibold uppercase tracking-wider">
                    {galleryList.length} High-Resolution Captures
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryList.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-4/3 rounded-none overflow-hidden shadow-xs border border-border group cursor-pointer bg-background"
                      onClick={() => setActiveLightboxImg(img)}
                    >
                      <Image
                        src={img}
                        alt={`Portfolio piece ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-foreground p-3 text-center">
                        <Eye className="w-6 h-6 mb-1 text-brand" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand">Enlarge View</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <h2 className="font-serif text-2xl font-light text-foreground">
                      Verified Client Reviews
                    </h2>
                    <p className="text-xs text-foreground-muted font-light">
                      Reviews authenticated via completed Ophir Escrow milestone releases
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-surface-elevated border border-border px-4 py-2.5 rounded-none">
                    <Star className="w-6 h-6 fill-brand text-brand" />
                    <div>
                      <div className="font-serif text-xl font-bold text-foreground leading-tight">
                        {vendor.rating ? Number(vendor.rating).toFixed(1) : "5.0"} / 5.0
                      </div>
                      <div className="text-[11px] text-foreground-muted">
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
                        className="p-5 rounded-none bg-background border border-border space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-none bg-surface-sunken text-brand font-bold flex items-center justify-center text-sm border border-border">
                              {rev.author ? rev.author.charAt(0) : "C"}
                            </div>
                            <div>
                              <div className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
                                <span>{rev.author}</span>
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-success bg-success-soft px-2 py-0.5 rounded-none border border-success/30 font-semibold">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verified Host</span>
                                </span>
                              </div>
                              <span className="text-[11px] text-foreground-muted">{rev.event}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex text-brand">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-brand text-brand" />
                              ))}
                            </div>
                            {rev.date && (
                              <span className="text-xs text-foreground-muted">({rev.date})</span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed italic pl-1 font-light">
                          &ldquo;{rev.text}&rdquo;
                        </p>

                        {rev.reply && (
                          <div className="mt-3 p-3.5 bg-surface rounded-none border border-border text-xs text-foreground-secondary space-y-1">
                            <div className="font-bold text-brand flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                              <span>Vendor Response ({rev.reply.author}):</span>
                            </div>
                            <p className="text-foreground-muted italic">{rev.reply.text}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-sm font-semibold text-foreground-secondary">
                        All past events completed with full escrow release satisfaction.
                      </p>
                      <p className="text-xs text-foreground-muted">
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
                <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-6">
                  <h2 className="font-serif text-2xl font-light text-foreground">
                    About {vendor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed font-light">
                    {vendor.bio ||
                      "Dedicated cultural master and culinary artisan creating tailored ceremonial experiences and authentic heritage presentations for milestone galas and sacred weddings."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="p-4 rounded-none bg-background border border-border space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-brand">
                        <UtensilsCrossed className="w-4 h-4 text-brand" />
                        <span>Artisanal Philosophy</span>
                      </div>
                      <p className="text-xs text-foreground-muted leading-relaxed font-light">
                        Authentic heritage sourcing, handcrafted custom arrangements, and cultural reverence for traditional customs.
                      </p>
                    </div>

                    <div className="p-4 rounded-none bg-background border border-border space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-success">
                        <Truck className="w-4 h-4 text-success" />
                        <span>Logistics & On-Site Protocol</span>
                      </div>
                      <p className="text-xs text-foreground-muted leading-relaxed font-light">
                        White-glove delivery, dedicated ceremonial sound or culinary staging, and full venue breakdown.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Standards & Certifications */}
                <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-6">
                  <h3 className="font-serif text-xl font-light text-foreground">
                    Standards, Insurance & Escrow Guarantees
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-none bg-background border border-border space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-success">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        <span>$2,000,000 Insurance</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted leading-relaxed font-light">
                        Full Commercial General Liability policy. COI issued directly to event venues.
                      </p>
                    </div>

                    <div className="p-4 rounded-none bg-background border border-border space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand">
                        <Award className="w-4 h-4 text-brand" />
                        <span>Certified Mastercraft</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted leading-relaxed font-light">
                        Vetted credentials and certified professional expertise in ceremonial traditions.
                      </p>
                    </div>

                    <div className="p-4 rounded-none bg-background border border-border space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand">
                        <Lock className="w-4 h-4 text-brand" />
                        <span>Ophir Escrow Vault</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted leading-relaxed font-light">
                        100% deposit protection. Payouts are held in escrow and released solely upon client milestone approval.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Territory & Operations */}
                <div className="bg-surface rounded-none p-6 sm:p-8 shadow-2xl border border-border space-y-4">
                  <h3 className="font-serif text-xl font-light text-foreground">
                    Service Radius & Operations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-foreground-secondary">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-foreground block">Base Location</span>
                        <span className="text-foreground-muted">{vendor.location} (Servicing up to {vendor.serviceRadius || 50} miles)</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-foreground block">Response Speed</span>
                        <span className="text-foreground-muted">{vendor.responseSpeed || "Within 1 hour"} with priority dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Escrow Booking Widget */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-surface rounded-none p-6 sm:p-7 shadow-2xl border border-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand block">
                    SERVICES STARTING FROM
                  </span>
                  <span className="font-serif text-3xl font-bold text-foreground">
                    ${Number(vendor.startingPrice || 750).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-foreground-muted">/ event</span>
              </div>

              {/* 100% Escrow Callout */}
              <div className="p-3.5 rounded-none bg-success-soft border border-success/30 space-y-1 text-success">
                <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Escrow Protected</span>
                </div>
                <p className="text-[11px] text-success/80 leading-relaxed font-light">
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
                  className="w-full h-11 bg-surface-elevated hover:bg-surface-sunken text-brand font-semibold text-xs rounded-none border border-border hover:border-border-brand/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users2 className="w-4 h-4 text-brand" />
                  <span>Collaborative Hub Shortlist</span>
                </button>

                <button
                  onClick={() => handleBookPackage(packagesList[0]?.id || "default")}
                  className="w-full h-12 bg-brand hover:bg-brand-hover active:scale-99 text-on-brand font-bold text-xs uppercase tracking-wider rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-on-brand" />
                  <span>Reserve Consultation via Escrow</span>
                </button>
              </div>

              <div className="pt-2 border-t border-border space-y-2 text-center">
                <span className="text-[11px] text-foreground-muted block font-light">
                  Have bespoke ceremony requirements?
                </span>
                <Link
                  href={`/user/messages?vendorId=${vendor.id}`}
                  className="text-xs font-bold text-brand hover:text-brand-hover inline-flex items-center gap-1.5 uppercase tracking-wider"
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
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-[65vh] bg-background rounded-none overflow-hidden border border-border shadow-2xl"
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
              className="absolute top-4 right-4 p-2 bg-surface hover:bg-surface-sunken text-foreground border border-border rounded-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-brand" />
            </button>
          </div>
        </div>
      )}

      {/* Add to Family Hub Modal */}
      {isFamilyModalOpen && serviceToAdd && (
        <AddToFamilyHubModal
          isOpen={isFamilyModalOpen}
          onClose={() => setIsFamilyModalOpen(false)}
          service={serviceToAdd}
        />
      )}
    </div>
  );
}
