"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileCheck, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  DollarSign, 
  Eye, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Trash2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useGetVendorOffersQuery, useWithdrawOfferMutation } from "@/redux/service/jobs/jobsApi";

interface SubmittedOffer {
  id: string;
  offerCode: string;
  jobId?: string;
  jobTitle: string;
  clientName: string;
  clientAvatar: string;
  eventDate: string;
  location: string;
  price: number;
  milestonesCount: number;
  submittedAt: string;
  expiresIn: string;
  status: "Under Review" | "Accepted" | "Declined" | "Expired";
  rawStatus: string;
  coverNote: string;
}

const mockOffers: SubmittedOffer[] = [
  {
    id: "off-1",
    offerCode: "PROP-9011",
    jobTitle: "DJ & Emcee for Lakefront Wedding Reception",
    clientName: "Emily Carter",
    clientAvatar: "EC",
    eventDate: "Nov 15, 2026",
    location: "Chicago, IL",
    price: 1200,
    milestonesCount: 2,
    submittedAt: "2 hours ago",
    expiresIn: "46h left",
    status: "Under Review",
    rawStatus: "PENDING",
    coverNote: "Includes 5-hour continuous DJ set, wireless lapel mics for ceremony vows, dual 15-inch QSC sound towers, and 8 wireless battery uplights in warm amber.",
  },
  {
    id: "off-2",
    offerCode: "PROP-9008",
    jobTitle: "Corporate Gala Audio & Background Jazz",
    clientName: "Robert Sterling",
    clientAvatar: "RS",
    eventDate: "Dec 08, 2026",
    location: "Chicago, IL",
    price: 2400,
    milestonesCount: 3,
    submittedAt: "Yesterday",
    expiresIn: "22h left",
    status: "Accepted",
    rawStatus: "ACCEPTED",
    coverNote: "Live saxophone during networking hour followed by DJ dinner set and awards ceremony fanfare audio.",
  },
  {
    id: "off-3",
    offerCode: "PROP-8995",
    jobTitle: "Sweet 16 Dance Party DJ & Laser Lighting",
    clientName: "Samantha Miller",
    clientAvatar: "SM",
    eventDate: "Jan 18, 2027",
    location: "Naperville, IL",
    price: 950,
    milestonesCount: 2,
    submittedAt: "3 days ago",
    expiresIn: "Expired",
    status: "Expired",
    rawStatus: "EXPIRED",
    coverNote: "High energy TikTok hits & club clean edits with dual haze laser scanners.",
  }
];

