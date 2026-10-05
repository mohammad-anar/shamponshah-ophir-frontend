"use client";

import { useState } from "react";
import { X, DollarSign, Clock, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SendOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  clientBudget?: string;
  clientName?: string;
  onOfferSent?: (offer: any) => void;
}

export default function SendOfferModal({
  isOpen,
  onClose,
  jobTitle = "DJ and Emcee for 5th birthday party",
  clientBudget = "$600 – $1,200",
  clientName,
  onOfferSent,
}: SendOfferModalProps) {
  const [offerPrice, setOfferPrice] = useState("850.00");
  const [coverLetter, setCoverLetter] = useState(
    "Hi! I would love to perform for your celebration. My setup includes high-definition audio, wireless microphones, warm uplighting, and seamless playlist curation!"
  );

  if (!isOpen) return null;

  const handleSend = () => {
    toast.success(`Custom offer of $${offerPrice} sent!`);
    if (onOfferSent) {
      onOfferSent({
        title: jobTitle,
        price: Number(offerPrice),
        note: coverLetter,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8F9FD]">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Send Custom Proposal {clientName ? `to ${clientName}` : ""}
            </span>
            <h3 className="text-base font-bold text-[#0F0C3B] mt-0.5">{jobTitle}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <span className="text-indigo-900 font-semibold">Client Target Budget:</span>
            <span className="font-extrabold text-[#0F0C3B]">{clientBudget}</span>
          </div>

          <div>
            <label className="block font-bold text-[#0F0C3B] mb-1">Your Total Proposed Price ($) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="text"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs font-bold text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              You receive: <strong>${offerPrice}</strong> (0% vendor fee deduction).
            </span>
          </div>

          <div>
            <label className="block font-bold text-[#0F0C3B] mb-1">Proposal Note &amp; Equipment Inclusions *</label>
            <textarea
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
            <span>Bid Credits Cost: <strong>2 Credits</strong></span>
            <span className="font-semibold text-amber-800">Remaining Balance: 14 Credits</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-6 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Submit Proposal (2 Credits)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
