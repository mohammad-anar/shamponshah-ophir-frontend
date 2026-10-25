"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Share2,
  Bookmark,
  MessageSquare,
  Award,
  Lock,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { VENDORS } from "@/data/mockData";
import { useGetGigBySlugQuery } from "@/redux/service/gigs/gigsApi";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const { data: gigResp, isLoading: isGigLoading } = useGetGigBySlugQuery(serviceId, {
    skip: !serviceId,
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [hubModalOpen, setHubModalOpen] = useState(false);

  const liveGig = gigResp?.data || gigResp;

  // Resolve service data from live API or mock fallback
  const service = useMemo(() => {
    if (liveGig && liveGig.id) {
      const v = liveGig.vendorProfile || {};
      const gallery = (liveGig.gallery || []).map((img: any) => img.url);
      const pkgs = (liveGig.packages || []).map((p: any, idx: number) => ({
        id: p.id,
        title: p.title || `Tier ${idx + 1}`,
        description: p.description || "Comprehensive service coverage",
        price: Number(p.price) || 1200,
        turnaround: p.turnaround || "3 business days",
        hours: p.turnaround ? `${p.turnaround}` : "Full Day",
        features: p.features || [
          "Complete professional execution & setup",
          "Dedicated on-site coordinator",
          "100% Milestone escrow protection",
        ],
      }));

      return {
        id: liveGig.slug || liveGig.id,
        realId: liveGig.id,
        title: liveGig.title,
        description: liveGig.description,
        category: liveGig.category?.name || "Vendor Service",
        vendorId: v.slug || v.id,
        vendorName: v.businessName || "Verified Vendor",
        vendorAvatar: v.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        vendorTier: v.tier || "PRO",
        location: `${v.city || "Chicago"}, ${v.state || "IL"}`,
        rating: v.rating || 4.9,
        reviewCount: v.reviewCount || 36,
        images: gallery.length > 0 ? gallery : [
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
        ],
        packages: pkgs.length > 0 ? pkgs : [
          {
            id: "pkg-1",
            title: "Standard Vendor Package",
            description: "Essential premium coverage for milestone celebrations",
            price: 1200,
            turnaround: "3 Days",
            hours: "6 Hours",
            features: [
              "Continuous full coverage",
              "Dedicated certified lead vendor",
              "48-hour sneak peek delivery",
              "100% Escrow safe custody",
            ],
          },
        ],
        reviews: (liveGig.gigReviews || []).map((r: any) => ({
          author: r.clientProfile?.displayName || "Verified Client",
          rating: r.rating || 5,
          text: r.comment || "Outstanding vendor craft. Everything exceeded our highest expectations.",
          date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
        })),
      };
    }

    // Mock match
    // Check if ID matches vendor ID or vendor-pkg format
    const vendorMatch = VENDORS.find(
      (v) => v.id === serviceId || serviceId.startsWith(v.id)
    ) || VENDORS[0];

    const pkgIdx = serviceId.includes("-pkg-")
      ? parseInt(serviceId.split("-pkg-")[1], 10) || 0
      : 0;

    return {
      id: serviceId,
      realId: serviceId,
      title: `${vendorMatch.name} — ${vendorMatch.packages[pkgIdx]?.title || vendorMatch.title}`,
      description: vendorMatch.bio,
      category: vendorMatch.categoryLabel,
      vendorId: vendorMatch.id,
      vendorName: vendorMatch.name,
      vendorAvatar: vendorMatch.avatar,
      vendorTier: vendorMatch.guildTier,
      location: vendorMatch.location,
      rating: vendorMatch.rating,
      reviewCount: vendorMatch.reviewCount,
      images: [
        vendorMatch.heroImage,
        ...vendorMatch.galleryImages,
      ],
      packages: vendorMatch.packages,
      reviews: vendorMatch.reviewsList.map((r) => ({
        author: r.author,
        rating: r.rating,
        text: r.text,
        date: r.date || "2 weeks ago",
      })),
    };
  }, [liveGig, serviceId]);

  const activePackage = service.packages[selectedPackageIndex] || service.packages[0];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Add To Family Hub Modal */}
      {hubModalOpen && (
        <AddToFamilyHubModal
          isOpen={hubModalOpen}
          onClose={() => setHubModalOpen(false)}
          service={{
            id: service.id,
            name: service.title,
            category: service.category,
            price: activePackage.price,
            vendorName: service.vendorName,
            image: service.images[0],
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/services" className="hover:text-brand-primary transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-600">{service.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-[#0F0C3B] truncate max-w-xs">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Service Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-brand-primary text-xs font-bold tracking-wide uppercase">
                {service.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-300/60 text-amber-900 text-xs font-extrabold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {service.rating} ({service.reviewCount} verified reviews)
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {service.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F0C3B] tracking-tight font-serif">
              {service.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHubModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-brand-primary text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Users2 className="w-4 h-4 text-brand-primary" />
              <span>Recommend to Family Hub</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Service link copied to clipboard!");
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title="Share Service"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Gallery, Vendor Profile, Inclusions, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
              {/* Main Active Image */}
              <div className="relative h-72 sm:h-96 md:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Verified Portfolio
                  </span>
                </div>
              </div>

              {/* Thumbnails Bar */}
              {service.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {service.images.map((img: string, idx: number) => {
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isActive
                            ? "border-brand-primary ring-2 ring-brand-primary/30"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Vendor Vendor Bio Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-slate-100 shadow-sm shrink-0">
                    <Image
                      src={service.vendorAvatar}
                      alt={service.vendorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-[#0F0C3B]">
                        {service.vendorName}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/15 text-amber-900 border border-amber-300">
                        {service.vendorTier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified Ophir Vendor Guild Member &bull; {service.location}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/vendors/${service.vendorId}`}
                  className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
                >
                  View Full Profile
                </Link>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Service Assurance Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-[#0F0C3B]">Escrow Custody</span>
                    <span className="text-[11px] text-slate-500">Funds released on approval</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                  <div>
                    <span className="font-bold block text-[#0F0C3B]">On-Time Arrival</span>
                    <span className="text-[11px] text-slate-500">Guaranteed schedule lock</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-[#0F0C3B]">Vetted Standard</span>
                    <span className="text-[11px] text-slate-500">Background & gear checked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details & What's Included */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
              <h3 className="font-serif font-bold text-xl text-[#0F0C3B]">
                What is Included in the Selected Package
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePackage.features.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0F0C3B]">
                    Client Reviews & Ratings
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Verified client feedback backed by completed escrow milestones
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{service.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {service.reviews.map((rev: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-brand-primary font-bold flex items-center justify-center text-xs">
                          {rev.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-[#0F0C3B]">{rev.author}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Verified Order
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, starI) => (
                        <Star
                          key={starI}
                          className={`w-3.5 h-3.5 ${
                            starI < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Package Selector & Booking Action Card */}
          <div className="lg:col-span-4 sticky top-6 space-y-5">
            {/* Package Selector Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
              {/* Package Tabs */}
              {service.packages.length > 1 && (
                <div className="flex rounded-2xl bg-slate-100 p-1 gap-1">
                  {service.packages.map((pkg: any, idx: number) => {
                    const isSelected = idx === selectedPackageIndex;
                    return (
                      <button
                        key={pkg.id || idx}
                        onClick={() => setSelectedPackageIndex(idx)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white text-[#0F0C3B] shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {pkg.title.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Price & Summary */}
              <div className="border-b border-slate-100 pb-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Price</span>
                  <div className="text-right">
                    <span className="text-3xl font-black font-serif text-[#0F0C3B]">
                      ${activePackage.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 block font-normal">Escrow-backed total</span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-[#0F0C3B] pt-2">
                  {activePackage.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activePackage.description}
                </p>
              </div>

              {/* Turnaround & Coverage Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Coverage</span>
                  <span className="font-bold text-[#0F0C3B]">{activePackage.hours || "Full Event Coverage"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Turnaround</span>
                  <span className="font-bold text-emerald-600">{activePackage.turnaround}</span>
                </div>
              </div>

              {/* Package Features List */}
              <div className="space-y-2 text-xs">
                {activePackage.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Direct Booking CTA */}
              <div className="pt-2 space-y-2.5">
                <Link
                  href={`/checkout?vendorId=${service.vendorId}&packageId=${activePackage.id}`}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0F0C3B] font-extrabold text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#0F0C3B]" />
                  <span>Book Now & Lock Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setHubModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/90 text-brand-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Users2 className="w-4 h-4 text-brand-primary" />
                  <span>Recommend to Family Hub</span>
                </button>
              </div>

              {/* Escrow Guarantee Footer Note */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% Milestone Escrow Protection</span>
                </div>
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Your funds remain locked in escrow until you inspect and accept milestone deliverables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
