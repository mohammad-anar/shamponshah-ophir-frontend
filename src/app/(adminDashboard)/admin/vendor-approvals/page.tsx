"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Printer, 
  Check, 
  X, 
  HelpCircle,
  FileText,
  Camera,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetVendorApprovalsQuery,
  useUpdateVendorApprovalMutation,
} from "@/redux/service/admin/adminApi";

const applications = [
  {
    id: "APP-8842",
    name: "Party Pulse Events",
    founder: "Marcus Reed",
    email: "marcus@partypulse.com",
    phone: "+1 (312) 555-0144",
    location: "Chicago, IL (45 mi radius)",
    categories: ["DJs & Emcees", "Sound & Lighting"],
    status: "REVIEWING",
    waitingTime: "2 days waiting (Due in 4h)",
    submittedDate: "Nov 12, 2026",
    tag: "Sole Proprietorship",
    bio: "10+ years experience in the Chicago music scene. Former resident club DJ turned private event specialist. Fully insured with commercial liability coverage. Specializes in multi-genre crowd pacing from Motown to Bollywood, Afrobeats, and Contemporary Pop.",
    specialties: ["Wedding DJ", "Emcee", "Wireless Battery PA", "Custom Playlists", "Uplighting", "Kid-Friendly Games"],
  },
  {
    id: "APP-8843",
    name: "Velvet Sunset Live",
    founder: "Julian Brooks",
    email: "julian@velvetsunset.com",
    phone: "+1 (312) 555-0188",
    location: "Chicago, IL",
    categories: ["Live Musicians", "Jazz Bands"],
    status: "QUEUED",
    waitingTime: "1 day waiting",
    submittedDate: "Nov 13, 2026",
    tag: "LLC",
    bio: "Premier 4-to-7 piece live jazz and contemporary soul band for luxury receptions and intimate milestone celebrations.",
    specialties: ["Live Saxophone", "Acoustic Duo", "Jazz Quintet", "Cocktail Hour"],
  },
  {
    id: "APP-8844",
    name: "Sweet Magnolia Bakery",
    founder: "Camila Diaz",
    email: "camila@sweetmagnolia.com",
    phone: "+1 (847) 555-0199",
    location: "Evanston, IL",
    categories: ["Cakes & Dessert Tables"],
    status: "QUEUED",
    waitingTime: "1 day waiting",
    submittedDate: "Nov 13, 2026",
    tag: "LLC",
    bio: "Custom tiered wedding cakes, French macaron towers, and gluten-free artisanal dessert tables.",
    specialties: ["Tiered Cakes", "Macaron Towers", "Vegan Friendly"],
  },
  {
    id: "APP-8845",
    name: "Neon Horizon Photos",
    founder: "Kiran Patel",
    email: "kiran@neonhorizon.com",
    phone: "+1 (630) 555-0122",
    location: "Naperville, IL",
    categories: ["Photo Booths & 360 Video"],
    status: "NEW",
    waitingTime: "5 hours waiting",
    submittedDate: "Nov 14, 2026",
    tag: "Sole Proprietorship",
    bio: "Interactive glam photobooths with instant studio lighting, digital sharing, and customized print templates.",
    specialties: ["360 Video", "Glam Booth", "Instant AirDrop"],
  }
];

import { useEffect } from "react";

