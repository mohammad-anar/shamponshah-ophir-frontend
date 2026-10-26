"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Smartphone, Sparkles, Store, Shield, User, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";

import { useLoginUserMutation, useResendVerificationMutation } from "@/redux/service/auth/authApi";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { setUser } from "@/redux/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [resendVerification, { isLoading: isResendingVerification }] = useResendVerificationMutation();
  const [unverifiedVendor, setUnverifiedVendor] = useState<{ email: string } | null>(null);
  const [email, setEmail] = useState("sarah@ophir.com");
  const [password, setPassword] = useState("Ophir1234!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+1 (512) 890-4421");
  const [hasError, setHasError] = useState(false);
  const [demoLoadingRole, setDemoLoadingRole] = useState<string | null>(null);

  const fillCredentials = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setIsPhoneMode(false);
    setHasError(false);
  };

  /**
   * 1-Click direct demo login using credentials from seed.ts
   */
  const handleDirectDemoLogin = async (role: "CLIENT" | "VENDOR" | "ADMIN") => {
    let demoEmail = "sarah@ophir.com";
    let targetPath = "/user";
    let roleLabel = "Client (Sarah Jenkins)";

    if (role === "VENDOR") {
      demoEmail = "luminary@ophir.com";
      targetPath = "/vendor";
      roleLabel = "Vendor (Luminary Studios)";
    } else if (role === "ADMIN") {
      demoEmail = "admin@ophir.com";
      targetPath = "/admin";
      roleLabel = "Admin (Operations Director)";
    }

    const demoPassword = "Ophir1234!";
    setEmail(demoEmail);
    setPassword(demoPassword);
    setDemoLoadingRole(role);
    setHasError(false);

    try {
      const res = await loginUser({ email: demoEmail, password: demoPassword }).unwrap();
      dispatch(
        setUser({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );

      // Set cookies for Edge runtime Next.js middleware and browser
      document.cookie = `accessToken=${res.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `role=${res.user.role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `roll=${res.user.role}; path=/; max-age=604800; SameSite=Lax`;

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", res.accessToken);
      }

      toast.success(`Welcome to Ophir! Logged in as ${roleLabel}.`);
      router.push(targetPath);
    } catch (err: any) {
      setHasError(true);
      toast.error(err?.data?.message || `Demo login as ${role} failed. Please try again.`);
    } finally {
      setDemoLoadingRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    try {
      const res = await loginUser({ email, password }).unwrap();
      dispatch(
        setUser({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );

      // Set cookies for Edge runtime Next.js middleware and browser
      document.cookie = `accessToken=${res.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `role=${res.user.role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `roll=${res.user.role}; path=/; max-age=604800; SameSite=Lax`;

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", res.accessToken);
      }

      if (res.user.role === "VENDOR" && !res.user.isEmailVerified) {
        setUnverifiedVendor({ email: res.user.email });
        toast.warning("Unverified vendor: Please verify your email to activate your account.");
        return;
      }

      toast.success(`Welcome back, ${res.user.role}!`);

      if (res.user.role === "VENDOR") {
        router.push("/vendor");
      } else if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err: any) {
      setHasError(true);
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: Sign In Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Vault Header Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3730A3]" />
                <span>OPHIR RESERVE SECURED</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  Welcome back
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Sign in or use 1-click demo login to access your role dashboard.
                </p>
              </div>

              {/* Quick 1-Click Demo Login Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FBF9F5] to-[#F5F2EB] border border-[#E2DDD3] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instant Demo Login (Seed Users)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Ophir1234!</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Demo Client Button */}
                  <button
                    type="button"
                    disabled={isLoading || !!demoLoadingRole}
                    onClick={() => handleDirectDemoLogin("CLIENT")}
                    className="w-full px-3 py-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/60 active:scale-99 transition-all text-left flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {demoLoadingRole === "CLIENT" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-700" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Login as Client</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">/user</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">sarah@ophir.com (Sarah Jenkins)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>

                  {/* Demo Vendor Button */}
                  <button
                    type="button"
                    disabled={isLoading || !!demoLoadingRole}
                    onClick={() => handleDirectDemoLogin("VENDOR")}
                    className="w-full px-3 py-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50/60 active:scale-99 transition-all text-left flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {demoLoadingRole === "VENDOR" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                        ) : (
                          <Store className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Login as Vendor</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">/vendor</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">luminary@ophir.com (Luminary Studios)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>

                  {/* Demo Admin Button */}
                  <button
                    type="button"
                    disabled={isLoading || !!demoLoadingRole}
                    onClick={() => handleDirectDemoLogin("ADMIN")}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50/60 active:scale-99 transition-all text-left flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {demoLoadingRole === "ADMIN" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Login as Admin</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">/admin</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">admin@ophir.com (Operations Director)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>
                </div>
              </div>

              {/* Unverified Vendor Warning */}
              {unverifiedVendor && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-950 text-sm">Vendor Verification Required</h4>
                      <p className="text-amber-800 text-xs leading-relaxed">
                        Your vendor email (<span className="font-semibold">{unverifiedVendor.email}</span>) is not verified. Please verify your email to directly activate your account.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200">
                    <button
                      type="button"
                      disabled={isResendingVerification}
                      onClick={async () => {
                        try {
                          await resendVerification({ email: unverifiedVendor.email }).unwrap();
                          toast.success("Verification email resent! Check your inbox.");
                        } catch (err: any) {
                          toast.error(err?.data?.message || "Failed to resend verification email.");
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                    >
                      {isResendingVerification ? "Sending..." : "Resend Verification Email"}
                    </button>
                    <Link
                      href={`/verify-email?email=${encodeURIComponent(unverifiedVendor.email)}&role=vendor`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-semibold text-xs transition-colors"
                    >
                      Enter Code
                    </Link>
                    <button
                      type="button"
                      onClick={() => router.push("/vendor")}
                      className="text-[11px] text-amber-800 hover:underline ml-auto cursor-pointer"
                    >
                      Skip to dashboard &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Error Callout Toggleable */}
              {hasError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Incorrect email or password.</span> Try again or reset your password.
                  </div>
                </div>
              )}

              {/* Social Logins */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Connecting to Google authentication...");
                    setTimeout(() => router.push("/"), 1200);
                  }}
                  className="w-full h-11 px-4 flex items-center justify-center gap-3 bg-[#F8F7F4] hover:bg-[#F2EFE8] border border-[#E2DDD3] text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-2xs"
                >
                  <FcGoogle className="w-4 h-4 text-lg" />
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.info("Connecting to Apple authentication...");
                    setTimeout(() => router.push("/"), 1200);
                  }}
                  className="w-full h-11 px-4 flex items-center justify-center gap-3 bg-[#F8F7F4] hover:bg-[#F2EFE8] border border-[#E2DDD3] text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-2xs"
                >
                  <FaApple className="w-4 h-4 text-lg text-black" />
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#EAE6DF]" />
                <span className="absolute bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  OR
                </span>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isPhoneMode ? (
                  <>
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

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
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
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 px-3.5 pr-10 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                      />
                      <Smartphone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      We will send a single-use login passcode via SMS.
                    </p>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0F1228] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#0F1228] hover:text-gold-600 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
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
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Phone Code Switcher */}
                <button
                  type="button"
                  onClick={() => setIsPhoneMode(!isPhoneMode)}
                  className="w-full text-center py-1 text-xs font-semibold text-[#0F1228] hover:underline"
                >
                  {isPhoneMode ? "Sign in with email and password" : "Sign in with a phone code"}
                </button>
              </form>

              {/* Bottom Join CTA */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-[#EAE6DF]">
                <span>New to Ophir Reserve? </span>
                <Link
                  href="/register/select-role"
                  className="font-bold text-[#0F1228] hover:text-gold-600 hover:underline"
                >
                  Join now
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Rich Hero Visual Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <AuthSideHero
              badge="FDIC-Insured Escrow • 100% Verified Vendors"
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