export default function VendorOffersPage() {
  const { data: apiOffers, isLoading } = useGetVendorOffersQuery();
  const [withdrawOffer, { isLoading: isWithdrawing }] = useWithdrawOfferMutation();

  const [offers, setOffers] = useState<SubmittedOffer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState<SubmittedOffer | null>(null);

  useEffect(() => {
    const rawOffers = (apiOffers as any)?.data || (Array.isArray(apiOffers) ? apiOffers : []);
    if (Array.isArray(rawOffers)) {
      const mapped = rawOffers.map((o: any) => ({
        id: o.id,
        offerCode: `PROP-${o.id.slice(-4).toUpperCase()}`,
        jobId: o.jobId,
        jobTitle: o.job?.title || "Custom Event Project",
        clientName: o.job?.clientProfile?.displayName || o.job?.clientProfile?.user?.name || "Private Host",
        clientAvatar: (o.job?.clientProfile?.displayName || o.job?.clientProfile?.user?.name || "PH").slice(0, 2).toUpperCase(),
        eventDate: o.job?.eventDate ? new Date(o.job.eventDate).toLocaleDateString() : "Flexible",
        location: o.job?.location || o.job?.city || "Chicago, IL",
        price: Number(o.price || 0),
        milestonesCount: o.milestones ? (Array.isArray(o.milestones) ? o.milestones.length : 2) : 2,
        submittedAt: new Date(o.createdAt).toLocaleDateString(),
        expiresIn: "48h left",
        status: (o.status === "PENDING" ? "Under Review" : o.status === "ACCEPTED" ? "Accepted" : o.status === "REJECTED" ? "Declined" : "Expired") as SubmittedOffer["status"],
        rawStatus: o.status,
        coverNote: o.message || o.coverLetter || "Custom proposal submitted with all milestone deliverables.",
      }));
      setOffers(mapped);
    }
  }, [apiOffers]);

  const handleWithdraw = async (offerId: string) => {
    if (!confirm("Are you sure you want to retract this proposal? 2 bid credits will be refunded back to your account.")) return;

    try {
      await withdrawOffer(offerId).unwrap();
      setOffers(prev => prev.filter(o => o.id !== offerId));
      if (selectedOffer?.id === offerId) setSelectedOffer(null);
      toast.success("Offer withdrawn.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not withdraw offer.");
    }
  };

  const filtered = offers.filter((o) => {
    const matchesSearch = o.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) || o.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">My Submitted Offers &amp; Bids</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              {offers.length} Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor client review status, proposal expiry timers, and milestone contract awards.
          </p>
        </div>

        <Link
          href="/vendor/find-jobs"
          className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-[#18124E] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <Search className="w-4 h-4 text-amber-300" /> Browse Live Jobs
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search proposals, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F9FD] border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
            <span>Loading submitted proposals...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-[#0F0C3B]">No proposals found</p>
            <p className="text-slate-400 mt-0.5">Submit offers on verified client celebration posts</p>
          </div>
        ) : (
          filtered.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-brand-primary">{o.offerCode}</span>
                  <span className="text-xs font-bold text-slate-400">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700">Submitted {o.submittedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  {o.status === "Under Review" && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {o.expiresIn}
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    o.status === "Under Review" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    o.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <h3 className="text-sm font-bold text-[#0F0C3B]">{o.jobTitle}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">
                        {o.clientAvatar}
                      </div>
                      <span className="font-bold text-slate-700">{o.clientName}</span>
                    </div>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{o.eventDate}</span>
                    </div>
                    <span>&bull;</span>
                    <span>{o.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-[#F8F9FD] p-3 rounded-xl border border-slate-100 mt-2">
                    &ldquo;{o.coverNote}&rdquo;
                  </p>
                </div>

                <div className="bg-[#F8F9FD] p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Proposed Price</span>
                    <p className="text-xl font-black text-[#0F0C3B] mt-0.5">
                      ${o.price.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">
                      You keep 100% (${o.price.toLocaleString()})
                    </p>
                    <span className="text-[10px] text-slate-400">{o.milestonesCount} Escrow Milestones</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/vendor/messages"
                      className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0F0C3B] rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </Link>
                    <button
                      onClick={() => setSelectedOffer(o)}
                      className="w-full py-2 bg-[#0F0C3B] hover:bg-[#18124E] text-white rounded-lg text-xs font-bold text-center cursor-pointer"
                    >
                      Details
                    </button>
                  </div>

                  {(o.status === "Under Review" || o.rawStatus === "PENDING") && (
                    <button
                      onClick={() => handleWithdraw(o.id)}
                      className="w-full py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Withdraw Proposal
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">{selectedOffer.offerCode}</span>
                <h2 className="text-sm font-bold text-[#0F0C3B]">{selectedOffer.jobTitle}</h2>
              </div>
              <button onClick={() => setSelectedOffer(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8F9FD] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Client &amp; Event Date</span>
                <p className="font-bold text-slate-800">{selectedOffer.clientName} &bull; {selectedOffer.eventDate}</p>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Proposal Cover Note</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-200">
                  {selectedOffer.coverNote}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Payout Guarantee</span>
                  <p className="text-sm font-black text-emerald-900">${selectedOffer.price.toLocaleString()} Net Payout</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {(selectedOffer.status === "Under Review" || selectedOffer.rawStatus === "PENDING") ? (
                <button
                  onClick={() => handleWithdraw(selectedOffer.id)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Retract Proposal
                </button>
              ) : <div />}

              <button
                onClick={() => setSelectedOffer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
