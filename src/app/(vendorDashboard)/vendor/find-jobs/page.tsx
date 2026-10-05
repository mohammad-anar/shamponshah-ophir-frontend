"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Clock, DollarSign, Send, Sparkles, ShieldCheck } from "lucide-react";
import SendOfferModal from "@/components/vendor/SendOfferModal";

const jobMatches = [
  {
    id: "JOB-8492",
    title: "DJ and Emcee for 5th birthday party",
    client: "Emily Carter (Lincoln Park)",
    date: "Nov 14, 2026 (2:00 PM – 6:00 PM)",
    budget: "$600 – $1,200",
    distance: "6.2 miles away (Chicago, IL)",
    bidsSent: 7,
    creditsCost: 2,
    description: "Looking for family-friendly DJ who can keep 40 kids entertained with interactive games, freeze dance, limbo, and provide nice background music for parents.",
  },
  {
    id: "JOB-8490",
    title: "Wedding DJ with wireless mic setup",
    client: "Sarah Jenkins (Naperville)",
    date: "Oct 24, 2026",
    budget: "$800 – $1,500",
    distance: "18 miles away (Naperville, IL)",
    bidsSent: 4,
    creditsCost: 2,
    description: "Full reception dinner, toasts, first dance, and high-energy party set. Premium sound system required.",
  },
  {
    id: "JOB-8488",
    title: "Corporate Holiday Mixer DJ",
    client: "TechForward Group (Loop)",
    date: "Dec 04, 2026",
    budget: "$500 – $900",
    distance: "2.1 miles away (Loop, Chicago)",
    bidsSent: 2,
    creditsCost: 2,
    description: "Cocktail mixer for 120 tech professionals. Sophisticated lounge, deep house, and classic soul.",
  },
];

export default function VendorFindJobsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ title: string; budget: string }>({
    title: "",
    budget: "",
  });

  const handleOpenProposal = (title: string, budget: string) => {
    setSelectedJob({ title, budget });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <SendOfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        jobTitle={selectedJob.title}
        clientBudget={selectedJob.budget}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">Find Jobs &amp; Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified client requests matching your Chicago DJ &amp; sound profile
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {jobMatches.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    {job.creditsCost} Bid Credits
                  </span>
                  <span className="text-slate-400 font-medium">#{job.id}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F0C3B] mt-1">{job.title}</h3>
                <p className="text-slate-500 mt-0.5">Posted by <strong>{job.client}</strong> • {job.distance}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Target Budget</span>
                <span className="text-lg font-extrabold text-[#0F0C3B]">{job.budget}</span>
              </div>
            </div>

            <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {job.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Target Date: <strong>{job.date}</strong>
              </span>

              <button
                onClick={() => handleOpenProposal(job.title, job.budget)}
                className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Custom Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
