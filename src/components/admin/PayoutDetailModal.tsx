"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  X, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  ArrowUpRight,
  Clock,
  Sparkles,
  Lock,
  Layers,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PayoutOrder {
  orderId: string;
  serviceTitle: string;
  clientName: string;
  eventDate: string;
  completedDate: string;
  grossAmount: number;
  platformFee: number;
  netPayout: number;
}

export interface PayoutBatchDetail {
  id: string;
  status: "SCHEDULED" | "PROCESSING" | "FLAGGED" | "COMPLETED";
  scheduledDate: string;
  totalGross: number;
  platformFeeTotal: number;
  netDisbursement: number;
  vendor: {
    id: string;
    legalName: string;
    businessName: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    taxId: string;
    kycStatus: "VERIFIED" | "PENDING_TAX_FORM" | "FLAGGED";
    riskScore: string;
    stripeConnectId: string;
    bankName: string;
    routingNumber: string;
    accountLast4: string;
    accountType: string;
  };
  orders: PayoutOrder[];
  auditLog: { id: string; timestamp: string; action: string; actor: string }[];
}

interface PayoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutBatchDetail;
  onApprove: (id: string) => void;
  onFlag: (id: string, reason: string) => void;
}

export default function PayoutDetailModal({
  isOpen,
  onClose,
  payout,
  onApprove,
  onFlag,
}: PayoutDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0F0C3B] to-[#1E175E] text-white flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                #{payout.id}
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                payout.status === "COMPLETED" && "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30",
                payout.status === "SCHEDULED" && "bg-amber-400/20 text-amber-300 border border-amber-400/30",
                payout.status === "PROCESSING" && "bg-indigo-400/20 text-indigo-300 border border-indigo-400/30",
                payout.status === "FLAGGED" && "bg-rose-400/20 text-rose-300 border border-rose-400/30",
              )}>
                {payout.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Stripe Connect Disbursement Batch
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
          
          {/* Summary Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Gross Milestone Total</span>
              <span className="text-lg font-black text-[#0F0C3B] font-mono mt-1 block">
                ${payout.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-500">{payout.orders.length} Completed Orders</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Platform Fee Retained</span>
              <span className="text-lg font-black text-brand-primary font-mono mt-1 block">
                -${payout.platformFeeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-500">10% Platform Commission</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-emerald-800 text-[10px] uppercase font-bold block">Net Stripe ACH Payout</span>
              <span className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                ${payout.netDisbursement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold">Direct Deposit to Bank</span>
            </div>
          </div>

          {/* Vendor Personal & Financial Details */}
          <div className="bg-[#F8F9FD] rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-primary" /> Vendor Profile &amp; Banking Specs
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {payout.vendor.kycStatus.replace(/_/g, " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Personal / Business Contact Info */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Identity &amp; Legal Entity
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-[#0F0C3B] text-sm">{payout.vendor.legalName}</p>
                  <p className="text-slate-600 font-semibold">{payout.vendor.businessName}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600 text-[11px]">
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {payout.vendor.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {payout.vendor.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {payout.vendor.address}
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Tax ID: {payout.vendor.taxId}
                  </p>
                </div>
              </div>

              {/* Stripe Connect & Bank specs */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Stripe ACH Direct Deposit Target
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-brand-primary" />
                    {payout.vendor.bankName}
                  </p>
                  <p className="text-slate-600 font-mono text-xs">
                    Account ending in <strong className="text-[#0F0C3B]">•••• {payout.vendor.accountLast4}</strong> ({payout.vendor.accountType})
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600 text-[11px]">
                  <p className="font-mono text-[10px]">
                    Routing: <strong className="text-slate-700">{payout.vendor.routingNumber}</strong>
                  </p>
                  <p className="font-mono text-[10px]">
                    Stripe Acct: <span className="text-indigo-700 font-bold">{payout.vendor.stripeConnectId}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Compliance Risk Score: <strong className="text-emerald-700">{payout.vendor.riskScore} (Low Risk)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aggregated Orders in this Batch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-primary" /> Itemized Orders Included in Batch ({payout.orders.length})
              </h3>
              <span className="text-[11px] text-slate-400">All milestones verified &amp; approved</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#EDE9FE]/40 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Order &amp; Service</th>
                    <th className="py-2.5 px-3">Host (Buyer)</th>
                    <th className="py-2.5 px-3">Event Date</th>
                    <th className="py-2.5 px-3 font-mono">Gross</th>
                    <th className="py-2.5 px-3 font-mono">Platform (10%)</th>
                    <th className="py-2.5 px-3 font-mono text-right">Net Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {payout.orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#0F0C3B] block">{order.serviceTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{order.orderId}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{order.clientName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{order.eventDate}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">${order.grossAmount}</td>
                      <td className="py-2.5 px-3 font-mono text-brand-primary">-${order.platformFee}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-700 text-right">${order.netPayout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disbursement Audit Trail */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Settlement &amp; Audit Trail
            </span>
            <div className="space-y-1.5">
              {payout.auditLog.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.action}</span>
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">{log.timestamp} &bull; {log.actor}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {payout.status === "SCHEDULED" && (
              <>
                <button
                  onClick={() => {
                    onFlag(payout.id, "Tax W-9 form renewal required before ACH disbursement.");
                    onClose();
                  }}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Flag / Hold Batch</span>
                </button>

                <button
                  onClick={() => {
                    onApprove(payout.id);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Release Instant ACH (${payout.netDisbursement})</span>
                </button>
              </>
            )}

            {payout.status === "FLAGGED" && (
              <button
                onClick={() => {
                  onApprove(payout.id);
                  onClose();
                }}
                className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Override &amp; Release Payout</span>
              </button>
            )}

            {payout.status === "COMPLETED" && (
              <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Disbursed via Stripe Connect</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
