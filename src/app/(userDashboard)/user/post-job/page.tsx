"use client";

import { useState, useEffect } from "react";
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
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateJobMutation } from "@/redux/service/jobs/jobsApi";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { useGetCategoriesQuery } from "@/redux/service/categories/categoriesApi";

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
  "Vendor Cake",
  "Emcee",
  "Kids Entertainer",
  "Photo Booth",
  "Party Rentals",
];

export default function PostJobWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [createJob, { isLoading: isCreatingJob }] = useCreateJobMutation();
  const { data: meData, isLoading: isMeLoading } = useGetMeQuery();
  const { data: apiCategories, isLoading: isLoadingCats } = useGetCategoriesQuery();

  const categories = Array.isArray(apiCategories)
    ? apiCategories
    : Array.isArray(apiCategories?.data)
    ? apiCategories.data
    : [];

  const me = (meData as any)?.data || meData;

  useEffect(() => {
    if (!isMeLoading && !me) {
      toast.error("Login required: You must be logged in as a client to post a job.");
      router.push("/login?redirect=/user/post-job");
    }
  }, [isMeLoading, me, router]);

  const clientName = me?.clientProfile?.displayName || me?.name || "Event Host";
  const clientCity = me?.clientProfile?.city
    ? `${me.clientProfile.city}, ${me.clientProfile.state || "IL"}`
    : "Chicago, IL";
  const hostInitials = (clientName || "EH")
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Form State
  const [occasion, setOccasion] = useState("wedding");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [postToFamily, setPostToFamily] = useState(true);

  // Step 2
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [duration, setDuration] = useState("");

  // Step 3
  const [description, setDescription] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Step 4
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [biddingDuration, setBiddingDuration] = useState("48 Hours");

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const selectedOccasionObj = occasions.find((o) => o.id === occasion);

  const handleNext = async () => {
    if (!me) {
      toast.error("You must be logged in as a client to post a job.");
      router.push("/login?redirect=/user/post-job");
      return;
    }
    if (step === 1) {
      if (!title.trim()) {
        toast.error("Please enter a title for your job request.");
        return;
      }
      if (!selectedCategoryId && selectedServices.length === 0) {
        toast.error("Please select a target service category.");
        return;
      }
    } else if (step === 2) {
      if (!location.trim()) {
        toast.error("Please enter a venue or city location.");
        return;
      }
      if (!eventDate) {
        toast.error("Please select an event date.");
        return;
      }
    } else if (step === 3) {
      if (!description.trim()) {
        toast.error("Please provide a description of your celebration requirements.");
        return;
      }
    } else if (step === 4) {
      const min = parseFloat(budgetMin) || 0;
      const max = parseFloat(budgetMax) || 0;
      if (min < 0 || max <= 0 || min > max) {
        toast.error("Please enter a valid budget range (Min must be less than or equal to Max).");
        return;
      }
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      try {
        let validIsoDate: string | undefined = undefined;
        if (eventDate) {
          const d = new Date(eventDate);
          if (!isNaN(d.getTime())) {
            validIsoDate = d.toISOString();
          }
        }

        await createJob({
          title: title.trim(),
          description: description.trim(),
          categoryId: selectedCategoryId || undefined,
          category: selectedCategoryName || selectedServices[0] || "General",
          occasion,
          budgetMin: parseFloat(budgetMin) || 0,
          budgetMax: parseFloat(budgetMax) || 0,
          eventDate: validIsoDate,
          location: location.trim(),
          guestCount: parseInt(guestCount, 10) || 0,
          duration,
          specialRequests,
          isPostedToFamily: postToFamily,
          publishNow: true,
        }).unwrap();
        toast.success("Job Published! Your RFP is live and matching vetted vendors in Chicago.");
        router.push("/user/jobs");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to publish job");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Wizard Top Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
              Client Posting Wizard
            </span>
            <span className="text-[10px] text-foreground-muted bg-surface-sunken px-2 py-0.5 rounded">
              Draft saved 2m ago
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground mt-0.5">Post a Job &amp; Receive Vetted Proposals</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/user"
            className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated"
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
                  ? "bg-brand text-foreground shadow-xs"
                  : step > s.num
                  ? "bg-success-solid text-foreground text-foreground"
                  : "bg-surface-sunken text-foreground-secondary"
              )}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={cn(
                "text-xs font-semibold whitespace-nowrap",
                step === s.num ? "text-foreground font-bold" : "text-foreground-muted"
              )}
            >
              {s.label}
            </span>
            {s.num < 5 && <div className="h-[2px] bg-surface-sunken flex-1 ml-1" />}
          </div>
        ))}
      </div>

      {/* Main 2-Column Split: Form (7 cols) + Live Preview Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area (7 cols) */}
        <div className="lg:col-span-7 bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-6 text-xs">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 1 of 5 • Service &amp; Occasion
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1">What do you need help with?</h2>
                <p className="text-foreground-muted mt-0.5">
                  Select your celebration type and the specific vendor services you are seeking vetted proposals for.
                </p>
              </div>

              {/* Occasion Grid */}
              <div>
                <label className="block font-bold text-foreground mb-2">Occasion type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all",
                        occasion === occ.id
                          ? "bg-brand-soft border-brand-primary text-foreground font-bold shadow-xs"
                          : "bg-surface-elevated border-border text-foreground-secondary hover:bg-surface-sunken"
                      )}
                    >
                      <span className="text-xl">{occ.icon}</span>
                      <span className="text-xs">{occ.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories / Services Required */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-foreground">Select Service Category *</label>
                  <span className="text-foreground-muted font-semibold">{selectedServices.length} chosen</span>
                </div>
                {isLoadingCats ? (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" /> Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-3 bg-warning-soft border border-warning/30 rounded-xl text-warning text-xs">
                    No categories registered yet. Please inform the administrator to configure categories.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat: any) => {
                      const isSelected = selectedCategoryId === cat.id || selectedServices.includes(cat.name);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategoryId("");
                              setSelectedCategoryName("");
                              setSelectedServices(selectedServices.filter((s) => s !== cat.name));
                            } else {
                              setSelectedCategoryId(cat.id);
                              setSelectedCategoryName(cat.name);
                              setSelectedServices([cat.name]);
                            }
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
                            isSelected
                              ? "bg-brand text-foreground shadow-xs"
                              : "bg-surface-sunken text-foreground-secondary hover:bg-surface-sunken"
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 text-success" />}
                          <span>{cat.icon || "✨"}</span>
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="block font-bold text-foreground mb-1">Give your job a title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High-Energy DJ & Emcee for Emma's 5th Birthday"
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-medium focus:outline-none focus:border-brand-primary focus:bg-surface"
                />
                <p className="text-[11px] text-foreground-muted mt-1">
                  💡 A clear, descriptive title attracts 40% faster bids from vetted vendors.
                </p>
              </div>

              {/* Post to Family Board Toggle */}
              <div className="p-4 rounded-xl bg-warning-soft/60 border border-warning/30 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-warning-soft text-warning mt-0.5">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">Post to Family Board first</h4>
                      <span className="text-[9px] font-extrabold uppercase bg-warning-soft text-warning px-1.5 py-0.2 rounded">
                        Collaborative Escrow Feature
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground-secondary mt-0.5">
                      Allow co-hosts to review and vote on this RFP draft before broadcasting to the public vendor network.
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
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-border-strong after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
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
                <h2 className="text-xl font-bold text-foreground mt-1">When and where is your celebration?</h2>
                <p className="text-foreground-muted mt-0.5">
                  Vendors use date, venue type, and guest count to calculate precise travel and equipment needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Location / Venue *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lincoln Park, Chicago, IL"
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Estimated Guest Count *</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Service Duration &amp; Hours *</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4 Hours (2:00 PM – 6:00 PM)"
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-primary"
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
                <h2 className="text-xl font-bold text-foreground mt-1">Describe your vision &amp; specific needs</h2>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Detailed Description &amp; Scope *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the atmosphere, songs, timeline, or special instructions..."
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Special Equipment or Safety Requests</label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Wireless battery-powered sound, strobe-free lighting"
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-primary"
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
                <h2 className="text-xl font-bold text-foreground mt-1">Set your target budget range</h2>
                <p className="text-foreground-muted mt-0.5">
                  Bids are held in escrow. You only release milestone disbursements after satisfactory delivery.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1">Minimum Target Budget ($)</label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Maximum Target Budget ($)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-success-soft border border-success/30 text-xs text-success flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-success flex-shrink-0" />
                <div>
                  <p className="font-bold">100% Escrow Milestone Protection Guaranteed</p>
                  <p className="text-[11px] text-success mt-0.5">
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
                <h2 className="text-xl font-bold text-foreground mt-1">Ready to publish your request?</h2>
                <p className="text-foreground-muted mt-0.5">
                  Your job will be immediately broadcast to vetted Chicago vendors matching your criteria.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground-muted font-medium">Title:</span>
                  <span className="font-bold text-foreground text-right">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted font-medium">Services:</span>
                  <span className="font-semibold text-foreground">{selectedServices.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted font-medium">Date &amp; Location:</span>
                  <span className="font-semibold text-foreground">{eventDate} • {location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted font-medium">Budget:</span>
                  <span className="font-extrabold text-foreground">${budgetMin} - ${budgetMax}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isCreatingJob}
              className="px-6 py-2.5 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isCreatingJob ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing RFP...</span>
                </>
              ) : (
                <>
                  <span>{step === 5 ? "Publish Job to Network" : "Continue"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Job Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-foreground-muted">
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> LIVE JOB PREVIEW
            </span>
            <span className="text-[10px] text-warning bg-warning-soft px-2 py-0.5 rounded-full font-bold">
              ● Updates as you type
            </span>
          </div>

          {/* Preview Card */}
          <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden text-xs">
            {/* Header banner */}
            <div className="bg-surface-sunken p-4 text-foreground flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-surface/10 text-[10px] font-bold uppercase tracking-wider">
                {selectedOccasionObj?.icon || "🎉"} {selectedOccasionObj?.label || "Celebration"} RFP
              </span>
              <span className="text-[10px] font-extrabold bg-warning-solid text-on-brand text-foreground px-2 py-0.5 rounded">
                NEW RFP
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground leading-tight">
                  {title || "Untitled Job Request"}
                </h3>
                <p className="text-[11px] text-foreground-muted mt-1">
                  Looking for {selectedServices.length} verified vendors in the Chicagoland area
                </p>
              </div>

              {/* Service tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedServices.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-info-soft text-info text-[10px] font-semibold border border-info/30">
                    {s}
                  </span>
                ))}
              </div>

              {/* Logistics grid */}
              <div className="space-y-2 pt-3 border-t border-border text-foreground-secondary">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground-muted">
                    <Calendar className="w-3.5 h-3.5" /> Date:
                  </span>
                  <span className="font-semibold text-foreground">{eventDate || "Pending (Step 2)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground-muted">
                    <MapPin className="w-3.5 h-3.5" /> Location:
                  </span>
                  <span className="font-semibold text-foreground">{location || "Pending (Step 2)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground-muted">
                    <DollarSign className="w-3.5 h-3.5" /> Target Budget:
                  </span>
                  <span className="font-extrabold text-foreground">${budgetMin} - ${budgetMax}</span>
                </div>
              </div>

              {/* Host avatar */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-brand text-foreground flex items-center justify-center font-bold text-[10px]">
                    {hostInitials}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">{clientName}</span>
                    <span className="text-[10px] text-foreground-muted">{clientCity}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-warning-soft/80 border border-warning/30 text-center text-[10px] font-bold text-warning flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-warning" />
                <span>100% Escrow Protected Booking Guarantee</span>
              </div>
            </div>
          </div>

          {/* Posting Readiness */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-bold text-foreground">Posting Readiness</span>
              <span className="font-bold text-brand-primary">{step * 20}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
              <div style={{ width: `${step * 20}%` }} className="h-full bg-brand-primary rounded-full transition-all duration-300" />
            </div>
            <p className="text-[11px] text-foreground-muted">
              Step {step} of 5 complete. {5 - step} short milestones remaining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
