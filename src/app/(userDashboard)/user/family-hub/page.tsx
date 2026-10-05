"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users2, 
  Plus, 
  ThumbsUp, 
  MessageSquare, 
  Check, 
  Sparkles, 
  UserPlus,
  CreditCard,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Crown,
  Lock,
  Heart,
  Calendar,
  Star,
  MapPin,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import FamilyPaymentModal from "@/components/user/FamilyPaymentModal";
import FamilyServiceDetailModal, { HubServiceDetail } from "@/components/user/FamilyServiceDetailModal";
import AddToFamilyHubModal from "@/components/shared/AddToFamilyHubModal";

interface FamilyHubWorkspace {
  id: string;
  name: string;
  role: string;
  eventDate: string;
  targetBudget: number;
  totalPledged: number;
  members: { name: string; avatar: string; role: string; pledged: number }[];
}

const mockWorkspaces: FamilyHubWorkspace[] = [
  {
    id: "hub-1",
    name: "Emily & David's Golden Ophir Wedding",
    role: "Host / Admin",
    eventDate: "Nov 15, 2025",
    targetBudget: 25000,
    totalPledged: 14000,
    members: [
      { name: "Emily Carter", avatar: "EC", role: "Host", pledged: 8500 },
      { name: "David Miller", avatar: "DM", role: "Co-Host", pledged: 3500 },
      { name: "Grace Carter (Mom)", avatar: "GC", role: "Contributor", pledged: 2000 },
      { name: "Uncle Robert", avatar: "UR", role: "Reviewer", pledged: 0 },
    ],
  },
  {
    id: "hub-2",
    name: "Miller 40th Birthday Bash",
    role: "Co-Planner",
    eventDate: "Dec 08, 2025",
    targetBudget: 8000,
    totalPledged: 5400,
    members: [
      { name: "David Miller", avatar: "DM", role: "Host", pledged: 3000 },
      { name: "Emily Carter", avatar: "EC", role: "Co-Host", pledged: 1500 },
      { name: "Sarah Miller", avatar: "SM", role: "Contributor", pledged: 900 },
    ],
  },
  {
    id: "hub-3",
    name: "Carter Family Holiday Gala",
    role: "Family Member",
    eventDate: "Dec 24, 2025",
    targetBudget: 12000,
    totalPledged: 6000,
    members: [
      { name: "Grace Carter", avatar: "GC", role: "Host", pledged: 4000 },
      { name: "Emily Carter", avatar: "EC", role: "Contributor", pledged: 1000 },
      { name: "Aunt Claire", avatar: "AC", role: "Contributor", pledged: 1000 },
    ],
  },
];

