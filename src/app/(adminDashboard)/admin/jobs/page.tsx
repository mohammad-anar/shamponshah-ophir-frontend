"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Users, 
  Eye, 
  CheckCircle2, 
  Calendar,
  ChevronRight,
  ExternalLink,
  Sparkles,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const jobsList = [
  {
    id: "JOB-8492",
    title: "High-Energy DJ & Emcee for Emma's 5th Birthday Party",
    category: "Music & Entertainment",
    client: "Emily Carter (Lincoln Park)",
    clientAvatar: "EC",
    date: "Nov 14, 2026",
    location: "Lincoln Park, Chicago",
    budget: "$400 – $600",
    bidsCount: 5,
    status: "OPEN_BIDDING",
    timeLeft: "48 hours remaining",
  },
  {
    id: "JOB-8490",
    title: "Full-Day Wedding DJ with wireless mic setup",
    category: "Music & Entertainment",
    client: "Sarah Jenkins (Naperville)",
    clientAvatar: "SJ",
    date: "Oct 24, 2026",
    location: "Naperville, IL",
    budget: "$800 – $1,500",
    bidsCount: 4,
    status: "OPEN_BIDDING",
    timeLeft: "5 days remaining",
  },
  {
    id: "JOB-8488",
    title: "Corporate Holiday Mixer DJ & Ambient Lighting",
    category: "Corporate Events",
    client: "TechForward Group (Loop)",
    clientAvatar: "TF",
    date: "Dec 04, 2026",
    location: "The Loop, Chicago",
    budget: "$500 – $900",
    bidsCount: 2,
    status: "OPEN_BIDDING",
    timeLeft: "12 days remaining",
  },
  {
    id: "JOB-8485",
    title: "Organic Balloon Garland & Photo Backdrop Installation",
    category: "Decor & Styling",
    client: "Jessica Davis (Oak Park)",
    clientAvatar: "JD",
    date: "Nov 28, 2026",
    location: "Oak Park, IL",
    budget: "$350 – $600",
    bidsCount: 6,
    status: "AWARDED",
    timeLeft: "Awarded to Bloom Studio",
  },
];

export default function AdminJobsBidsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredJobs = jobsList.filter((job) => {
    const matchesFilter = activeFilter === "ALL" || job.status === activeFilter;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Jobs &amp; Bids Monitor</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit client celebration RFPs, inspect artisan proposal bids, review pricing spreads, and moderate custom job requests
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        {/* Search & Status Filters */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-[#F8F9FD]/50">
          <div className="flex items-center gap-2">
            {["ALL", "OPEN_BIDDING", "AWARDED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                  activeFilter === f 
                    ? "bg-[#0F0C3B] text-white shadow-xs" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                )}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search RFPs, buyers, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#EDE9FE]/40 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Job Title &amp; ID</th>
                <th className="py-3.5 px-4">Host (Buyer)</th>
                <th className="py-3.5 px-4">Event Date &amp; Location</th>
                <th className="py-3.5 px-4">Budget Range</th>
                <th className="py-3.5 px-4">Bids Received</th>
                <th className="py-3.5 px-4">Bidding Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="font-bold text-[#0F0C3B] group-hover:text-brand-primary line-clamp-1 block transition-colors"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-brand-primary bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                        #{job.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {job.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[9px]">
                        {job.clientAvatar}
                      </div>
                      <span className="font-semibold text-slate-800">{job.client}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-medium text-[#0F0C3B] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {job.date}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{job.location}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B] font-mono">{job.budget}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-brand-primary bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      {job.bidsCount} Proposals
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block",
                      job.status === "OPEN_BIDDING"
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    )}>
                      {job.timeLeft}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="px-3 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3" /> Full Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

