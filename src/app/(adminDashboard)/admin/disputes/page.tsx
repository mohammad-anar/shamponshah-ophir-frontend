"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { useGetAllDisputesQuery, useResolveDisputeMutation } from "@/redux/service/admin/adminApi";

const initialDisputes = [
  {
    id: "DS-1051",
    orderId: "OPH-20455",
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
    orderId: "OPH-20442",
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
    orderId: "OPH-20388",
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
  const { data: apiDisputes } = useGetAllDisputesQuery();
  const [resolveDisputeMutation] = useResolveDisputeMutation();

  const [disputes, setDisputes] = useState(initialDisputes);
  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);

  useEffect(() => {
    const list = Array.isArray(apiDisputes) ? apiDisputes : (apiDisputes as any)?.data;
    if (list && Array.isArray(list) && list.length > 0) {
      setDisputes(list);
      if (!list.find((d: any) => d.id === selectedDispute?.id)) {
        setSelectedDispute(list[0]);
      }
    }
  }, [apiDisputes]);

  const handleActionComplete = async (actionType: string, details: any) => {
    try {
      await resolveDisputeMutation({
        id: selectedDispute.id,
        action: actionType,
        ...details,
      }).unwrap();
    } catch {
      // Handled
    }
    toast.success(`Dispute #${selectedDispute.id} Resolved via Stripe Connect!`);
  };


  return (
    <div className="space-y-6 pb-16">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Disputes &amp; Arbitration Console
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30">
              Stripe Connect Vault Arbitration
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Binding arbitration docket, evidentiary review, and manual/partial split refunds via Stripe Connect
          </p>
        </div>

        <button
          onClick={() => setIsEscrowModalOpen(true)}
          className="px-4 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Scale className="w-4 h-4 text-[#0B0C0E]" /> Open Escrow Settlement Console
        </button>
      </div>

      {/* Overdue Alert Banner */}
      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>Case #{selectedDispute.id} Exceeded 72h SLA: Immediate Arbitrator Decision Required</span>
        </div>
        <button 
          onClick={() => setIsEscrowModalOpen(true)}
          className="font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Execute Settlement</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Col Docket Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
        
        {/* Left Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span className="uppercase tracking-wider">Active Disputes Queue ({disputes.length})</span>
            <span className="text-[10px] text-slate-500 font-normal">Sorted by SLA Urgency</span>
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
                      ? "bg-[#16181F] border-[#DFB76C] shadow-sm ring-1 ring-[#DFB76C]/30"
                      : "bg-[#121418] border-[#26282E] hover:border-slate-700 hover:bg-[#16181F]/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#DFB76C] font-mono bg-[#1A1D24] px-2 py-0.5 rounded border border-[#DFB76C]/30">
                          #{d.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Order #{d.orderId}</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-1.5">
                        {d.client} <span className="text-slate-500 font-normal">vs</span> {d.vendor}
                      </p>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                      d.status === "OVERDUE" && "bg-rose-500/15 text-rose-400 border-rose-500/30",
                      d.status === "ACTIVE" && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                      d.status === "EVIDENCE_PENDING" && "bg-purple-500/15 text-purple-400 border-purple-500/30",
                    )}>
                      {d.statusText}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-[#0B0C0E]/60 p-2.5 rounded-xl border border-[#26282E]">
                    {d.summary}
                  </p>

                  <div className="pt-2 border-t border-[#26282E] flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3 text-slate-500" /> Escrow: ${d.amount.toLocaleString()}
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
          <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFB76C] bg-[#1A1D24] px-2.5 py-0.5 rounded-full border border-[#DFB76C]/30">
                  Priority Arbitration Docket
                </span>
                <h2 className="text-base font-black text-white mt-1.5">
                  Case #{selectedDispute.id}: {selectedDispute.client} vs. {selectedDispute.vendor}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" /> Overdue 18h
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#26282E] text-xs">
              <div className="p-3 bg-[#16181F] rounded-2xl border border-[#26282E]">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Escrow in Custody</span>
                <p className="text-base font-black text-white font-mono mt-0.5">${selectedDispute.amount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#16181F] rounded-2xl border border-[#26282E]">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Parent Order</span>
                <p className="font-bold text-white mt-0.5">#{selectedDispute.orderId}</p>
              </div>
              <div className="p-3 bg-[#16181F] rounded-2xl border border-[#26282E]">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Vendor Stripe ID</span>
                <p className="font-mono text-[#DFB76C] text-[11px] font-bold mt-0.5 truncate">{selectedDispute.vendorStripeAccountId}</p>
              </div>
              <div className="p-3 bg-[#16181F] rounded-2xl border border-[#26282E]">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Arbitration Rule</span>
                <p className="font-bold text-slate-200 mt-0.5">Policy v3.2 Escrow</p>
              </div>
            </div>
          </div>

          {/* Evidence Dossier */}
          <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DFB76C]" />
                Party Submissions &amp; Evidentiary Dossier
              </h3>
              <span className="text-xs text-slate-400 font-medium">2 Submissions Lodged</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Client Statement */}
              <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30 flex items-center justify-center font-bold text-[10px]">
                      EC
                    </div>
                    <div>
                      <p className="font-bold text-white">{selectedDispute.client}</p>
                      <p className="text-[10px] text-slate-400">Claimant (Buyer)</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Nov 12, 10:30 AM</span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed italic bg-[#121418] p-3 rounded-xl border border-[#26282E]">
                  &ldquo;{selectedDispute.clientStatement}&rdquo;
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#26282E] text-[10px] font-bold text-slate-300">
                    📸 cords_draped.jpg
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#26282E] text-[10px] font-bold text-slate-300">
                    📄 contract_rider.pdf
                  </span>
                </div>
              </div>

              {/* Vendor Statement */}
              <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-[10px]">
                      WC
                    </div>
                    <div>
                      <p className="font-bold text-white">{selectedDispute.vendor}</p>
                      <p className="text-[10px] text-slate-400">Respondent (Vendor)</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Nov 13, 03:15 PM</span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed italic bg-[#121418] p-3 rounded-xl border border-[#26282E]">
                  &ldquo;{selectedDispute.vendorStatement}&rdquo;
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#26282E] text-[10px] font-bold text-slate-300">
                    📸 mist_conditions.jpg
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#26282E] text-[10px] font-bold text-slate-300">
                    🌦️ weather_log.pdf
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settle Dispute CTA Card */}
          <div className="bg-[#16181F] border border-[#DFB76C]/30 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Execute Binding Escrow Settlement</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Release 100% to vendor Stripe Connect account, issue 100% full refund to buyer card, or execute custom partial split refund.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              <Link
                href={`/admin/orders/${(selectedDispute as any).dbOrderId || selectedDispute.orderId}`}
                className="px-4 py-2.5 bg-[#1A1D24] hover:bg-[#222630] border border-[#26282E] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-[#DFB76C]" />
                <span>Join Order Page & Chat</span>
              </Link>
              <button
                onClick={() => setIsEscrowModalOpen(true)}
                className="px-4 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-4 h-4 text-[#0B0C0E]" />
                <span>Settlement Console</span>
              </button>
            </div>
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
