"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  Plus,
  Sparkles,
  ShieldCheck,
  Loader2,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Trash2,
  Pencil,
  X,
  Check,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import CompareOffersModal from "@/components/user/CompareOffersModal";
import {
  useGetClientJobsQuery,
  useCancelJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/redux/service/jobs/jobsApi";

const occasionOptions = [
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
  { id: "baby_shower", label: "Baby Shower" },
  { id: "graduation", label: "Graduation" },
  { id: "quinceanera", label: "Quinceañera" },
  { id: "corporate", label: "Corporate" },
  { id: "anniversary", label: "Anniversary" },
  { id: "stage_show", label: "Stage Show" },
];

export default function UserJobsPage() {
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobToCancel, setJobToCancel] = useState<any>(null);
  const [jobToDelete, setJobToDelete] = useState<any>(null);
  const [jobToEdit, setJobToEdit] = useState<any>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editOccasion, setEditOccasion] = useState("wedding");
  const [editCategory, setEditCategory] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editGuestCount, setEditGuestCount] = useState<number | string>("");
  const [editDuration, setEditDuration] = useState("");
  const [editBudgetMin, setEditBudgetMin] = useState<number | string>("");
  const [editBudgetMax, setEditBudgetMax] = useState<number | string>("");
  const [editDescription, setEditDescription] = useState("");
  const [editSpecialRequests, setEditSpecialRequests] = useState("");

  const [activeTab, setActiveTab] = useState<"ALL" | "OPEN" | "AWARDED" | "CANCELLED">("ALL");

  const { data: jobsData, isLoading, refetch } = useGetClientJobsQuery();
  const [cancelJobMutation, { isLoading: isCancelling }] = useCancelJobMutation();
  const [updateJobMutation, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJobMutation, { isLoading: isDeleting }] = useDeleteJobMutation();

  const allJobs: any[] = Array.isArray(jobsData)
    ? jobsData
    : jobsData?.data?.jobs || jobsData?.jobs || jobsData?.data || [];

  // Filter jobs based on activeTab
  const filteredJobs = allJobs.filter((job) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "OPEN") return job.status === "OPEN";
    if (activeTab === "AWARDED") return job.status === "AWARDED";
    if (activeTab === "CANCELLED") return job.status === "CANCELLED";
    return true;
  });

  const countOpen = allJobs.filter((j) => j.status === "OPEN").length;
  const countAwarded = allJobs.filter((j) => j.status === "AWARDED").length;
  const countCancelled = allJobs.filter((j) => j.status === "CANCELLED").length;

  const handleOpenCompare = (job: any) => {
    setSelectedJob(job);
    setCompareModalOpen(true);
  };

  const handleOpenEdit = (job: any) => {
    setJobToEdit(job);
    setEditTitle(job.title || "");
    setEditOccasion(job.occasion || "wedding");
    setEditCategory(job.category?.name || job.category || "");
    setEditLocation(job.location || "");
    setEditGuestCount(job.guestCount || "");
    setEditDuration(job.duration || "");
    setEditBudgetMin(job.budgetMin ? Number(job.budgetMin) : "");
    setEditBudgetMax(job.budgetMax ? Number(job.budgetMax) : "");
    setEditDescription(job.description || "");
    setEditSpecialRequests(job.specialRequests || "");

    if (job.eventDate) {
      try {
        const d = new Date(job.eventDate);
        setEditEventDate(d.toISOString().split("T")[0]);
      } catch (_) {
        setEditEventDate("");
      }
    } else {
      setEditEventDate("");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobToEdit) return;

    if (!editTitle.trim()) {
      toast.error("Please enter a title for your job.");
      return;
    }

    try {
      await updateJobMutation({
        id: jobToEdit.id,
        data: {
          title: editTitle.trim(),
          occasion: editOccasion,
          category: editCategory || undefined,
          location: editLocation.trim(),
          guestCount: editGuestCount ? Number(editGuestCount) : undefined,
          duration: editDuration.trim(),
          budgetMin: editBudgetMin ? Number(editBudgetMin) : undefined,
          budgetMax: editBudgetMax ? Number(editBudgetMax) : undefined,
          description: editDescription.trim(),
          specialRequests: editSpecialRequests.trim(),
          eventDate: editEventDate ? new Date(editEventDate).toISOString() : undefined,
        },
      }).unwrap();

      toast.success("Job RFP updated successfully!");
      setJobToEdit(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update job");
    }
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJobMutation(jobToDelete.id).unwrap();
      toast.success("Job RFP permanently deleted", {
        description: "The job listing and all submitted bids have been removed.",
      });
      setJobToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete job. An accepted offer may exist.");
    }
  };

  const handleConfirmCancel = async () => {
    if (!jobToCancel) return;
    try {
      await cancelJobMutation(jobToCancel.id).unwrap();
      toast.success("Job RFP successfully cancelled", {
        description: "Any pending vendor proposals have been withdrawn.",
      });
      setJobToCancel(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel job. An accepted offer may already exist.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <CompareOffersModal
        isOpen={compareModalOpen}
        onClose={() => {
          setCompareModalOpen(false);
          refetch();
        }}
        job={selectedJob}
        onAcceptOffer={() => {
          refetch();
        }}
      />

      {/* Edit Job Modal */}
      {jobToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F0C3B]">Edit Job RFP</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update celebration requirements before accepting bids
                </p>
              </div>
              <button
                type="button"
                onClick={() => setJobToEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Vintage Jazz Band & Saxophonist"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Occasion</label>
                  <select
                    value={editOccasion}
                    onChange={(e) => setEditOccasion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
                  >
                    {occasionOptions.map((occ) => (
                      <option key={occ.id} value={occ.id}>
                        {occ.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Event Date</label>
                  <input
                    type="date"
                    value={editEventDate}
                    onChange={(e) => setEditEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Chicago, IL"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Guest Count</label>
                  <input
                    type="number"
                    value={editGuestCount}
                    onChange={(e) => setEditGuestCount(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Min Budget ($)</label>
                  <input
                    type="number"
                    value={editBudgetMin}
                    onChange={(e) => setEditBudgetMin(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Max Budget ($)</label>
                  <input
                    type="number"
                    value={editBudgetMax}
                    onChange={(e) => setEditBudgetMax(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Celebration Requirements &amp; Scope</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe your vision, timeline, and deliverables..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Requests (Optional)</label>
                <input
                  type="text"
                  value={editSpecialRequests}
                  onChange={(e) => setEditSpecialRequests(e.target.value)}
                  placeholder="e.g. Requires wireless lavalier microphones"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setJobToEdit(null)}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#0F0C3B]">Delete Job RFP?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-slate-700">&ldquo;{jobToDelete.title}&rdquo;</span>?
                  This action cannot be undone. The RFP and all submitted bids will be completely removed.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Escrow Commitment</span>
              </div>
              <p>
                No vendor offer has been accepted for this RFP. You will not incur any fee or penalty.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Keep Job
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Job Cancellation */}
      {jobToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#0F0C3B]">Cancel Job RFP?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to cancel{" "}
                  <span className="font-semibold text-slate-700">&ldquo;{jobToCancel.title}&rdquo;</span>?
                  All active vendor bids will be automatically withdrawn.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Escrow Policy Guarantee</span>
              </div>
              <p>
                Since no vendor offer has been accepted for this RFP, your escrow funds are completely untouched.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setJobToCancel(null)}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Keep RFP Open
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Confirm Cancel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">My Jobs &amp; RFPs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare received vendor proposals, review equipment checklists, or edit and delete open celebration requests
          </p>
        </div>

        <Link
          href="/user/post-job"
          className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Post Another Job
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "ALL"
              ? "bg-[#0F0C3B] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>All RFPs</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 text-slate-700">
            {allJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("OPEN")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "OPEN"
              ? "bg-[#0F0C3B] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Bidding Open</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
            {countOpen}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("AWARDED")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "AWARDED"
              ? "bg-[#0F0C3B] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Awarded</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800">
            {countAwarded}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "CANCELLED"
              ? "bg-[#0F0C3B] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Cancelled</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
            {countCancelled}
          </span>
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-10 flex items-center justify-center text-slate-400 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
            <span>Loading celebration RFPs...</span>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job: any) => {
            // Check offer acceptance
            const hasAcceptedOffer =
              job.status === "AWARDED" ||
              job.offers?.some((o: any) => o.status === "ACCEPTED");
            const isCancelled = job.status === "CANCELLED";
            const canCancel = job.status === "OPEN" && !hasAcceptedOffer;
            const canDelete = !hasAcceptedOffer;
            const canEdit = !hasAcceptedOffer && !isCancelled;

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl p-6 border shadow-xs space-y-4 text-xs transition-all ${
                  isCancelled
                    ? "border-slate-200/60 opacity-80 bg-slate-50/40"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {isCancelled ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Cancelled RFP
                        </span>
                      ) : hasAcceptedOffer ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" /> Contract Awarded
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Bidding Active
                        </span>
                      )}

                      {!isCancelled && !hasAcceptedOffer && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {job.offers?.length || job._count?.offers || 0} Offers Received
                        </span>
                      )}

                      {hasAcceptedOffer && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Offer Accepted
                        </span>
                      )}

                      {job.category && (
                        <span className="text-[11px] text-slate-400 capitalize">
                          • {(job.category.name || job.category).toLowerCase().replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#0F0C3B] mt-1.5">{job.title}</h3>
                    <p className="text-slate-500 mt-0.5">
                      Target: {job.eventDate ? new Date(job.eventDate).toLocaleDateString() : "TBD"} • {job.location || "USA"} • {job.guestCount || 0} guests
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
                    <span className="text-lg font-extrabold text-[#0F0C3B]">
                      ${Number(job.budgetMin || 0).toLocaleString()} - ${Number(job.budgetMax || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-slate-600 font-medium">
                    {isCancelled ? (
                      <span className="text-rose-600 font-medium flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 shrink-0" />
                        This RFP was cancelled. No new proposals are accepted.
                      </span>
                    ) : hasAcceptedOffer ? (
                      <span className="text-purple-700 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                        Vendor proposal accepted! Escrow contract is active.
                      </span>
                    ) : job.offers?.length ? (
                      <span>{job.offers.length} proposals ready for side-by-side comparison</span>
                    ) : (
                      <span>Open for vendor proposals across your region</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    {/* Edit Job Button: Only visible if not awarded */}
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(job)}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                        title="Edit this RFP requirements"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Delete Job Button: Only visible if no offer is accepted */}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => setJobToDelete(job)}
                        className="px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                        title="Delete this RFP permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}

                    {/* Action Buttons */}
                    {hasAcceptedOffer ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenCompare(job)}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Accepted Proposal</span>
                        </button>

                        <Link
                          href="/user/orders"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          <span>View Order &amp; Milestones</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : !isCancelled ? (
                      <button
                        onClick={() => handleOpenCompare(job)}
                        className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Compare Offers</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Clean Empty State */
          <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-brand-primary flex items-center justify-center mx-auto text-2xl font-bold">
              <Briefcase className="w-7 h-7 text-brand-primary" />
            </div>
            <h3 className="text-base font-bold text-[#0F0C3B]">
              {activeTab === "ALL"
                ? "No celebration RFPs found"
                : `No ${activeTab.toLowerCase()} RFPs`}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Post your event requirements to receive customized bids with transparent milestone pricing and 100% escrow protection.
            </p>
            <div className="pt-2">
              <Link
                href="/user/post-job"
                className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Post Your First RFP
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
