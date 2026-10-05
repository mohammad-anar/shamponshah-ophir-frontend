"use client";

import { useState } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  ArrowUpRight, 
  Building2, 
  Eye, 
  Search, 
  ShieldCheck, 
  Filter,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import PayoutDetailModal, { PayoutBatchDetail } from "@/components/admin/PayoutDetailModal";

const initialPayoutBatches: PayoutBatchDetail[] = [
  {
    id: "BAT-9941",
    status: "SCHEDULED",
    scheduledDate: "Today (2:00 PM EST)",
    totalGross: 600.00,
    platformFeeTotal: 60.00,
    netDisbursement: 540.00,
    vendor: {
      id: "V-101",
      legalName: "Marcus Reed",
      businessName: "Party Pulse Events LLC",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      email: "marcus@partypulsechicago.com",
      phone: "+1 (312) 555-0194",
      address: "1420 N Wells St, Suite 4B, Chicago, IL 60610",
      taxId: "XX-XXX4819 (W-9 Verified)",
      kycStatus: "VERIFIED",
      riskScore: "0.01",
      stripeConnectId: "acct_1Nsk92Kx09LmQ4",
      bankName: "JPMorgan Chase Bank, N.A.",
      routingNumber: "071000013",
      accountLast4: "4812",
      accountType: "Business Checking",
    },
    orders: [
      {
        orderId: "ORD-8421",
        serviceTitle: "Essential Party Set (Kids 5th Birthday)",
        clientName: "Emily Carter",
        eventDate: "Nov 14, 2026",
        completedDate: "Oct 3, 2026",
        grossAmount: 400.00,
        platformFee: 40.00,
        netPayout: 360.00,
      },
      {
        orderId: "ORD-8419",
        serviceTitle: "Extra Audio Monitor & Mic Add-on",
        clientName: "Emily Carter",
        eventDate: "Nov 14, 2026",
        completedDate: "Oct 3, 2026",
        grossAmount: 200.00,
        platformFee: 20.00,
        netPayout: 180.00,
      },
    ],
    auditLog: [
      { id: "l-1", timestamp: "Oct 3, 2026 18:22 EST", action: "Milestone completion signed off by client", actor: "Emily Carter (Client)" },
      { id: "l-2", timestamp: "Oct 4, 2026 09:00 EST", action: "Payout batch auto-queued for next ACH cycle", actor: "System Escrow Custody" },
    ],
  },
  {
    id: "BAT-9940",
    status: "PROCESSING",
    scheduledDate: "Oct 05, 2026",
    totalGross: 2055.00,
    platformFeeTotal: 205.00,
    netDisbursement: 1850.00,
    vendor: {
      id: "V-102",
      legalName: "Amina Rahman",
      businessName: "Amina Rahman Visuals",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      email: "amina@rahmanvisuals.com",
      phone: "+1 (310) 555-0812",
      address: "842 Wilshire Blvd, Los Angeles, CA 90036",
      taxId: "XX-XXX9021 (W-9 Verified)",
      kycStatus: "VERIFIED",
      riskScore: "0.02",
      stripeConnectId: "acct_1Mpw84Jx11PnK8",
      bankName: "Bank of America, N.A.",
      routingNumber: "122000661",
      accountLast4: "9021",
      accountType: "Commercial Checking",
    },
    orders: [
      {
        orderId: "ORD-8415",
        serviceTitle: "Cinema Story Package (Dual-Camera & Drone)",
        clientName: "David Miller",
        eventDate: "Oct 1, 2026",
        completedDate: "Oct 4, 2026",
        grossAmount: 2055.00,
        platformFee: 205.00,
        netPayout: 1850.00,
      },
    ],
    auditLog: [
      { id: "l-3", timestamp: "Oct 4, 2026 14:10 EST", action: "4K Video delivery approved by client", actor: "David Miller (Client)" },
      { id: "l-4", timestamp: "Oct 5, 2026 08:30 EST", action: "ACH initiated via Stripe Connect", actor: "Stripe Automated Gateway" },
    ],
  },
  {
    id: "BAT-9939",
    status: "FLAGGED",
    scheduledDate: "Oct 05, 2026 (On Hold)",
    totalGross: 2666.00,
    platformFeeTotal: 266.00,
    netDisbursement: 2400.00,
    vendor: {
      id: "V-106",
      legalName: "Jonathan Vance",
      businessName: "Windy City Sound LLC",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      email: "jonathan@windycitysound.com",
      phone: "+1 (312) 555-8911",
      address: "550 W Madison St, Chicago, IL 60661",
      taxId: "XX-XXX1134 (Action Required)",
      kycStatus: "PENDING_TAX_FORM",
      riskScore: "0.18",
      stripeConnectId: "acct_1Klq32Px88QwR2",
      bankName: "Wells Fargo Bank, N.A.",
      routingNumber: "071000288",
      accountLast4: "1134",
      accountType: "Business Checking",
    },
    orders: [
      {
        orderId: "ORD-8399",
        serviceTitle: "Full Wedding Master Audio Suite",
        clientName: "Grace Carter",
        eventDate: "Sep 28, 2026",
        completedDate: "Oct 1, 2026",
        grossAmount: 1500.00,
        platformFee: 150.00,
        netPayout: 1350.00,
      },
      {
        orderId: "ORD-8395",
        serviceTitle: "Cocktail Hour Sound Zone",
        clientName: "Grace Carter",
        eventDate: "Sep 28, 2026",
        completedDate: "Oct 1, 2026",
        grossAmount: 600.00,
        platformFee: 60.00,
        netPayout: 540.00,
      },
      {
        orderId: "ORD-8392",
        serviceTitle: "Intelligent Moving Heads Lighting",
        clientName: "Grace Carter",
        eventDate: "Sep 28, 2026",
        completedDate: "Oct 1, 2026",
        grossAmount: 566.00,
        platformFee: 56.00,
        netPayout: 510.00,
      },
    ],
    auditLog: [
      { id: "l-5", timestamp: "Oct 2, 2026 11:00 EST", action: "Annual 1099/W-9 form expired on file", actor: "Tax Compliance Bot" },
      { id: "l-6", timestamp: "Oct 3, 2026 09:15 EST", action: "Disbursement flagged pending tax document update", actor: "Compliance Admin" },
    ],
  },
  {
    id: "BAT-9938",
    status: "COMPLETED",
    scheduledDate: "Oct 04, 2026",
    totalGross: 1088.00,
    platformFeeTotal: 108.00,
    netDisbursement: 980.00,
    vendor: {
      id: "V-103",
      legalName: "Chloe Bennett",
      businessName: "Bloom Studio Chicago",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      email: "chloe@bloomstudiochi.com",
      phone: "+1 (312) 555-4421",
      address: "2100 W North Ave, Chicago, IL 60647",
      taxId: "XX-XXX6523 (W-9 Verified)",
      kycStatus: "VERIFIED",
      riskScore: "0.01",
      stripeConnectId: "acct_1Hjr77Bx99ZzK1",
      bankName: "PNC Bank, N.A.",
      routingNumber: "071921891",
      accountLast4: "6523",
      accountType: "Business Checking",
    },
    orders: [
      {
        orderId: "ORD-8380",
        serviceTitle: "Standard 8ft Demi Arch",
        clientName: "Sarah Jenkins",
        eventDate: "Sep 30, 2026",
        completedDate: "Oct 2, 2026",
        grossAmount: 650.00,
        platformFee: 65.00,
        netPayout: 585.00,
      },
      {
        orderId: "ORD-8378",
        serviceTitle: "Champagne Shimmer Wall Rental",
        clientName: "Sarah Jenkins",
        eventDate: "Sep 30, 2026",
        completedDate: "Oct 2, 2026",
        grossAmount: 438.00,
        platformFee: 43.00,
        netPayout: 395.00,
      },
    ],
    auditLog: [
      { id: "l-7", timestamp: "Oct 2, 2026 16:45 EST", action: "Milestone tear-down confirmed", actor: "Sarah Jenkins (Client)" },
      { id: "l-8", timestamp: "Oct 4, 2026 04:00 EST", action: "Stripe ACH Transfer completed: $980.00", actor: "Stripe Settlement Engine" },
    ],
  },
];

