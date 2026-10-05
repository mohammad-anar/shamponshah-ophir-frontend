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
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function VendorApprovalsPage() {
  const [selectedApp, setSelectedApp] = useState(applications[0]);
  const [activeTab, setActiveTab] = useState("Pending");
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

  const handleApprove = () => {
    toast.success(`Application #${selectedApp.id} Approved! Assigned tier: ${assignedTier} Vendor.`);
  };

  const handleRequestInfo = () => {
    toast.info(`Information request sent to ${selectedApp.founder}`);
  };

  const handleReject = () => {
    toast.error(`Application #${selectedApp.id} Rejected.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#0F0C3B]">Vendor Approvals</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              12 applicants pending • 48h SLA: 91.6% met
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review identity, insurance certificates, portfolio artifacts, and assign initial merit tier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter applications..."
              aria-label="Filter applications"
              className="bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-[#0F0C3B] placeholder-slate-400 focus:outline-none focus:border-brand-primary"
            />
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
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
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              activeTab === tab.label
                ? "bg-[#0F0C3B] text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <span>{tab.label}</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px]",
              activeTab === tab.label ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
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
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span className="uppercase tracking-wider">Prioritized Queue</span>
            <span>Sorted by SLA Urgency</span>
          </div>

          <div className="space-y-2.5">
            {applications.map((app) => {
              const isSelected = selectedApp.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all cursor-pointer bg-white",
                    isSelected
                      ? "border-brand-primary ring-2 ring-indigo-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {app.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0F0C3B]">{app.name}</h4>
                        <p className="text-[11px] text-slate-500">{app.founder} • {app.categories[0]}</p>
                      </div>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      app.status === "REVIEWING" && "bg-purple-100 text-purple-800",
                      app.status === "QUEUED" && "bg-slate-100 text-slate-700",
                      app.status === "NEW" && "bg-amber-100 text-amber-800",
                    )}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {app.location.split("(")[0]}
                    </span>
                    <span className={cn("font-medium", app.status === "REVIEWING" ? "text-amber-700 font-semibold" : "text-slate-500")}>
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
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F0C3B] text-white flex items-center justify-center text-lg font-bold">
                  {selectedApp.name.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#0F0C3B]">{selectedApp.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      APPLICATION #{selectedApp.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned Inspector: <strong>Jordan (Ops Lead)</strong> • Started Review: 18m ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Public Draft</span>
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2-Col Breakdown: Profile details & Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Applicant Profile */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#0F0C3B] text-sm">Applicant Profile</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {selectedApp.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Founder</span>
                  <span className="font-bold text-[#0F0C3B]">{selectedApp.founder}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                  <span className="font-medium truncate block">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone</span>
                  <span className="font-medium">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Operating Radius</span>
                  <span className="font-medium">{selectedApp.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 italic text-slate-600 text-xs">
                &ldquo;Full-service high-energy DJ & live interactive MC for luxury weddings, milestones, and family celebrations.&rdquo;
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Bio & Professional Background</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{selectedApp.bio}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1.5">Declared Specialties</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.specialties.map((spec) => (
                    <span key={spec} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-medium border border-indigo-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspection Checklist */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#0F0C3B] text-sm">Inspection Checklist</h3>
                  <span className="font-bold text-brand-primary">{completedCount} of 6 completed</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: "identity" as const, label: "Identity and legal entity verified via state registry" },
                    { key: "portfolio" as const, label: "Portfolio media meets Ophir high-resolution standards" },
                    { key: "pricing" as const, label: "Service pricing within standard Chicago market bounds ($400 - $2,500)" },
                    { key: "equipment" as const, label: "Equipment description verified suitable for luxury celebrations" },
                    { key: "insurance" as const, label: "Insurance policy date valid through event season (Checked by Jordan)" },
                    { key: "tier" as const, label: "Initial artisan tier confirmed: 'Rising Vendor' assigned" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      onClick={() => toggleCheck(item.key)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checklist[item.key]}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-brand-primary focus:ring-brand-primary w-4 h-4"
                      />
                      <span className={cn(
                        "text-[11px] leading-tight",
                        checklist[item.key] ? "text-slate-800 font-medium" : "text-slate-500"
                      )}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tier Assignment */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium text-[11px]">Assign Initial Badge:</span>
                <div className="flex items-center gap-1.5">
                  {(["Rising", "Pro", "Master"] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setAssignedTier(tier)}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase transition-all",
                        assignedTier === tier
                          ? "bg-amber-500 text-[#0F0C3B] shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Automated Verification Engine
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Powered by Persona & Checkr</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-950">Government ID Verification</p>
                  <p className="text-[10px] text-emerald-700">Illinois Real ID Driver License • 99.4% biometric selfie match</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Passed (100%)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-950">Trust & Background Screening</p>
                  <p className="text-[10px] text-emerald-700">Cook County court database, sex offender registry</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Clear
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-950">Commercial General Liability</p>
                  <p className="text-[10px] text-emerald-700">Hartford Casualty • Policy #GL-8820491 ($2,000,000 aggregate)</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Verified
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-950">Stripe Escrow Bank Payout</p>
                  <p className="text-[10px] text-amber-700">Pending vendor bank account onboarding (Allowed post-approval)</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  Not yet connected
                </span>
              </div>
            </div>
          </div>

          {/* Operator Decision Box */}
          <div className="bg-[#F8F9FD] p-5 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F0C3B] mb-1">
                Operator Decision & Feedback Notes
              </label>
              <textarea
                rows={2}
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Provide constructive feedback if requesting info or explaining approval tier / rejection..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-[#0F0C3B] placeholder-slate-400 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRequestInfo}
                  className="px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request Info</span>
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>

              <button
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-lg bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Approve Vendor (Assign {assignedTier} Tier & Publish)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
