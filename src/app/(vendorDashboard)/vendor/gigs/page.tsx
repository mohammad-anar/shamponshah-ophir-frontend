"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, MoreHorizontal, Star, CheckCircle2, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const myGigs = [
  {
    id: "GIG-101",
    title: "I will DJ and host your birthday party with music, lights and games",
    category: "DJ & Live Music • Birthdays",
    startingPrice: "$450.00",
    ordersCompleted: 14,
    rating: "4.9",
    views: "1,420",
    status: "ACTIVE",
  },
  {
    id: "GIG-102",
    title: "I will provide luxury wedding sound, wireless mics, and emcee coordination",
    category: "DJ & Live Music • Weddings",
    startingPrice: "$850.00",
    ordersCompleted: 8,
    rating: "5.0",
    views: "980",
    status: "ACTIVE",
  },
];

export default function VendorGigsPage() {
  const handleToggleStatus = (id: string) => {
    toast.info(`Gig ${id} status updated.`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">My Service Gigs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your active marketplace listings, pricing packages, and discovery performance
          </p>
        </div>

        <Link
          href="/vendor/gigs/create"
          className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" /> Create New Gig
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {myGigs.map((gig) => (
          <div key={gig.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {gig.status}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">#{gig.id}</span>
              </div>

              <h3 className="font-bold text-[#0F0C3B] text-sm mt-2">{gig.title}</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">{gig.category}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Orders</span>
                <span className="font-bold text-[#0F0C3B] text-sm">{gig.ordersCompleted}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Rating</span>
                <span className="font-bold text-amber-800 text-sm flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {gig.rating}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Views</span>
                <span className="font-bold text-[#0F0C3B] text-sm">{gig.views}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting at</span>
                <span className="text-lg font-extrabold text-[#0F0C3B]">{gig.startingPrice}</span>
              </div>

              <Link
                href="/vendor/gigs/create"
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors"
              >
                Edit Gig
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