export default function AdminPayoutsPage() {
  const [batches, setBatches] = useState<PayoutBatchDetail[]>(initialPayoutBatches);
  const [selectedPayout, setSelectedPayout] = useState<PayoutBatchDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const handleApprovePayout = (id: string) => {
    setBatches(batches.map(b => b.id === id ? { ...b, status: "COMPLETED" } : b));
    if (selectedPayout && selectedPayout.id === id) {
      setSelectedPayout({ ...selectedPayout, status: "COMPLETED" });
    }
    toast.success(`Batch ${id} cleared for instant Stripe ACH disbursement.`);
  };

  const handleFlagPayout = (id: string, reason: string) => {
    setBatches(batches.map(b => b.id === id ? { ...b, status: "FLAGGED" } : b));
    if (selectedPayout && selectedPayout.id === id) {
      setSelectedPayout({ ...selectedPayout, status: "FLAGGED" });
    }
    toast.warning(`Batch ${id} placed on compliance hold: ${reason}`);
  };

  const filteredBatches = batches.filter((b) => {
    const matchesFilter = activeFilter === "ALL" || b.status === activeFilter;
    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vendor.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vendor.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Vendor Payouts &amp; Disbursements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated Stripe Connect ACH settlement, escrow releases, KYC audits, and itemized order reconciliations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success("Payout disbursement ledger CSV exported successfully.")}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" />
            <span>Export Disbursement CSV</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Today</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0F0C3B] font-mono">$9,240.00</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">18 Batches</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Stripe ACH window opens in 2 hours</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cleared This Week</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">$42,800.00</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">54 Vendors</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">0% ACH failure rate on Stripe Connect</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">KYC Verification Holds</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-800 font-mono">$2,400.00</span>
            <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">1 Flagged</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting W-9 tax document verification</p>
        </div>
      </div>

      {/* Payout Batches Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-[#F8F9FD]/50">
          <div className="flex items-center gap-2">
            {["ALL", "SCHEDULED", "PROCESSING", "FLAGGED", "COMPLETED"].map((f) => (
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

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vendors, banks, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#EDE9FE]/40 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Vendor &amp; Legal Entity</th>
                <th className="py-3.5 px-4">Bank Target (Stripe ACH)</th>
                <th className="py-3.5 px-4">Disbursement Amount</th>
                <th className="py-3.5 px-4">Orders Count</th>
                <th className="py-3.5 px-4">Status &amp; Risk</th>
                <th className="py-3.5 px-4 text-right">Disbursement Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch) => (
                <tr 
                  key={batch.id} 
                  onClick={() => setSelectedPayout(batch)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B] font-mono">
                    <span className="bg-indigo-50 text-brand-primary px-2 py-0.5 rounded-lg border border-indigo-100">
                      #{batch.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={batch.vendor.avatar} alt={batch.vendor.legalName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0F0C3B] group-hover:text-brand-primary transition-colors">
                          {batch.vendor.businessName}
                        </p>
                        <p className="text-[10px] text-slate-400">{batch.vendor.legalName} &bull; {batch.vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{batch.vendor.bankName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">•••• {batch.vendor.accountLast4}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-[#0F0C3B] font-mono text-sm block">
                      ${batch.netDisbursement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">Gross: ${batch.totalGross}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {batch.orders.length} orders
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block",
                      batch.status === "SCHEDULED" && "bg-amber-100 text-amber-800 border border-amber-200",
                      batch.status === "PROCESSING" && "bg-indigo-100 text-indigo-800 border border-indigo-200",
                      batch.status === "FLAGGED" && "bg-rose-100 text-rose-800 border border-rose-200",
                      batch.status === "COMPLETED" && "bg-emerald-100 text-emerald-800 border border-emerald-200",
                    )}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayout(batch);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3 text-brand-primary" /> Inspect Details
                    </button>

                    {batch.status === "SCHEDULED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprovePayout(batch.id);
                        }}
                        className="px-3 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold text-[11px] transition-colors shadow-2xs inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-amber-300" /> Release Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Details Modal */}
      {selectedPayout && (
        <PayoutDetailModal
          isOpen={!!selectedPayout}
          onClose={() => setSelectedPayout(null)}
          payout={selectedPayout}
          onApprove={handleApprovePayout}
          onFlag={handleFlagPayout}
        />
      )}
    </div>
  );
}

