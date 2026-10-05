"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Layers, 
  FileText, 
  Lock, 
  Send, 
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Percent,
  Sliders,
  Award,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TierPackage {
  name: string;
  price: number;
  deliveryTime: string;
  description: string;
  features: string[];
}

interface GigDetailData {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  occasions: string[];
  status: "ACTIVE" | "PENDING_REVIEW" | "SUSPENDED";
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  totalOrders: number;
  totalRevenue: number;
  viewsCount: number;
  conversionRate: string;
  vendor: {
    id: string;
    name: string;
    businessName: string;
    avatar: string;
    rating: number;
    completedOrders: number;
    memberSince: string;
    tier: string;
    email: string;
    phone: string;
    location: string;
    identityVerified: boolean;
    insuranceVerified: boolean;
  };
  media: {
    cover: string;
    gallery: string[];
  };
  description: string;
  packages: {
    basic: TierPackage;
    standard: TierPackage;
    premium: TierPackage;
  };
  compliance: {
    insuranceType: string;
    insuranceStatus: "VERIFIED" | "PENDING" | "EXPIRED";
    insuranceExpiry: string;
    certifications: string[];
    backgroundCheck: "PASSED" | "PENDING";
  };
  commissionRate: number;
  adminNotes: { id: string; author: string; text: string; date: string }[];
}

