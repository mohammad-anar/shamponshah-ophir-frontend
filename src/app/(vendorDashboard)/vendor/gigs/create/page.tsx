"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  DollarSign,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Clock,
  Layers,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateGigPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [gigTitle, setGigTitle] = useState("DJ and host your birthday party with music, lights and games");
  const [occasion, setOccasion] = useState("Birthdays (Milestone & Youth)");
  const [category, setCategory] = useState("DJ & Live Music");
  const [tags, setTags] = useState<string[]>(["Birthday DJ", "Interactive Emcee", "Party Lighting"]);
  const [tagInput, setTagInput] = useState("");
  const [travelRadius, setTravelRadius] = useState(40);
  const [outsideRadiusAllowed, setOutsideRadiusAllowed] = useState(true);

  // Step 2: Pricing
  const [basicPrice, setBasicPrice] = useState("450");
  const [standardPrice, setStandardPrice] = useState("850");
  const [premiumPrice, setPremiumPrice] = useState("1,400");

  // Step 3: Description
  const [description, setDescription] = useState(
    "High-energy DJ and interactive MC experience curated specifically for kids and family birthday celebrations. Full sound rig, child-safe volume limits, cordless microphones, bubble effects, and lively group activities."
  );

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      toast.success("Gig Published! Your service is live on the Ophir marketplace.");
      router.push("/vendor/gigs");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
              Create Gig Wizard
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Draft saved just now
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#0F0C3B] mt-0.5">Publish a New Service Listing</h1>
        </div>

        <Link
          href="/vendor/gigs"
          className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          Exit Draft
        </Link>
      </div>

      {/* 5-Step Breadcrumbs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
        {[
          { num: 1, label: "Overview" },
          { num: 2, label: "Pricing" },
          { num: 3, label: "Description & FAQ" },
          { num: 4, label: "Gallery" },
          { num: 5, label: "Publish" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 flex-1 min-w-[120px]">
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

      {/* 2-Column Split: Form (7 cols) + Live Card Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 1 of 5 • Essential Configuration
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Let&apos;s set up your gig</h2>
                <p className="text-slate-500 mt-0.5">
                  Start with a clear title, categorize your entertainment service, and set where you perform.
                </p>
              </div>

              {/* Conversion Pro-Tip */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Pro-tip for higher conversion:</strong> Titles pairing a specific occasion with a celebratory outcome generate <strong>42% more inquiries</strong>.
                </p>
              </div>

              {/* Gig Title */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="font-bold text-[#0F0C3B]">Gig title *</label>
                  <span className="text-slate-400 text-[11px]">{gigTitle.length} / 80</span>
                </div>
                <div className="flex items-center rounded-xl border border-slate-200 bg-[#F8F9FD] overflow-hidden focus-within:border-brand-primary focus-within:bg-white">
                  <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 font-bold text-slate-600 select-none">
                    I will
                  </span>
                  <input
                    type="text"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    placeholder="DJ and host your birthday party with music, lights and games"
                    className="w-full bg-transparent px-3 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">✓ Perfect length. Clear occasion and deliverables included.</p>
              </div>

              {/* Category Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Primary Occasion *</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option>Birthdays (Milestone &amp; Youth)</option>
                    <option>Weddings &amp; Receptions</option>
                    <option>Corporate Events &amp; Galas</option>
                    <option>Baby Showers &amp; Holuds</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F0C3B] mb-1">Service Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option>DJ &amp; Live Music</option>
                    <option>Photography &amp; Film</option>
                    <option>Floral &amp; Balloon Decor</option>
                    <option>Catering &amp; Bakery</option>
                  </select>
                </div>
              </div>

              {/* Search Tags */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-bold text-[#0F0C3B]">Search tags (up to 5)</label>
                  <span className="text-slate-400">{tags.length} of 5 used</span>
                </div>
                <div className="p-2 rounded-xl border border-slate-200 bg-[#F8F9FD] flex flex-wrap gap-1.5 items-center">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1 shadow-xs"
                    >
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="text-slate-400 hover:text-red-500">
                        ×
                      </button>
                    </span>
                  ))}
                  {tags.length < 5 && (
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add a tag and press enter..."
                      className="bg-transparent text-xs text-[#0F0C3B] placeholder-slate-400 focus:outline-none px-2 py-1 flex-1 min-w-[140px]"
                    />
                  )}
                </div>
              </div>

              {/* Service Area & Radius */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F0C3B] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-primary" /> Service Area &amp; Travel Radius
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    HQ: Chicago 60611
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Performance Travel Radius:</span>
                    <strong className="text-[#0F0C3B]">{travelRadius} miles from 60611</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={travelRadius}
                    onChange={(e) => setTravelRadius(Number(e.target.value))}
                    className="w-full accent-[#0F0C3B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 mi (Strict Local)</span>
                    <span>25 mi</span>
                    <span>50 mi</span>
                    <span>100 mi (Regional)</span>
                  </div>
                </div>

                <label className="flex items-center justify-between pt-2 border-t border-slate-200 cursor-pointer">
                  <span className="text-slate-700 font-medium">I travel outside my radius for custom surcharge</span>
                  <input
                    type="checkbox"
                    checked={outsideRadiusAllowed}
                    onChange={(e) => setOutsideRadiusAllowed(e.target.checked)}
                    className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 2 of 5 • Pricing Packages
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Configure your package tiers</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Basic Package</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input
                      type="text"
                      value={basicPrice}
                      onChange={(e) => setBasicPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-[#0F0C3B]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">2 hours sound, 1 mic</p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-300 bg-indigo-50/40 space-y-2 ring-2 ring-indigo-50">
                  <span className="text-xs font-bold text-[#0F0C3B] block">Standard (Most Popular)</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input
                      type="text"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-[#0F0C3B]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">4 hours, games, bubble rig</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Premium Package</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input
                      type="text"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-[#0F0C3B]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Full day, lighting + 2 MCs</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 3 of 5 • Description &amp; FAQ
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Describe your service in detail</h2>
              </div>

              <div>
                <label className="block font-bold text-[#0F0C3B] mb-1">Service Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 4 of 5 • Gallery &amp; Media
                </span>
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Showcase your work</h2>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors">
                <UploadCloud className="w-10 h-10 text-brand-primary mb-2" />
                <p className="font-bold text-[#0F0C3B]">Drag &amp; drop high-resolution photos or videos</p>
                <p className="text-[11px] text-slate-400 mt-1">Supported: JPG, PNG, MP4 up to 50MB</p>
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
                <h2 className="text-xl font-bold text-[#0F0C3B] mt-1">Ready to launch your gig?</h2>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Title:</span>
                  <span className="font-bold text-[#0F0C3B]">{gigTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Starting Price:</span>
                  <span className="font-extrabold text-[#0F0C3B]">${basicPrice}</span>
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
              <span>{step === 5 ? "Publish Gig to Marketplace" : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1 text-[#0F0C3B]">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Live card preview
            </span>
            <span className="text-[10px] text-slate-400">Buyer viewpoint</span>
          </div>

          {/* Card Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden text-xs">
            <div className="bg-[#18124E] p-4 text-white flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase">
                {occasion.split("(")[0]}
              </span>
              <span className="text-[10px] font-extrabold bg-amber-500 text-[#0F0C3B] px-2 py-0.5 rounded">
                Live Preview
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs">
                  PP
                </div>
                <div>
                  <span className="font-bold text-[#0F0C3B] block">Party Pulse Events</span>
                  <span className="text-[10px] text-amber-700 font-semibold">★ Rising Vendor • Chicago verified</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F0C3B] leading-snug">
                  I will {gigTitle || "DJ and host your event"}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">{category} • Emcee Hosting</p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Chicago, IL • {travelRadius} mi radius</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">STARTING AT</span>
                  <span className="text-xl font-extrabold text-[#0F0C3B]">From ${basicPrice}</span>
                </div>
                <span className="text-xs font-bold text-brand-primary">Inspect details →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
