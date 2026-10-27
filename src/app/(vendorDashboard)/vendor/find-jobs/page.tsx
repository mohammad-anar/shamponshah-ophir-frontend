"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  RefreshCw,
  Users,
  Calendar,
  Briefcase,
  AlertCircle
} from "lucide-react";
import SendOfferModal from "@/components/vendor/SendOfferModal";
import { useGetVendorFindJobsQuery } from "@/redux/service/jobs/jobsApi";
import { cn } from "@/lib/utils";

export default function VendorFindJobsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJob, setSelectedJob] = useState<{ id?: string; title: string; budget: string; clientName?: string }>({
    id: undefined,
    title: "",
    budget: "",
    clientName: "",
  });

  const { data: apiJobsData, isLoading, isFetching, refetch } = useGetVendorFindJobsQuery();

  // Extract jobs array robustly across all response wrapper formats
  const liveJobs: any[] =
    (Array.isArray(apiJobsData?.data?.data) && apiJobsData.data.data) ||
    (Array.isArray(apiJobsData?.data?.jobs) && apiJobsData.data.jobs) ||
    (Array.isArray(apiJobsData?.data) && apiJobsData.data) ||
    (Array.isArray(apiJobsData?.jobs) && apiJobsData.jobs) ||
    (Array.isArray(apiJobsData) && apiJobsData) ||
    [];

  // Filter jobs by search keyword and category
  const filteredJobs = liveJobs.filter((job: any) => {
    const matchesSearch =
      !searchQuery ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.occasion?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      job.categoryId === selectedCategory ||
      job.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleOpenProposal = (job: any, budgetText: string, clientName: string) => {
    setSelectedJob({
      id: job.id,
      title: job.title,
      budget: budgetText,
      clientName,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Custom Offer Modal */}
      <SendOfferModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetch();
        }}
        jobId={selectedJob.id}
        jobTitle={selectedJob.title}
        clientBudget={selectedJob.budget}
        clientName={selectedJob.clientName}
        onOfferSent={() => {
          refetch();
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-info" />
              Live Client Job Board
            </span>
            <span className="text-foreground-muted text-xs font-semibold">
              {liveJobs.length} {liveJobs.length === 1 ? "Job" : "Jobs"} Available
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F0C3B] mt-1.5">Find Jobs &amp; Opportunities</h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            Browse verified client celebration requests and submit staged milestone or full payment proposals
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2.5 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-info")} />
          <span>Refresh Jobs</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, occasion..."
            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-foreground-muted shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-border rounded-xl text-xs bg-surface text-foreground-secondary focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="photo">Photography &amp; Media</option>
            <option value="dj">DJ &amp; Live Music</option>
            <option value="catering">Catering &amp; Culinary</option>
            <option value="decor">Decor &amp; Floral</option>
            <option value="planning">Event Planning</option>
          </select>
        </div>
      </div>

      {/* Job Listings List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 bg-surface rounded-2xl border border-border flex flex-col items-center justify-center text-foreground-muted gap-3 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#0F0C3B]" />
            <span className="font-medium">Loading live client job opportunities...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 bg-surface rounded-2xl border border-border flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-info flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F0C3B]">No Matching Jobs Found</h3>
              <p className="text-xs text-foreground-muted max-w-sm mt-1">
                {searchQuery || selectedCategory !== "all"
                  ? "Try resetting your search filters or clearing search keywords."
                  : "Clients have not published any open requests in your service areas yet. Check back soon!"}
              </p>
            </div>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 rounded-xl bg-surface-sunken text-foreground-secondary font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((job: any) => {
            const minB = job.budgetMin ? Number(job.budgetMin) : null;
            const maxB = job.budgetMax ? Number(job.budgetMax) : null;
            let budgetText = "Negotiable";
            if (minB && maxB) budgetText = `$${minB.toLocaleString()} – $${maxB.toLocaleString()}`;
            else if (minB) budgetText = `From $${minB.toLocaleString()}`;
            else if (maxB) budgetText = `Up to $${maxB.toLocaleString()}`;

            const clientName = job.clientProfile?.displayName || job.clientProfile?.user?.name || "Verified Client";
            const dateText = job.eventDate
              ? new Date(job.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : job.duration || "Flexible Schedule";
            const distance = job.location || job.clientProfile?.city || "Chicago, IL";
            const bidsCount = job.bidsSent ?? job._count?.offers ?? 0;
            const hasSubmitted = Boolean(job.hasSubmittedOffer);
            const myOffer = job.myOffer;

            return (
              <div
                key={job.id}
                className={cn(
                  "bg-surface p-6 rounded-2xl border transition-all shadow-xs space-y-4 text-xs",
                  hasSubmitted
                    ? "border-emerald-300 ring-1 ring-emerald-100 bg-emerald-50/10"
                    : "border-border hover:border-indigo-200"
                )}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        2 Bid Credits
                      </span>

                      {job.category?.name && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {job.category.name}
                        </span>
                      )}

                      {job.occasion && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-sunken text-foreground-secondary">
                          {job.occasion}
                        </span>
                      )}

                      <span className="text-foreground-muted font-mono text-[10px]">#{job.id.slice(-6)}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F0C3B] mt-1.5">{job.title}</h3>
                    <p className="text-foreground-muted mt-0.5">
                      Posted by <strong>{clientName}</strong> • {distance}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 bg-surface-elevated sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Client Target Budget
                    </span>
                    <span className="text-lg font-extrabold text-[#0F0C3B]">{budgetText}</span>
                  </div>
                </div>

                {/* Job Description */}
                <p className="text-foreground-secondary bg-surface-elevated/80 p-3.5 rounded-xl border border-border leading-relaxed">
                  {job.description}
                </p>

                {/* Metadata Pills */}
                <div className="flex items-center gap-4 text-foreground-muted text-[11px] flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
                    Target Date: <strong className="text-foreground-secondary">{dateText}</strong>
                  </span>

                  {job.guestCount && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-foreground-muted" />
                      Guests: <strong className="text-foreground-secondary">{job.guestCount} Attendees</strong>
                    </span>
                  )}

                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-foreground-muted" />
                    Location: <strong className="text-foreground-secondary">{distance}</strong>
                  </span>

                  <span className="flex items-center gap-1.5 ml-auto text-indigo-700 font-bold">
                    <span>{bidsCount} Proposal{bidsCount === 1 ? "" : "s"} Received</span>
                  </span>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                    <span className="text-[11px] text-foreground-muted">
                      Ophir Vault Escrow Guaranteed • 0% Commission on Accepted Proposals
                    </span>
                  </div>

                  {hasSubmitted ? (
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Proposal Submitted ({myOffer ? `$${myOffer.price}` : "Pending"})</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenProposal(job, budgetText, clientName)}
                      className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-[#18124E] text-foreground text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-warning" />
                      <span>Send Custom Proposal (2 Credits)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
