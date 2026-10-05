"use client";

import { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  MessageSquare, 
  FileText,
  DollarSign,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order?: {
    id: string;
    vendorName: string;
    serviceTitle: string;
    totalAmount: string;
    eventDate: string;
    location: string;
    milestones: { name: string; amount: string; status: "PAID" | "PENDING" | "RELEASED" }[];
  };
}

export default function OrderDetailDrawer({ isOpen, onClose, order }: OrderDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "milestones" | "messages">("details");

  if (!isOpen) return null;

  const currentOrder = order || {
    id: "JB-20455",
    vendorName: "Windy City Sound (Marcus Reed)",
    serviceTitle: "DJ and Emcee for 5th Birthday Party",
    totalAmount: "$850.00",
    eventDate: "Saturday, November 14, 2026 (2:00 PM – 6:00 PM)",
    location: "Lincoln Park Conservatory / South Lawn, Chicago, IL",
    milestones: [
      { name: "Milestone 1 • Booking Deposit (50%)", amount: "$425.00", status: "PAID" as const },
      { name: "Milestone 2 • Post-Event Delivery Approval (50%)", amount: "$425.00", status: "PENDING" as const },
    ],
  };

  const handleApproveMilestone = () => {
    toast.success("Milestone 2 Approved! $425.00 released from escrow vault to Marcus Reed.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#F8F9FD]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Detail</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                #{currentOrder.id}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                In Progress
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0F0C3B] mt-1">{currentOrder.serviceTitle}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Tabs */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-200 text-xs font-bold text-slate-600 bg-white">
          <button
            onClick={() => setActiveTab("details")}
            className={cn("py-3 border-b-2 transition-colors", activeTab === "details" ? "border-brand-primary text-brand-primary" : "border-transparent text-slate-500 hover:text-slate-800")}
          >
            Celebration Details &amp; Logistics
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={cn("py-3 border-b-2 transition-colors", activeTab === "milestones" ? "border-brand-primary text-brand-primary" : "border-transparent text-slate-500 hover:text-slate-800")}
          >
            Escrow Milestones
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Escrow Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F0C3B]">Ophir Escrow Vault Protection</h4>
                <p className="text-[11px] text-slate-600">Neutral custody escrow governing delivery sign-off and disbursements</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              100% Protected
            </span>
          </div>

          {/* Event Logistics */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#0F0C3B] text-sm">Event Logistics Plan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date &amp; Schedule</span>
                  <span className="font-semibold text-slate-800">{currentOrder.eventDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue &amp; Destination</span>
                  <span className="font-semibold text-slate-800">{currentOrder.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Escrow Milestone Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#0F0C3B] text-sm">Escrow Milestone Schedule</h4>
              <span className="text-slate-500 font-semibold">2 Milestones</span>
            </div>

            <div className="space-y-2.5">
              {currentOrder.milestones.map((ms, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs",
                      ms.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-[#0F0C3B] block">{ms.name}</span>
                      <span className="text-[11px] text-slate-500">
                        {ms.status === "PAID" ? "Secured in Ophir Escrow Vault" : "Auto-charged upon event delivery completion"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-[#0F0C3B] block">{ms.amount}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      ms.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                    )}>
                      {ms.status === "PAID" ? "Vaulted" : "Pending Approval"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Agreed Offer Price</span>
              <span className="font-semibold text-[#0F0C3B]">{currentOrder.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Protection Fee (5%)</span>
              <span className="font-semibold text-[#0F0C3B]">$42.50</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-[#0F0C3B] text-sm">
              <span>Total Contracted</span>
              <span>$892.50</span>
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <button className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
            Open Resolution Center
          </button>
          <button
            onClick={handleApproveMilestone}
            className="px-6 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Approve Delivery &amp; Release Funds</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
