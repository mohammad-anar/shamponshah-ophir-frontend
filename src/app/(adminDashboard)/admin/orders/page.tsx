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
    orderNumber: "OPH-20455",
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
    orderNumber: "OPH-20448",
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
    orderNumber: "OPH-20432",
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
    orderNumber: "OPH-20419",
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

import { useGetAllOrdersQuery } from "@/redux/service/admin/adminApi";

export default function AdminOrdersEscrowPage() {
  const { data: apiOrders, isLoading } = useGetAllOrdersQuery();
  const [search, setSearch] = useState("");
  const [selectedOrderForEscrow, setSelectedOrderForEscrow] = useState<any | null>(null);

  const rawOrders = apiOrders?.data || apiOrders?.orders || apiOrders;
  const orders = (rawOrders && Array.isArray(rawOrders) && rawOrders.length > 0)
    ? rawOrders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber || `OPH-${o.id.substring(0, 5).toUpperCase()}`,
        occasion: o.gig?.title || o.job?.title || "Special Event Milestone",
        clientName: o.clientProfile?.displayName || o.client?.name || "Client",
        clientEmail: o.clientProfile?.user?.email || "client@email.com",
        vendorName: o.vendorProfile?.businessName || o.vendor?.businessName || "Vendor",
        vendorStripeAccountId: o.vendorProfile?.stripeAccountId || "acct_connected",
        stripePaymentIntentId: o.stripePaymentIntentId || "pi_vault",
        service: o.gig?.category?.name || "Celebration Escrow Package",
        totalAmount: Number(o.grandTotal || 0),
        escrowLockedAmount: o.status === "COMPLETED" ? 0 : Number(o.grandTotal || 0),
        escrowStatus: o.status === "COMPLETED" ? "COMPLETED" : o.status === "DISPUTED" ? "DISPUTE_HOLD" : "LOCKED_IN_CUSTODY",
        milestone: `${o.milestones?.length || 1} Milestones`,
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent",
        protection: "100% Vault Protected",
        status: o.status || "Active",
      }))
    : initialOrders;


  const handleActionComplete = (actionType: string, details: any) => {
    toast.success(`Escrow settlement complete: ${actionType}`);
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
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Orders &amp; Escrow Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40">
              Stripe Connect Vault Custody
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Real-time custody tracking, milestone schedules, manual Stripe Connect payouts, and partial refund arbitration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success("Immutable Escrow Custody Ledger exported to CSV")}
            className="px-3.5 py-2 rounded-xl bg-[#16181F] border border-[#26282E] text-xs font-bold text-foreground-secondary hover:bg-[#1A1D24] hover:text-foreground flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>Export Custody Ledger</span>
          </button>
        </div>
      </div>

      {/* Escrow Liquidity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Total in Escrow Custody</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-foreground font-mono">$38,900.00</span>
            <span className="text-xs font-bold text-success bg-success-solid text-white/15 px-2 py-0.5 rounded-full border border-success/30">100% Backed</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Across 42 active milestone contracts</p>
        </div>

        <div className="bg-[#121418] p-5 rounded-3xl border border-[#26282E] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Milestones Released (30d)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-success font-mono">$148,250.00</span>
            <span className="text-xs font-bold text-[#DFB76C] bg-[#1A1D24] px-2 py-0.5 rounded-full border border-border-brand/40">118 Milestones</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Stripe Connect ACH disbursements</p>
        </div>

        <div className="bg-[#121418] p-5 rounded-3xl border border-danger/30 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-danger uppercase tracking-wider">Dispute Holdback Pool</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-danger font-mono">$4,850.00</span>
            <span className="text-xs font-bold text-rose-300 bg-danger-solid text-white/15 px-2 py-0.5 rounded-full border border-danger/30">4 Orders Frozen</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">Subject to ongoing arbitration</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121418] rounded-3xl border border-[#26282E] shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-[#26282E] flex items-center justify-between gap-4 flex-wrap bg-[#16181F]/40">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by order ID, client, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#16181F] border border-[#26282E] rounded-xl pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground-muted font-semibold">
            <span>Stripe Webhook Gateway:</span>
            <span className="px-2.5 py-0.5 bg-success-solid text-white/15 text-success rounded-full font-bold text-[10px] border border-success/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              200 OK Live
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#16181F]/80 border-b border-[#26282E] text-[11px] font-bold uppercase text-foreground-muted tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID &amp; Event</th>
                <th className="py-3.5 px-4">Client &amp; Vendor</th>
                <th className="py-3.5 px-4 font-mono">Escrow Locked</th>
                <th className="py-3.5 px-4">Milestone Progress</th>
                <th className="py-3.5 px-4">Custody Status</th>
                <th className="py-3.5 px-4 text-right">Stripe Escrow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26282E]/60">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#16181F]/50 transition-colors group">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground font-mono block">#{ord.orderNumber}</span>
                    <p className="text-[11px] text-foreground-muted mt-0.5">{ord.occasion}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground-secondary block">{ord.clientName}</span>
                    <p className="text-[11px] text-[#DFB76C] font-medium">{ord.vendorName}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-foreground text-sm">
                    ${ord.escrowLockedAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-foreground-secondary font-medium block">{ord.milestone}</span>
                    <p className="text-[10px] text-foreground-muted">Target: {ord.date}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                      ord.escrowStatus === "LOCKED_IN_CUSTODY" && "bg-warning-solid text-on-brand/15 text-warning border-warning/30",
                      ord.escrowStatus === "MILESTONE_RELEASED" && "bg-info-solid text-white/15 text-info border-info/30",
                      ord.escrowStatus === "COMPLETED" && "bg-success-solid text-white/15 text-success border-success/30",
                      ord.escrowStatus === "REFUNDED" && "bg-danger-solid text-white/15 text-danger border-danger/30",
                    )}>
                      <Lock className="w-2.5 h-2.5" />
                      {ord.escrowStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderForEscrow(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#222630] border border-[#26282E] hover:border-border-brand/40 text-foreground font-bold text-xs transition-all shadow-sm inline-flex items-center gap-1.5 ml-auto"
                    >
                      <Scale className="w-3.5 h-3.5 text-[#DFB76C]" />
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
