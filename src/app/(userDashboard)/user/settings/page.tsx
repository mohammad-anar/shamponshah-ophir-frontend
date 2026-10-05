"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Bell, 
  CreditCard, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Sparkles,
  Camera
} from "lucide-react";

export default function UserSettingsPage() {
  const [name, setName] = useState("Emily Carter");
  const [email, setEmail] = useState("emily.carter@gmail.com");
  const [phone, setPhone] = useState("+1 (312) 555-0194");
  const [city, setCity] = useState("Chicago, IL");
  const [emailBids, setEmailBids] = useState(true);
  const [smsMilestones, setSmsMilestones] = useState(true);
  const [familyHubDigest, setFamilyHubDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password reset state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Account & Security Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Verified Client
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, contact information, notification preferences, and password.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Account preferences saved successfully!
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                EC
              </div>
              <button className="absolute bottom-0 right-0 p-1 bg-white border border-slate-200 rounded-full shadow-xs text-slate-600 hover:text-brand-primary">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Personal Details</h2>
              <p className="text-xs text-slate-500">Visible to vendors when you post event jobs</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2 rounded-xl bg-indigo-50 text-brand-primary">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Security & Password</h2>
              <p className="text-xs text-slate-500">Update your Ophir account login credentials</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">New Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs md:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F0C3B]">Communication & Alert Preferences</h2>
              <p className="text-xs text-slate-500">Choose when and how Ophir notifies you</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-slate-200/80 cursor-pointer hover:bg-slate-50">
              <div>
                <p className="font-bold text-[#0F0C3B]">Instant Proposal & Bid Alerts (Email)</p>
                <p className="text-slate-500 text-[11px]">Receive immediate notification when an artisan bids on your event</p>
              </div>
              <input
                type="checkbox"
                checked={emailBids}
                onChange={(e) => setEmailBids(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-slate-200/80 cursor-pointer hover:bg-slate-50">
              <div>
                <p className="font-bold text-[#0F0C3B]">Milestone Signoff & Escrow Releases (SMS)</p>
                <p className="text-slate-500 text-[11px]">Get a text message when a vendor submits milestone completion deliverables</p>
              </div>
              <input
                type="checkbox"
                checked={smsMilestones}
                onChange={(e) => setSmsMilestones(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-slate-200/80 cursor-pointer hover:bg-slate-50">
              <div>
                <p className="font-bold text-[#0F0C3B]">Family Hub Activity Digest</p>
                <p className="text-slate-500 text-[11px]">Weekly email summary of family votes and pledged budget contributions</p>
              </div>
              <input
                type="checkbox"
                checked={familyHubDigest}
                onChange={(e) => setFamilyHubDigest(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