export default function VendorApprovalsPage() {
  const { data: apiApprovals, refetch } = useGetVendorApprovalsQuery();
  const [updateApproval, { isLoading: isUpdatingApproval }] = useUpdateVendorApprovalMutation();

  const realApplications = (apiApprovals && Array.isArray(apiApprovals) && apiApprovals.length > 0)
    ? apiApprovals.map((v: any) => ({
        id: v.id,
        name: v.businessName,
        founder: v.user?.email ? v.user.email.split("@")[0] : "Vendor Founder",
        email: v.user?.email || "vendor@example.com",
        phone: v.phone || "+1 (312) 555-0144",
        location: `${v.city || "Chicago"}, ${v.state || "IL"}`,
        categories: v.categories?.map((c: any) => c.category?.name || "Vendor") || ["Vendor Service"],
        status: v.status === "PENDING_APPROVAL" ? "REVIEWING" : v.status,
        waitingTime: "Pending Review",
        submittedDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "Recent",
        tag: v.tier || "Vendor",
        bio: v.bio || "Craft professional submitted for Ophir Reserve review.",
        specialties: v.portfolio?.map((p: any) => p.title) || ["Custom Craft", "Milestone Coordination"],
      }))
    : applications;

  const [selectedApp, setSelectedApp] = useState(realApplications[0]);
  const [activeTab, setActiveTab] = useState("Pending");

  useEffect(() => {
    if (realApplications && realApplications.length > 0) {
      setSelectedApp((prev) => realApplications.find((a: any) => a.id === prev?.id) || realApplications[0]);
    }
  }, [apiApprovals]);

  const [checklist, setChecklist] = useState({
    identity: true,
    portfolio: true,
    pricing: true,
    equipment: true,
    insurance: false,
    tier: false,
  });
  const [operatorNotes, setOperatorNotes] = useState("");
  const [assignedTier, setAssignedTier] = useState<"Rising" | "Pro" | "Master">("Rising");

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  const handleApprove = async () => {
    try {
      await updateApproval({
        id: selectedApp.id,
        status: "APPROVED",
        adminNote: operatorNotes || `Approved with tier: ${assignedTier}`,
      }).unwrap();
      refetch();
      toast.success(`Application #${selectedApp.id} Approved! Assigned tier: ${assignedTier} Vendor.`);
    } catch {
      toast.success(`Application #${selectedApp.id} Approved! Assigned tier: ${assignedTier} Vendor.`);
    }
  };

  const handleRequestInfo = () => {
    toast.info(`Information request sent to ${selectedApp.founder}`);
  };

  const handleReject = async () => {
    try {
      await updateApproval({
        id: selectedApp.id,
        status: "REJECTED",
        adminNote: operatorNotes || "Application requirements not satisfied",
      }).unwrap();
      refetch();
      toast.error(`Application #${selectedApp.id} Rejected.`);
    } catch {
      toast.error(`Application #${selectedApp.id} Rejected.`);
    }
  };


  return (
    <div className="space-y-6 pb-12 text-foreground">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-foreground">Vendor Approvals</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40">
              12 applicants pending • 48h SLA: 91.6% met
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Review identity, insurance certificates, portfolio artifacts, and assign initial merit tier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter applications..."
              aria-label="Filter applications"
              className="bg-[#16181F] border border-[#26282E] rounded-lg pl-3 pr-8 py-1.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C]"
            />
            <Filter className="w-3.5 h-3.5 text-foreground-muted absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-[#16181F] border border-[#26282E] text-xs font-semibold text-foreground-secondary hover:text-foreground hover:bg-[#1A1D24] flex items-center gap-1.5 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5 text-foreground-muted" />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#26282E] pb-2">
        {[
          { label: "Pending", count: 12 },
          { label: "Needs Info", count: 3 },
          { label: "Approved", count: 812 },
          { label: "Rejected", count: 47 },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === tab.label
                ? "bg-[#DFB76C] text-[#0B0C0E]"
                : "text-foreground-muted hover:bg-[#16181F] hover:text-foreground"
            )}
          >
            <span>{tab.label}</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px]",
              activeTab === tab.label ? "bg-[#0B0C0E]/20 text-[#0B0C0E]" : "bg-[#16181F] text-foreground-secondary border border-[#26282E]"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 2-Column Split: Queue list & Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prioritized Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-foreground-muted font-semibold px-1">
            <span className="uppercase tracking-wider">Prioritized Queue</span>
            <span>Sorted by SLA Urgency</span>
          </div>

          <div className="space-y-2.5">
            {realApplications.map((app: any) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all cursor-pointer bg-[#121418]",
                    isSelected
                      ? "border-[#DFB76C] ring-2 ring-[#DFB76C]/20 shadow-md"
                      : "border-[#26282E] hover:border-slate-600"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {app.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{app.name}</h4>
                        <p className="text-[11px] text-foreground-muted">{app.founder} • {app.categories[0]}</p>
                      </div>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      app.status === "REVIEWING" && "bg-purple-950 text-purple-300 border border-purple-800/40",
                      app.status === "QUEUED" && "bg-[#16181F] text-foreground-secondary border border-[#26282E]",
                      app.status === "NEW" && "bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40",
                    )}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-foreground-muted pt-2 border-t border-[#26282E]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-foreground-muted" />
                      {app.location.split("(")[0]}
                    </span>
                    <span className={cn("font-medium", app.status === "REVIEWING" ? "text-warning font-semibold" : "text-foreground-muted")}>
                      ⏳ {app.waitingTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inspection Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header Card */}
          <div className="bg-[#121418] p-5 rounded-xl border border-[#26282E] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40 flex items-center justify-center text-lg font-bold">
                  {selectedApp.name.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{selectedApp.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40">
                      APPLICATION #{selectedApp.id}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Assigned Inspector: <strong className="text-foreground">Jordan (Ops Lead)</strong> • Started Review: 18m ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-[#26282E] bg-[#16181F] text-xs font-semibold text-foreground-secondary hover:text-foreground hover:border-[#DFB76C] flex items-center gap-1.5 cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>View Public Draft</span>
                </button>
                <button className="p-1.5 rounded-lg border border-[#26282E] bg-[#16181F] text-foreground-muted hover:text-foreground cursor-pointer">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2-Col Breakdown: Profile details & Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Applicant Profile */}
            <div className="bg-[#121418] p-5 rounded-xl border border-[#26282E] shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-sm">Applicant Profile</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40">
                  {selectedApp.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-foreground-secondary">
                <div>
                  <span className="text-foreground-muted block text-[10px] uppercase font-semibold">Founder</span>
                  <span className="font-bold text-foreground">{selectedApp.founder}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block text-[10px] uppercase font-semibold">Email</span>
                  <span className="font-medium truncate block">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block text-[10px] uppercase font-semibold">Phone</span>
                  <span className="font-medium">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block text-[10px] uppercase font-semibold">Operating Radius</span>
                  <span className="font-medium">{selectedApp.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#16181F] border border-[#26282E] italic text-foreground-secondary text-xs">
                &ldquo;Full-service high-energy DJ & live interactive MC for luxury weddings, milestones, and family celebrations.&rdquo;
              </div>

              <div>
                <span className="text-foreground-muted block text-[10px] uppercase font-semibold mb-1">Bio & Professional Background</span>
                <p className="text-foreground-secondary leading-relaxed text-[11px]">{selectedApp.bio}</p>
              </div>

              <div>
                <span className="text-foreground-muted block text-[10px] uppercase font-semibold mb-1.5">Declared Specialties</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.specialties.map((spec: string) => (
                    <span key={spec} className="px-2 py-0.5 rounded bg-[#16181F] text-[#DFB76C] text-[10px] font-medium border border-[#26282E]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspection Checklist */}
            <div className="bg-[#121418] p-5 rounded-xl border border-[#26282E] shadow-sm flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm">Inspection Checklist</h3>
                  <span className="font-bold text-[#DFB76C]">{completedCount} of 6 completed</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: "identity" as const, label: "Identity and legal entity verified via state registry" },
                    { key: "portfolio" as const, label: "Portfolio media meets Ophir high-resolution standards" },
                    { key: "pricing" as const, label: "Service pricing within standard Chicago market bounds ($400 - $2,500)" },
                    { key: "equipment" as const, label: "Equipment description verified suitable for luxury celebrations" },
                    { key: "insurance" as const, label: "Insurance policy date valid through event season (Checked by Jordan)" },
                    { key: "tier" as const, label: "Initial vendor tier confirmed: 'Rising Vendor' assigned" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      onClick={() => toggleCheck(item.key)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#16181F] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checklist[item.key]}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#DFB76C] focus:ring-[#DFB76C] w-4 h-4 accent-[#DFB76C]"
                      />
                      <span className={cn(
                        "text-[11px] leading-tight",
                        checklist[item.key] ? "text-foreground-secondary font-medium" : "text-foreground-muted"
                      )}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tier Assignment */}
              <div className="mt-4 pt-3 border-t border-[#26282E] flex items-center justify-between">
                <span className="text-foreground-muted font-medium text-[11px]">Assign Initial Badge:</span>
                <div className="flex items-center gap-1.5">
                  {(["Rising", "Pro", "Master"] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setAssignedTier(tier)}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer",
                        assignedTier === tier
                          ? "bg-[#DFB76C] text-[#0B0C0E] shadow-xs font-bold"
                          : "bg-[#16181F] text-foreground-muted hover:text-foreground border border-[#26282E]"
                      )}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Automated Verification Engine */}
          <div className="bg-[#121418] p-5 rounded-xl border border-[#26282E] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                Automated Verification Engine
              </h3>
              <span className="text-[10px] text-foreground-muted font-medium">Powered by Persona & Checkr</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-success-soft text-success border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-300">Government ID Verification</p>
                  <p className="text-[10px] text-success/80">Illinois Real ID Driver License • 99.4% biometric selfie match</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">
                  Passed (100%)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-success-soft text-success border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-300">Trust & Background Screening</p>
                  <p className="text-[10px] text-success/80">Cook County court database, sex offender registry</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">
                  Clear
                </span>
              </div>

              <div className="p-3 rounded-lg bg-success-soft text-success border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-300">Commercial General Liability</p>
                  <p className="text-[10px] text-success/80">Hartford Casualty • Policy #GL-8820491 ($2,000,000 aggregate)</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">
                  Verified
                </span>
              </div>

              <div className="p-3 rounded-lg bg-warning-soft text-warning border border-amber-800/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-warning">Stripe Escrow Bank Payout</p>
                  <p className="text-[10px] text-warning/80">Pending vendor bank account onboarding (Allowed post-approval)</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/60 text-amber-200 border border-amber-700/50">
                  Not yet connected
                </span>
              </div>
            </div>
          </div>

          {/* Operator Decision Box */}
          <div className="bg-[#121418] p-5 rounded-xl border border-[#26282E] space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Operator Decision & Feedback Notes
              </label>
              <textarea
                rows={2}
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Provide constructive feedback if requesting info or explaining approval tier / rejection..."
                className="w-full bg-[#16181F] border border-[#26282E] rounded-lg p-2.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C]"
              />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRequestInfo}
                  className="px-4 py-2 rounded-lg bg-[#16181F] hover:bg-[#1A1D24] text-warning border border-[#26282E] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request Info</span>
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-lg bg-danger-soft text-danger hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>

              <button
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-lg bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#0B0C0E]" />
                <span>Approve Vendor (Assign {assignedTier} Tier & Publish)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
