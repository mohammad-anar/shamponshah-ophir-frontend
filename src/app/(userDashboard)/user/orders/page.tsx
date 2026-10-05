"use client";

import { useState } from "react";
import { ShoppingBag, Lock, ShieldCheck, CheckCircle2, ChevronRight, Download } from "lucide-react";
import OrderDetailDrawer from "@/components/user/OrderDetailDrawer";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "JB-20455",
    vendorName: "Windy City Sound (Marcus Reed)",
    serviceTitle: "DJ and Emcee for 5th Birthday Party",
    totalAmount: "$850.00",
    eventDate: "Saturday, November 14, 2026",
    location: "Lincoln Park Conservatory, Chicago, IL",
    status: "IN_PROGRESS",
    currentMilestone: "Milestone 2 of 2: Post-Event Signoff",
    milestones: [
      { name: "Milestone 1 • Booking Deposit (50%)", amount: "$425.00", status: "PAID" as const },
      { name: "Milestone 2 • Post-Event Delivery Approval (50%)", amount: "$425.00", status: "PENDING" as const },
    ],
  },
  {
    id: "JB-20448",
    vendorName: "Bloom Studio Chicago",
    serviceTitle: "Floral & Pastel Balloon Arch",
    totalAmount: "$850.00",
    eventDate: "Saturday, November 14, 2026",
    location: "Lincoln Park Conservatory",
    status: "IN_DELIVERY",
    currentMilestone: "Milestone 3 of 5: In Delivery",
    milestones: [
      { name: "Design Concept Approval", amount: "$280.00", status: "PAID" as const },
      { name: "Floral Sourcing", amount: "$285.00", status: "PAID" as const },
      { name: "On-site Installation", amount: "$285.00", status: "PENDING" as const },
    ],
  },
  {
    id: "JB-20432",
    vendorName: "Chef Marcus (Sweet Delights)",
    serviceTitle: "Custom 2-Tier Birthday Cake",
    totalAmount: "$350.00",
    eventDate: "Saturday, November 14, 2026",
    location: "Lincoln Park",
    status: "CONFIRMED",
    currentMilestone: "Milestone 2 of 5: Design Finalized",
    milestones: [
      { name: "Design Finalized", amount: "$175.00", status: "PAID" as const },
      { name: "Delivery & Setup", amount: "$175.00", status: "PENDING" as const },
    ],
  },
];

export default function UserOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenOrder = (ord: any) => {
    setSelectedOrder(ord);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <OrderDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        order={selectedOrder}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">My Orders &amp; Escrow Contracts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active milestones, review vendor deliveries, and approve escrow disbursements
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((ord) => (
          <div
            key={ord.id}
            onClick={() => handleOpenOrder(ord)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F0C3B] text-sm">{ord.serviceTitle}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800">
                    #{ord.id}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">{ord.vendorName} • {ord.eventDate}</p>
                <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                  {ord.currentMilestone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-base font-extrabold text-[#0F0C3B] block">{ord.totalAmount}</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3 h-3" /> Escrow Protected
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
