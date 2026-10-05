"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, CheckCircle2, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "emily.carter@email.com";

  const [otp, setOtp] = useState(["7", "4", "2", "", "", ""]);
  const [timer, setTimer] = useState(42);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      toast.success("Email verified successfully!");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: OTP Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Mail Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center shadow-xs">
                <Mail className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  Check your email
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  We sent a 6-digit code to <span className="font-semibold text-obsidian">{emailParam}</span>
                </p>
              </div>

              {/* 6 Digit Input Row */}
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-full aspect-square text-center font-bold text-lg sm:text-xl text-obsidian bg-[#F9F8F5] border border-[#E2DDD3] focus:border-[#0F1228] focus:bg-white rounded-xl focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-99 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Timer & Change Email */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Resend code in{" "}
                    <span className="font-semibold text-obsidian">
                      0:{timer < 10 ? `0${timer}` : timer}
                    </span>
                  </span>
                </div>

                <Link
                  href="/register"
                  className="font-semibold text-[#0F1228] hover:underline"
                >
                  Change email
                </Link>
              </div>

              {/* Help tip */}
              <div className="flex items-start gap-2 text-xs text-slate-400 pt-2 border-t border-[#EAE6DF]">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>Can&apos;t find it? Check your spam or promotions folder.</p>
              </div>
            </div>

            {/* Live Success Banner */}
            {isVerified && (
              <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-5 shadow-luxury border border-emerald-200 animate-in fade-in zoom-in-95 duration-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-obsidian">Email verified</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    Live Preview
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Your email address has been successfully authenticated with the Utsob Trust Vault.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full h-10 flex items-center justify-center gap-2 bg-[#0F1228] hover:bg-[#1A1F40] text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <span>Continue to celebration board</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Hero Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <AuthSideHero
              badge="UTSOB VAULT V2.4 • ESCROW PROTECTED"
              vaultScore="Bank-grade 256-bit"
              headline="Every celebration deserves the right people."
              subheadline="Hire award-winning cinematographers, decorators, caterers, and live musicians with total milestone transparency and guaranteed fund custody."
              quote="Being able to invite both families to our Ophir Reserve board and approve vendor milestones together saved our sanity."
              authorName="Marcus & Leena K."
              authorRole="Wedding • Austin, TX"
              badgeLabel="Verified Hosts"
              stats={[
                { value: "100%", label: "Disbursement Lock" },
                { value: "$48M+", label: "Secured in Milestones" },
                { value: "4.9/5", label: "Client Satisfaction" },
              ]}
            />
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
