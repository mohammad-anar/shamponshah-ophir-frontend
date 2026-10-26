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
    <div className="min-h-screen bg-[#0B0C0E] text-[#F3F4F6] pb-24">
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
      <div className="bg-[#121418] border-b border-[#26282E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-[#DFB76C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/services" className="hover:text-[#DFB76C] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-medium text-slate-300">{service.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-[#DFB76C] truncate max-w-xs">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Service Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-none bg-[#121418] border border-[#DFB76C]/30 text-[#DFB76C] text-xs font-bold tracking-widest uppercase">
                {service.category}
              </span>
              <span className="px-2.5 py-1 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#DFB76C] text-[#DFB76C]" />
                {service.rating} ({service.reviewCount} verified ceremonies)
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
                {service.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
              {service.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHubModalOpen(true)}
              className="px-4 py-2.5 rounded-none border border-[#26282E] bg-[#121418] hover:bg-[#1A1D24] text-[#DFB76C] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Users2 className="w-4 h-4 text-[#DFB76C]" />
              <span>Collaborative Hub</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Service link copied to clipboard!");
              }}
              className="p-2.5 rounded-none bg-[#121418] border border-[#26282E] text-slate-300 hover:text-[#DFB76C] transition-colors cursor-pointer"
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
            <div className="bg-[#121418] rounded-none p-4 sm:p-5 border border-[#26282E] shadow-xl space-y-3">
              {/* Main Active Image */}
              <div className="relative h-72 sm:h-96 md:h-[440px] w-full rounded-none overflow-hidden bg-[#0B0C0E]">
                <Image
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-none bg-[#0B0C0E]/85 backdrop-blur-md text-[#DFB76C] border border-[#DFB76C]/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#DFB76C]" />
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
                        className={`relative h-16 sm:h-20 rounded-none overflow-hidden border transition-all cursor-pointer ${
                          isActive
                            ? "border-[#DFB76C] ring-1 ring-[#DFB76C]"
                            : "border-[#26282E] opacity-70 hover:opacity-100"
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
            <div className="bg-[#121418] rounded-none p-6 sm:p-7 border border-[#26282E] shadow-xl space-y-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-none overflow-hidden border border-[#26282E] shadow-sm shrink-0 bg-[#0B0C0E]">
                    <Image
                      src={service.vendorAvatar}
                      alt={service.vendorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-white">
                        {service.vendorName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30">
                        {service.vendorTier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verified Ophir Reserve Guild Member &bull; {service.location}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/vendors/${service.vendorId}`}
                  className="px-4 py-2 rounded-none bg-[#1A1D24] hover:bg-[#22252F] text-xs font-bold uppercase tracking-wider text-slate-300 border border-[#26282E] transition-colors"
                >
                  View Artisan Profile
                </Link>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {service.description}
              </p>

              {/* Service Assurance Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#26282E] text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-none bg-[#0B0C0E] border border-[#26282E] text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-[#DFB76C] shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Escrow Custody</span>
                    <span className="text-[11px] text-slate-400">Released upon acceptance</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-none bg-[#0B0C0E] border border-[#26282E] text-slate-300">
                  <Clock className="w-4 h-4 text-[#DFB76C] shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Punctual Arrival</span>
                    <span className="text-[11px] text-slate-400">Guaranteed schedule lock</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-none bg-[#0B0C0E] border border-[#26282E] text-slate-300">
                  <Award className="w-4 h-4 text-[#DFB76C] shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Vetted Master</span>
                    <span className="text-[11px] text-slate-400">Identity & craft authenticated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details & What's Included */}
            <div className="bg-[#121418] rounded-none p-6 sm:p-7 border border-[#26282E] shadow-xl space-y-5">
              <h3 className="font-serif font-bold text-xl text-white">
                What is Included in the Selected Package
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePackage.features.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-none bg-[#0B0C0E] border border-[#26282E] flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#DFB76C] shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-[#121418] rounded-none p-6 sm:p-7 border border-[#26282E] shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    Client Reviews & Ratings
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified client feedback backed by completed escrow milestones
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#0B0C0E] border border-[#26282E] text-[#DFB76C] font-bold text-sm">
                  <Star className="w-4 h-4 fill-[#DFB76C] text-[#DFB76C]" />
                  <span>{service.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {service.reviews.map((rev: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-none bg-[#0B0C0E] border border-[#26282E] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-none bg-[#1A1D24] text-[#DFB76C] font-bold flex items-center justify-center text-xs border border-[#26282E]">
                          {rev.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{rev.author}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold bg-[#0D211A] border border-emerald-500/30 px-2 py-0.5 rounded-none">
                          Verified Ceremony
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, starI) => (
                        <Star
                          key={starI}
                          className={`w-3.5 h-3.5 ${
                            starI < rev.rating
                              ? "fill-[#DFB76C] text-[#DFB76C]"
                              : "text-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-300 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Package Selector & Booking Action Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-5">
            {/* Package Selector Card */}
            <div className="bg-[#121418] rounded-none p-6 border border-[#26282E] shadow-2xl space-y-5">
              {/* Package Tabs */}
              {service.packages.length > 1 && (
                <div className="flex rounded-none bg-[#0B0C0E] p-1 gap-1 border border-[#26282E]">
                  {service.packages.map((pkg: any, idx: number) => {
                    const isSelected = idx === selectedPackageIndex;
                    return (
                      <button
                        key={pkg.id || idx}
                        onClick={() => setSelectedPackageIndex(idx)}
                        className={`flex-1 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#DFB76C] text-[#0B0C0E] shadow-gold-glow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {pkg.title.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Price & Summary */}
              <div className="border-b border-[#26282E] pb-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reserve Price</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-mono text-[#DFB76C]">
                      ${activePackage.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 block font-normal">Escrow-safeguarded total</span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-white pt-2">
                  {activePackage.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activePackage.description}
                </p>
              </div>

              {/* Turnaround & Coverage Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-none bg-[#0B0C0E] border border-[#26282E]">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Coverage</span>
                  <span className="font-bold text-white">{activePackage.hours || "Ceremonial Duration"}</span>
                </div>
                <div className="p-3 rounded-none bg-[#0B0C0E] border border-[#26282E]">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Turnaround</span>
                  <span className="font-bold text-[#DFB76C]">{activePackage.turnaround}</span>
                </div>
              </div>

              {/* Package Features List */}
              <div className="space-y-2 text-xs">
                {activePackage.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Direct Booking CTA */}
              <div className="pt-2 space-y-2.5">
                <Link
                  href={`/checkout?vendorId=${service.vendorId}&packageId=${activePackage.id}`}
                  className="w-full py-3.5 px-4 rounded-none bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] font-bold text-xs uppercase tracking-widest text-center shadow-gold-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#0B0C0E]" />
                  <span>Reserve & Lock Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setHubModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-none border border-[#26282E] bg-[#1A1D24] hover:bg-[#22252F] text-[#DFB76C] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Users2 className="w-4 h-4 text-[#DFB76C]" />
                  <span>Collaborative Hub</span>
                </button>
              </div>

              {/* Escrow Guarantee Footer Note */}
              <div className="p-3.5 rounded-none bg-[#0D211A] border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Milestone Escrow Protection</span>
                </div>
                <p className="text-[10px] text-emerald-400/80 leading-relaxed">
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
