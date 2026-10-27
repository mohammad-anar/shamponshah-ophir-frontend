"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  AlertCircle,
  User,
  Store,
  Mail,
  Phone,
  Briefcase,
  Lock,
  ArrowRight,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";
import { cn } from "@/lib/utils";

import {
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/redux/service/auth/authApi";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { setUser } from "@/redux/features/auth";

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Role query param determines active tab: /signup?role=client or /signup?role=vendor
  const roleParam = searchParams.get("role")?.toLowerCase();
  const activeRole: "client" | "vendor" = roleParam === "vendor" ? "vendor" : "client";

  // Shared form state (persists across tab switches)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vendor-specific state
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");

  // Honeypot for bot detection (must remain empty)
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");

  // Checkboxes
  const [agreedTerms, setAgreedTerms] = useState(false);

  // UI status states
  const [duplicateEmailError, setDuplicateEmailError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // RTK Query Mutations
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [verifyEmailMutation] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResendingVerification }] = useResendVerificationMutation();

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  // Tab switcher: updates URL search params without full page reload
  const handleTabChange = (newRole: "client" | "vendor") => {
    setDuplicateEmailError(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", newRole);
    // Use replace with scroll: false to ensure seamless in-place URL transition
    router.replace(`/signup?${params.toString()}`, { scroll: false });
  };

  // Password validation checks
  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (isLengthValid) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;
    return score;
  }, [password, isLengthValid, hasNumber, hasSymbol]);

  const strengthLabel =
    strengthScore === 3 ? "Strong" : strengthScore === 2 ? "Medium" : strengthScore === 1 ? "Weak" : "Too Short";

  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Handle Sign Up Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateEmailError(null);

    // Client-side validations
    if (!agreedTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify your password.");
      return;
    }

    if (activeRole === "vendor" && !businessName.trim()) {
      toast.error("Please provide a business or display name for your vendor studio.");
      return;
    }

    try {
      const res = await registerUser({
        email: email.trim().toLowerCase(),
        password,
        role: activeRole === "vendor" ? "VENDOR" : "CLIENT",
        fullName: fullName.trim() || undefined,
        displayName: activeRole === "client" ? fullName.trim() : undefined,
        businessName: activeRole === "vendor" ? (businessName.trim() || fullName.trim()) : undefined,
        phone: activeRole === "vendor" ? (phone.trim() || undefined) : undefined,
        website: websiteHoneypot || undefined,
      }).unwrap();

      toast.success(res?.message || "Account created! Please check your email for the verification code.");
      setRegisteredEmail(email.trim().toLowerCase());
      setResendCooldown(60);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Registration failed. Please try again.";
      if (err?.status === 409 || msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("registered")) {
        setDuplicateEmailError("An account with this email already exists. Please log in or use another email.");
      } else {
        toast.error(msg);
      }
    }
  };

  // OTP Handling
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("").trim();
    if (token.length < 6) {
      toast.error("Please enter the complete 6-digit code sent to your email.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyEmailMutation({ token }).unwrap();
      setIsVerifiedSuccess(true);

      if (res?.accessToken) {
        dispatch(
          setUser({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
        );
        document.cookie = `accessToken=${res.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `role=${res.user?.role || (activeRole === "vendor" ? "VENDOR" : "CLIENT")}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `roll=${res.user?.role || (activeRole === "vendor" ? "VENDOR" : "CLIENT")}; path=/; max-age=604800; SameSite=Lax`;

        if (typeof localStorage !== "undefined") {
          localStorage.setItem("token", res.accessToken);
        }
      }

      toast.success(
        activeRole === "vendor"
          ? "Vendor account verified! Welcome to your Artisan Dashboard."
          : "Account verified! Welcome to Ophir Reserve."
      );

      setTimeout(() => {
        if (activeRole === "vendor") {
          router.push("/vendor");
        } else {
          router.push("/user");
        }
      }, 1200);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired verification code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Resend Verification Code
  const handleResend = async () => {
    if (resendCooldown > 0 || isResendingVerification || !registeredEmail) return;
    try {
      await resendVerification({ email: registeredEmail }).unwrap();
      setResendCooldown(60);
      toast.success(`New verification code sent to ${registeredEmail}! Check your inbox or terminal logs.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend verification code. Please wait a few moments.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5]">
      <AuthHeader />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-6xl">
          {/* Left Column: Sign Up Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              
              {/* STATE A: "Check your email" after signup */}
              {registeredEmail ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center shadow-xs">
                    <Mail className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-success-solid text-foreground" />
                      Registration Received
                    </span>
                    <h1 className="font-serif text-3xl font-bold text-obsidian tracking-tight">
                      Check your email
                    </h1>
                    <p className="text-foreground-muted text-xs sm:text-sm leading-relaxed">
                      We sent a 6-digit verification code to{" "}
                      <span className="font-semibold text-obsidian">{registeredEmail}</span>.
                      Enter the code below to activate your account.
                    </p>
                  </div>

                  {isVerifiedSuccess ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span>Account Activated!</span>
                      </div>
                      <p className="text-emerald-800">
                        Redirecting you to your {activeRole === "vendor" ? "vendor dashboard" : "client portal"}...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpInputRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-full aspect-square text-center font-bold text-lg sm:text-xl text-obsidian bg-[#F9F8F5] border border-[#E2DDD3] focus:border-[#0F1228] focus:bg-surface rounded-xl focus:outline-none transition-all shadow-xs"
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingOtp}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-[#0B0C0E] hover:bg-[#1A1D24] text-foreground font-semibold rounded-xl shadow-md transition-all active:scale-99 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingOtp ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Verify and activate</span>
                            <ArrowRight className="w-4 h-4 text-[#DFB76C]" />
                          </>
                        )}
                      </button>

                      {/* Resend Verification Option */}
                      <div className="pt-2 border-t border-[#EAE6DF] flex items-center justify-between text-xs text-foreground-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-foreground-muted" />
                          {resendCooldown > 0 ? (
                            <span>
                              Resend code in{" "}
                              <span className="font-semibold text-obsidian">0:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResend}
                              disabled={isResendingVerification}
                              className="font-bold text-[#0F1228] hover:text-[#DFB76C] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <RefreshCw className={cn("w-3 h-3", isResendingVerification && "animate-spin")} />
                              <span>Resend verification email</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setRegisteredEmail(null);
                            setOtp(["", "", "", "", "", ""]);
                          }}
                          className="font-semibold text-foreground-secondary hover:text-obsidian hover:underline cursor-pointer"
                        >
                          Edit details
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* STATE B: Sign Up Form with 2 Luxury Tabs */
                <>
                  {/* Two Main Tabs: "Register as a Client" & "Become a Vendor" */}
                  <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#F4F1EA] border border-[#E2DDD3]">
                    <button
                      type="button"
                      id="tab-register-client"
                      onClick={() => handleTabChange("client")}
                      className={cn(
                        "py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none",
                        activeRole === "client"
                          ? "bg-[#0B0C0E] text-foreground shadow-sm"
                          : "text-foreground-secondary hover:text-foreground bg-transparent hover:bg-surface/50"
                      )}
                    >
                      <User className={cn("w-3.5 h-3.5", activeRole === "client" ? "text-[#DFB76C]" : "text-foreground-muted")} />
                      <span>Register as a Client</span>
                    </button>

                    <button
                      type="button"
                      id="tab-become-vendor"
                      onClick={() => handleTabChange("vendor")}
                      className={cn(
                        "py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none",
                        activeRole === "vendor"
                          ? "bg-[#0B0C0E] text-foreground shadow-sm"
                          : "text-foreground-secondary hover:text-foreground bg-transparent hover:bg-surface/50"
                      )}
                    >
                      <Store className={cn("w-3.5 h-3.5", activeRole === "vendor" ? "text-[#DFB76C]" : "text-foreground-muted")} />
                      <span>Become a Vendor</span>
                    </button>
                  </div>

                  {/* Header Title & Subtitle */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {activeRole === "vendor" ? "Artisan Vendor Studio" : "Celebration Host"}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-medium">Quick Onboarding</span>
                    </div>

                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian tracking-tight pt-1">
                      {activeRole === "vendor" ? "Join as a Verified Vendor" : "Create your Client Account"}
                    </h1>
                    <p className="text-foreground-muted text-xs sm:text-sm">
                      {activeRole === "vendor"
                        ? "Register your studio to publish milestone gigs and receive direct escrow bookings."
                        : "Post milestone event requests and reserve award-winning cultural artisans."}
                    </p>
                  </div>

                  {/* Duplicate Email Error Callout */}
                  {duplicateEmailError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-red-900">{duplicateEmailError}</p>
                        <p className="text-[11px] text-red-700">
                          Already have an account?{" "}
                          <Link href="/login" className="font-bold underline text-red-900 hover:text-black">
                            Log in here
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Social Logins */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Connecting to Google authentication...");
                        setTimeout(() => router.push("/verify-email"), 800);
                      }}
                      className="h-10 px-3 flex items-center justify-center gap-2 bg-[#F8F7F4] hover:bg-[#F2EFE8] border border-[#E2DDD3] text-foreground text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      <FcGoogle className="w-4 h-4 text-base" />
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Connecting to Apple authentication...");
                        setTimeout(() => router.push("/verify-email"), 800);
                      }}
                      className="h-10 px-3 flex items-center justify-center gap-2 bg-[#F8F7F4] hover:bg-[#F2EFE8] border border-[#E2DDD3] text-foreground text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      <FaApple className="w-4 h-4 text-base text-black" />
                      <span>Apple</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-[#EAE6DF]" />
                    <span className="absolute bg-surface px-3 text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                      OR REGISTER WITH EMAIL
                    </span>
                  </div>

                  {/* Sign Up Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Bot Honeypot Input: Hidden from humans, traps bots */}
                    <input
                      type="text"
                      name="website_url"
                      value={websiteHoneypot}
                      onChange={(e) => setWebsiteHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      className="opacity-0 absolute -z-50 h-0 w-0 pointer-events-none"
                    />

                    {/* Full Name (Shared across both tabs) */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-foreground-secondary">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full h-11 px-3.5 pl-9 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-surface focus:border-[#0F1228] focus:outline-none transition-all"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                      </div>
                    </div>

                    {/* Vendor-Only Fields: Display/Business Name & Phone */}
                    {activeRole === "vendor" && (
                      <div className="space-y-4 p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E4DA] animate-in fade-in duration-200">
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-foreground">
                            Studio / Business Display Name <span className="text-danger">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="e.g. Luminary Cinematic Films"
                              className="w-full h-11 px-3.5 pl-9 text-sm bg-surface text-obsidian border border-[#DCD6C9] rounded-xl focus:border-[#0F1228] focus:outline-none transition-all"
                            />
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-foreground">
                            Contact Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g. +1 (512) 555-0199"
                              className="w-full h-11 px-3.5 pl-9 text-sm bg-surface text-obsidian border border-[#DCD6C9] rounded-xl focus:border-[#0F1228] focus:outline-none transition-all"
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                          </div>
                          <p className="text-[10px] text-foreground-muted pt-0.5">
                            Portfolio, bio, skills, and payout settings are completed right after signup from your vendor studio dashboard.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Email Address (Shared across both tabs) */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-foreground-secondary">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (duplicateEmailError) setDuplicateEmailError(null);
                          }}
                          placeholder="name@example.com"
                          className={cn(
                            "w-full h-11 px-3.5 pl-9 pr-10 text-sm bg-[#F9F8F5] text-obsidian border rounded-xl focus:bg-surface focus:outline-none transition-all",
                            isEmailValid
                              ? "border-emerald-500 focus:border-emerald-600"
                              : "border-[#E2DDD3] focus:border-[#0F1228]"
                          )}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                        {isEmailValid && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                        )}
                      </div>
                      {isEmailValid && (
                        <p className="text-[11px] text-success font-medium flex items-center gap-1 pt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Valid email format</span>
                        </p>
                      )}
                    </div>

                    {/* Password Field with Show/Hide Toggle */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground-secondary">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full h-11 px-3.5 pl-9 pr-10 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-surface focus:border-[#0F1228] focus:outline-none transition-all"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-obsidian cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-foreground-secondary" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {password.length > 0 && (
                        <div className="space-y-1 pt-1 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex gap-1.5 w-3/4">
                              <div
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors",
                                  strengthScore >= 1 ? "bg-success-solid text-foreground" : "bg-slate-200"
                                )}
                              />
                              <div
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors",
                                  strengthScore >= 2 ? "bg-success-solid text-foreground" : "bg-slate-200"
                                )}
                              />
                              <div
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors",
                                  strengthScore >= 3 ? "bg-success-solid text-foreground" : "bg-slate-200"
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "font-bold text-[10px]",
                                strengthScore === 3
                                  ? "text-success"
                                  : strengthScore === 2
                                  ? "text-amber-600"
                                  : "text-foreground-muted"
                              )}
                            >
                              {strengthLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-foreground-muted pt-0.5">
                            <span className={cn("flex items-center gap-1", isLengthValid ? "text-success font-medium" : "text-foreground-muted")}>
                              <Check className="w-3 h-3 stroke-[3]" /> 8+ chars
                            </span>
                            <span className={cn("flex items-center gap-1", hasNumber ? "text-success font-medium" : "text-foreground-muted")}>
                              <Check className="w-3 h-3 stroke-[3]" /> Number
                            </span>
                            <span className={cn("flex items-center gap-1", hasSymbol ? "text-success font-medium" : "text-foreground-muted")}>
                              <Check className="w-3 h-3 stroke-[3]" /> Symbol
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field with Show/Hide Toggle */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-foreground-secondary">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className={cn(
                            "w-full h-11 px-3.5 pl-9 pr-10 text-sm bg-[#F9F8F5] text-obsidian border rounded-xl focus:bg-surface focus:outline-none transition-all",
                            passwordsMatch
                              ? "border-emerald-500 focus:border-emerald-600"
                              : passwordsMismatch
                              ? "border-red-400 focus:border-red-500"
                              : "border-[#E2DDD3] focus:border-[#0F1228]"
                          )}
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-obsidian cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-foreground-secondary" />}
                        </button>
                      </div>

                      {passwordsMatch && (
                        <p className="text-[11px] text-success font-medium flex items-center gap-1 pt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Passwords match</span>
                        </p>
                      )}
                      {passwordsMismatch && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>Passwords do not match</span>
                        </p>
                      )}
                    </div>

                    {/* Terms & Privacy Policy Checkbox (Mandatory) */}
                    <div className="pt-2 text-xs text-foreground-secondary">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded border-border text-[#0B0C0E] focus:ring-0 cursor-pointer"
                        />
                        <span>
                          I agree to the{" "}
                          <Link href="/terms" target="_blank" className="font-semibold text-obsidian underline hover:text-[#DFB76C]">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" target="_blank" className="font-semibold text-obsidian underline hover:text-[#DFB76C]">
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-[#0B0C0E] hover:bg-[#1A1D24] text-foreground font-semibold rounded-xl shadow-md transition-all active:scale-99 cursor-pointer mt-4 disabled:opacity-50"
                    >
                      {isRegistering ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>
                            {activeRole === "vendor" ? "Register Vendor Studio" : "Create Client Account"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#DFB76C]" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Bottom Log In Link */}
                  <div className="pt-3 text-center text-xs text-foreground-secondary border-t border-[#EAE6DF]">
                    <span>Already have an account? </span>
                    <Link
                      href="/login"
                      className="font-bold text-[#0F1228] hover:text-[#DFB76C] hover:underline"
                    >
                      Log in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Rich Hero & Assurance Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <AuthSideHero
              badge="OPHIR RESERVE PROTOCOL V2.4"
              vaultScore="100% Escrow Milestone Protection"
              headline={
                activeRole === "vendor"
                  ? "Showcase your heritage craft. Get paid with zero payment disputes."
                  : "Every celebration deserves verified, extraordinary artisans."
              }
              subheadline={
                activeRole === "vendor"
                  ? "Join vetted photographers, caterers, floral sculptors, and symphony ensembles. Guaranteed funds locked before work begins."
                  : "Hire award-winning cinematographers, decorators, caterers, and live musicians with complete milestone transparency."
              }
              quote={
                activeRole === "vendor"
                  ? "As an artisanal cinematographer, having clients fund each milestone into escrow before shooting day transformed our cash flow."
                  : "Approving vendor milestones step-by-step together gave our families complete peace of mind."
              }
              authorName={activeRole === "vendor" ? "Tariq V." : "Marcus & Leena K."}
              authorRole={activeRole === "vendor" ? "Austin, TX • Verified Cinema Artisan" : "Austin, TX • Wedding Reception"}
              badgeLabel={activeRole === "vendor" ? "Verified Studio" : "Verified Hosts"}
            />
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
