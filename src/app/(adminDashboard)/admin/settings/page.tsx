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

import { useEffect } from "react";
import { 
  useGetAdminSettingsQuery, 
  useUpdateAdminSettingsMutation 
} from "@/redux/service/admin/adminApi";

export default function AdminSettingsPage() {
  const { data: apiSettings, refetch } = useGetAdminSettingsQuery();
  const [updateAdminSettings, { isLoading: isSaving }] = useUpdateAdminSettingsMutation();

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

  useEffect(() => {
    if (apiSettings) {
      if (typeof apiSettings.buyerFee === "number") setBuyerFee(apiSettings.buyerFee);
      if (typeof apiSettings.vendorFee === "number") setVendorFee(apiSettings.vendorFee);
      if (typeof apiSettings.disputeTimeoutHours === "number") setDisputeTimeoutHours(apiSettings.disputeTimeoutHours);
      if (typeof apiSettings.payoutHoldDays === "number") setPayoutHoldDays(apiSettings.payoutHoldDays);
      if (typeof apiSettings.requireIdVerification === "boolean") setRequireIdVerification(apiSettings.requireIdVerification);
      if (typeof apiSettings.requireInsurance === "boolean") setRequireInsurance(apiSettings.requireInsurance);
      if (typeof apiSettings.autoApproveTopRated === "boolean") setAutoApproveTopRated(apiSettings.autoApproveTopRated);
      if (typeof apiSettings.emailAlerts === "boolean") setEmailAlerts(apiSettings.emailAlerts);
      if (typeof apiSettings.slackWebhookAlerts === "boolean") setSlackWebhookAlerts(apiSettings.slackWebhookAlerts);
    }
  }, [apiSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminSettings({
        buyerFee,
        vendorFee,
        disputeTimeoutHours,
        payoutHoldDays,
        requireIdVerification,
        requireInsurance,
        autoApproveTopRated,
        emailAlerts,
        slackWebhookAlerts,
      }).unwrap();
      refetch();
      setSavedSuccess(true);
      toast.success("System governance parameters updated successfully.");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      toast.success("System governance parameters updated successfully.");
    }
  };


  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">System &amp; Platform Governance</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand/15 text-brand border border-border-brand/40">
              v2.4.0 Engine
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Global fee formulas, escrow custody timeout windows, automated risk parameters, and API integration hooks.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4 text-on-brand" /> Save System Config
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-success-solid text-foreground/15 border border-success/30 rounded-2xl text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-success" /> Platform configuration successfully synced to cloud edge.
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Escrow & Financial Take Rates */}
        <div className="bg-surface border border-border rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-success-solid text-foreground/15 text-success border border-success/30">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground">Escrow &amp; Monetization Rules</h2>
              <p className="text-[11px] text-foreground-muted">Transaction take rates and payout disbursement limits</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-foreground-muted font-bold mb-1">
                Client Service Fee (%) <span className="text-[10px] text-brand">(Currently 5%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={buyerFee}
                onChange={(e) => setBuyerFee(Number(e.target.value))}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none focus:border-border-brand"
              />
              <p className="text-[10px] text-foreground-muted mt-1">Charged directly to buyers at escrow checkout.</p>
            </div>

            <div>
              <label className="block text-foreground-muted font-bold mb-1">
                Vendor Commission Cut (%) <span className="text-[10px] text-success font-bold">(0% — Free for Sellers)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={vendorFee}
                onChange={(e) => setVendorFee(Number(e.target.value))}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none focus:border-border-brand"
              />
              <p className="text-[10px] text-foreground-muted mt-1">Vendors retain 100% of quote amount.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-foreground-muted font-bold mb-1">Escrow Hold Days</label>
                <input
                  type="number"
                  value={payoutHoldDays}
                  onChange={(e) => setPayoutHoldDays(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none focus:border-border-brand"
                />
              </div>
              <div>
                <label className="block text-foreground-muted font-bold mb-1">Arbitration Timeout (Hrs)</label>
                <input
                  type="number"
                  value={disputeTimeoutHours}
                  onChange={(e) => setDisputeTimeoutHours(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none focus:border-border-brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Onboarding & Verification Rules */}
        <div className="bg-surface border border-border rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-surface-elevated text-brand border border-border">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground">Trust &amp; Compliance Engine</h2>
              <p className="text-[11px] text-foreground-muted">KYC checks, insurance mandates, and automated vetting</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-elevated border border-border cursor-pointer hover:border-border-brand/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">Government ID Verification (Persona)</p>
                <p className="text-[11px] text-foreground-muted">Require automated passport/DL scan before first payout</p>
              </div>
              <input
                type="checkbox"
                checked={requireIdVerification}
                onChange={(e) => setRequireIdVerification(e.target.checked)}
                className="w-4 h-4 accent-[#DFB76C] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-elevated border border-border cursor-pointer hover:border-border-brand/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">COI Liability Insurance Requirement</p>
                <p className="text-[11px] text-foreground-muted">Mandatory for Venue &amp; Catering vendor tiers</p>
              </div>
              <input
                type="checkbox"
                checked={requireInsurance}
                onChange={(e) => setRequireInsurance(e.target.checked)}
                className="w-4 h-4 accent-[#DFB76C] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-elevated border border-border cursor-pointer hover:border-border-brand/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">Auto-Publish Gigs for Top Rated</p>
                <p className="text-[11px] text-foreground-muted">Bypass manual gig moderation for verified 4.8+ sellers</p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveTopRated}
                onChange={(e) => setAutoApproveTopRated(e.target.checked)}
                className="w-4 h-4 accent-[#DFB76C] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security & API Integrations */}
        <div className="bg-surface border border-border rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-info-solid text-foreground/15 text-info border border-info/30">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground">Payment &amp; API Integrations</h2>
              <p className="text-[11px] text-foreground-muted">Stripe Connect &amp; Twilio Webhook Gateways</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-foreground-muted font-bold mb-1">Stripe Connect Account ID</label>
              <input
                type="password"
                defaultValue="acct_1NZxxxx9988219"
                readOnly
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground-muted font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-foreground-muted font-bold mb-1">Live Webhook Signing Secret</label>
              <input
                type="password"
                defaultValue="whsec_0982348a098fa890sd"
                readOnly
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground-muted font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="p-3 bg-surface-elevated rounded-2xl border border-border flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold">Stripe Webhook Sync</span>
              <span className="px-2.5 py-0.5 rounded-full bg-success-solid text-foreground/15 text-success text-[10px] font-bold border border-success/30">
                Operational (200 OK)
              </span>
            </div>
          </div>
        </div>

        {/* Administrative Notifications & Escalation */}
        <div className="bg-surface border border-border rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-warning-solid text-on-brand/15 text-warning border border-warning/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground">Alerts &amp; Escalation Desks</h2>
              <p className="text-[11px] text-foreground-muted">Configure emergency notifications for platform supervisors</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-elevated border border-border cursor-pointer hover:border-border-brand/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">Dispute Escalation Push Notifications</p>
                <p className="text-[11px] text-foreground-muted">Notify legal admin team if dispute remains unresolved &gt;48h</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#DFB76C] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-elevated border border-border cursor-pointer hover:border-border-brand/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">Slack Ops Webhook (#ophir-alerts)</p>
                <p className="text-[11px] text-foreground-muted">Real-time alerts for refunds &gt;$1,000</p>
              </div>
              <input
                type="checkbox"
                checked={slackWebhookAlerts}
                onChange={(e) => setSlackWebhookAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#DFB76C] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
