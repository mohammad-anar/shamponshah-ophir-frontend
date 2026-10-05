"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileBarChart, 
  Download, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  ArrowUpRight, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Percent, 
  Layers,
  X,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeeTransaction {
  id: string;
  orderId: string;
  serviceTitle: string;
  category: string;
  buyerName: string;
  buyerEmail: string;
  vendorName: string;
  date: string;
  grossAmount: number;
  buyerFee: number; // 5%
  vendorCommission: number; // 10%
  stripeCost: number; // ~2.9% + $0.30
  netPlatformRevenue: number;
  status: "SETTLED" | "ESCROW_HOLD" | "REFUNDED";
  paymentMethod: string;
  stripeChargeId: string;
}

const feeTransactionsList: FeeTransaction[] = [
  {
    id: "TXN-7741",
    orderId: "ORD-8421",
    serviceTitle: "Essential Party Set (Kids 5th Birthday)",
    category: "DJs & Emcees",
    buyerName: "Emily Carter",
    buyerEmail: "emily.carter@example.com",
    vendorName: "Party Pulse Events (Marcus Reed)",
    date: "Oct 05, 2026 14:32",
    grossAmount: 400.00,
    buyerFee: 20.00, // 5%
    vendorCommission: 40.00, // 10%
    stripeCost: 11.90, // 2.9% + 0.30
    netPlatformRevenue: 48.10,
    status: "SETTLED",
    paymentMethod: "Visa •••• 4242",
    stripeChargeId: "ch_3Nsk92Kx09LmQ4",
  },
  {
    id: "TXN-7740",
    orderId: "ORD-8415",
    serviceTitle: "Full-Day 4K Cinema & Drone Coverage",
    category: "Photography & Film",
    buyerName: "David Miller",
    buyerEmail: "david.miller@example.com",
    vendorName: "Amina Rahman Visuals",
    date: "Oct 04, 2026 19:15",
    grossAmount: 2055.00,
    buyerFee: 102.75, // 5%
    vendorCommission: 205.50, // 10%
    stripeCost: 59.90,
    netPlatformRevenue: 248.35,
    status: "ESCROW_HOLD",
    paymentMethod: "Mastercard •••• 8821",
    stripeChargeId: "ch_3Mpw84Jx11PnK8",
  },
  {
    id: "TXN-7739",
    orderId: "ORD-8399",
    serviceTitle: "Full Wedding Master Audio Suite & Emcee",
    category: "DJs & Emcees",
    buyerName: "Grace Carter",
    buyerEmail: "grace.carter@example.com",
    vendorName: "Windy City Sound LLC",
    date: "Oct 03, 2026 11:20",
    grossAmount: 1500.00,
    buyerFee: 75.00, // 5%
    vendorCommission: 150.00, // 10%
    stripeCost: 43.80,
    netPlatformRevenue: 181.20,
    status: "SETTLED",
    paymentMethod: "Amex •••• 1005",
    stripeChargeId: "ch_3Klq32Px88QwR2",
  },
  {
    id: "TXN-7738",
    orderId: "ORD-8380",
    serviceTitle: "Organic Balloon Garland & Backdrop Setup",
    category: "Decor & Styling",
    buyerName: "Sarah Jenkins",
    buyerEmail: "sarah.jenkins@example.com",
    vendorName: "Bloom Studio Chicago",
    date: "Oct 02, 2026 16:45",
    grossAmount: 650.00,
    buyerFee: 32.50, // 5%
    vendorCommission: 65.00, // 10%
    stripeCost: 19.15,
    netPlatformRevenue: 78.35,
    status: "SETTLED",
    paymentMethod: "Visa •••• 9912",
    stripeChargeId: "ch_3Hjr77Bx99ZzK1",
  },
  {
    id: "TXN-7737",
    orderId: "ORD-8370",
    serviceTitle: "Custom 3-Tier Fondant Sculpted Milestone Cake",
    category: "Bakery & Desserts",
    buyerName: "Marcus Vance",
    buyerEmail: "marcus.vance@example.com",
    vendorName: "Chef Marcus (Sweet Delights)",
    date: "Sep 29, 2026 10:10",
    grossAmount: 450.00,
    buyerFee: 22.50, // 5%
    vendorCommission: 45.00, // 10%
    stripeCost: 13.35,
    netPlatformRevenue: 54.15,
    status: "SETTLED",
    paymentMethod: "Apple Pay (Visa •••• 2011)",
    stripeChargeId: "ch_3Gtx11Zx44KkL9",
  },
  {
    id: "TXN-7736",
    orderId: "ORD-8362",
    serviceTitle: "Cocktail Hour Acoustic Duo Performance",
    category: "Music & Entertainment",
    buyerName: "Jessica Davis",
    buyerEmail: "jessica.davis@example.com",
    vendorName: "String & Harmony Duet",
    date: "Sep 26, 2026 13:00",
    grossAmount: 500.00,
    buyerFee: 25.00,
    vendorCommission: 50.00,
    stripeCost: 14.80,
    netPlatformRevenue: 60.20,
    status: "REFUNDED",
    paymentMethod: "Visa •••• 5514",
    stripeChargeId: "ch_3Fxq99Kx22YyZ0",
  },
];

