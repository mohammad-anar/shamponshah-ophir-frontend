"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, KeyRound, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("maya.torres@gmail.com");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Password recovery link sent!");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: Recovery Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Key Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  Reset your password
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Enter the email associated with your account and we&apos;ll send a secure password reset link and recovery code.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-11 px-3.5 pr-10 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                      />
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F7F4] border border-[#EAE6DF] text-xs text-slate-600 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      We will verify your identity before allowing password updates to secure your active milestone escrow funds.
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
                        <span>Send reset link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Check your inbox</span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      We have sent instructions to <span className="font-semibold">{email}</span>. Click the link in the email to set your new password.
                    </p>
                  </div>

                  <Link
                    href="/reset-password"
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#0F1228] text-white text-sm font-semibold rounded-xl"
                  >
                    <span>Proceed to Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Back to sign in */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-[#EAE6DF]">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-bold text-[#0F1228] hover:text-gold-600 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
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
