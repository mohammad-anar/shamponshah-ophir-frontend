"use client";

import { useState } from "react";
import {
  Scale,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AdminEscrowReleaseModal from "@/components/admin/AdminEscrowReleaseModal";

const initialDisputes = [
  {
    id: "DS-1051",
    orderId: "JB-20455",
    client: "Emily Carter",
    clientEmail: "emily.carter@gmail.com",
    vendor: "Windy City Sound",
    vendorStripeAccountId: "acct_1NZDJ88219",
    stripePaymentIntentId: "pi_3N9xDJ8821980",
    occasion: "Emma's 5th Birthday Gala",
    amount: 850,
    status: "OVERDUE",
    statusText: "Past SLA by 18 hours",
    summary: "Service not as described: Contracted wireless battery packs omitted leading to audio shutdown during toasts.",
    clientStatement: "The contracted wireless battery packs were not provided, leading to sound cutoff during the birthday toasts. See photo of booth setup with cords draped dangerously across grass where kids were running.",
    vendorStatement: "The outdoor yard did not have the promised covered canopy shelter. Due to sudden mist, equipment safety regulations strictly prohibit battery pack exposure to moisture. We ran direct surge-protected AC lines instead. Event sound was fully maintained for 3.5 of 4 hours.",
  },
  {
    id: "DS-1049",
    orderId: "JB-20442",
    client: "Rachel Adams",
    clientEmail: "rachel.adams@gmail.com",
    vendor: "Bloom & Petal Decor",
    vendorStripeAccountId: "acct_1NZFloral331",
    stripePaymentIntentId: "pi_3N9xFloral3310",
    occasion: "Adams Wedding Reception",
    amount: 1250,
    status: "ACTIVE",
    statusText: "14h remaining",
    summary: "Floral centerpiece wilting reported 3 hours prior to wedding ceremony start.",
    clientStatement: "Hydrangeas were visibly wilted by 2 PM before our 5 PM reception.",
    vendorStatement: "Flowers were fresh at 11 AM load-in; the venue turned off AC until 4 PM.",
  },
  {
    id: "DS-1046",
    orderId: "JB-20388",
    client: "Viktor Vance",
    clientEmail: "viktor.vance@gmail.com",
    vendor: "SoundWave Audio",
    vendorStripeAccountId: "acct_1NZSound992",
    stripePaymentIntentId: "pi_3N9xSound9920",
    occasion: "Corporate Gala",
    amount: 750,
    status: "EVIDENCE_PENDING",
    statusText: "Client Video Requested",
    summary: "DJ crew reported 2 hours late past venue load-in deadline; ceremony prelude missing.",
    clientStatement: "Guests arrived to silence as microphones were not yet sound-checked.",
    vendorStatement: "Highway 90 pileup caused delay; communicated arrival ETA at 1:15 PM.",
  }
];

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);

  const handleActionComplete = (actionType: string, details: any) => {
    toast.success(`Dispute #${selectedDispute.id} Resolved via Stripe Connect!`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Disputes &amp; Arbitration Console
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
              Stripe Connect Vault Arbitration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Binding arbitration docket, evidentiary review, and manual/partial split refunds via Stripe Connect
          </p>
        </div>

        <button
          onClick={() => setIsEscrowModalOpen(true)}
          className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-amber-300" /> Open Escrow Settlement Console
        </button>
      </div>

      {/* Overdue Alert Banner */}
      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>Case #{selectedDispute.id} Exceeded 72h SLA: Immediate Arbitrator Decision Required</span>
        </div>
        <button 
          onClick={() => setIsEscrowModalOpen(true)}
          className="font-bold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Execute Settlement</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Col Docket Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
        
        {/* Left Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span className="uppercase tracking-wider">Active Disputes Queue ({disputes.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">Sorted by SLA Urgency</span>
          </div>

          <div className="space-y-2.5">
            {disputes.map((d) => {
              const isSelected = selectedDispute.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className={cn(
                    "p-4 rounded-3xl border transition-all cursor-pointer space-y-2.5",
                    isSelected
                      ? "bg-indigo-50/60 border-brand-primary shadow-xs ring-1 ring-brand-primary/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-primary font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          #{d.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Order #{d.orderId}</span>
                      </div>
                      <p className="text-xs font-bold text-[#0F0C3B] mt-1.5">
                        {d.client} <span className="text-slate-400 font-normal">vs</span> {d.vendor}
                      </p>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      d.status === "OVERDUE" && "bg-rose-100 text-rose-800 border border-rose-200",
                      d.status === "ACTIVE" && "bg-amber-100 text-amber-800 border border-amber-200",
                      d.status === "EVIDENCE_PENDING" && "bg-purple-100 text-purple-800 border border-purple-200",
                    )}>
                      {d.statusText}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-[#F8F9FD] p-2.5 rounded-xl border border-slate-100">
                    {d.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3 text-slate-400" /> Escrow: ${d.amount.toLocaleString()}
                    </span>
                    <span className="text-slate-400 font-medium">{d.occasion}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arbitration Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Case Header Details Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F0C3B] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Priority Arbitration Docket
                </span>
                <h2 className="text-base font-black text-[#0F0C3B] mt-1.5">
                  Case #{selectedDispute.id}: {selectedDispute.client} vs. {selectedDispute.vendor}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-600" /> Overdue 18h
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Escrow in Custody</span>
                <p className="text-base font-black text-[#0F0C3B] font-mono mt-0.5">${selectedDispute.amount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Parent Order</span>
                <p className="font-bold text-[#0F0C3B] mt-0.5">#{selectedDispute.orderId}</p>
              </div>
              <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Vendor Stripe ID</span>
                <p className="font-mono text-emerald-700 text-[11px] font-bold mt-0.5 truncate">{selectedDispute.vendorStripeAccountId}</p>
              </div>
              <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Arbitration Rule</span>
                <p className="font-bold text-brand-primary mt-0.5">Policy v3.2 Escrow</p>
              </div>
            </div>
          </div>

          {/* Evidence Dossier */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                Party Submissions &amp; Evidentiary Dossier
              </h3>
              <span className="text-xs text-slate-400 font-medium">2 Submissions Lodged</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Client Statement */}
              <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[10px]">
                      EC
                    </div>
                    <div>
                      <p className="font-bold text-[#0F0C3B]">{selectedDispute.client}</p>
                      <p className="text-[10px] text-slate-400">Claimant (Buyer)</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Nov 12, 10:30 AM</span>
                </div>

                <p className="text-slate-700 text-[11px] leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200/80">
                  &ldquo;{selectedDispute.clientStatement}&rdquo;
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    📸 cords_draped.jpg
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    📄 contract_rider.pdf
                  </span>
                </div>
              </div>

              {/* Vendor Statement */}
              <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
                      WC
                    </div>
                    <div>
                      <p className="font-bold text-[#0F0C3B]">{selectedDispute.vendor}</p>
                      <p className="text-[10px] text-slate-400">Respondent (Vendor)</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Nov 13, 03:15 PM</span>
                </div>

                <p className="text-slate-700 text-[11px] leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200/80">
                  &ldquo;{selectedDispute.vendorStatement}&rdquo;
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    📸 mist_conditions.jpg
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    🌦️ weather_log.pdf
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settle Dispute CTA Card */}
          <div className="bg-gradient-to-r from-[#0F0C3B] to-[#1E175E] text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Execute Binding Escrow Settlement</h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Release 100% to vendor Stripe Connect account, issue 100% full refund to buyer card, or execute custom partial split refund.
              </p>
            </div>

            <button
              onClick={() => setIsEscrowModalOpen(true)}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 flex-shrink-0"
            >
              <Scale className="w-4 h-4 text-brand-primary" />
              <span>Launch Settlement Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Escrow Release & Split Refund Modal */}
      {isEscrowModalOpen && (
        <AdminEscrowReleaseModal
          isOpen={isEscrowModalOpen}
          onClose={() => setIsEscrowModalOpen(false)}
          order={{
            id: selectedDispute.id,
            orderNumber: selectedDispute.orderId,
            clientName: selectedDispute.client,
            clientEmail: selectedDispute.clientEmail,
            vendorName: selectedDispute.vendor,
            vendorStripeAccountId: selectedDispute.vendorStripeAccountId,
            stripePaymentIntentId: selectedDispute.stripePaymentIntentId,
            totalAmount: selectedDispute.amount,
            escrowLockedAmount: selectedDispute.amount,
            status: selectedDispute.status,
          }}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
}
