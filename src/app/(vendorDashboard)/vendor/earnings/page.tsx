"use client";

import { useState } from "react";
import { Wallet, Clock, ShieldCheck, Download, ArrowUpRight, Building2, CheckCircle2, Loader2 } from "lucide-react";
import WithdrawFundsDrawer from "@/components/vendor/WithdrawFundsDrawer";
import { useGetVendorEarningsQuery } from "@/redux/service/payments/paymentsApi";

export default function VendorEarningsPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const { data: earningsData } = useGetVendorEarningsQuery();

  const earnings = earningsData?.data || earningsData || {};
  const available = Number(earnings.availableBalance || 0).toFixed(2);
  const pending = Number(earnings.pendingBalance || 0).toFixed(2);
  const escrow = Number(earnings.escrowBalance || 0).toFixed(2);
  const transferred = Number(earnings.transferredBalance || 0).toFixed(2);

  const payouts = Array.isArray(earnings.payoutHistory) ? earnings.payoutHistory : [];
  const upcomingReleases = Array.isArray(earnings.upcomingReleases) ? earnings.upcomingReleases : [];
  const milestoneHistory = Array.isArray(earnings.earnings) ? earnings.earnings : [];

  return (
    <div className="space-y-6 pb-12">
      <WithdrawFundsDrawer
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableAmount={available}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">Earnings &amp; Wallet</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track milestone release status, Stripe Connect balance, refunds, and bank payouts
          </p>
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Wallet className="w-4 h-4 text-amber-300" /> Withdraw Funds (${available})
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Stripe balance available for payout</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">${available}</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Available in your connected Stripe account</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Waiting 7-day release</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">${pending}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Client-approved milestones scheduled for transfer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Paid milestones in progress</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">${escrow}</span>
          </div>
          <p className="text-[11px] text-indigo-700 font-semibold mt-1">Client-funded; delivery not yet approved</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Transferred to Stripe account</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0F0C3B]">${transferred}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Bank payout is a separate Stripe step</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 font-bold text-[#0F0C3B]">Scheduled milestone releases</div>
        {upcomingReleases.length ? (
          <div className="divide-y divide-slate-100">
            {upcomingReleases.map((release: any) => (
              <div key={release.milestoneId} className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0F0C3B]">{release.label} · Order #{release.orderNumber}</p>
                  <p className="text-slate-500 mt-1">Approved {release.approvedAt ? new Date(release.approvedAt).toLocaleDateString() : ""}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#0F0C3B]">${Number(release.amount).toFixed(2)}</p>
                  <p className="text-slate-500 mt-1">Transfer {release.releaseAt ? new Date(release.releaseAt).toLocaleString() : "pending"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="p-4 text-slate-500">No approved milestones are waiting for release.</p>}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 font-bold text-[#0F0C3B]">Milestone earnings and adjustments</div>
        {milestoneHistory.length ? (
          <div className="divide-y divide-slate-100">
            {milestoneHistory.map((entry: any) => (
              <div key={entry.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0F0C3B]">Order {entry.orderNumber ? `#${entry.orderNumber}` : "adjustment"}</p>
                  <p className="text-slate-500 mt-1">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#0F0C3B]">${Number(entry.amount).toFixed(2)}</p>
                  <p className="text-slate-500 mt-1 capitalize">{String(entry.status).replaceAll("_", " ")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="p-4 text-slate-500">Milestone activity will appear here after the first order payment.</p>}
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
              {payouts.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B]">
                    #{p.id}
                    <span className="text-[10px] text-slate-400 font-normal block">{p.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0F0C3B]">{p.amount}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{p.destination}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.type}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.status === "SUCCEEDED" ? "bg-emerald-100 text-emerald-900 border border-emerald-200" : p.status === "FAILED" ? "bg-rose-100 text-rose-900 border border-rose-200" : "bg-amber-100 text-amber-900 border border-amber-200"}`}>
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
