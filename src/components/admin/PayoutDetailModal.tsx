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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 text-foreground">
      <div className="bg-[#121418] rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-[#26282E] animate-in fade-in flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#16181F] border-b border-[#26282E] text-foreground flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#1A1D24] text-[#DFB76C] px-2.5 py-0.5 rounded-full border border-border-brand/40">
                #{payout.id}
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                payout.status === "COMPLETED" && "bg-success-soft text-success text-emerald-300 border border-emerald-800/40",
                payout.status === "SCHEDULED" && "bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40",
                payout.status === "PROCESSING" && "bg-info-soft text-info text-indigo-300 border border-indigo-800/40",
                payout.status === "FLAGGED" && "bg-danger-soft text-danger text-rose-300 border border-rose-800/40",
              )}>
                {payout.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Stripe Connect Disbursement Batch
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A1D24] hover:bg-[#26282E] text-foreground-muted hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
          
          {/* Summary Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E]">
              <span className="text-foreground-muted text-[10px] uppercase font-bold block">Gross Milestone Total</span>
              <span className="text-lg font-black text-foreground font-mono mt-1 block">
                ${payout.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-foreground-muted">{payout.orders.length} Completed Orders</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E]">
              <span className="text-foreground-muted text-[10px] uppercase font-bold block">Platform Fee Retained</span>
              <span className="text-lg font-black text-danger font-mono mt-1 block">
                -${payout.platformFeeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-foreground-muted">10% Platform Commission</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-border-brand/40">
              <span className="text-[#DFB76C] text-[10px] uppercase font-bold block">Net Stripe ACH Payout</span>
              <span className="text-xl font-black text-[#DFB76C] font-mono mt-1 block">
                ${payout.netDisbursement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-foreground-secondary font-semibold">Direct Deposit to Bank</span>
            </div>
          </div>

          {/* Vendor Personal & Financial Details */}
          <div className="bg-[#16181F] rounded-2xl border border-[#26282E] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#DFB76C]" /> Vendor Profile &amp; Banking Specs
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-soft text-success text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-success" />
                {payout.vendor.kycStatus.replace(/_/g, " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Personal / Business Contact Info */}
              <div className="space-y-2 bg-[#121418] p-3.5 rounded-xl border border-[#26282E]">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                  Identity &amp; Legal Entity
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-foreground text-sm">{payout.vendor.legalName}</p>
                  <p className="text-foreground-secondary font-semibold">{payout.vendor.businessName}</p>
                </div>
                <div className="pt-2 border-t border-[#26282E] space-y-1 text-foreground-muted text-[11px]">
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-foreground-muted" /> {payout.vendor.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-foreground-muted" /> {payout.vendor.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-foreground-muted" /> {payout.vendor.address}
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[10px] text-foreground-muted">
                    <FileText className="w-3.5 h-3.5 text-foreground-muted" /> Tax ID: {payout.vendor.taxId}
                  </p>
                </div>
              </div>

              {/* Stripe Connect & Bank specs */}
              <div className="space-y-2 bg-[#121418] p-3.5 rounded-xl border border-[#26282E]">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                  Stripe ACH Direct Deposit Target
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#DFB76C]" />
                    {payout.vendor.bankName}
                  </p>
                  <p className="text-foreground-muted font-mono text-xs">
                    Account ending in <strong className="text-foreground">•••• {payout.vendor.accountLast4}</strong> ({payout.vendor.accountType})
                  </p>
                </div>
                <div className="pt-2 border-t border-[#26282E] space-y-1 text-foreground-muted text-[11px]">
                  <p className="font-mono text-[10px]">
                    Routing: <strong className="text-foreground-secondary">{payout.vendor.routingNumber}</strong>
                  </p>
                  <p className="font-mono text-[10px]">
                    Stripe Acct: <span className="text-[#DFB76C] font-bold">{payout.vendor.stripeConnectId}</span>
                  </p>
                  <p className="text-[10px] text-foreground-muted">
                    Compliance Risk Score: <strong className="text-success">{payout.vendor.riskScore} (Low Risk)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aggregated Orders in this Batch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#DFB76C]" /> Itemized Orders Included in Batch ({payout.orders.length})
              </h3>
              <span className="text-[11px] text-foreground-muted">All milestones verified &amp; approved</span>
            </div>

            <div className="bg-[#121418] rounded-2xl border border-[#26282E] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#16181F] border-b border-[#26282E] text-[10px] font-bold uppercase text-foreground-muted">
                  <tr>
                    <th className="py-2.5 px-3">Order &amp; Service</th>
                    <th className="py-2.5 px-3">Host (Buyer)</th>
                    <th className="py-2.5 px-3">Event Date</th>
                    <th className="py-2.5 px-3 font-mono">Gross</th>
                    <th className="py-2.5 px-3 font-mono">Platform (10%)</th>
                    <th className="py-2.5 px-3 font-mono text-right">Net Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26282E] text-[11px]">
                  {payout.orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-[#16181F]">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-foreground block">{order.serviceTitle}</span>
                        <span className="text-[10px] text-foreground-muted font-mono">#{order.orderId}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground-secondary">{order.clientName}</td>
                      <td className="py-2.5 px-3 text-foreground-muted">{order.eventDate}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-foreground-secondary">${order.grossAmount}</td>
                      <td className="py-2.5 px-3 font-mono text-danger">-${order.platformFee}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-[#DFB76C] text-right">${order.netPayout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disbursement Audit Trail */}
          <div className="p-4 bg-[#16181F] rounded-2xl border border-[#26282E] space-y-2">
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
              Settlement &amp; Audit Trail
            </span>
            <div className="space-y-1.5">
              {payout.auditLog.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-[11px] text-foreground-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-foreground-muted" />
                    <span>{log.action}</span>
                  </span>
                  <span className="text-foreground-muted text-[10px] font-mono">{log.timestamp} &bull; {log.actor}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-4 sm:p-5 border-t border-[#26282E] bg-[#121418] flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
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
                  className="px-3.5 py-2.5 bg-danger-soft text-danger hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                  <span>Flag / Hold Batch</span>
                </button>

                <button
                  onClick={() => {
                    onApprove(payout.id);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0B0C0E]" />
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
                className="px-5 py-2.5 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#0B0C0E]" />
                <span>Override &amp; Release Payout</span>
              </button>
            )}

            {payout.status === "COMPLETED" && (
              <div className="px-4 py-2 bg-success-soft text-success text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Disbursed via Stripe Connect</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
