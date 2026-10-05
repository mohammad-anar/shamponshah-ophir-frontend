"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLengthValid || !isMatch) {
      toast.error("Please meet all password requirements.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully!");
      router.push("/login");
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: Reset Password Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Shield Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  Set new password
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Choose a strong, unique password to secure your celebration bookings and escrow vault.
                </p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 px-3.5 pr-10 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-obsidian"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-600" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 px-3.5 pr-10 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                    />
                    {isMatch && (
                      <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-3.5 rounded-xl bg-[#F8F7F4] border border-[#EAE6DF] space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700">Password requirements:</div>
                  <div className="space-y-1 text-slate-500">
                    <div className={cn("flex items-center gap-1.5", isLengthValid && "text-emerald-600 font-medium")}>
                      <Check className="w-3.5 h-3.5" />
                      <span>At least 8 characters long</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", hasNumber && "text-emerald-600 font-medium")}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Includes at least one number</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", hasSymbol && "text-emerald-600 font-medium")}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Includes at least one special symbol</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", isMatch && "text-emerald-600 font-medium")}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Passwords match</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-99 text-white font-semibold rounded-xl shadow-md transition-all mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Update Password & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to sign in */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-[#EAE6DF]">
                <span>Remember your old password? </span>
                <Link
                  href="/login"
                  className="font-bold text-[#0F1228] hover:text-gold-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Hero Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <AuthSideHero
              badge="FDIC-Insured Escrow • 100% Verified Artisans"
              vaultScore="4.96/5 Vault Score"
              headline="Every celebration deserves the right people."
              subheadline="Over 50,000 multi-generational milestones coordinated with unyielding contract clarity and milestone-based fund releases."
              quote="Ophir Reserve kept our 450-guest wedding completely on budget and stress-free. Releasing milestone funds gave us 100% peace of mind."
              authorName="Priya & Rohan S."
              authorRole="Married in Chicago, IL"
            />
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
