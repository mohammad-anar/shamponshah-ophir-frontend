"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Check, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "client";

  const [firstName, setFirstName] = useState("Amina");
  const [lastName, setLastName] = useState("Rahman");
  const [email, setEmail] = useState("amina.rahman@gmail.com");
  const [password, setPassword] = useState("OphirCelebration2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [zipCode, setZipCode] = useState("78701");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation checks
  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strengthScore = useMemo(() => {
    let score = 0;
    if (isLengthValid) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;
    return score;
  }, [isLengthValid, hasNumber, hasSymbol]);

  const strengthLabel = strengthScore === 3 ? "Strong" : strengthScore === 2 ? "Medium" : "Weak";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      toast.error("Please agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully! Please verify your email.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: Sign Up Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Step & Role header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
                  STEP 1 OF 2
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {role === "vendor" ? "Artisan Studio" : "Host Account"}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  Create your account
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  {role === "vendor"
                    ? "Apply to showcase your creative portfolio and secure direct milestone bookings."
                    : "Sign up to post event RFPs and reserve verified vendors."}
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Connecting to Google...");
                    setTimeout(() => router.push("/verify-email"), 1000);
                  }}
                  className="h-11 px-3 flex items-center justify-center gap-2 bg-[#F8F7F4] hover:bg-[#F2EFE8] border border-[#E2DDD3] text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-2xs"
                >
                  <FcGoogle className="w-4 h-4 text-base" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.info("Connecting to Apple...");
                    setTimeout(() => router.push("/verify-email"), 1000);
                  }}
                  className="h-11 px-3 flex items-center justify-center gap-2 bg-[#F8F7F4] hover:bg-[#F2EFE8] border border-[#E2DDD3] text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-2xs"
                >
                  <FaApple className="w-4 h-4 text-base text-black" />
                  <span>Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#EAE6DF]" />
                <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      First name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Amina"
                      className="w-full h-11 px-3.5 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Rahman"
                      className="w-full h-11 px-3.5 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1">
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
                      className="w-full h-11 px-3.5 pr-10 text-sm bg-[#F9F8F5] text-obsidian border border-emerald-400 focus:bg-white focus:border-emerald-500 focus:outline-none rounded-xl transition-all"
                    />
                    <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 pt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Email is available and verified format</span>
                  </p>
                </div>

                {/* Password & Strength Meter */}
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

                  {/* Password Strength Bars */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex gap-1.5 w-3/4">
                        <div className={cn("h-1.5 flex-1 rounded-full transition-colors", strengthScore >= 1 ? "bg-emerald-500" : "bg-slate-200")} />
                        <div className={cn("h-1.5 flex-1 rounded-full transition-colors", strengthScore >= 2 ? "bg-emerald-500" : "bg-slate-200")} />
                        <div className={cn("h-1.5 flex-1 rounded-full transition-colors", strengthScore >= 3 ? "bg-emerald-500" : "bg-slate-200")} />
                      </div>
                      <span className={cn("font-bold text-[11px]", strengthScore === 3 ? "text-emerald-600" : "text-amber-600")}>
                        {strengthLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-emerald-700 pt-0.5">
                      <span className={cn("flex items-center gap-1", isLengthValid ? "text-emerald-600 font-medium" : "text-slate-400")}>
                        <Check className="w-3 h-3 stroke-[3]" /> 8+ chars
                      </span>
                      <span className={cn("flex items-center gap-1", hasNumber ? "text-emerald-600 font-medium" : "text-slate-400")}>
                        <Check className="w-3 h-3 stroke-[3]" /> One number
                      </span>
                      <span className={cn("flex items-center gap-1", hasSymbol ? "text-emerald-600 font-medium" : "text-slate-400")}>
                        <Check className="w-3 h-3 stroke-[3]" /> One symbol
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event ZIP code */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Event ZIP code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={5}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="78701"
                      className="w-full h-11 px-3.5 text-sm bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
                    />
                  </div>
                  {zipCode.length < 5 && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>Please enter a valid 5-digit US ZIP code.</span>
                    </p>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-600">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0F1228] focus:ring-0 cursor-pointer"
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/terms" className="font-semibold text-obsidian underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="font-semibold text-obsidian underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0F1228] focus:ring-0 cursor-pointer"
                    />
                    <span>
                      Send me celebration planning tips, seasonal vendor trends, and exclusive milestone guides.
                    </span>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-99 text-white font-semibold rounded-xl shadow-md transition-all mt-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Create account</span>
                  )}
                </button>
              </form>

              {/* Bottom Sign In Link */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-[#EAE6DF]">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  className="font-bold text-[#0F1228] hover:text-gold-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Rich Hero Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <AuthSideHero
              badge="UTSOB VAULT V2.4"
              vaultScore="Escrow Protected • Zero Upfront Risk"
              headline="Every celebration deserves the right people."
              subheadline="Hire award-winning cinematographers, decorators, caterers, and live musicians with total milestone transparency."
              quote="Being able to invite both families to our Ophir Reserve board and approve vendor milestones together saved our sanity."
              authorName="Marcus & Leena K."
              authorRole="Austin, TX • Wedding Reception"
              badgeLabel="Verified Hosts"
            />
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