export default function AdminFeesReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedTxn, setSelectedTxn] = useState<FeeTransaction | null>(null);

  const filteredTransactions = feeTransactionsList.filter((txn) => {
    const matchesFilter = activeFilter === "ALL" || txn.status === activeFilter;
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalGMV = feeTransactionsList.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.grossAmount : 0), 0);
  const totalBuyerFees = feeTransactionsList.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.buyerFee : 0), 0);
  const totalVendorCommissions = feeTransactionsList.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.vendorCommission : 0), 0);
  const totalNetRevenue = feeTransactionsList.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.netPlatformRevenue : 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
            Platform Fees &amp; Financial Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reconciliation of 5% buyer platform fees, 10% vendor commissions, Stripe processing spreads, and net take-rate margins
          </p>
        </div>

        <button 
          onClick={() => toast.success("Complete platform financial ledger CSV exported.")}
          className="px-4 py-2 rounded-xl bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" /> 
          <span>Export Financial Audit (.csv)</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Escrow Volume (GMV)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">
              ${totalGMV.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">+18%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total booked celebration contracts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Buyer Platform Fees (5%)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-brand-primary font-mono">
              ${totalBuyerFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">5.0%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Escrow protection &amp; client guarantee fee</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Vendor Commissions (10%)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">
              ${totalVendorCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">10.0%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Platform take-rate deducted on payout</p>
        </div>

        <div className="bg-gradient-to-br from-[#0F0C3B] to-[#1E175E] text-white p-5 rounded-3xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Net Platform Yield</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ${totalNetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-white/80 bg-white/10 px-1.5 py-0.2 rounded">Net Margin</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">After Stripe payment gateway fees</p>
        </div>
      </div>

      {/* Financial Transactions & Fee Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        {/* Search & Status Filter Controls */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-[#F8F9FD]/50">
          <div className="flex items-center gap-2">
            {["ALL", "SETTLED", "ESCROW_HOLD", "REFUNDED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                  activeFilter === f 
                    ? "bg-[#0F0C3B] text-white shadow-xs" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                )}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search TXNs, orders, buyers, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#EDE9FE]/40 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Transaction &amp; Order</th>
                <th className="py-3.5 px-4">Service &amp; Category</th>
                <th className="py-3.5 px-4">Buyer &amp; Vendor</th>
                <th className="py-3.5 px-4 font-mono">Gross Amount</th>
                <th className="py-3.5 px-4 font-mono">Buyer Fee (5%)</th>
                <th className="py-3.5 px-4 font-mono">Vendor Fee (10%)</th>
                <th className="py-3.5 px-4 font-mono">Net Yield</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr 
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0F0C3B] font-mono block">
                      #{txn.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: #{txn.orderId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-[#0F0C3B] group-hover:text-brand-primary line-clamp-1 transition-colors">
                      {txn.serviceTitle}
                    </p>
                    <span className="text-[10px] text-slate-400 block">{txn.category}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{txn.buyerName}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">To: {txn.vendorName}</p>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B] font-mono">
                    ${txn.grossAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-brand-primary font-mono">
                    +${txn.buyerFee.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-amber-700 font-mono">
                    +${txn.vendorCommission.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-black text-emerald-700 font-mono">
                    ${txn.netPlatformRevenue.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block",
                      txn.status === "SETTLED" && "bg-emerald-100 text-emerald-800 border border-emerald-200",
                      txn.status === "ESCROW_HOLD" && "bg-indigo-100 text-indigo-800 border border-indigo-200",
                      txn.status === "REFUNDED" && "bg-rose-100 text-rose-800 border border-rose-200",
                    )}>
                      {txn.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTxn(txn);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3 text-brand-primary" /> Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Transaction Breakdown Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in flex flex-col text-xs">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0F0C3B] to-[#1E175E] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 uppercase">
                  Transaction Audit #{selectedTxn.id}
                </span>
                <h3 className="text-base font-black text-white mt-1">Fee &amp; Escrow Reconciliation</h3>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Service Info */}
              <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Listing</span>
                <h4 className="font-bold text-[#0F0C3B] text-sm">{selectedTxn.serviceTitle}</h4>
                <p className="text-slate-500 text-xs">Category: {selectedTxn.category} &bull; Order: #{selectedTxn.orderId}</p>
              </div>

              {/* Counterparties */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Host (Buyer)</span>
                  <p className="font-bold text-[#0F0C3B]">{selectedTxn.buyerName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{selectedTxn.buyerEmail}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Vendor (Artisan)</span>
                  <p className="font-bold text-[#0F0C3B]">{selectedTxn.vendorName}</p>
                  <p className="text-[10px] text-slate-500">Verified Stripe Connect</p>
                </div>
              </div>

              {/* Comprehensive Fee Math Waterfall */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Waterfall Accounting Breakdown
                </span>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Gross Booking Value:</span>
                    <span className="font-bold">${selectedTxn.grossAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-brand-primary">
                    <span>+ Buyer Platform Fee (5.0%):</span>
                    <span className="font-bold">+${selectedTxn.buyerFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-amber-700">
                    <span>+ Vendor Marketplace Fee (10.0%):</span>
                    <span className="font-bold">+${selectedTxn.vendorCommission.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-rose-600">
                    <span>- Stripe Gateway Cost (2.9% + 30¢):</span>
                    <span className="font-bold">-${selectedTxn.stripeCost.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-emerald-700 font-black text-sm">
                    <span>= Net Platform Margin:</span>
                    <span>${selectedTxn.netPlatformRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Specs */}
              <div className="space-y-1 text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-slate-700">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stripe Charge ID:</span>
                  <span className="font-mono text-indigo-700">{selectedTxn.stripeChargeId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span>{selectedTxn.date}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold transition-colors"
              >
                Close Breakdown
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
