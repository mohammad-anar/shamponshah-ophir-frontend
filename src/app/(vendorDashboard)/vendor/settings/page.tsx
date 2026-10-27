"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Bell,
  MapPin,
  Lock,
  Save,
  CheckCircle2,
  FileText,
  DollarSign,
  Palmtree,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetMyVendorProfileQuery,
  useUpdateVendorProfileMutation,
  useToggleVacationModeMutation,
} from "@/redux/service/vendors/vendorsApi";

export default function VendorSettingsPage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetMyVendorProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateVendorProfileMutation();
  const [toggleVacation, { isLoading: isTogglingVacation }] = useToggleVacationModeMutation();

  const [businessName, setBusinessName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [businessType, setBusinessType] = useState("LLC");
  const [taxEin, setTaxEin] = useState("XX-XXX8921");
  const [instantBooking, setInstantBooking] = useState(true);
  const [smsJobAlerts, setSmsJobAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const p = (profileData as any)?.data || profileData;
    if (p) {
      if (p.name || p.businessName) setBusinessName(p.name || p.businessName);
      if (p.title || p.tagline) setTitle(p.title || p.tagline);
      if (p.location || p.city) setLocation(p.location || (p.city ? `${p.city}${p.state ? `, ${p.state}` : ''}` : ''));
      if (p.startingPrice) setStartingPrice(String(p.startingPrice));
      if (typeof p.isVacationMode === "boolean") setIsVacationMode(p.isVacationMode);
    }
  }, [profileData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: businessName,
        businessName,
        title,
        tagline: title,
        location,
        city: location.split(",")[0]?.trim() || location,
        startingPrice: parseFloat(startingPrice) || 450,
      }).unwrap();

      setSavedSuccess(true);
      toast.success("Business preferences successfully updated!");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update vendor settings");
    }
  };

  const handleToggleVacation = async () => {
    const nextState = !isVacationMode;
    try {
      await toggleVacation({ isVacationMode: nextState }).unwrap();
      setIsVacationMode(nextState);
      toast.success(nextState ? "Vacation mode activated. Your gigs are temporarily hidden." : "Vacation mode turned off. Your profile is live!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not update vacation mode.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Business &amp; Account Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Tax Verified
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Manage your legal entity details, marketplace public profile, and vacation pause mode.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-foreground rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-success" /> Business preferences successfully updated.
        </div>
      )}

      {/* Vacation Mode Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-amber-950">Vacation &amp; Hiatus Mode</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Temporarily hide your listings from search results while preserving all reviews and guild level ranking.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleVacation}
          disabled={isTogglingVacation}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isVacationMode
              ? "bg-warning-solid text-on-brand hover:bg-amber-700 text-foreground shadow-xs"
              : "bg-surface border border-amber-300 text-amber-900 hover:bg-amber-100/50"
          }`}
        >
          {isVacationMode ? "Vacation Active (Turn Off)" : "Take a Break"}
        </button>
      </div>

      {/* Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketplace Public Profile */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-brand-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Vendor Public Profile</h2>
              <p className="text-xs text-foreground-muted">Visible to clients across the directory</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Business / Brand Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Headline / Specialty</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Primary City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Starting Price ($)</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Tax Entity */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Legal Entity &amp; 1099 Tax Info</h2>
              <p className="text-xs text-foreground-muted">For annual IRS reporting and escrow payouts</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Business Structure</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none"
              >
                <option value="LLC">Limited Liability Company (LLC)</option>
                <option value="Sole">Sole Proprietorship</option>
                <option value="Corp">C-Corporation / S-Corporation</option>
                <option value="Individual">Individual / Independent Contractor</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Employer Identification Number (EIN)</label>
              <input
                type="text"
                value={taxEin}
                onChange={(e) => setTaxEin(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="text-emerald-900 font-bold">W-9 Form Status</span>
              <span className="px-2 py-0.5 rounded-full bg-success-solid text-white text-foreground text-[10px] font-bold">
                Active on File
              </span>
            </div>
          </div>
        </div>

        {/* Lead Alerts & Notifications */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs md:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Lead Matching &amp; Notifications</h2>
              <p className="text-xs text-foreground-muted">Configure alerts when new events are posted near you</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-border/80 cursor-pointer hover:bg-surface-elevated">
              <div>
                <p className="font-bold text-[#0F0C3B]">Instant SMS for &lt;50 mi Job Matches</p>
                <p className="text-foreground-muted text-[11px]">Receive an immediate text when a client posts a job in your category</p>
              </div>
              <input
                type="checkbox"
                checked={smsJobAlerts}
                onChange={(e) => setSmsJobAlerts(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-border/80 cursor-pointer hover:bg-surface-elevated">
              <div>
                <p className="font-bold text-[#0F0C3B]">Direct Gig Instant Booking</p>
                <p className="text-foreground-muted text-[11px]">Allow verified clients to book open calendar dates without prior inquiry</p>
              </div>
              <input
                type="checkbox"
                checked={instantBooking}
                onChange={(e) => setInstantBooking(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-border/80 cursor-pointer hover:bg-surface-elevated">
              <div>
                <p className="font-bold text-[#0F0C3B]">Weekly Performance Summary Email</p>
                <p className="text-foreground-muted text-[11px]">Weekly breakdown of impressions, bids won, and level progress</p>
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
      </form>
    </div>
  );
}