const mockGigsDatabase: Record<string, GigDetailData> = {
  "GIG-101": {
    id: "GIG-101",
    title: "High-Energy DJ & Live Interactive MC for Milestone Celebrations",
    category: "Music & Entertainment",
    subcategory: "DJs & Live MCs",
    occasions: ["Weddings", "Milestone Birthdays", "Corporate Galas", "Anniversaries"],
    status: "ACTIVE",
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 124,
    totalOrders: 68,
    totalRevenue: 54400,
    viewsCount: 4820,
    conversionRate: "14.1%",
    vendor: {
      id: "V-101",
      name: "Marcus Reed",
      businessName: "Party Pulse Events LLC",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      rating: 4.95,
      completedOrders: 142,
      memberSince: "Jan 2024",
      tier: "Elite Level 2 Vendor",
      email: "marcus@partypulsechicago.com",
      phone: "+1 (312) 555-0194",
      location: "Chicago, IL & Suburbs",
      identityVerified: true,
      insuranceVerified: true,
    },
    media: {
      cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
      gallery: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600",
      ],
    },
    description: `Elevate your milestone event with premier audio curation, dynamic crowd interaction, and intelligent dance-floor illumination. With over 10 years of concert and luxury wedding experience, Marcus Reed delivers seamless transitions, tailored playlist curation, and professional Master of Ceremonies coordination that keeps energy high and guests engaged.`,
    packages: {
      basic: {
        name: "Essential Party Set",
        price: 450,
        deliveryTime: "3 Hours Performance",
        description: "Compact sound system and curated playlist for cocktail hours and intimate gatherings up to 60 guests.",
        features: [
          "3 Hours Continuous DJ Performance",
          "2 Active Electro-Voice 12-inch Speakers",
          "1 Shure Wireless Microphone",
          "Custom Online Playlist Consultation",
        ],
      },
      standard: {
        name: "Celebration Master Pack",
        price: 850,
        deliveryTime: "5 Hours Performance",
        description: "Full event audio, intelligent multi-color dance wash lighting, and dedicated Master of Ceremonies hosting.",
        features: [
          "5 Hours Full Event Audio & Emcee Hosting",
          "High-Power 3000W Subwoofer & Dual Array System",
          "2 Shure Wireless Mics for Toasts & Speeches",
          "Moving-Head Intelligent LED Dance Lighting",
          "Custom 'Do-Not-Play' & Must-Play Music Portal",
        ],
      },
      premium: {
        name: "Royal Gala Platinum Experience",
        price: 1400,
        deliveryTime: "7 Hours Full Day",
        description: "Ultimate luxury setup with dual sound zones, cold sparklers effect, uplighting package, and on-site audio engineer.",
        features: [
          "7 Hours Unlimited DJ/MC Service (Ceremony + Reception)",
          "Dual-Zone Audio Setup for Separate Rooms",
          "12 Wireless Battery-Powered Ambient Uplights",
          "Indoor Safe Cold-Spark Fountain Finale (2 Units)",
          "Dedicated Assistant Audio Engineer On-Site",
          "Full 4K Soundboard Audio Recording of Speeches",
        ],
      },
    },
    compliance: {
      insuranceType: "$2,000,000 General Event Liability (Travelers)",
      insuranceStatus: "VERIFIED",
      insuranceExpiry: "Dec 31, 2026",
      certifications: ["QSC Certified Audio Engineer", "Illinois Licensed Vendor", "ServSafe Level 1"],
      backgroundCheck: "PASSED",
    },
    commissionRate: 10,
    adminNotes: [
      {
        id: "n-1",
        author: "Super Admin (Sarah)",
        text: "Verified Certificate of Insurance on file. Highly responsive vendor with 100% 5-star feedback in Chicago.",
        date: "Oct 1, 2025",
      },
      {
        id: "n-2",
        author: "Compliance Officer (Dan)",
        text: "Audio equipment specs meet venue decibel limit safety guidelines.",
        date: "Sep 15, 2025",
      },
    ],
  },
  "GIG-102": {
    id: "GIG-102",
    title: "Full-Day 4K Cinema & Drone Coverage with 48h Teaser Reel",
    category: "Photography & Cinema",
    subcategory: "Cinematography & Drone",
    occasions: ["Weddings", "Galas", "Milestone Anniversaries"],
    status: "ACTIVE",
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 89,
    totalOrders: 42,
    totalRevenue: 84000,
    viewsCount: 3940,
    conversionRate: "10.6%",
    vendor: {
      id: "V-102",
      name: "Amina Rahman",
      businessName: "Amina Rahman Visuals",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5.0,
      completedOrders: 96,
      memberSince: "Nov 2023",
      tier: "Elite Master Cinematographer",
      email: "amina@rahmanvisuals.com",
      phone: "+1 (310) 555-0812",
      location: "Los Angeles, CA",
      identityVerified: true,
      insuranceVerified: true,
    },
    media: {
      cover: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200",
      gallery: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
      ],
    },
    description: `Capturing the authentic emotions and cinematic grandeur of your milestone celebration. Features dual 4K Sony Cinema Line cameras, licensed drone aerial footage, and custom audio mastering for vows and speeches.`,
    packages: {
      basic: {
        name: "Teaser Film Highlight",
        price: 1200,
        deliveryTime: "4 Hours Coverage",
        description: "Essential ceremony and toast coverage edited into a cinematic 3-minute highlight film.",
        features: ["4 Hours Single Cinematographer", "4K Video Resolution", "3-Minute Teaser Film", "Digital Cloud Delivery"],
      },
      standard: {
        name: "Cinema Story Package",
        price: 2000,
        deliveryTime: "8 Hours Coverage",
        description: "Full day dual-camera documentation, drone aerials, and 7-minute feature film.",
        features: ["8 Hours Coverage with 2 Filming Units", "FAA Certified Drone Aerials", "7-Minute Highlight Film", "Full Vows & Toast Edits"],
      },
      premium: {
        name: "Heirloom Documentary Archive",
        price: 2800,
        deliveryTime: "10 Hours Full Day",
        description: "Complete raw footage archive, 15-minute documentary film, 48h Instagram teaser reel, and leather USB vault.",
        features: ["10 Hours Dual Cinematographers + Drone", "48h Social Media Reel", "15-Minute Documentary", "Raw Footage Hard Drive", "Leather Gift Presentation Box"],
      },
    },
    compliance: {
      insuranceType: "$1,000,000 Drone & Aerial Commercial Policy (Hiscox)",
      insuranceStatus: "VERIFIED",
      insuranceExpiry: "Nov 30, 2026",
      certifications: ["FAA Part 107 Commercial Drone Pilot", "Sony Pro Cine Certified"],
      backgroundCheck: "PASSED",
    },
    commissionRate: 10,
    adminNotes: [
      {
        id: "n-3",
        author: "Admin Team",
        text: "FAA Part 107 license cross-referenced with national registry. Approved.",
        date: "Oct 2, 2025",
      },
    ],
  },
  "GIG-103": {
    id: "GIG-103",
    title: "Organic Pastel Floral Balloon Arch & Luxury Photo Backdrops",
    category: "Decor & Styling",
    subcategory: "Balloon Art & Backdrops",
    occasions: ["Baby Showers", "Birthdays", "Bridal Showers", "Proms"],
    status: "PENDING_REVIEW",
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 64,
    totalOrders: 31,
    totalRevenue: 18600,
    viewsCount: 2150,
    conversionRate: "14.4%",
    vendor: {
      id: "V-103",
      name: "Chloe Bennett",
      businessName: "Bloom Studio Chicago",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      rating: 4.8,
      completedOrders: 54,
      memberSince: "Mar 2024",
      tier: "Verified Partner",
      email: "chloe@bloomstudiochi.com",
      phone: "+1 (312) 555-4421",
      location: "Chicago, IL",
      identityVerified: true,
      insuranceVerified: false,
    },
    media: {
      cover: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200",
      gallery: [
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600",
      ],
    },
    description: `Bespoke organic balloon installations intertwined with fresh or faux floral accents, custom laser-cut wooden signage, and modern shimmer wall photo backdrops.`,
    packages: {
      basic: {
        name: "Standard 8ft Demi Arch",
        price: 350,
        deliveryTime: "Setup 2h prior",
        description: "8-foot custom color organic balloon garland for cake tables or entryways.",
        features: ["8ft Organic Garland (up to 3 colors)", "Delivery & On-site Rigging", "Biodegradable Latex Materials"],
      },
      standard: {
        name: "Luxury Shimmer Wall & Arch",
        price: 650,
        deliveryTime: "Setup 3h prior",
        description: "12-foot organic balloon installation with 8x8ft champagne shimmer wall backdrop.",
        features: ["12ft Organic Arch + Fresh Florals", "8x8ft Shimmer Wall Backdrop", "Custom Neon or Wooden Signage", "Tear-down Service Included"],
      },
      premium: {
        name: "Grand Gala Photo Pavilion",
        price: 950,
        deliveryTime: "Full Day Rental",
        description: "Giant 20ft multi-tiered backdrop, floral explosion, balloon ceiling cascade, and LED spotlights.",
        features: ["20ft Mega Balloon Pavilion", "Custom 3D Foam Props", "LED Spotlights & Floor Pedestals", "Full Strike & Cleanup"],
      },
    },
    compliance: {
      insuranceType: "$1,000,000 General Decorators Policy",
      insuranceStatus: "PENDING",
      insuranceExpiry: "Awaiting Document Upload",
      certifications: ["Qualatex Certified Balloon Artist (CBA)"],
      backgroundCheck: "PASSED",
    },
    commissionRate: 10,
    adminNotes: [
      {
        id: "n-4",
        author: "Compliance Officer (Dan)",
        text: "Vendor updated balloon safety specs. Waiting for signed Certificate of Insurance to approve ACTIVE status.",
        date: "Oct 4, 2025",
      },
    ],
  },
  "GIG-104": {
    id: "GIG-104",
    title: "Custom 3-Tier Fondant Sculpted Milestone Cake & Macaron Towers",
    category: "Bakery & Desserts",
    subcategory: "Custom Cakes & Sweets",
    occasions: ["Birthdays", "Anniversaries", "Weddings"],
    status: "ACTIVE",
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 42,
    totalOrders: 38,
    totalRevenue: 15200,
    viewsCount: 1890,
    conversionRate: "20.1%",
    vendor: {
      id: "V-104",
      name: "Marcus Vance",
      businessName: "Chef Marcus (Sweet Delights)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      rating: 4.92,
      completedOrders: 82,
      memberSince: "Feb 2024",
      tier: "Artisan Baker",
      email: "marcus@sweetdelights.com",
      phone: "+1 (312) 555-8911",
      location: "Chicago, IL",
      identityVerified: true,
      insuranceVerified: true,
    },
    media: {
      cover: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=1200",
      gallery: [
        "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600",
      ],
    },
    description: `Handcrafted couture cakes crafted with gourmet Madagascar vanilla, Valrhona dark chocolate, and customized fondant sculptures. Delivered refrigerated with safe setup at your venue.`,
    packages: {
      basic: {
        name: "2-Tier Celebration Cake",
        price: 250,
        deliveryTime: "Serves 30-40",
        description: "Classic buttercream design with custom topper and seasonal berry fillings.",
        features: ["2-Tier Cake (6in + 8in)", "Choice of 2 Cake Flavors", "Complimentary Cake Stand Rental"],
      },
      standard: {
        name: "3-Tier Fondant Sculpted",
        price: 450,
        deliveryTime: "Serves 60-80",
        description: "Custom theme sculpted fondant accents, gold leafing, and handcrafted sugar flowers.",
        features: ["3-Tier Cake (6in + 8in + 10in)", "Handmade Sugar Florals", "Refrigerated Delivery & Setup"],
      },
      premium: {
        name: "Royal Dessert Table Suite",
        price: 650,
        deliveryTime: "Serves 100+",
        description: "3-Tier centerpiece cake paired with 50 matching French macarons and 30 cake pops.",
        features: ["3-Tier Centerpiece Cake", "50 French Macarons with Custom Tower", "30 Gourmet Cake Pops", "On-site Display Arrangement"],
      },
    },
    compliance: {
      insuranceType: "Commercial Kitchen & Food Liability Policy",
      insuranceStatus: "VERIFIED",
      insuranceExpiry: "Aug 15, 2026",
      certifications: ["ServSafe Food Manager", "City of Chicago Commercial Kitchen License"],
      backgroundCheck: "PASSED",
    },
    commissionRate: 10,
    adminNotes: [
      {
        id: "n-5",
        author: "Health & Safety Admin",
        text: "Inspected commercial kitchen license. All health inspection records up to date.",
        date: "Sep 20, 2025",
      },
    ],
  },
};

