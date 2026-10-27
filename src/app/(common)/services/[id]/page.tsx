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
  Flag,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useGetGigBySlugQuery, useReportGigMutation } from "@/redux/service/gigs/gigsApi";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";
import { useTrackView } from "@/lib/tracking";

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

  const [reportGigMutation, { isLoading: isSubmittingReport }] = useReportGigMutation();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [hubModalOpen, setHubModalOpen] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Misleading pricing or inaccurate deliverables");
  const [reportDescription, setReportDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");

  const liveGig = gigResp?.data || gigResp;

  // Track gig detail page view with session deduplication
  useTrackView("GIG", liveGig?.id || serviceId);

  const handleSubmitReport = async () => {
    if (!reportDescription.trim()) {
      toast.error("Please provide a detailed explanation for your report.");
      return;
    }

    try {
      const gigIdentifier = liveGig?.id || serviceId;
      await reportGigMutation({
        gigId: gigIdentifier,
        reason: reportReason,
        description: reportDescription.trim(),
        reporterName: reporterName.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
      }).unwrap();

      toast.success("Report Submitted", {
        description: "Thank you for helping keep the marketplace safe. Administrators will audit this service.",
      });
      setReportModalOpen(false);
      setReportDescription("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit report. Please try again.");
    }
  };

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

    return null;
  }, [liveGig, serviceId]);

  if (isGigLoading) {
    return (
      <div className="min-h-[75vh] bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-xs uppercase tracking-widest text-foreground-muted font-bold">
          Loading ceremonial artisan service details...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[75vh] bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-none bg-surface border border-border flex items-center justify-center text-brand">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-light text-foreground">Ceremonial Service Not Found</h1>
        <p className="text-xs text-foreground-muted max-w-md">
          The service you are looking for may have been archived, completed, or the URL might be invalid.
        </p>
        <Link
          href="/services"
          className="mt-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold uppercase tracking-widest shadow-gold-glow-sm"
        >
          Browse Service Directory
        </Link>
      </div>
    );
  }

  const activePackage = service.packages[selectedPackageIndex] || service.packages[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
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

      {/* Report Service Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border max-w-md w-full p-6 text-foreground space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-solid text-foreground/10 border border-danger/30 text-danger flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Report Service Listing</h3>
                <p className="text-xs text-foreground-muted">
                  Notify Platform Trust &amp; Safety of policy violations or safety concerns
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-foreground-secondary block mb-1">
                  Reason for Report <span className="text-danger">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 bg-surface-sunken border border-border text-foreground-secondary text-xs focus:border-border-brand outline-none"
                >
                  <option value="Misleading pricing or inaccurate deliverables">Misleading pricing or inaccurate deliverables</option>
                  <option value="Inappropriate or offensive content">Inappropriate or offensive content</option>
                  <option value="Copyright or intellectual property infringement">Copyright or intellectual property infringement</option>
                  <option value="Prohibited services or illegal activity">Prohibited services or illegal activity</option>
                  <option value="Safety, security or privacy concern">Safety, security or privacy concern</option>
                  <option value="Suspected fraudulent vendor">Suspected fraudulent vendor</option>
                  <option value="Other grievance">Other grievance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">
                  Detailed Explanation <span className="text-danger">*</span>
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Explain clearly what violates platform terms, with relevant details..."
                  rows={4}
                  className="w-full p-2.5 bg-surface-sunken border border-border text-foreground-secondary text-xs focus:border-border-brand outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-2.5 bg-surface-sunken border border-border text-foreground-secondary text-xs focus:border-border-brand outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground-secondary block mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full p-2.5 bg-surface-sunken border border-border text-foreground-secondary text-xs focus:border-border-brand outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2.5 border border-border text-xs font-bold text-foreground-muted hover:text-foreground hover:bg-surface-sunken cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmittingReport}
                className="flex-1 py-2.5 bg-danger-solid text-foreground hover:bg-danger-solid text-foreground text-foreground text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                <span>Submit Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs text-foreground-muted flex-wrap">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-foreground-secondary" />
            <Link href="/services" className="hover:text-brand transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-foreground-secondary" />
            <span className="font-medium text-foreground-secondary">{service.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-foreground-secondary" />
            <span className="font-bold text-brand truncate max-w-xs">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Service Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-none bg-surface border border-border-brand/40 text-brand text-xs font-bold tracking-widest uppercase">
                {service.category}
              </span>
              <span className="px-2.5 py-1 rounded-none bg-surface-sunken border border-border text-brand text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-brand text-brand" />
                {service.rating} ({service.reviewCount} verified ceremonies)
              </span>
              <span className="text-xs text-foreground-muted flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                {service.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight font-serif">
              {service.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHubModalOpen(true)}
              className="px-4 py-2.5 rounded-none border border-border bg-surface hover:bg-surface-sunken text-brand text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Users2 className="w-4 h-4 text-brand" />
              <span>Collaborative Hub</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Service link copied to clipboard!");
              }}
              className="p-2.5 rounded-none bg-surface border border-border text-foreground-secondary hover:text-brand transition-colors cursor-pointer"
              title="Share Service"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2.5 rounded-none bg-surface border border-border text-foreground-muted hover:text-danger hover:border-danger/30 transition-colors cursor-pointer"
              title="Report this service"
            >
              <Flag className="w-4 h-4" />
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
            <div className="bg-surface rounded-none p-4 sm:p-5 border border-border shadow-xl space-y-3">
              {/* Main Active Image */}
              <div className="relative h-72 sm:h-96 md:h-[440px] w-full rounded-none overflow-hidden bg-background">
                <Image
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-none bg-background/85 backdrop-blur-md text-brand border border-border-brand/40 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-brand" />
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
                            ? "border-border-brand ring-1 ring-focus-ring"
                            : "border-border opacity-70 hover:opacity-100"
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
            <div className="bg-surface rounded-none p-6 sm:p-7 border border-border shadow-xl space-y-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-none overflow-hidden border border-border shadow-sm shrink-0 bg-background">
                    <Image
                      src={service.vendorAvatar}
                      alt={service.vendorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-foreground">
                        {service.vendorName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider bg-surface-sunken text-brand border border-border-brand/40">
                        {service.vendorTier}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      Verified Ophir Reserve Guild Member &bull; {service.location}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/vendors/${service.vendorId}`}
                  className="px-4 py-2 rounded-none bg-surface-sunken hover:bg-surface-sunken text-xs font-bold uppercase tracking-wider text-foreground-secondary border border-border transition-colors"
                >
                  View Artisan Profile
                </Link>
              </div>

              <p className="text-sm text-foreground-secondary leading-relaxed">
                {service.description}
              </p>

              {/* Service Assurance Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-none bg-background border border-border text-foreground-secondary">
                  <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <span className="font-bold block text-foreground">Escrow Custody</span>
                    <span className="text-[11px] text-foreground-muted">Released upon acceptance</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-none bg-background border border-border text-foreground-secondary">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <span className="font-bold block text-foreground">Punctual Arrival</span>
                    <span className="text-[11px] text-foreground-muted">Guaranteed schedule lock</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-none bg-background border border-border text-foreground-secondary">
                  <Award className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <span className="font-bold block text-foreground">Vetted Master</span>
                    <span className="text-[11px] text-foreground-muted">Identity & craft authenticated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details & What's Included */}
            <div className="bg-surface rounded-none p-6 sm:p-7 border border-border shadow-xl space-y-5">
              <h3 className="font-serif font-bold text-xl text-foreground">
                What is Included in the Selected Package
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePackage.features.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-none bg-background border border-border flex items-start gap-2.5 text-xs text-foreground-secondary"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-surface rounded-none p-6 sm:p-7 border border-border shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-foreground">
                    Client Reviews & Ratings
                  </h3>
                  <p className="text-xs text-foreground-muted mt-1">
                    Verified client feedback backed by completed escrow milestones
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-background border border-border text-brand font-bold text-sm">
                  <Star className="w-4 h-4 fill-brand text-brand" />
                  <span>{service.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {service.reviews.map((rev: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-none bg-background border border-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-none bg-surface-sunken text-brand font-bold flex items-center justify-center text-xs border border-border">
                          {rev.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{rev.author}</span>
                        <span className="text-[10px] text-success font-semibold bg-success-soft border border-success/30 px-2 py-0.5 rounded-none">
                          Verified Ceremony
                        </span>
                      </div>
                      <span className="text-[10px] text-foreground-muted">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, starI) => (
                        <Star
                          key={starI}
                          className={`w-3.5 h-3.5 ${
                            starI < rev.rating
                              ? "fill-brand text-brand"
                              : "text-foreground-secondary"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-foreground-secondary leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Package Selector & Booking Action Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-5">
            {/* Package Selector Card */}
            <div className="bg-surface rounded-none p-6 border border-border shadow-2xl space-y-5">
              {/* Package Tabs */}
              {service.packages.length > 1 && (
                <div className="flex rounded-none bg-background p-1 gap-1 border border-border">
                  {service.packages.map((pkg: any, idx: number) => {
                    const isSelected = idx === selectedPackageIndex;
                    return (
                      <button
                        key={pkg.id || idx}
                        onClick={() => setSelectedPackageIndex(idx)}
                        className={`flex-1 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand text-on-brand shadow-gold-glow-sm"
                            : "text-foreground-muted hover:text-foreground"
                        }`}
                      >
                        {pkg.title.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Price & Summary */}
              <div className="border-b border-border pb-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-foreground-muted uppercase tracking-widest">Reserve Price</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-mono text-brand">
                      ${activePackage.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-foreground-muted block font-normal">Escrow-safeguarded total</span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-foreground pt-2">
                  {activePackage.title}
                </h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {activePackage.description}
                </p>
              </div>

              {/* Turnaround & Coverage Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-none bg-background border border-border">
                  <span className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest block">Coverage</span>
                  <span className="font-bold text-foreground">{activePackage.hours || "Ceremonial Duration"}</span>
                </div>
                <div className="p-3 rounded-none bg-background border border-border">
                  <span className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest block">Turnaround</span>
                  <span className="font-bold text-brand">{activePackage.turnaround}</span>
                </div>
              </div>

              {/* Package Features List */}
              <div className="space-y-2 text-xs">
                {activePackage.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-foreground-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Direct Booking CTA */}
              <div className="pt-2 space-y-2.5">
                <Link
                  href={`/checkout?vendorId=${service.vendorId}&packageId=${activePackage.id}`}
                  className="w-full py-3.5 px-4 rounded-none bg-brand hover:bg-brand-hover text-on-brand font-bold text-xs uppercase tracking-widest text-center shadow-gold-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-on-brand" />
                  <span>Reserve & Lock Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setHubModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-none border border-border bg-surface-sunken hover:bg-surface-sunken text-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Users2 className="w-4 h-4 text-brand" />
                  <span>Collaborative Hub</span>
                </button>
              </div>

              {/* Escrow Guarantee Footer Note */}
              <div className="p-3.5 rounded-none bg-success-soft border border-success/30 text-[11px] text-success space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                  <span>100% Milestone Escrow Protection</span>
                </div>
                <p className="text-[10px] text-success/80 leading-relaxed">
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
