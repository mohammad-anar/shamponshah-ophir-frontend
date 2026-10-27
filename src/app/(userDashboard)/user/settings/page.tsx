"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetClientProfileQuery,
  useUpdateClientProfileMutation,
} from "@/redux/service/user/userApi";
import { useChangePasswordMutation } from "@/redux/service/auth/authApi";

export default function UserSettingsPage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetClientProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateClientProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [emailBids, setEmailBids] = useState(true);
  const [smsMilestones, setSmsMilestones] = useState(true);
  const [familyHubDigest, setFamilyHubDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password reset state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    const p = profileData?.data || profileData;
    if (p) {
      if (p.displayName) setName(p.displayName);
      if (p.user?.email) setEmail(p.user.email);
      if (p.phone) setPhone(p.phone);
      if (p.city) setCity(p.city);
      if (p.avatarUrl) setAvatarUrl(p.avatarUrl);
      if (p.notificationPreferences) {
        setEmailBids(p.notificationPreferences.emailBids ?? true);
        setSmsMilestones(p.notificationPreferences.smsMilestones ?? true);
        setFamilyHubDigest(p.notificationPreferences.familyHubDigest ?? true);
      }
    }
  }, [profileData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        displayName: name,
        phone,
        city,
        avatarUrl,
        notificationPreferences: { emailBids, smsMilestones, familyHubDigest },
      }).unwrap();
      setSavedSuccess(true);
      toast.success("Account preferences saved successfully!");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPass.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      await changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
      }).unwrap();
      toast.success("Password changed successfully!");
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Account &amp; Security Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-soft text-foreground">
              {(profileData?.data || profileData)?.user?.isEmailVerified ? "Email verified" : "Client account"}
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Manage your personal profile, contact information, notification preferences, and password.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdatingProfile}
          className="px-5 py-2.5 bg-brand hover:bg-info-soft text-foreground rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          {isUpdatingProfile ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-success-soft border border-success/30 rounded-xl text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-success" /> Account preferences saved successfully!
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Profile */}
        <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="relative">
              <div className="relative w-14 h-14 overflow-hidden rounded-full bg-gradient-to-tr from-purple-500 to-brand text-foreground flex items-center justify-center font-bold text-lg shadow-sm">
                {avatarUrl ? <img src={avatarUrl} alt="Profile" className="absolute inset-0 h-full w-full object-cover" /> : (name.split(" ").map((n) => n[0]).join("").slice(0, 2) || "")}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Personal Details</h2>
              <p className="text-xs text-foreground-muted">Visible to vendors when you post event jobs</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Profile image URL</label>
              <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-medium" />
            </div>
            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-surface-sunken border border-border rounded-xl p-2.5 text-foreground-muted font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-foreground-secondary font-bold mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-medium"
              />
            </div>
          </div>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <div className="p-2 rounded-xl bg-info-soft text-brand-primary">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Security &amp; Password</h2>
                <p className="text-xs text-foreground-muted">Keep your account guarded with AES encryption</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full py-2.5 bg-surface-sunken hover:bg-surface-sunken text-foreground font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>

        {/* Notification Preferences */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs md:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-border pb-4">
            <div className="p-2 rounded-xl bg-warning-soft text-warning">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Communication &amp; Alert Preferences</h2>
              <p className="text-xs text-foreground-muted">Choose when and how Ophir notifies you</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border/80 cursor-pointer hover:bg-surface-elevated">
              <div>
                <p className="font-bold text-foreground">Instant Proposal &amp; Bid Alerts (Email)</p>
                <p className="text-foreground-muted text-[11px]">Receive immediate notification when an vendor bids on your event</p>
              </div>
              <input
                type="checkbox"
                checked={emailBids}
                onChange={(e) => setEmailBids(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border/80 cursor-pointer hover:bg-surface-elevated">
              <div>
                <p className="font-bold text-foreground">Milestone Signoff &amp; Escrow Releases (SMS)</p>
                <p className="text-foreground-muted text-[11px]">Get a text message when a vendor submits milestone completion deliverables</p>
              </div>
              <input
                type="checkbox"
                checked={smsMilestones}
                onChange={(e) => setSmsMilestones(e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border/80 cursor-pointer hover:bg-surface-elevated">
              <div>
                <p className="font-bold text-foreground">Family Hub Activity Digest</p>
                <p className="text-foreground-muted text-[11px]">Weekly email summary of family votes and pledged budget contributions</p>
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