export default function AdminGigDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const gigId = resolvedParams.id;
  
  const initialGig = mockGigsDatabase[gigId] || mockGigsDatabase["GIG-101"];
  const [gig, setGig] = useState<GigDetailData>({
    ...initialGig,
    id: gigId, // keep url param id
  });

  const [selectedTier, setSelectedTier] = useState<"basic" | "standard" | "premium">("standard");
  const [newNote, setNewNote] = useState("");
  const [commissionInput, setCommissionInput] = useState(gig.commissionRate);

  const handleStatusChange = (newStatus: GigDetailData["status"]) => {
    setGig({ ...gig, status: newStatus });
    toast.success(`Gig #${gig.id} status updated to ${newStatus}.`);
  };

  const handleToggleFeatured = () => {
    const updated = !gig.isFeatured;
    setGig({ ...gig, isFeatured: updated });
    toast.success(updated ? "Gig marked as Featured on Marketplace homepage." : "Gig removed from Featured rotation.");
  };

  const handleSaveCommission = () => {
    setGig({ ...gig, commissionRate: commissionInput });
    toast.success(`Platform commission updated to ${commissionInput}% for this gig.`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteItem = {
      id: `n-${Date.now()}`,
      author: "Admin (You)",
      text: newNote,
      date: "Just now",
    };

    setGig({
      ...gig,
      adminNotes: [noteItem, ...gig.adminNotes],
    });
    setNewNote("");
    toast.success("Moderation note appended to audit record.");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Quick Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/gigs"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
                Gig Audit &amp; Moderation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
                #{gig.id}
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase",
                  gig.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : gig.status === "PENDING_REVIEW"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                )}
              >
                {gig.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Category: <span className="font-semibold text-slate-700">{gig.category}</span> &bull; Subcategory: <span className="font-semibold text-slate-700">{gig.subcategory}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/vendors/${gig.vendor.id}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public View
          </Link>

          <button
            onClick={handleToggleFeatured}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              gig.isFeatured
                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{gig.isFeatured ? "Featured Active" : "Set Featured"}</span>
          </button>

          {gig.status !== "ACTIVE" && (
            <button
              onClick={() => handleStatusChange("ACTIVE")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve &amp; Activate
            </button>
          )}

          {gig.status !== "PENDING_REVIEW" && (
            <button
              onClick={() => handleStatusChange("PENDING_REVIEW")}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" /> Request Revision
            </button>
          )}

          {gig.status !== "SUSPENDED" && (
            <button
              onClick={() => handleStatusChange("SUSPENDED")}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Suspend
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Gig Overview, Media, Packages) / Right 1 Col (Vendor, Compliance, Commission, Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Media & Title Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Banner Cover */}
            <div className="relative h-64 md:h-80 w-full bg-slate-900 overflow-hidden">
              <img
                src={gig.media.cover}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                  {gig.category}
                </span>
                {gig.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-white" /> Featured Homepage
                  </span>
                )}
              </div>

              {/* Title & Stats Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                <h2 className="text-lg md:text-2xl font-black drop-shadow-sm leading-tight">
                  {gig.title}
                </h2>
                
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-200">
                  <div className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{gig.rating}</span>
                    <span className="text-slate-300 font-normal">({gig.reviewsCount} reviews)</span>
                  </div>
                  <span>&bull;</span>
                  <span>{gig.totalOrders} Orders Completed</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ${gig.totalRevenue.toLocaleString()} Lifetime Volume
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {gig.media.gallery.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 overflow-x-auto">
                <span className="text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap">
                  Gallery Assets ({gig.media.gallery.length + 1}):
                </span>
                <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-brand-primary flex-shrink-0 cursor-pointer">
                  <img src={gig.media.cover} alt="Cover" className="w-full h-full object-cover" />
                </div>
                {gig.media.gallery.map((img, i) => (
                  <div key={i} className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Gig Description & Occasion Tags */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F0C3B] uppercase tracking-wider mb-2">
                  Service Description &amp; Scope
                </h3>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {gig.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Target Celebrations &amp; Occasions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {gig.occasions.map((occ, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-[#0F0C3B] rounded-lg text-[11px] font-semibold"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3-Tier Pricing Packages Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0F0C3B] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-primary" /> Service Pricing Packages &amp; Deliverables
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect the structured package tiers submitted by the vendor for marketplace compliance.
                </p>
              </div>

              {/* Tier Switcher Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {(["basic", "standard", "premium"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-bold text-xs capitalize transition-all",
                      selectedTier === tier
                        ? "bg-[#0F0C3B] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {tier} (${gig.packages[tier].price})
                  </button>
                ))}
              </div>
            </div>

            {/* Active Tier Package Detail Card */}
            {(() => {
              const activePkg = gig.packages[selectedTier];
              return (
                <div className="p-5 rounded-2xl bg-[#F8F9FD] border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-[#0F0C3B]">
                        {selectedTier} Tier
                      </span>
                      <h4 className="text-base font-bold text-[#0F0C3B] mt-1">{activePkg.name}</h4>
                      <p className="text-slate-600 text-xs mt-0.5">{activePkg.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Client Price</span>
                      <span className="text-2xl font-black text-[#0F0C3B] font-mono">${activePkg.price}</span>
                      <span className="text-[10px] text-slate-500 block">{activePkg.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Included Deliverables &amp; Equipment
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activePkg.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Analytics & Conversion Performance */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#0F0C3B] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Listing Performance Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Marketplace Views</span>
                <span className="text-lg font-black text-[#0F0C3B] mt-1 block">{gig.viewsCount.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-600 font-bold">+12% this month</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Conversion Rate</span>
                <span className="text-lg font-black text-brand-primary mt-1 block">{gig.conversionRate}</span>
                <span className="text-[10px] text-slate-500">Industry avg: 8.5%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Completed Orders</span>
                <span className="text-lg font-black text-[#0F0C3B] mt-1 block">{gig.totalOrders}</span>
                <span className="text-[10px] text-slate-500">0 Disputes logged</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Gross Payouts</span>
                <span className="text-lg font-black text-emerald-600 font-mono mt-1 block">
                  ${(gig.totalRevenue * (1 - gig.commissionRate / 100)).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Net after {gig.commissionRate}% fee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Vendor Profile, Compliance, Commission, Admin Notes */}
        <div className="space-y-6">

          {/* Vendor Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Listed By Vendor
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-brand-primary border border-indigo-100">
                {gig.vendor.tier}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-primary shadow-xs">
                <img src={gig.vendor.avatar} alt={gig.vendor.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1">
                  {gig.vendor.name}
                  {gig.vendor.identityVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                </h4>
                <p className="text-slate-600 text-xs">{gig.vendor.businessName}</p>
                <span className="text-[10px] text-slate-400">Member since {gig.vendor.memberSince} &bull; {gig.vendor.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
                <span className="font-bold text-[#0F0C3B] text-xs flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {gig.vendor.rating}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Completed</span>
                <span className="font-bold text-[#0F0C3B] text-xs">{gig.vendor.completedOrders} Gigs</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/admin/vendor-approvals`}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl font-bold text-center block transition-colors"
              >
                Inspect Vendor Credentials &rarr;
              </Link>
            </div>
          </div>

          {/* Insurance & Safety Compliance Audit */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Insurance &amp; Compliance Audit
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Commercial Liability</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold",
                    gig.compliance.insuranceStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  )}>
                    {gig.compliance.insuranceStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{gig.compliance.insuranceType}</p>
                <span className="text-[10px] text-slate-400 block">Valid thru: {gig.compliance.insuranceExpiry}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Background Screening</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {gig.compliance.backgroundCheck}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Identity and criminal background verified via Checkr.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-700 block">Certifications On File:</span>
                <div className="flex flex-wrap gap-1">
                  {gig.compliance.certifications.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-medium text-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Commission & Escrow Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-brand-primary" /> Platform Fee &amp; Commission Override
            </h4>

            <p className="text-slate-500 text-[11px]">
              Set custom commission deduction for this specific gig listing (Marketplace default is 10%).
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(Number(e.target.value))}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                />
                <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
              </div>

              <button
                type="button"
                onClick={handleSaveCommission}
                className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold transition-colors text-xs"
              >
                Save
              </button>
            </div>
          </div>

          {/* Admin Audit Log & Internal Notes */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand-primary" /> Admin Audit Log &amp; Notes
              </h4>
              <span className="text-slate-400 text-[10px] font-bold">{gig.adminNotes.length} notes</span>
            </div>

            {/* Note items */}
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {gig.adminNotes.map((note) => (
                <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#0F0C3B]">{note.author}</span>
                    <span className="text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Append Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
              <textarea
                rows={2}
                placeholder="Add internal moderation note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                <Send className="w-3.5 h-3.5" /> Append Note
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
