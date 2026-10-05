"use client";

import { useState } from "react";
import { Check, X, ShieldCheck, Sparkles, Star, Award, Clock, DollarSign, Download, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CompareOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptOffer?: (vendorName: string, amount: string) => void;
}

const candidates = [
  {
    name: "Spin City DJ Co.",
    founder: "David Miller",
    location: "Chicago, IL • 6.2 miles away",
    badge: "Elite Guild Master (Top 1%)",
    rating: "5.0",
    reviewsCount: "142",
    baseOffer: "$1,150.00",
    escrowFee: "$57.50",
    totalPay: "$1,207.50",
    arrival: "90 min pre-event soundcheck",
    hours: "4 hours continuous",
    gear: "Dual Electro-Voice 15\" rigs",
    mics: "2 Wireless handheld mics",
    games: "Full games coordinator + prizes",
    lighting: "Custom monogram + wash lights",
    consult: "30-min Zoom call",
    bubble: "+$75 optional add-on",
    cancellation: "Flexible (Full refund up to 14 days)",
    bestValue: false,
  },
  {
    name: "Windy City Sound",
    founder: "Marcus Reed",
    location: "Lincoln Park, Chicago",
    badge: "Pro Level (Verified Identity)",
    rating: "4.9",
    reviewsCount: "124",
    baseOffer: "$850.00",
    escrowFee: "$42.50",
    totalPay: "$892.50",
    arrival: "60 min child-safe perimeter setup",
    hours: "4 hours continuous (2:00 - 6:00 PM)",
    gear: "Child-safe acoustic sound rig",
    mics: "2 Child-friendly wireless mics",
    games: "Freeze dance, limbo, musical chairs",
    lighting: "Strobe-free warm party ambient LEDs",
    consult: "Dedicated phone call + Spotify sync",
    bubble: "Included complimentary",
    cancellation: "Standard (Full refund up to 7 days before event)",
    bestValue: true,
  },
  {
    name: "Party Pulse Events",
    founder: "Leo Chen",
    location: "Wicker Park, Chicago",
    badge: "Rising Artisan",
    rating: "4.8",
    reviewsCount: "32",
    baseOffer: "$720.00",
    escrowFee: "$36.00",
    totalPay: "$756.00",
    arrival: "45 min setup",
    hours: "4 hours continuous",
    gear: "Single portable PA",
    mics: "1 Wireless mic",
    games: "Basic games announcements",
    lighting: "Basic colored pars",
    consult: "Chat messaging only",
    bubble: "Included",
    cancellation: "Strict (Full refund up to 30 days only)",
    bestValue: false,
  },
];

export default function CompareOffersModal({ isOpen, onClose, onAcceptOffer }: CompareOffersModalProps) {
  if (!isOpen) return null;

  const handleAccept = (name: string, total: string) => {
    toast.success(`Offer from ${name} accepted! Escrow milestone contract generated.`);
    if (onAcceptOffer) onAcceptOffer(name, total);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8F9FD]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compare Offers</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-semibold">DJ & Emcee for Emma&apos;s 5th Birthday</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                3 Candidates Selected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Protected by Ophir Vault Escrow Protocol • 100% milestone guarantee
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-slate-400" /> Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Candidates Header Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col justify-end p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evaluation Matrix</span>
              <p className="text-xs font-bold text-[#0F0C3B] mt-1">Side-by-side spec match &amp; vetted fees</p>
            </div>

            {candidates.map((c) => (
              <div
                key={c.name}
                className={cn(
                  "p-4 rounded-xl border relative transition-all",
                  c.bestValue ? "bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-100 shadow-xs" : "bg-white border-slate-200"
                )}
              >
                {c.bestValue && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                    ★ Best Value &amp; Host Pick
                  </span>
                )}
                <h4 className="font-bold text-[#0F0C3B] text-sm">{c.name}</h4>
                <p className="text-[11px] text-slate-500">{c.location}</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 mt-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{c.rating} ({c.reviewsCount} reviews)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section 1: Price & Escrow Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-[#0F0C3B] text-xs flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-primary" />
              <span>1. Price &amp; Escrow Fees</span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Vendor Base Offer</span>
                {candidates.map((c) => (
                  <span key={c.name} className="font-bold text-[#0F0C3B] text-sm">{c.baseOffer}</span>
                ))}
              </div>

              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Platform Escrow Fee (5%)</span>
                {candidates.map((c) => (
                  <span key={c.name} className="text-slate-600">{c.escrowFee}</span>
                ))}
              </div>

              <div className="grid grid-cols-4 p-3.5 items-center bg-indigo-50/40">
                <span className="font-bold text-[#0F0C3B]">Total You Pay</span>
                {candidates.map((c) => (
                  <span key={c.name} className={cn("text-base font-extrabold", c.bestValue ? "text-emerald-700" : "text-[#0F0C3B]")}>
                    {c.totalPay}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery & Timeline */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-[#0F0C3B] text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>2. Delivery &amp; Timeline</span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Setup &amp; Arrival</span>
                {candidates.map((c) => (
                  <span key={c.name} className="text-slate-700 font-medium">{c.arrival}</span>
                ))}
              </div>

              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Coverage Hours</span>
                {candidates.map((c) => (
                  <span key={c.name} className="text-slate-700 font-medium">{c.hours}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Included Services & Gear */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-[#0F0C3B] text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>3. Included Services &amp; Gear</span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Sound Rig</span>
                {candidates.map((c) => (
                  <span key={c.name} className="text-slate-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    {c.gear}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Microphones</span>
                {candidates.map((c) => (
                  <span key={c.name} className="text-slate-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    {c.mics}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Interactive Games</span>
                {candidates.map((c) => (
                  <span key={c.name} className="text-slate-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    {c.games}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="font-medium text-slate-600">Bubble Machine</span>
                {candidates.map((c) => (
                  <span key={c.name} className={cn("font-medium", c.bubble.includes("complimentary") ? "text-emerald-700 font-bold" : "text-slate-600")}>
                    {c.bubble}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Selection & Accept Action */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 items-center">
            <div>
              <span className="font-bold text-[#0F0C3B] block">Confirm Selection</span>
              <span className="text-[11px] text-slate-500">Locks date in vendor calendar &amp; initiates escrow deposit</span>
            </div>

            {candidates.map((c) => (
              <div key={c.name}>
                <button
                  onClick={() => handleAccept(c.name, c.totalPay)}
                  className={cn(
                    "w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm",
                    c.bestValue
                      ? "bg-[#0F0C3B] hover:bg-[#18124E] text-white ring-2 ring-indigo-300"
                      : "bg-white border border-slate-300 text-[#0F0C3B] hover:bg-slate-100"
                  )}
                >
                  <span>Accept ({c.baseOffer})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