const initialHubServices: HubServiceDetail[] = [
  {
    id: "hs-1",
    title: "DJ & Emcee Master Sound Reception Set",
    category: "Music & Entertainment",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000",
    vendorName: "Windy City Sound DJ",
    vendorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    vendorRating: 4.9,
    vendorReviewCount: 142,
    vendorTier: "Top Rated Vendor",
    location: "Chicago, IL",
    totalPrice: 1200,
    amountPaid: 900,
    status: "Partially Funded",
    addedBy: {
      name: "Emily Carter",
      avatar: "EC",
      role: "Host",
      date: "Oct 2, 2025",
    },
    note: "They did my cousin's wedding last year and the dance floor was packed all night! We should definitely lock in this early bird rate.",
    votesUp: 4,
    votedBy: ["Emily", "David", "Grace", "Uncle Robert"],
    inclusions: [
      "5 Hours Live DJ & Master of Ceremonies Performance",
      "Wireless Shure Microphones for speeches & toasts",
      "Club-grade moving head intelligent dance lighting",
      "Custom curated playlist & 'Do Not Play' blacklist",
      "Early soundcheck & backup equipment on-site",
    ],
    contributors: [
      { name: "Emily Carter", amount: 600, avatar: "EC", date: "Oct 3, 2025" },
      { name: "Grace Carter", amount: 300, avatar: "GC", date: "Oct 4, 2025" },
    ],
    comments: [
      {
        id: "c-1",
        author: "Grace Carter (Mom)",
        avatar: "GC",
        text: "Love their music sample mixes! I just chipped in $300 towards the balance.",
        time: "Yesterday at 4:20 PM",
      },
      {
        id: "c-2",
        author: "David Miller",
        avatar: "DM",
        text: "Checked their lighting demo, it will match our purple & gold theme perfectly.",
        time: "2 hours ago",
      },
    ],
  },
  {
    id: "hs-2",
    title: "Cinematic 4K Drone & Dual-Camera Video Package",
    category: "Photography & Cinema",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1000",
    vendorName: "Lumina Cinematic Films",
    vendorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    vendorRating: 5.0,
    vendorReviewCount: 98,
    vendorTier: "Elite Master",
    location: "Los Angeles, CA",
    totalPrice: 2800,
    amountPaid: 2800,
    status: "Funded (Escrow Active)",
    addedBy: {
      name: "David Miller",
      avatar: "DM",
      role: "Co-Host",
      date: "Oct 1, 2025",
    },
    note: "Includes aerial drone 4K footage of the outdoor venue + 8 minute highlight film. Escrow fully completed!",
    votesUp: 3,
    votedBy: ["Emily", "David", "Grace"],
    inclusions: [
      "8 Hours Full Day Dual-Cinematographer Coverage",
      "FAA-Certified 4K Drone Aerial Venue Shots",
      "Cinematic 7-9 Minute Teaser Highlight Film",
      "Full Length Raw Speech & Vows Archive",
      "Digital 4K Download Master with Cloud Backup",
    ],
    contributors: [
      { name: "David Miller", amount: 1800, avatar: "DM", date: "Oct 1, 2025" },
      { name: "Emily Carter", amount: 1000, avatar: "EC", date: "Oct 2, 2025" },
    ],
    comments: [
      {
        id: "c-3",
        author: "David Miller",
        avatar: "DM",
        text: "Full amount is now safely in Stripe Escrow. Vendor confirmed date reservation.",
        time: "3 days ago",
      },
    ],
  },
  {
    id: "hs-3",
    title: "Artisan Dessert & Champagne Bar Setup",
    category: "Catering & Bar Service",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1000",
    vendorName: "Gourmet Bites & Bar Co.",
    vendorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    vendorRating: 4.8,
    vendorReviewCount: 84,
    vendorTier: "Verified Partner",
    location: "Chicago, IL",
    totalPrice: 1500,
    amountPaid: 500,
    status: "Partially Funded",
    addedBy: {
      name: "Grace Carter (Mom)",
      avatar: "GC",
      role: "Contributor",
      date: "Oct 3, 2025",
    },
    note: "Handmade French macarons, chocolate truffles, and a customized champagne tower for the cocktail hour.",
    votesUp: 2,
    votedBy: ["Grace", "Uncle Robert"],
    inclusions: [
      "French Macarons (150 pcs) & Belgium Ganache Tartlets",
      "Illuminated 4-Tier Glass Champagne Tower Setup",
      "2 Dedicated Uniformed Bar Servers for 3 Hours",
      "Custom Menu Card Display & Floral Accents",
      "Complete Setup, Service, and Tear-down Clean Up",
    ],
    contributors: [
      { name: "Grace Carter", amount: 500, avatar: "GC", date: "Oct 4, 2025" },
    ],
    comments: [
      {
        id: "c-4",
        author: "Grace Carter (Mom)",
        avatar: "GC",
        text: "I covered the first $500 deposit! Can someone help cover the remaining $1,000?",
        time: "Yesterday at 11:30 AM",
      },
    ],
  },
];

