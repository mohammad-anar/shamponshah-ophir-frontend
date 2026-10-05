"use client";

import { useState } from "react";
import { Wallet, Clock, ShieldCheck, Download, ArrowUpRight, Building2, CheckCircle2 } from "lucide-react";
import WithdrawFundsDrawer from "@/components/vendor/WithdrawFundsDrawer";

const payoutHistory = [
  {
    id: "PAY-5512",
    date: "Sep 20, 2026",
    amount: "$750.00",
    destination: "Chase Bank (•••• 4812)",
    type: "Instant Payout",
    status: "SETTLED",
  },
  {
    id: "PAY-5508",
    date: "Sep 08, 2026",
    amount: "$1,050.00",
    destination: "Chase Bank (•••• 4812)",
    type: "Standard ACH",
    status: "SETTLED",
  },
];

export default function VendorEarningsPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      <WithdrawFundsDrawer
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableAmount="540.00"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">Earnings &amp; Wallet</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track cleared payouts, funds in escrow custody, and transfer directly to your bank account
          </p>
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start"
        >
          <Wallet className="w-4 h-4" /> Withdraw Funds ($540.00)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Available to Withdraw</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">$540.00</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Cleared for instant ACH transfer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Clearance</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">$360.00</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">⏳ Clears Sep 28, 2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Locked in Ophir Escrow</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">$1,150.00</span>
          </div>
          <p className="text-[11px] text-indigo-700 font-semibold mt-1">3 active milestone contracts</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 font-bold text-[#0F0C3B]">
          Payout Disbursement History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Payout ID &amp; Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payoutHistory.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B]">
                    #{p.id}
                    <span className="text-[10px] text-slate-400 font-normal block">{p.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0F0C3B]">{p.amount}</td>
                  <td className="py-3.5 px-4 text-slate-700">{p.destination}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.type}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
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
