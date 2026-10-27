"use client";

import { useState, useEffect } from "react";
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
import { useGetFeesReportsQuery } from "@/redux/service/admin/adminApi";


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
  const { data: apiFeesReports } = useGetFeesReportsQuery();
  const [transactions, setTransactions] = useState<FeeTransaction[]>(feeTransactionsList);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedTxn, setSelectedTxn] = useState<FeeTransaction | null>(null);

  useEffect(() => {
    const list = Array.isArray(apiFeesReports) ? apiFeesReports : (apiFeesReports as any)?.data;
    if (list && Array.isArray(list) && list.length > 0) {
      setTransactions(list);
    }
  }, [apiFeesReports]);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesFilter = activeFilter === "ALL" || txn.status === activeFilter;
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalGMV = transactions.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.grossAmount : 0), 0);
  const totalBuyerFees = transactions.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.buyerFee : 0), 0);
  const totalVendorCommissions = transactions.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.vendorCommission : 0), 0);
  const totalNetRevenue = transactions.reduce((acc, t) => acc + (t.status !== "REFUNDED" ? t.netPlatformRevenue : 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
            Platform Fees &amp; Financial Reports
          </h1>
          <p className="text-xs text-foreground-muted mt-1">
            Real-time reconciliation of 5% buyer platform fees, 10% vendor commissions, Stripe processing spreads, and net take-rate margins
          </p>
        </div>

        <button 
          onClick={() => toast.success("Complete platform financial ledger CSV exported.")}
          className="px-4 py-2 rounded-xl bg-[#16181F] hover:bg-[#1A1D24] border border-[#26282E] text-foreground text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start"
        >
          <Download className="w-3.5 h-3.5 text-[#DFB76C]" /> 
          <span>Export Financial Audit (.csv)</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Gross Escrow Volume (GMV)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-foreground font-mono">
              ${totalGMV.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-success bg-success-solid text-white/15 border border-success/30 px-1.5 py-0.2 rounded">+18%</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Total booked celebration contracts</p>
        </div>

        <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Buyer Platform Fees (5%)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#DFB76C] font-mono">
              ${totalBuyerFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-[#DFB76C] bg-[#1A1D24] border border-border-brand/40 px-1.5 py-0.2 rounded">5.0%</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Escrow protection &amp; client guarantee fee</p>
        </div>

        <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Vendor Commissions (10%)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-foreground font-mono">
              ${totalVendorCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-warning bg-warning-solid text-on-brand/15 border border-warning/30 px-1.5 py-0.2 rounded">10.0%</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Platform take-rate deducted on payout</p>
        </div>

        <div className="bg-[#16181F] border border-border-brand/40 text-foreground p-5 rounded-3xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#DFB76C] block">Net Platform Yield</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-success font-mono">
              ${totalNetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-foreground-secondary bg-[#1A1D24] border border-[#26282E] px-1.5 py-0.2 rounded">Net Margin</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">After Stripe payment gateway fees</p>
        </div>
      </div>

      {/* Financial Transactions & Fee Breakdown Table */}
      <div className="bg-[#121418] rounded-3xl border border-[#26282E] shadow-sm overflow-hidden text-xs">
        {/* Search & Status Filter Controls */}
        <div className="p-4 border-b border-[#26282E] flex items-center justify-between gap-4 flex-wrap bg-[#16181F]/40">
          <div className="flex items-center gap-2 flex-wrap">
            {["ALL", "SETTLED", "ESCROW_HOLD", "REFUNDED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all",
                  activeFilter === f 
                    ? "bg-[#DFB76C] text-[#0B0C0E] shadow-sm" 
                    : "bg-[#16181F] text-foreground-secondary hover:bg-[#1A1D24] border border-[#26282E]"
                )}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search TXNs, orders, buyers, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#16181F] border border-[#26282E] rounded-xl text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#16181F]/80 border-b border-[#26282E] text-[11px] font-bold uppercase text-foreground-muted tracking-wider">
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
            <tbody className="divide-y divide-[#26282E]/60">
              {filteredTransactions.map((txn) => (
                <tr 
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="hover:bg-[#16181F]/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground font-mono block">
                      #{txn.id}
                    </span>
                    <span className="text-[10px] text-foreground-muted font-mono">
                      Ref: #{txn.orderId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-foreground group-hover:text-[#DFB76C] line-clamp-1 transition-colors">
                      {txn.serviceTitle}
                    </p>
                    <span className="text-[10px] text-foreground-muted block">{txn.category}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-foreground-secondary">{txn.buyerName}</p>
                    <p className="text-[10px] text-foreground-muted line-clamp-1">To: {txn.vendorName}</p>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-foreground font-mono">
                    ${txn.grossAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#DFB76C] font-mono">
                    +${txn.buyerFee.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-warning font-mono">
                    +${txn.vendorCommission.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-black text-success font-mono">
                    ${txn.netPlatformRevenue.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                      txn.status === "SETTLED" && "bg-success-solid text-white/15 text-success border-success/30",
                      txn.status === "ESCROW_HOLD" && "bg-info-solid text-white/15 text-info border-info/30",
                      txn.status === "REFUNDED" && "bg-danger-solid text-white/15 text-danger border-danger/30",
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
                      className="px-3 py-1.5 bg-[#16181F] hover:bg-[#1A1D24] border border-[#26282E] text-foreground-secondary rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3 h-3 text-[#DFB76C]" /> Breakdown
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121418] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#26282E] animate-in fade-in flex flex-col text-xs text-foreground-secondary">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#16181F] border-b border-[#26282E] text-foreground flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#1A1D24] text-[#DFB76C] px-2.5 py-0.5 rounded-full border border-border-brand/40 uppercase">
                  Transaction Audit #{selectedTxn.id}
                </span>
                <h3 className="text-base font-black text-foreground mt-1">Fee &amp; Escrow Reconciliation</h3>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                className="w-8 h-8 rounded-full bg-[#1A1D24] hover:bg-[#222630] text-foreground-muted hover:text-foreground flex items-center justify-center transition-colors border border-[#26282E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Service Info */}
              <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-1">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">Service Listing</span>
                <h4 className="font-bold text-foreground text-sm">{selectedTxn.serviceTitle}</h4>
                <p className="text-foreground-muted text-xs">Category: {selectedTxn.category} &bull; Order: #{selectedTxn.orderId}</p>
              </div>

              {/* Counterparties */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-1">
                  <span className="text-[10px] font-bold text-foreground-muted uppercase block">Host (Buyer)</span>
                  <p className="font-bold text-foreground">{selectedTxn.buyerName}</p>
                  <p className="text-[10px] text-foreground-muted font-mono">{selectedTxn.buyerEmail}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-1">
                  <span className="text-[10px] font-bold text-foreground-muted uppercase block">Vendor (Vendor)</span>
                  <p className="font-bold text-foreground">{selectedTxn.vendorName}</p>
                  <p className="text-[10px] text-foreground-muted">Verified Stripe Connect</p>
                </div>
              </div>

              {/* Comprehensive Fee Math Waterfall */}
              <div className="p-4 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-2.5">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                  Waterfall Accounting Breakdown
                </span>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-foreground-secondary">
                    <span>Gross Booking Value:</span>
                    <span className="font-bold text-foreground">${selectedTxn.grossAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#DFB76C]">
                    <span>+ Buyer Platform Fee (5.0%):</span>
                    <span className="font-bold">+${selectedTxn.buyerFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-warning">
                    <span>+ Vendor Marketplace Fee (10.0%):</span>
                    <span className="font-bold">+${selectedTxn.vendorCommission.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-danger">
                    <span>- Stripe Gateway Cost (2.9% + 30¢):</span>
                    <span className="font-bold">-${selectedTxn.stripeCost.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-[#26282E] flex justify-between text-success font-black text-sm">
                    <span>= Net Platform Margin:</span>
                    <span>${selectedTxn.netPlatformRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Specs */}
              <div className="space-y-1 text-foreground-muted text-[11px] pt-1 border-t border-[#26282E]">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-foreground-secondary">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stripe Charge ID:</span>
                  <span className="font-mono text-[#DFB76C]">{selectedTxn.stripeChargeId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span>{selectedTxn.date}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#16181F] border-t border-[#26282E] flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2 bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] rounded-xl font-bold transition-colors"
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
