"use client";

import { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Lock, 
  Save, 
  CheckCircle2, 
  FileText,
  DollarSign
} from "lucide-react";

export default function VendorSettingsPage() {
  const [businessType, setBusinessType] = useState("LLC");
  const [taxEin, setTaxEin] = useState("XX-XXX8921");
  const [instantBooking, setInstantBooking] = useState(true);
  const [smsJobAlerts, setSmsJobAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
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
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Business & Account Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Tax Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your legal entity details, instant booking preferences, and lead dispatch notifications.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Business preferences successfully updated.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legal & Tax Entity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-brand-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Legal Entity & 1099 Tax Info</h2>
              <p className="text-xs text-slate-500">For annual IRS reporting and escrow contracts</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Business Structure</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
              >
                <option value="LLC">Limited Liability Company (LLC)</option>
                <option value="Sole">Sole Proprietorship</option>
                <option value="Corp">C-Corporation / S-Corporation</option>
                <option value="Individual">Individual / Independent Contractor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Employer Identification Number (EIN)</label>
              <input
                type="text"
                value={taxEin}
                onChange={(e) => setTaxEin(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="text-emerald-900 font-bold">W-9 Form Status</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                Active on File
              </span>
            </div>
          </div>
        </div>

        {/* Lead Alerts & Notifications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Lead Matching & Notifications</h2>
              <p className="text-xs text-slate-500">Configure alerts when new events are posted near you</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-slate-200/80 cursor-pointer hover:bg-slate-50">
              <div>
                <p className="font-bold text-[#0F0C3B]">Instant SMS for &lt;50 mi Job Matches</p>
                <p className="text-slate-500 text-[11px]">Receive an immediate text when a client posts a job in your category</p>
              </div>
              <input
                type="checkbox"
                checked={smsJobAlerts}
                onChange={(e) => setSmsJobAlerts(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-slate-200/80 cursor-pointer hover:bg-slate-50">
              <div>
                <p className="font-bold text-[#0F0C3B]">Direct Gig Instant Booking</p>
                <p className="text-slate-500 text-[11px]">Allow verified clients to book open calendar dates without prior inquiry</p>
              </div>
              <input
                type="checkbox"
                checked={instantBooking}
                onChange={(e) => setInstantBooking(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-slate-200/80 cursor-pointer hover:bg-slate-50">
              <div>
                <p className="font-bold text-[#0F0C3B]">Weekly Performance Summary Email</p>
                <p className="text-slate-500 text-[11px]">Weekly breakdown of impressions, bids won, and level progress</p>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
