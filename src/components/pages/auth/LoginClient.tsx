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
  const [unverifiedUser, setUnverifiedUser] = useState<{ email: string; role: string } | null>(null);
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

      if (!res.user.isEmailVerified) {
        setUnverifiedUser({ email: res.user.email, role: res.user.role });
        toast.warning("Your email is not verified. Please verify your email to activate your account.");
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
      if (err?.data?.isEmailVerified === false) {
        setUnverifiedUser({
          email: err.data.email || email,
          role: err.data.role || "client",
        });
        toast.warning(err.data.message || "Please verify your email address to activate your account.");
        return;
      }
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
            <div className="w-full max-w-md mx-auto bg-[#121418] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#26282E] space-y-6 text-foreground">
              {/* Vault Header Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1D24] border border-border-brand/40 text-[#DFB76C] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>OPHIR RESERVE SECURED</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Welcome back
                </h1>
                <p className="text-foreground-muted text-xs sm:text-sm">
                  Sign in or use 1-click demo login to access your role dashboard.
                </p>
              </div>

              {/* Quick 1-Click Demo Login Box */}
              <div className="p-3.5 rounded-2xl bg-[#16181F] border border-[#26282E] space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground-secondary">
                    <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
                    <span>Instant Demo Login (Seed Users)</span>
                  </div>
                  <span className="text-[10px] text-foreground-muted font-mono">Ophir1234!</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Demo Client Button */}
                  <button
                    type="button"
                    disabled={isLoading || !!demoLoadingRole}
                    onClick={() => handleDirectDemoLogin("CLIENT")}
                    className="w-full px-3 py-2.5 rounded-xl border border-info/30 bg-[#1A1D24] hover:bg-info-soft text-info active:scale-99 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-info-solid text-white/20 text-info flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {demoLoadingRole === "CLIENT" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-info" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>Login as Client</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-info-solid text-white/20 text-indigo-300">/user</span>
                        </div>
                        <div className="text-[11px] text-foreground-muted truncate">sarah@ophir.com (Sarah Jenkins)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-info group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>

                  {/* Demo Vendor Button */}
                  <button
                    type="button"
                    disabled={isLoading || !!demoLoadingRole}
                    onClick={() => handleDirectDemoLogin("VENDOR")}
                    className="w-full px-3 py-2.5 rounded-xl border border-success/30 bg-[#1A1D24] hover:bg-success-soft text-success active:scale-99 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-success-solid text-white/20 text-success flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {demoLoadingRole === "VENDOR" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-success" />
                        ) : (
                          <Store className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>Login as Vendor</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-success-solid text-white/20 text-emerald-300">/vendor</span>
                        </div>
                        <div className="text-[11px] text-foreground-muted truncate">luminary@ophir.com (Luminary Studios)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-success group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>

                  {/* Demo Admin Button */}
                  <button
                    type="button"
                    disabled={isLoading || !!demoLoadingRole}
                    onClick={() => handleDirectDemoLogin("ADMIN")}
                    className="w-full px-3 py-2.5 rounded-xl border border-warning/30 bg-[#1A1D24] hover:bg-warning-soft text-warning active:scale-99 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-warning-solid text-on-brand/20 text-warning flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {demoLoadingRole === "ADMIN" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-warning" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>Login as Admin</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-warning-solid text-on-brand/20 text-warning">/admin</span>
                        </div>
                        <div className="text-[11px] text-foreground-muted truncate">admin@ophir.com (Operations Director)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-warning group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>
                </div>
              </div>

              {/* Unverified Account Warning & Resend Option */}
              {unverifiedUser && (
                <div className="p-4 rounded-2xl bg-warning-soft text-warning border border-warning/30 text-amber-200 text-xs space-y-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-[#DFB76C] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-warning text-sm">
                        {unverifiedUser.role?.toUpperCase() === "VENDOR" ? "Vendor Email Verification Required" : "Email Verification Required"}
                      </h4>
                      <p className="text-amber-200/90 text-xs leading-relaxed">
                        Your account email (<span className="font-semibold text-foreground">{unverifiedUser.email}</span>) is not verified. Please verify your email with the 6-digit code to activate your account.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-warning/30">
                    <button
                      type="button"
                      disabled={isResendingVerification}
                      onClick={async () => {
                        try {
                          await resendVerification({ email: unverifiedUser.email }).unwrap();
                          toast.success("Verification email resent! Check your inbox or console.");
                        } catch (err: any) {
                          toast.error(err?.data?.message || "Failed to resend verification email.");
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] font-bold text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isResendingVerification ? "Sending..." : "Resend Verification Email"}
                    </button>
                    <Link
                      href={`/verify-email?email=${encodeURIComponent(unverifiedUser.email)}&role=${unverifiedUser.role?.toLowerCase() || "client"}`}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1D24] border border-[#26282E] hover:border-[#DFB76C] text-[#DFB76C] font-semibold text-xs transition-colors"
                    >
                      Enter 6-Digit Code
                    </Link>
                  </div>
                </div>
              )}

              {/* Error Callout Toggleable */}
              {hasError && (
                <div className="p-3.5 rounded-xl bg-danger-soft text-danger border border-danger/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">Incorrect email or password.</span> Try again or reset your password.
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
                  className="w-full h-11 px-4 flex items-center justify-center gap-3 bg-[#16181F] hover:bg-[#1E222B] border border-[#26282E] hover:border-border-brand/40 text-foreground-secondary text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <FcGoogle className="w-4 h-4 text-lg" />
                  <span className="text-foreground-secondary font-medium">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.info("Connecting to Apple authentication...");
                    setTimeout(() => router.push("/"), 1200);
                  }}
                  className="w-full h-11 px-4 flex items-center justify-center gap-3 bg-[#16181F] hover:bg-[#1E222B] border border-[#26282E] hover:border-border-brand/40 text-foreground-secondary text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <FaApple className="w-4 h-4 text-lg text-foreground" />
                  <span className="text-foreground-secondary font-medium">Continue with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#26282E]" />
                <span className="absolute bg-[#121418] px-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
                  OR
                </span>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isPhoneMode ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground-secondary">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-11 px-3.5 pr-10 text-sm bg-[#16181F] text-foreground border border-[#26282E] rounded-xl focus:bg-[#1A1D24] focus:border-[#DFB76C] focus:outline-none transition-all placeholder:text-foreground-muted"
                        />
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground-secondary">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-11 px-3.5 pr-10 text-sm bg-[#16181F] text-foreground border border-[#26282E] rounded-xl focus:bg-[#1A1D24] focus:border-[#DFB76C] focus:outline-none transition-all placeholder:text-foreground-muted"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-[#DFB76C] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-foreground-muted" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground-secondary">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 px-3.5 pr-10 text-sm bg-[#16181F] text-foreground border border-[#26282E] rounded-xl focus:bg-[#1A1D24] focus:border-[#DFB76C] focus:outline-none transition-all placeholder:text-foreground-muted"
                      />
                      <Smartphone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    </div>
                    <p className="text-[11px] text-foreground-muted">
                      We will send a single-use login passcode via SMS.
                    </p>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-foreground-muted select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#26282E] bg-[#16181F] text-[#DFB76C] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#DFB76C] hover:text-[#ECC870] hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#DFB76C] hover:bg-[#ECC870] active:scale-99 text-[#0B0C0E] font-bold rounded-xl shadow-md transition-all mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#0B0C0E]/30 border-t-[#0B0C0E] rounded-full animate-spin" />
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
                  className="w-full text-center py-1 text-xs font-semibold text-[#DFB76C] hover:underline cursor-pointer"
                >
                  {isPhoneMode ? "Sign in with email and password" : "Sign in with a phone code"}
                </button>
              </form>

              {/* Bottom Join CTA */}
              <div className="pt-2 text-center text-xs text-foreground-muted border-t border-[#26282E]">
                <span>New to Ophir Reserve? </span>
                <Link
                  href="/register/select-role"
                  className="font-bold text-[#DFB76C] hover:text-[#ECC870] hover:underline"
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
