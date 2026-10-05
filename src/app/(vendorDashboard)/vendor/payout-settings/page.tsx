"use client";

import { useState } from "react";
import { 
  Settings, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Save, 
  ArrowUpRight, 
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function VendorPayoutSettingsPage() {
  const [payoutSchedule, setPayoutSchedule] = useState("Automatic Daily");
  const [bankName, setBankName] = useState("Chase Bank Commercial");
  const [accountNumber, setAccountNumber] = useState("•••• •••• •••• 8912");
  const [routingNumber, setRoutingNumber] = useState("••••• 0210");
  const [instantDebitCard, setInstantDebitCard] = useState("•••• •••• •••• 4421 (Visa Debit)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Payout & Bank Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Stripe Connect Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure direct deposit bank routing, instant payout debit card, and automated disbursement schedules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Bank Preferences
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Payout settings updated and synced with Stripe Connect.
        </div>
      )}

      {/* Stripe Connect Banner */}
      <div className="bg-[#0F0C3B] text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Stripe Connect Verified (ID: acct_1N9x...4490)</h3>
            <p className="text-xs text-indigo-200">Instant ACH & Debit transfer capabilities are enabled for your business.</p>
          </div>
        </div>

        <button 
          onClick={() => alert("Opening Stripe Express Dashboard in new window...")}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5"
        >
          Stripe Portal <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct Deposit Bank Account */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-brand-primary">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Direct Deposit Bank Account</h2>
              <p className="text-xs text-slate-500">For standard 48h zero-fee ACH deposits</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Financial Institution</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Account Number (Checking)</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Routing Number (ABA)</label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Instant Payout Debit Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Instant Transfer Debit Card</h2>
              <p className="text-xs text-slate-500">Disburse within 30 minutes (1% fee)</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Registered Debit Card</label>
              <input
                type="text"
                value={instantDebitCard}
                onChange={(e) => setInstantDebitCard(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Automated Schedule</label>
              <select
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
              >
                <option>Automatic Daily (As milestones sign off)</option>
                <option>Weekly (Every Monday morning)</option>
                <option>Bi-Weekly (1st & 15th of the month)</option>
                <option>Manual Withdrawal Only</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              Escrow milestone releases are automatically triggered when a client signs off on deliverables or after 72h auto-completion.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
