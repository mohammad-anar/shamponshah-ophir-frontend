"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, CheckCircle2, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";

import { useVerifyEmailMutation, useResendVerificationMutation } from "@/redux/service/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { setUser } from "@/redux/features/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const emailParam = searchParams.get("email") || currentUser?.email || "vendor@example.com";
  const roleParam = searchParams.get("role") || currentUser?.role || "client";
  const isVendor = roleParam.toLowerCase() === "vendor";

  const [verifyEmailMutation] = useVerifyEmailMutation();
  const [resendVerificationMutation, { isLoading: isResending }] = useResendVerificationMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
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

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    try {
      await resendVerificationMutation({ email: emailParam }).unwrap();
      toast.success(`Verification code resent to ${emailParam}! Check your inbox or terminal.`);
      setTimer(60);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code. Please try again.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("").trim();
    if (token.length < 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyEmailMutation({ token }).unwrap();
      setIsVerified(true);
      if (currentUser) {
        dispatch(
          setUser({
            user: { ...currentUser, isEmailVerified: true },
            accessToken: localStorage.getItem("token"),
            refreshToken: null,
          })
        );
      }
      toast.success(res?.message || "Email verified! Account is now directly active.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: OTP Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-6">
            <div className="w-full max-w-md mx-auto bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Mail Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center shadow-xs">
                <Mail className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  Check your email
                </h1>
                <p className="text-foreground-muted text-xs sm:text-sm">
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
                      className="w-full aspect-square text-center font-bold text-lg sm:text-xl text-obsidian bg-[#F9F8F5] border border-[#E2DDD3] focus:border-[#0F1228] focus:bg-surface rounded-xl focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-99 text-foreground font-semibold rounded-xl shadow-md transition-all"
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

              {/* Timer & Resend / Change Email */}
              <div className="flex items-center justify-between text-xs text-foreground-muted pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-foreground-muted" />
                  {timer > 0 ? (
                    <span>
                      Resend code in{" "}
                      <span className="font-semibold text-obsidian">
                        0:{timer < 10 ? `0${timer}` : timer}
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={handleResend}
                      className="font-bold text-[#4F46E5] hover:underline disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend code now"}
                    </button>
                  )}
                </div>

                <Link
                  href="/register"
                  className="font-semibold text-[#0F1228] hover:underline"
                >
                  Change email
                </Link>
              </div>

              {/* Help tip */}
              <div className="flex items-start gap-2 text-xs text-foreground-muted pt-2 border-t border-[#EAE6DF]">
                <Info className="w-4 h-4 text-foreground-muted flex-shrink-0 mt-0.5" />
                <p>Can&apos;t find it? Check your spam or promotions folder.</p>
              </div>
            </div>

            {/* Live Success Banner */}
            {isVerified && (
              <div className="w-full max-w-md mx-auto bg-surface rounded-2xl p-5 shadow-luxury border border-emerald-200 animate-in fade-in zoom-in-95 duration-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-obsidian">
                        {isVendor ? "Vendor Account Activated" : "Email verified"}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <p className="text-xs text-foreground-muted">
                  {isVendor
                    ? "Your vendor email is verified and your account is directly activated. No manual approval needed! You can now publish gigs and accept orders."
                    : "Your email address has been successfully authenticated with Ophir Reserve."}
                </p>

                <button
                  type="button"
                  onClick={() => router.push(isVendor ? "/vendor" : "/user")}
                  className="w-full h-11 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-foreground text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <span>{isVendor ? "Go to Vendor Dashboard" : "Go to Dashboard"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
