"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calendar,
  MapPin,
  DollarSign,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Users2,
  Lock,
  Clock,
  HelpCircle,
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const occasions = [
  { id: "wedding", label: "Wedding", icon: "💍" },
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "baby_shower", label: "Baby Shower", icon: "👶" },
  { id: "graduation", label: "Graduation", icon: "🎓" },
  { id: "quinceanera", label: "Quinceañera", icon: "👑" },
  { id: "corporate", label: "Corporate", icon: "🏢" },
  { id: "anniversary", label: "Anniversary", icon: "❤️" },
  { id: "stage_show", label: "Stage Show", icon: "🎭" },
];

const serviceOptions = [
  "Photography",
  "Videography",
  "DJ & Music",
  "Catering",
  "Decoration",
  "Artisan Cake",
  "Emcee",
  "Kids Entertainer",
  "Photo Booth",
  "Party Rentals",
];

export default function PostJobWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [occasion, setOccasion] = useState("birthday");
  const [selectedServices, setSelectedServices] = useState<string[]>(["DJ & Music", "Emcee"]);
  const [title, setTitle] = useState("High-Energy DJ & Emcee for Emma's 5th Birthday Party");
  const [postToFamily, setPostToFamily] = useState(true);

  // Step 2
  const [eventDate, setEventDate] = useState("2026-11-14");
  const [location, setLocation] = useState("Lincoln Park, Chicago, IL");
  const [guestCount, setGuestCount] = useState("40");
  const [duration, setDuration] = useState("4 Hours (2:00 PM – 6:00 PM)");

  // Step 3
  const [description, setDescription] = useState(
    "Looking for a family-friendly DJ who can keep both 4-6 year olds engaged with interactive games, musical chairs, freeze dance, and provide great background music for parents."
  );
  const [specialRequests, setSpecialRequests] = useState("Strobe-free lighting preferred, clean radio edits only.");

  // Step 4
  const [budgetMin, setBudgetMin] = useState("400");
  const [budgetMax, setBudgetMax] = useState("600");
  const [biddingDuration, setBiddingDuration] = useState("48 Hours");

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      toast.success("Job Published! Your RFP is live and matching vetted artisans in Chicago.");
      router.push("/user/jobs");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Wizard Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
              Client Posting Wizard
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Draft saved 2m ago
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#0F0C3B] mt-0.5">Post a Job &amp; Receive Vetted Proposals</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/user"
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Exit Draft
          </Link>
        </div>
      </div>

      {/* 5-Step Horizontal Breadcrumb */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
        {[
          { num: 1, label: "Service & Occasion" },
          { num: 2, label: "Event Details" },
          { num: 3, label: "Requirements & Style" },
          { num: 4, label: "Budget & Escrow" },
          { num: 5, label: "Review & Post" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 flex-1 min-w-[130px]">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                step === s.num
                  ? "bg-[#0F0C3B] text-white shadow-xs"
                  : step > s.num
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-600"
              )}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={cn(
                "text-xs font-semibold whitespace-nowrap",
                step === s.num ? "text-[#0F0C3B] font-bold" : "text-slate-500"
              )}
            >
              {s.label}
            </span>
            {s.num < 5 && <div className="h-[2px] bg-slate-200 flex-1 ml-1" />}
          </div>
        ))}
      </div>

      {/* Main 2-Column Split: Form (7 cols) + Live Preview Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 1 of 5 • Service &amp; Occasion
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">What do you need help with?</h2>
                <p className="text-slate-500 mt-0.5">
                  Select your celebration type and the specific artisan services you are seeking vetted proposals for.
                </p>
              </div>

              {/* Occasion Grid */}
              <div>
                <label className="block font-bold text-[#0F0C3B] mb-2">Occasion type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all",
                        occasion === occ.id
                          ? "bg-[#EDE9FE] border-brand-primary text-[#0F0C3B] font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <span className="text-xl">{occ.icon}</span>
                      <span className="text-xs">{occ.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Required Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#0F0C3B]">Services required (Select all that apply) *</label>
                  <span className="text-slate-400 font-semibold">{selectedServices.length} chosen</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((svc) => {
                    const isSelected = selectedServices.includes(svc);
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5",
                          isSelected
                            ? "bg-[#0F0C3B] text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                        <span>{svc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block font-bold text-[#0F0C3B] mb-1">Give your job a title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High-Energy DJ & Emcee for Emma's 5th Birthday"
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none focus:border-brand-primary focus:bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 A clear, descriptive title attracts 40% faster bids from vetted artisans.
                </p>
              </div>

              {/* Post to Family Board Toggle */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#0F0C3B]">Post to Family Board first</h4>
                      <span className="text-[9px] font-extrabold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                        Collaborative Escrow Feature
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Allow co-hosts to review and vote on this RFP draft before broadcasting to the public artisan network.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={postToFamily}
                    onChange={(e) => setPostToFamily(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F0C3B]"></div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 2 of 5 • Event Details &amp; Logistics
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">When and where is your celebration?</h2>
                <p className="text-slate-500 mt-0.5">
                  Artisans use date, venue type, and guest count to calculate precise travel and equipment needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Location / Venue *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lincoln Park, Chicago, IL"
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Estimated Guest Count *</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Service Duration &amp; Hours *</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4 Hours (2:00 PM – 6:00 PM)"
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 3 of 5 • Requirements &amp; Inspiration
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Describe your vision &amp; specific needs</h2>
              </div>

              <div>
                <label className="block font-bold text-[#0F0C3B] mb-1">Detailed Description &amp; Scope *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the atmosphere, songs, timeline, or special instructions..."
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F0C3B] mb-1">Special Equipment or Safety Requests</label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Wireless battery-powered sound, strobe-free lighting"
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 4 of 5 • Budget &amp; Escrow Milestones
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Set your target budget range</h2>
                <p className="text-slate-500 mt-0.5">
                  Bids are held in escrow. You only release milestone disbursements after satisfactory delivery.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Minimum Target Budget ($)</label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Maximum Target Budget ($)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F0C3B] font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <div>
                  <p className="font-bold">100% Escrow Milestone Protection Guaranteed</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Zero funds leave your custody prematurely. Standard payout splits 50% deposit and 50% upon event signoff.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 5 of 5 • Review &amp; Publish
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Ready to publish your request?</h2>
                <p className="text-slate-500 mt-0.5">
                  Your job will be immediately broadcast to vetted Chicago artisans matching your criteria.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Title:</span>
                  <span className="font-bold text-[#0F0C3B] text-right">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Services:</span>
                  <span className="font-semibold text-slate-800">{selectedServices.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Date &amp; Location:</span>
                  <span className="font-semibold text-slate-800">{eventDate} • {location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Budget:</span>
                  <span className="font-extrabold text-[#0F0C3B]">${budgetMin} - ${budgetMax}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{step === 5 ? "Publish Job to Network" : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Job Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1 text-[#0F0C3B]">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> LIVE JOB PREVIEW
            </span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
              ● Updates as you type
            </span>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden text-xs">
            {/* Header banner */}
            <div className="bg-[#18124E] p-4 text-white flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider">
                🎂 Birthday Celebration
              </span>
              <span className="text-[10px] font-extrabold bg-amber-500 text-[#0F0C3B] px-2 py-0.5 rounded">
                NEW RFP
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#0F0C3B] leading-tight">
                  {title || "Untitled Job Request"}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Looking for {selectedServices.length} verified artisans in the Chicagoland area
                </p>
              </div>

              {/* Service tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedServices.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-semibold border border-indigo-100">
                    {s}
                  </span>
                ))}
              </div>

              {/* Logistics grid */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> Date:
                  </span>
                  <span className="font-semibold text-[#0F0C3B]">{eventDate || "Pending (Step 2)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" /> Location:
                  </span>
                  <span className="font-semibold text-[#0F0C3B]">{location || "Pending (Step 2)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <DollarSign className="w-3.5 h-3.5" /> Target Budget:
                  </span>
                  <span className="font-extrabold text-[#0F0C3B]">${budgetMin} - ${budgetMax}</span>
                </div>
              </div>

              {/* Host avatar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    EC
                  </div>
                  <div>
                    <span className="font-bold text-[#0F0C3B] block">Emily Carter</span>
                    <span className="text-[10px] text-slate-400">Lincoln Park, Chicago, IL</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-center text-[10px] font-bold text-amber-900 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>100% Escrow Protected Booking Guarantee</span>
              </div>
            </div>
          </div>

          {/* Posting Readiness */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-bold text-[#0F0C3B]">Posting Readiness</span>
              <span className="font-bold text-brand-primary">{step * 20}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div style={{ width: `${step * 20}%` }} className="h-full bg-brand-primary rounded-full transition-all duration-300" />
            </div>
            <p className="text-[11px] text-slate-500">
              Step {step} of 5 complete. {5 - step} short milestones remaining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
