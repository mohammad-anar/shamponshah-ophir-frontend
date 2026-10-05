"use client";

import { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Bell, 
  Globe, 
  Key, 
  Save, 
  CheckCircle2, 
  Sliders,
  DollarSign,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [buyerFee, setBuyerFee] = useState(5.0);
  const [vendorFee, setVendorFee] = useState(0.0);
  const [disputeTimeoutHours, setDisputeTimeoutHours] = useState(72);
  const [payoutHoldDays, setPayoutHoldDays] = useState(3);
  const [requireIdVerification, setRequireIdVerification] = useState(true);
  const [requireInsurance, setRequireInsurance] = useState(true);
  const [autoApproveTopRated, setAutoApproveTopRated] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhookAlerts, setSlackWebhookAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    toast.success("System governance parameters updated successfully.");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">System &amp; Platform Governance</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
              v2.4.0 Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global fee formulas, escrow custody timeout windows, automated risk parameters, and API integration hooks.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <Save className="w-4 h-4 text-amber-300" /> Save System Config
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Platform configuration successfully synced to cloud edge.
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Escrow & Financial Take Rates */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0F0C3B]">Escrow &amp; Monetization Rules</h2>
              <p className="text-[11px] text-slate-500">Transaction take rates and payout disbursement limits</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Client Service Fee (%) <span className="text-[10px] text-indigo-600">(Currently 5%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={buyerFee}
                onChange={(e) => setBuyerFee(Number(e.target.value))}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-[#0F0C3B] font-mono font-bold focus:outline-none focus:border-brand-primary"
              />
              <p className="text-[10px] text-slate-400 mt-1">Charged directly to buyers at escrow checkout.</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Vendor Commission Cut (%) <span className="text-[10px] text-emerald-700 font-bold">(0% — Free for Sellers)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={vendorFee}
                onChange={(e) => setVendorFee(Number(e.target.value))}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-[#0F0C3B] font-mono font-bold focus:outline-none focus:border-brand-primary"
              />
              <p className="text-[10px] text-slate-400 mt-1">Vendors retain 100% of quote amount.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Escrow Hold Days</label>
                <input
                  type="number"
                  value={payoutHoldDays}
                  onChange={(e) => setPayoutHoldDays(Number(e.target.value))}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-[#0F0C3B] font-mono font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Arbitration Timeout (Hrs)</label>
                <input
                  type="number"
                  value={disputeTimeoutHours}
                  onChange={(e) => setDisputeTimeoutHours(Number(e.target.value))}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-[#0F0C3B] font-mono font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Onboarding & Verification Rules */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-[#0F0C3B] border border-indigo-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0F0C3B]">Trust &amp; Compliance Engine</h2>
              <p className="text-[11px] text-slate-500">KYC checks, insurance mandates, and automated vetting</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FD] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors">
              <div>
                <p className="font-bold text-[#0F0C3B]">Government ID Verification (Persona)</p>
                <p className="text-[11px] text-slate-500">Require automated passport/DL scan before first payout</p>
              </div>
              <input
                type="checkbox"
                checked={requireIdVerification}
                onChange={(e) => setRequireIdVerification(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FD] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors">
              <div>
                <p className="font-bold text-[#0F0C3B]">COI Liability Insurance Requirement</p>
                <p className="text-[11px] text-slate-500">Mandatory for Venue &amp; Catering vendor tiers</p>
              </div>
              <input
                type="checkbox"
                checked={requireInsurance}
                onChange={(e) => setRequireInsurance(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FD] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors">
              <div>
                <p className="font-bold text-[#0F0C3B]">Auto-Publish Gigs for Top Rated</p>
                <p className="text-[11px] text-slate-500">Bypass manual gig moderation for verified 4.8+ sellers</p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveTopRated}
                onChange={(e) => setAutoApproveTopRated(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Security & API Integrations */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0F0C3B]">Payment &amp; API Integrations</h2>
              <p className="text-[11px] text-slate-500">Stripe Connect &amp; Twilio Webhook Gateways</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Stripe Connect Account ID</label>
              <input
                type="password"
                defaultValue="acct_1NZxxxx9988219"
                readOnly
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-600 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Live Webhook Signing Secret</label>
              <input
                type="password"
                defaultValue="whsec_0982348a098fa890sd"
                readOnly
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-600 font-mono text-xs"
              />
            </div>

            <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Stripe Webhook Sync</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                Operational (200 OK)
              </span>
            </div>
          </div>
        </div>

        {/* Administrative Notifications & Escalation */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0F0C3B]">Alerts &amp; Escalation Desks</h2>
              <p className="text-[11px] text-slate-500">Configure emergency notifications for platform supervisors</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FD] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors">
              <div>
                <p className="font-bold text-[#0F0C3B]">Dispute Escalation Push Notifications</p>
                <p className="text-[11px] text-slate-500">Notify legal admin team if dispute remains unresolved &gt;48h</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FD] border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors">
              <div>
                <p className="font-bold text-[#0F0C3B]">Slack Ops Webhook (#ophir-alerts)</p>
                <p className="text-[11px] text-slate-500">Real-time alerts for refunds &gt;$1,000</p>
              </div>
              <input
                type="checkbox"
                checked={slackWebhookAlerts}
                onChange={(e) => setSlackWebhookAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
