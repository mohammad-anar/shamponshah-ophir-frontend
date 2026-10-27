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
          <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Jobs &amp; Bids Monitor</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Audit client celebration RFPs, inspect vendor proposal bids, review pricing spreads, and moderate custom job requests
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface rounded-3xl border border-border shadow-xs overflow-hidden text-xs">
        {/* Search & Status Filters */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-surface-elevated/70">
          <div className="flex items-center gap-2">
            {["ALL", "OPEN_BIDDING", "AWARDED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                  activeFilter === f 
                    ? "bg-brand text-on-brand shadow-xs font-bold" 
                    : "bg-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface-sunken border border-border"
                )}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search RFPs, buyers, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-elevated border border-border rounded-xl text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-elevated border-b border-border text-[11px] font-bold uppercase text-foreground-muted">
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
            <tbody className="divide-y divide-border">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className="hover:bg-surface-sunken/50 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      href={`/admin/jobs/${job.realId || job.id}`}
                      className="font-bold text-foreground group-hover:text-brand line-clamp-1 block transition-colors"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-brand bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
                        #{job.id}
                      </span>
                      <span className="text-[10px] text-foreground-muted font-medium">
                        {job.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-sunken border border-border text-brand flex items-center justify-center font-bold text-[9px]">
                        {job.clientAvatar}
                      </div>
                      <span className="font-semibold text-foreground-secondary">{job.client}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground-secondary">
                    <div className="font-medium text-foreground-secondary flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-foreground-muted" /> {job.date}
                    </div>
                    <span className="text-[10px] text-foreground-muted block">{job.location}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand font-mono">{job.budget}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-brand bg-brand/10 border border-border-brand/40 px-2 py-0.5 rounded-lg">
                      {job.bidsCount} Proposals
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block",
                      job.status === "OPEN_BIDDING" || job.status === "OPEN"
                        ? "bg-info-solid text-foreground/15 text-info border border-info/30"
                        : "bg-success-solid text-foreground/15 text-success border border-success/30"
                    )}>
                      {job.timeLeft}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/jobs/${job.realId || job.id}`}
                      className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary hover:text-foreground border border-border rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
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

