"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Layers,
  ArrowDownLeft,
  Calendar,
  Filter,
  DollarSign,
  Sparkles,
} from "lucide-react";
import WithdrawFundsDrawer from "@/components/vendor/WithdrawFundsDrawer";
import { useGetVendorWalletQuery } from "@/redux/service/payments/paymentsApi";

export default function VendorEarningsPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: walletData, isLoading, refetch } = useGetVendorWalletQuery(undefined, {
    pollingInterval: 30000,
  });

  const wallet = walletData || {
    pendingAmount: 0,
    pendingForReleaseAmount: 0,
    availableAmount: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    ledgerEntries: [],
  };

  const pendingFormatted = Number(wallet.pendingAmount || 0).toFixed(2);
  const pendingForReleaseFormatted = Number(wallet.pendingForReleaseAmount || 0).toFixed(2);
  const availableFormatted = Number(wallet.availableAmount || 0).toFixed(2);
  const totalEarnedFormatted = Number(wallet.totalEarned || 0).toFixed(2);
  const totalWithdrawnFormatted = Number(wallet.totalWithdrawn || 0).toFixed(2);

  const ledgerEntries = useMemo(() => {
    return Array.isArray(wallet.ledgerEntries) ? wallet.ledgerEntries : [];
  }, [wallet.ledgerEntries]);

  // Filtered Ledger entries
  const filteredLedger = useMemo(() => {
    return ledgerEntries.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        item.status === statusFilter ||
        (statusFilter === "CLEARING" && item.status === "CLEARING") ||
        (statusFilter === "PENDING" && item.status === "PENDING") ||
        (statusFilter === "AVAILABLE" && item.status === "AVAILABLE");

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.orderNumber?.toLowerCase().includes(query) ||
        item.orderId?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [ledgerEntries, statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Lock className="w-2.5 h-2.5" /> Pending (Active Order)
          </span>
        );
      case "CLEARING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-2.5 h-2.5" /> 7-Day Clearing
          </span>
        );
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-2.5 h-2.5" /> Available to Withdraw
          </span>
        );
      case "WITHDRAWN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ArrowUpRight className="w-2.5 h-2.5" /> Withdrawn to Bank
          </span>
        );
      case "CANCELLED":
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle className="w-2.5 h-2.5" /> Refunded / Reversible
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getClearingCountdown = (clearingEndsAt?: string | null, status?: string) => {
    if (status === "AVAILABLE") return <span className="text-emerald-400 font-semibold">Cleared</span>;
    if (status !== "CLEARING" || !clearingEndsAt) return <span className="text-slate-500">—</span>;

    const diffMs = new Date(clearingEndsAt).getTime() - Date.now();
    if (diffMs <= 0) return <span className="text-emerald-400 font-semibold">Ready to Clear</span>;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (
      <span className="text-amber-300 font-mono font-medium">
        {days > 0 ? `${days}d ` : ""}{hours}h remaining
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100">
      <WithdrawFundsDrawer
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableAmount={availableFormatted}
      />

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0d0c1e] via-[#14122d] to-[#0d0c1e] border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
              Stripe Connect Vault
            </span>
            <span className="text-xs text-slate-400">Separate Charges &amp; Transfers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Vendor Wallet &amp; Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time balance separation enforcing active escrow locks, client delivery 7-day clearing countdowns, and cleared payouts.
          </p>
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          disabled={Number(wallet.availableAmount || 0) <= 0}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Wallet className="w-4 h-4" /> Withdraw Funds (${availableFormatted})
        </button>
      </div>

      {/* ── 3 DISTINCT WALLET AMOUNT CARDS ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Pending (Order চলছে) */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-[#110f24] border border-indigo-500/30 shadow-xl group hover:border-indigo-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 1. Pending Balance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Active Orders
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              ${pendingFormatted}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Funds deposited by clients and locked in platform escrow while order work is active and in progress.
          </p>
        </div>

        {/* 2. Pending for Release (7-Day Clearing) */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-[#110f24] border border-amber-500/30 shadow-xl group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 2. Pending for Release
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              7-Day Clearing
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              ${pendingForReleaseFormatted}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Delivery accepted by client. Funds are undergoing the mandatory 7-day security clearance before payout.
          </p>
        </div>

        {/* 3. Available (Withdraw-যোগ্য) */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-[#110f24] border border-emerald-500/30 shadow-xl group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3. Available Balance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Withdrawable
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
              ${availableFormatted}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Fully cleared funds. Can be withdrawn immediately to your connected Stripe bank account or debit card.
          </p>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#131127] border border-white/10 text-xs">
          <span className="text-slate-400 block font-medium">Total Lifetime Earned</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">${totalEarnedFormatted}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131127] border border-white/10 text-xs">
          <span className="text-slate-400 block font-medium">Total Withdrawn</span>
          <span className="text-lg font-bold text-slate-300 font-mono mt-1 block">${totalWithdrawnFormatted}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131127] border border-white/10 text-xs">
          <span className="text-slate-400 block font-medium">Platform Fee Rate</span>
          <span className="text-lg font-bold text-amber-400 mt-1 block">15%</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131127] border border-white/10 text-xs">
          <span className="text-slate-400 block font-medium">Vendor Net Allocation</span>
          <span className="text-lg font-bold text-emerald-400 mt-1 block">85% Guaranteed</span>
        </div>
      </div>

      {/* ── TRANSACTION LEDGER HISTORY TABLE ─────────────────────── */}
      <div className="rounded-2xl bg-[#0f0e21] border border-white/10 shadow-2xl overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Transaction Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive audit trail of each order, gross charge, 15% fee, 85% vendor net, and clearance status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#181533] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44"
              />
            </div>

            <div className="flex items-center rounded-xl bg-[#181533] p-1 border border-white/10 text-xs">
              {(["ALL", "PENDING", "CLEARING", "AVAILABLE"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === filter
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {filter === "ALL" ? "All" : filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
            <span>Loading ledger entries...</span>
          </div>
        ) : filteredLedger.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Layers className="w-8 h-8 mx-auto text-slate-600" />
            <p className="font-semibold text-slate-400">No transaction ledger records found</p>
            <p className="text-[11px]">When orders are funded or cleared, transaction ledger entries will be recorded here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#14122d] text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Date &amp; Time</th>
                  <th className="py-3 px-4 font-semibold">Order #</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-right">Gross Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">Platform Fee (15%)</th>
                  <th className="py-3 px-4 font-semibold text-right">Vendor Net (85%)</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Clearing Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredLedger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleDateString()}{" "}
                      <span className="text-[10px] text-slate-500">
                        {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {entry.orderNumber ? (
                        <span className="font-mono font-bold text-amber-400">
                          #{entry.orderNumber}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                      {entry.description || "Escrow hold"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 whitespace-nowrap">
                      ${Number(entry.gross || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 whitespace-nowrap">
                      -${Number(entry.platformFee || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                      ${Number(entry.vendorNet || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap text-[11px]">
                      {getClearingCountdown(entry.clearingEndsAt, entry.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
