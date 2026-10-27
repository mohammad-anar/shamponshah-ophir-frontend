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

import { useGetAllJobsQuery } from "@/redux/service/admin/adminApi";

export default function AdminJobsBidsPage() {
  const { data: apiJobs, isLoading } = useGetAllJobsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const rawJobs = apiJobs?.data || apiJobs?.jobs || (Array.isArray(apiJobs) ? apiJobs : null);
  const jobs = (rawJobs && Array.isArray(rawJobs) && rawJobs.length > 0)
    ? rawJobs.map((j: any) => ({
        id: `JOB-${(j.id || "").substring(0, 5).toUpperCase()}`,
        realId: j.id,
        title: j.title,
        category: j.category?.name || "Event Service",
        client: `${j.clientProfile?.displayName || j.client?.name || "Client"} (${j.location || j.city || "Chicago"})`,
        clientAvatar: (j.clientProfile?.displayName || j.client?.name || "CL").substring(0, 2).toUpperCase(),
        date: j.eventDate ? new Date(j.eventDate).toLocaleDateString() : "Upcoming",
        location: j.location || `${j.city || "Chicago"}, IL`,
        budget: j.budgetMin && j.budgetMax ? `$${Number(j.budgetMin).toFixed(0)} – $${Number(j.budgetMax).toFixed(0)}` : j.budgetMin ? `$${Number(j.budgetMin).toFixed(0)}` : "$400 – $600",
        bidsCount: j._count?.offers || j.offers?.length || 0,
        status: j.status || "OPEN_BIDDING",
        timeLeft: j.status === "OPEN" || j.status === "OPEN_BIDDING" ? "Active RFP" : j.status,
      }))
    : jobsList.map(j => ({ ...j, realId: j.id }));

  const filteredJobs = jobs.filter((job) => {
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
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Jobs &amp; Bids Monitor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit client celebration RFPs, inspect vendor proposal bids, review pricing spreads, and moderate custom job requests
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#121418] rounded-3xl border border-[#26282E] shadow-xs overflow-hidden text-xs">
        {/* Search & Status Filters */}
        <div className="p-4 border-b border-[#26282E] flex items-center justify-between gap-4 flex-wrap bg-[#16181F]/70">
          <div className="flex items-center gap-2">
            {["ALL", "OPEN_BIDDING", "AWARDED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                  activeFilter === f 
                    ? "bg-[#DFB76C] text-[#0B0C0E] shadow-xs font-bold" 
                    : "bg-[#16181F] text-slate-400 hover:text-white hover:bg-[#1A1D24] border border-[#26282E]"
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
              className="w-full pl-9 pr-3 py-1.5 bg-[#16181F] border border-[#26282E] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#16181F] border-b border-[#26282E] text-[11px] font-bold uppercase text-slate-400">
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
            <tbody className="divide-y divide-[#26282E]">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className="hover:bg-[#1A1D24]/50 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      href={`/admin/jobs/${job.realId || job.id}`}
                      className="font-bold text-white group-hover:text-[#DFB76C] line-clamp-1 block transition-colors"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#DFB76C] bg-[#16181F] px-1.5 py-0.5 rounded border border-[#26282E]">
                        #{job.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {job.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center font-bold text-[9px]">
                        {job.clientAvatar}
                      </div>
                      <span className="font-semibold text-slate-200">{job.client}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="font-medium text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {job.date}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{job.location}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#DFB76C] font-mono">{job.budget}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#DFB76C] bg-[#DFB76C]/10 border border-[#DFB76C]/30 px-2 py-0.5 rounded-lg">
                      {job.bidsCount} Proposals
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block",
                      job.status === "OPEN_BIDDING" || job.status === "OPEN"
                        ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    )}>
                      {job.timeLeft}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/jobs/${job.realId || job.id}`}
                      className="px-3 py-1.5 bg-[#16181F] hover:bg-[#1A1D24] text-slate-200 hover:text-white border border-[#26282E] rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
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

