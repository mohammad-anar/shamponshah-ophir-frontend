"use client";

import { useState } from "react";
import { ShoppingBag, Lock, Clock, CheckCircle2, UploadCloud, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const vendorOrders = [
  {
    id: "JB-20455",
    client: "Sarah Jenkins",
    service: "Wedding Reception DJ & Sound (4 hrs)",
    totalAmount: "$550.00",
    date: "Oct 02, 2026",
    status: "IN_PROGRESS",
    milestone: "Milestone 2: Final Sound Check & Performance",
    dueIn: "2 days",
  },
  {
    id: "JB-20489",
    client: "David & Alicia Vance",
    service: "Anniversary Party Emcee & Uplighting",
    totalAmount: "$350.00",
    date: "Oct 05, 2026",
    status: "IN_PROGRESS",
    milestone: "Milestone 1: Custom Playlist Consultation",
    dueIn: "5 days",
  },
  {
    id: "JB-20512",
    client: "Marcus Taylor",
    service: "Emma's 5th Birthday Ophir - DJ & Games",
    totalAmount: "$250.00",
    date: "Oct 12, 2026",
    status: "DEPOSIT_FUNDED",
    milestone: "Milestone 1: Deposit Vaulted",
    dueIn: "12 days",
  },
];

export default function VendorOrdersPage() {
  const handleSubmitDelivery = (orderId: string) => {
    toast.success(`Milestone delivery files submitted for Order #${orderId}. Escrow release requested from client.`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">Fulfillment &amp; Client Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Deliver milestones, submit proofs of completion, and trigger escrow releases
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {vendorOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F0C3B] text-sm">{ord.service}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800">
                    #{ord.id}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">Client: <strong>{ord.client}</strong> • Due: {ord.date} ({ord.dueIn})</p>
                <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                  {ord.milestone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="text-right mr-2">
                <span className="text-base font-extrabold text-[#0F0C3B] block">{ord.totalAmount}</span>
                <span className="text-[10px] text-slate-400">100% Payout Rate</span>
              </div>

              <button
                onClick={() => handleSubmitDelivery(ord.id)}
                className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Deliver Milestone</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
