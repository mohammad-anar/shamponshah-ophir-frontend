"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  DollarSign,
  Scale,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AdminEscrowReleaseModal from "@/components/admin/AdminEscrowReleaseModal";

const initialOrders = [
  {
    id: "ord-1",
    orderNumber: "JB-20455",
    occasion: "Emma's 5th Birthday Gala",
    clientName: "Emily Carter",
    clientEmail: "emily.carter@gmail.com",
    vendorName: "Windy City Sound",
    vendorStripeAccountId: "acct_1NZDJ88219",
    stripePaymentIntentId: "pi_3N9xDJ8821980",
    service: "DJ & Live MC (4 Hours)",
    totalAmount: 850,
    escrowLockedAmount: 850,
    escrowStatus: "LOCKED_IN_CUSTODY",
    milestone: "Milestone 3 of 5 (Event Day)",
    date: "Nov 14, 2026",
    protection: "100% Vault Protected",
    status: "Active",
  },
  {
    id: "ord-2",
    orderNumber: "JB-20448",
    occasion: "Golden Hour Wedding",
    clientName: "Sarah Jenkins",
    clientEmail: "sarah.jenkins@gmail.com",
    vendorName: "Amina Rahman Visuals",
    vendorStripeAccountId: "acct_1NZPhoto7721",
    stripePaymentIntentId: "pi_3N9xPhoto77210",
    service: "Full-Day 4K Cinema & Drone",
    totalAmount: 1850,
    escrowLockedAmount: 925,
    escrowStatus: "MILESTONE_RELEASED",
    milestone: "Milestone 4 of 5 (Post-Production)",
    date: "Nov 20, 2026",
    protection: "100% Vault Protected",
    status: "In Progress",
  },
  {
    id: "ord-3",
    orderNumber: "JB-20432",
    occasion: "Adams Silver Anniversary",
    clientName: "David Vance",
    clientEmail: "david.vance@gmail.com",
    vendorName: "Bloom & Petal Studio",
    vendorStripeAccountId: "acct_1NZFloral331",
    stripePaymentIntentId: "pi_3N9xFloral3310",
    service: "Custom Floral Arches & Centerpieces",
    totalAmount: 1200,
    escrowLockedAmount: 0,
    escrowStatus: "COMPLETED",
    milestone: "All Milestones Completed",
    date: "Nov 02, 2026",
    protection: "Disbursed",
    status: "Completed",
  },
  {
    id: "ord-4",
    orderNumber: "JB-20419",
    occasion: "TechForward Annual Gala",
    clientName: "Marcus Sterling",
    clientEmail: "marcus.sterling@apex.com",
    vendorName: "Epicurean Bites Catering",
    vendorStripeAccountId: "acct_1NZCatering90",
    stripePaymentIntentId: "pi_3N9xCatering900",
    service: "Plated 3-Course Dinner (120 Guests)",
    totalAmount: 4500,
    escrowLockedAmount: 4500,
    escrowStatus: "LOCKED_IN_CUSTODY",
    milestone: "Milestone 1 of 4 (Deposit Confirmed)",
    date: "Dec 05, 2026",
    protection: "100% Vault Protected",
    status: "Active",
  },
];

export default function AdminOrdersEscrowPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedOrderForEscrow, setSelectedOrderForEscrow] = useState<any | null>(null);

  const handleActionComplete = (actionType: string, details: any) => {
    setOrders(orders.map((o) => {
      if (o.id === details.orderId) {
        return {
          ...o,
          escrowLockedAmount: actionType === "release" ? 0 : actionType === "full_refund" ? 0 : o.escrowLockedAmount - details.clientRefundDollar - details.vendorPayoutDollar,
          escrowStatus: actionType === "release" ? "COMPLETED" : actionType === "full_refund" ? "REFUNDED" : "SPLIT_SETTLED",
        };
      }
      return o;
    }));
  };

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase()) ||
    o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    o.occasion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Orders &amp; Escrow Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
              Stripe Connect Vault Custody
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time custody tracking, milestone schedules, manual Stripe Connect payouts, and partial refund arbitration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success("Immutable Escrow Custody Ledger exported to CSV")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" />
            <span>Export Custody Ledger</span>
          </button>
        </div>
      </div>

      {/* Escrow Liquidity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total in Escrow Custody</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">$38,900.00</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">100% Backed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 42 active milestone contracts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestones Released (30d)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">$148,250.00</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">118 Milestones</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Stripe Connect ACH disbursements</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-xs bg-rose-50/20 space-y-1">
          <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider">Dispute Holdback Pool</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-700 font-mono">$4,850.00</span>
            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">4 Orders Frozen</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Subject to ongoing arbitration</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-[#F8F9FD]/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by order ID, client, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <span>Stripe Webhook Gateway:</span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              200 OK Live
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#EDE9FE]/40 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID &amp; Event</th>
                <th className="py-3.5 px-4">Client &amp; Vendor</th>
                <th className="py-3.5 px-4 font-mono">Escrow Locked</th>
                <th className="py-3.5 px-4">Milestone Progress</th>
                <th className="py-3.5 px-4">Custody Status</th>
                <th className="py-3.5 px-4 text-right">Stripe Escrow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0F0C3B] font-mono block">#{ord.orderNumber}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ord.occasion}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{ord.clientName}</span>
                    <p className="text-[11px] text-brand-primary font-medium">{ord.vendorName}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-[#0F0C3B] text-sm">
                    ${ord.escrowLockedAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 font-medium block">{ord.milestone}</span>
                    <p className="text-[10px] text-slate-400">Target: {ord.date}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      ord.escrowStatus === "LOCKED_IN_CUSTODY" && "bg-amber-100 text-amber-800 border border-amber-200",
                      ord.escrowStatus === "MILESTONE_RELEASED" && "bg-indigo-100 text-indigo-800 border border-indigo-200",
                      ord.escrowStatus === "COMPLETED" && "bg-emerald-100 text-emerald-800 border border-emerald-200",
                      ord.escrowStatus === "REFUNDED" && "bg-rose-100 text-rose-800 border border-rose-200",
                    )}>
                      <Lock className="w-2.5 h-2.5" />
                      {ord.escrowStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderForEscrow(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0F0C3B] hover:bg-indigo-900 text-white font-bold text-xs transition-all shadow-2xs inline-flex items-center gap-1.5 ml-auto"
                    >
                      <Scale className="w-3.5 h-3.5 text-amber-300" />
                      <span>Manage Escrow</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Escrow Release & Refund Modal */}
      {selectedOrderForEscrow && (
        <AdminEscrowReleaseModal
          isOpen={!!selectedOrderForEscrow}
          onClose={() => setSelectedOrderForEscrow(null)}
          order={selectedOrderForEscrow}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
}
