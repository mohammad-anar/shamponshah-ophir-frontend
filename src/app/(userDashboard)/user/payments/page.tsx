"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Lock, Download, CheckCircle2, ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const payments = [
  {
    id: "TX-90422",
    date: "Nov 02, 2026",
    description: "Deposit for Emma's 5th Birthday DJ (Windy City Sound)",
    amount: "$425.00",
    fee: "$21.25",
    total: "$446.25",
    method: "Visa ending in 4242",
    status: "VAULT_HELD",
  },
  {
    id: "TX-90418",
    date: "Oct 28, 2026",
    description: "Milestone 1 for Floral Balloon Arch (Bloom Studio)",
    amount: "$280.00",
    fee: "$14.00",
    total: "$294.00",
    method: "Visa ending in 4242",
    status: "VAULT_HELD",
  },
  {
    id: "TX-90390",
    date: "Oct 15, 2026",
    description: "Full Payment for Anniversary Photo Album (Amina Rahman)",
    amount: "$650.00",
    fee: "$32.50",
    total: "$682.50",
    method: "Mastercard ending in 8819",
    status: "RELEASED_TO_VENDOR",
  },
];

export default function UserPaymentsPage() {
  const handleDownloadInvoice = (id: string) => {
    toast.success(`Invoice ${id} downloaded.`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">Payments &amp; Escrow Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your active escrow custody deposits, billing receipts, and payment methods
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5 self-start">
          <Plus className="w-3.5 h-3.5 text-brand-primary" /> Add Payment Method
        </button>
      </div>

      {/* Escrow Custody Banner */}
      <div className="bg-[#18124E] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-white">
            <Lock className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
              Active Custody Balance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold">$1,480.00</span>
              <span className="text-xs text-emerald-300 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                100% Protected
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              Funds are held safely in escrow and only released after your explicit milestone approval.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-white text-[#0F0C3B] font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm">
          Download Statement (.pdf)
        </button>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 font-bold text-[#0F0C3B]">
          Payment &amp; Escrow History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Transaction ID &amp; Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Total Charged</th>
                <th className="py-3 px-4">Escrow Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B]">
                    #{tx.id}
                    <span className="text-[10px] text-slate-400 font-normal block">{tx.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{tx.description}</td>
                  <td className="py-3.5 px-4 text-slate-600">{tx.method}</td>
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B]">{tx.total}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      tx.status === "VAULT_HELD" && "bg-amber-100 text-amber-900 border border-amber-200",
                      tx.status === "RELEASED_TO_VENDOR" && "bg-emerald-100 text-emerald-900 border border-emerald-200",
                    )}>
                      {tx.status === "VAULT_HELD" ? "In Escrow Custody" : "Released to Vendor"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(tx.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