export default function FamilyHubPage() {
  const [activeHub, setActiveHub] = useState<FamilyHubWorkspace>(mockWorkspaces[0]);
  const [services, setServices] = useState<HubServiceDetail[]>(initialHubServices);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<HubServiceDetail | null>(null);
  const [selectedServiceForPay, setSelectedServiceForPay] = useState<HubServiceDetail | null>(null);
  const [showHubSwitcher, setShowHubSwitcher] = useState(false);

  const handleVote = (serviceId: string) => {
    setServices(services.map((s) => {
      if (s.id === serviceId) {
        return {
          ...s,
          votesUp: s.votesUp + 1,
          votedBy: [...s.votedBy, "You"],
        };
      }
      return s;
    }));
    
    // Also update currently inspected detail modal if open
    if (selectedServiceDetail && selectedServiceDetail.id === serviceId) {
      setSelectedServiceDetail({
        ...selectedServiceDetail,
        votesUp: selectedServiceDetail.votesUp + 1,
        votedBy: [...selectedServiceDetail.votedBy, "You"],
      });
    }

    toast.success("Thumbs up vote recorded on the family board!");
  };

  const handlePaymentSuccess = (serviceId: string, amount: number, contributorName: string) => {
    const updated = services.map((s) => {
      if (s.id === serviceId) {
        const newPaid = s.amountPaid + amount;
        return {
          ...s,
          amountPaid: newPaid,
          status: (newPaid >= s.totalPrice ? "Funded (Escrow Active)" : "Partially Funded") as HubServiceDetail["status"],
          contributors: [
            ...s.contributors,
            { 
              name: contributorName, 
              amount, 
              avatar: contributorName.substring(0, 2).toUpperCase(),
              date: "Today"
            },
          ],
        };
      }
      return s;
    });

    setServices(updated);

    if (selectedServiceDetail && selectedServiceDetail.id === serviceId) {
      const match = updated.find(s => s.id === serviceId);
      if (match) setSelectedServiceDetail(match);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Multi-Family Hub Selector & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 relative">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Family Planning Hub</h1>
            
            {/* Multi-Family Hub Dropdown Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowHubSwitcher(!showHubSwitcher)}
                className="px-3 py-1 rounded-xl bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors shadow-xs"
              >
                <span>{activeHub.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-700" />
              </button>

              {showHubSwitcher && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
                    Switch Joined Family Hubs ({mockWorkspaces.length})
                  </span>
                  {mockWorkspaces.map((hub) => (
                    <div
                      key={hub.id}
                      onClick={() => {
                        setActiveHub(hub);
                        setShowHubSwitcher(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                        activeHub.id === hub.id ? "bg-[#EDE9FE] text-[#0F0C3B] font-bold" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <p className="font-bold">{hub.name}</p>
                        <p className="text-[10px] text-slate-500">{hub.role} &bull; {hub.eventDate}</p>
                      </div>
                      {activeHub.id === hub.id && <Check className="w-4 h-4 text-brand-primary" />}
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href="/user/family-hub/members"
                      className="w-full py-1.5 px-3 rounded-lg text-brand-primary font-bold hover:bg-indigo-50 flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Join / Manage Hub Members
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Collaborative decision board: Click any card to inspect full service inclusions, vendor credentials, family feedback, or contribute via Stripe.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/vendors"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-brand-primary" /> Browse Marketplace
          </Link>

          <Link
            href="/user/family-hub/members"
            className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-amber-400" /> Invite Family Member
          </Link>
        </div>
      </div>

      {/* Pooled Budget & Members Stats Card */}
      <div className="bg-gradient-to-r from-[#0F0C3B] to-[#18124E] text-white p-6 rounded-3xl shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              {activeHub.name}
            </span>
            <h2 className="text-xl font-black">
              Pooled Family Escrow Fund: <span className="text-emerald-400">${activeHub.totalPledged.toLocaleString()}</span>
            </h2>
            <p className="text-xs text-indigo-200">
              Target Celebration Budget: ${activeHub.targetBudget.toLocaleString()} &bull; Event Date: {activeHub.eventDate}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-300 font-bold block">Stripe Escrow Custody</span>
              <span className="text-xs font-bold text-white">Funds released only on milestone signoff</span>
            </div>
          </div>
        </div>

        {/* Member Avatars & Contribution Pills */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {activeHub.members.map((m, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] border-2 border-[#0F0C3B] shadow-xs"
                  title={`${m.name} (${m.role}): $${m.pledged.toLocaleString()} contributed`}
                >
                  {m.avatar}
                </div>
              ))}
            </div>
            <span className="text-slate-300 text-xs font-semibold">
              {activeHub.members.length} Active Collaborators
            </span>
          </div>

          <Link
            href="/user/family-hub/members"
            className="text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center gap-1"
          >
            Manage Permissions & Spending Caps &rarr;
          </Link>
        </div>
      </div>

      {/* Services Added to this Family Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#0F0C3B]">
              Shortlisted Services & Crowdfunded Milestones ({services.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click any service card to open full details, inclusions checklist, vendor review badges, and family chat.
            </p>
          </div>
        </div>

        {/* Services Grid with Rich Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const pct = Math.min(100, Math.round((svc.amountPaid / svc.totalPrice) * 100));
            const isFullyFunded = svc.amountPaid >= svc.totalPrice;

            return (
              <div
                key={svc.id}
                onClick={() => setSelectedServiceDetail(svc)}
                className="group bg-white border border-slate-200 hover:border-brand-primary/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Top Image Banner with Category & Vote Pill */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                      {svc.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(svc.id);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 hover:bg-rose-600/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 transition-colors"
                      title="Vote for this vendor service"
                    >
                      <ThumbsUp className="w-3 h-3 text-amber-300" />
                      <span>{svc.votesUp}</span>
                    </button>
                  </div>

                  {/* Vendor Avatar Overlay on bottom banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-white overflow-hidden flex items-center justify-center text-[#0F0C3B] font-bold text-[10px] shadow-sm">
                        {svc.vendorAvatar.startsWith("http") ? (
                          <img src={svc.vendorAvatar} alt={svc.vendorName} className="w-full h-full object-cover" />
                        ) : (
                          svc.vendorAvatar
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white drop-shadow-xs line-clamp-1">{svc.vendorName}</p>
                        <p className="text-[10px] text-slate-200 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                          <span>{svc.vendorRating}</span> &bull; <span>{svc.location}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-amber-300 font-mono bg-black/60 px-2 py-0.5 rounded-lg border border-white/10">
                      ${svc.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F0C3B] group-hover:text-brand-primary transition-colors line-clamp-1">
                        {svc.title}
                      </h4>
                      
                      {/* Added by badge */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600">
                        <span className="w-4 h-4 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[8px]">
                          {svc.addedBy.avatar}
                        </span>
                        <span>
                          Added by <strong className="text-[#0F0C3B]">{svc.addedBy.name}</strong>
                        </span>
                        <span className="text-slate-400">&bull; {svc.addedBy.date}</span>
                      </div>
                    </div>

                    {/* Funding Meter */}
                    <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFullyFunded ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-500"
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={isFullyFunded ? "text-emerald-700" : "text-amber-700"}>
                          ${svc.amountPaid.toLocaleString()} ({pct}%)
                        </span>
                        <span className="text-slate-500">
                          ${(svc.totalPrice - svc.amountPaid).toLocaleString()} remaining
                        </span>
                      </div>
                    </div>

                    {/* Contributors summary */}
                    {svc.contributors.length > 0 && (
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span className="font-semibold text-slate-400 uppercase">Contributors:</span>
                        <div className="flex items-center gap-1">
                          {svc.contributors.map((c, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full bg-slate-100 text-[#0F0C3B] border border-slate-300 flex items-center justify-center font-bold text-[8px]"
                              title={`${c.name}: $${c.amount}`}
                            >
                              {c.avatar}
                            </span>
                          ))}
                          <span className="font-bold text-slate-700">({svc.contributors.length})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedServiceDetail(svc);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Details</span>
                    </button>

                    {isFullyFunded ? (
                      <div className="flex-1 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Funded</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedServiceForPay(svc);
                        }}
                        className="flex-1 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Co-Pay ($)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Service Detail Modal on Card Click */}
      {selectedServiceDetail && (
        <FamilyServiceDetailModal
          isOpen={!!selectedServiceDetail}
          onClose={() => setSelectedServiceDetail(null)}
          service={selectedServiceDetail}
          onVote={handleVote}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Direct Quick Payment Modal */}
      {selectedServiceForPay && (
        <FamilyPaymentModal
          isOpen={!!selectedServiceForPay}
          onClose={() => setSelectedServiceForPay(null)}
          service={{
            id: selectedServiceForPay.id,
            title: selectedServiceForPay.title,
            vendorName: selectedServiceForPay.vendorName,
            totalPrice: selectedServiceForPay.totalPrice,
            amountPaid: selectedServiceForPay.amountPaid,
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

