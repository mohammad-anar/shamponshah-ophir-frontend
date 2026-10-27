"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  ShieldAlert, 
  Filter, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Slash,
  User,
  ShoppingBag,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetAllReportsQuery, 
  useModerateReportMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: apiData, isLoading, refetch } = useGetAllReportsQuery({
    status: activeTab === "ALL" ? undefined : activeTab,
    search: searchQuery || undefined,
  });
  const [moderateReport, { isLoading: isModerating }] = useModerateReportMutation();

  // Action modal
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"SUSPEND_GIG" | "DISMISS" | "RESOLVE" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const reports: any[] = Array.isArray(apiData)
    ? apiData
    : Array.isArray(apiData?.data)
    ? apiData.data
    : Array.isArray(apiData?.reports)
    ? apiData.reports
    : [];

  const handleOpenAction = (report: any, action: "SUSPEND_GIG" | "DISMISS" | "RESOLVE") => {
    setSelectedReport(report);
    setActionType(action);
    setAdminNotes(report.adminNotes || "");
  };

  const handleExecuteAction = async () => {
    if (!selectedReport || !actionType) return;
    try {
      await moderateReport({
        id: selectedReport.id,
        action: actionType,
        adminNotes,
      }).unwrap();

      if (actionType === "SUSPEND_GIG") {
        toast.success("Gig suspended and report marked as resolved");
      } else if (actionType === "DISMISS") {
        toast.success("Report dismissed successfully");
      } else {
        toast.success("Report marked as resolved");
      }

      setSelectedReport(null);
      setActionType(null);
      setAdminNotes("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to process report action");
    }
  };

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26282E] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
              Safety &amp; Compliance
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {pendingCount} urgent reports
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Service Reports &amp; Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review user-submitted reports on marketplace gigs, investigate policy violations, and hide, suspend, or dismiss complaints
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-[#16181F] border border-[#26282E] hover:bg-[#1A1D24] text-slate-300 hover:text-white text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          Refresh Feed
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121418] rounded-2xl border border-[#26282E] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "PENDING", "RESOLVED", "DISMISSED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap",
                activeTab === tab
                  ? "bg-[#DFB76C] text-[#0B0C0E] shadow-xs font-bold"
                  : "bg-[#16181F] text-slate-400 hover:text-white hover:bg-[#1A1D24] border border-[#26282E]"
              )}
            >
              {tab === "ALL" ? "All Reports" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search reason, gig title, reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#16181F] border border-[#26282E] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C]"
          />
        </div>
      </div>

      {/* Reports Table / Card List */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DFB76C]" />
          <span className="text-xs font-medium text-slate-400">Loading service reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-[#121418] border border-[#26282E] rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Reports in this Filter</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No service complaints or reports match your current filter. The marketplace is operating cleanly!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => {
            const gig = report.gig;
            const reporterName = report.reporter?.name || report.reporterName || "Anonymous User";
            const reporterEmail = report.reporter?.email || report.reporterEmail || "Hidden";
            const coverImage = gig?.gallery?.[0]?.url || gig?.images?.[0] || gig?.coverImageUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80";
            const vendorName = gig?.vendorProfile?.businessName || gig?.vendor?.name || "Vendor";

            const isPending = report.status === "PENDING";
            const isResolved = report.status === "RESOLVED";
            const isDismissed = report.status === "DISMISSED";

            return (
              <div
                key={report.id}
                className={cn(
                  "rounded-2xl border p-5 shadow-xs transition-all space-y-4",
                  isPending ? "bg-[#121418] border-amber-500/40 ring-1 ring-amber-500/20" : "bg-[#121418] border-[#26282E]"
                )}
              >
                {/* Header row: Report metadata & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26282E] pb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                      isPending ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse" :
                      isResolved ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                      "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                    )}>
                      {report.status}
                    </span>
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      {report.reason}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>Reported by:</span>
                    <strong className="text-slate-200 font-semibold">{reporterName}</strong>
                    <span className="text-slate-500 font-mono">({reporterEmail})</span>
                  </div>
                </div>

                {/* Body: Gig info + Complaint Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left: Reported Gig Card (4 cols) */}
                  <div className="lg:col-span-4 p-3 rounded-xl bg-[#16181F] border border-[#26282E] flex items-start gap-3">
                    <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-[#26282E]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage} alt={gig?.title || "Gig"} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-[#DFB76C] block truncate">
                        {gig?.category?.name || "Service Listing"}
                      </span>
                      <h4 className="font-bold text-white text-xs line-clamp-1">
                        {gig?.title || "Unknown Gig"}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Vendor: <strong className="text-slate-200">{vendorName}</strong>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn(
                          "px-1.5 py-0.2 rounded text-[9px] font-bold",
                          gig?.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                          gig?.status === "SUSPENDED" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                          "bg-slate-800 text-slate-400 border border-slate-700"
                        )}>
                          Status: {gig?.status || "UNKNOWN"}
                        </span>
                        {gig?.id && (
                          <Link
                            href={`/services/${gig.id}`}
                            target="_blank"
                            className="text-[10px] text-[#DFB76C] hover:underline font-bold flex items-center gap-0.5"
                          >
                            <span>Live Page</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Complaint Description & Notes (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300">
                      <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">
                        Complainant Description:
                      </span>
                      <p className="whitespace-pre-line leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {report.adminNotes && (
                      <div className="p-2.5 rounded-lg bg-[#16181F] border border-[#26282E] text-[11px] text-slate-300">
                        <strong className="text-[#DFB76C] block">Admin Audit Log:</strong>
                        <span>{report.adminNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Row */}
                {isPending && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#26282E]">
                    <button
                      type="button"
                      onClick={() => handleOpenAction(report, "DISMISS")}
                      className="px-3.5 py-1.5 rounded-xl border border-[#26282E] bg-[#16181F] hover:bg-[#1A1D24] text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss Report</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAction(report, "RESOLVE")}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAction(report, "SUSPEND_GIG")}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Suspend / Hide Gig</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ACTION CONFIRMATION MODAL */}
      {selectedReport && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#121418] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#26282E] space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center",
                actionType === "SUSPEND_GIG" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                actionType === "RESOLVE" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                "bg-[#16181F] text-slate-400 border border-[#26282E]"
              )}>
                {actionType === "SUSPEND_GIG" ? <ShieldAlert className="w-5 h-5" /> :
                 actionType === "RESOLVE" ? <CheckCircle2 className="w-5 h-5" /> :
                 <XCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {actionType === "SUSPEND_GIG" ? "Suspend & Hide Gig" :
                   actionType === "RESOLVE" ? "Mark Report as Resolved" :
                   "Dismiss Unfounded Report"}
                </h3>
                <p className="text-xs text-slate-400">
                  {actionType === "SUSPEND_GIG"
                    ? "This will immediately take the gig offline and notify the vendor."
                    : actionType === "RESOLVE"
                    ? "Confirm the reported issue has been addressed."
                    : "No penalty will be imposed on the vendor."}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Admin Notes / Action Rationale:
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Audit observation or message recorded in moderation logs..."
                className="w-full p-3 bg-[#16181F] border border-[#26282E] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C]"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl border border-[#26282E] bg-[#16181F] hover:bg-[#1A1D24] text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isModerating}
                className={cn(
                  "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer text-white",
                  actionType === "SUSPEND_GIG" ? "bg-rose-600 hover:bg-rose-500" :
                  actionType === "RESOLVE" ? "bg-emerald-600 hover:bg-emerald-500" :
                  "bg-slate-700 hover:bg-slate-600"
                )}
              >
                {isModerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Confirm Action</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
