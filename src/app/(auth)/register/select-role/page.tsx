"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Store, CheckCircle2, ArrowRight, Lock, Check } from "lucide-react";
import AuthHeader from "@/components/pages/auth/AuthHeader";
import AuthFooter from "@/components/pages/auth/AuthFooter";
import AuthSideHero from "@/components/pages/auth/AuthSideHero";
import { cn } from "@/lib/utils";

export default function SelectRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"client" | "vendor">("client");

  const handleContinue = () => {
    if (selectedRole === "client") {
      router.push("/register?role=client");
    } else {
      router.push("/register?role=vendor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: Role Selection Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-luxury border border-[#EAE6DF] space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3730A3]" />
                  STEP 2 OF 3
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Escrow Ready Setup
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
                  How will you use Ophir Reserve?
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Select how you&apos;d like to get started. You can hire or offer verified services from within one unified ecosystem.
                </p>
              </div>

              {/* Role Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Option 1: Client / Host */}
                <div
                  onClick={() => setSelectedRole("client")}
                  className={cn(
                    "relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3",
                    selectedRole === "client"
                      ? "bg-[#FAF9F5] border-[#0F1228] shadow-sm"
                      : "bg-white border-[#EAE6DF] hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>

                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                        selectedRole === "client"
                          ? "bg-[#0F1228] text-white"
                          : "border-2 border-slate-300 bg-white"
                      )}
                    >
                      {selectedRole === "client" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-obsidian">
                      I want to hire
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Find artisans & plan milestone celebrations.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>FDIC milestone escrow</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Vetted cultural artisans</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Shared Family Hub</span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Vendor / Artisan */}
                <div
                  onClick={() => setSelectedRole("vendor")}
                  className={cn(
                    "relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3",
                    selectedRole === "vendor"
                      ? "bg-[#FAF9F5] border-[#0F1228] shadow-sm"
                      : "bg-white border-[#EAE6DF] hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shadow-xs">
                      <Store className="w-5 h-5" />
                    </div>

                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                        selectedRole === "vendor"
                          ? "bg-[#0F1228] text-white"
                          : "border-2 border-slate-300 bg-white"
                      )}
                    >
                      {selectedRole === "vendor" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-obsidian">
                      I offer services
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Get booked and scale creative vendor operations.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>0% commission on gigs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Guaranteed payouts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Direct client RFP leads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Callout */}
              <div className="p-3.5 rounded-xl bg-[#F8F7F4] border border-[#EAE6DF] text-xs text-slate-600 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E2DDD3] flex items-center justify-center flex-shrink-0 text-slate-700">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  Backed by <span className="font-semibold text-obsidian">Utsob Vault Escrow</span>. Funds release solely upon your milestone signoff.
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-12 flex items-center justify-center gap-2 bg-[#0F1228] hover:bg-[#1A1F40] active:scale-99 text-white font-semibold rounded-xl shadow-md transition-all"
              >
                <span>
                  {selectedRole === "client" ? "Continue with Client Account" : "Continue with Vendor Studio"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[11px] text-slate-400">
                You can switch roles or run dual accounts anytime from settings.
              </p>

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
              badge="Trusted by 8,000+ Verified Artisans"
              vaultScore="4.96/5 Vault Score"
              headline="Every celebration deserves the right people."
              subheadline="Whether assembling your dream multi-day vendor collective or booking high-value commissions with total fund protection."
              quote="Ophir Reserve eliminated all awkward deposit negotiations. Clients deposit safely into escrow, and we do our best creative work without chasing invoices."
              authorName="Elena Rostova"
              authorRole="Velvet & Bloom Floral • Elite Guild"
              badgeLabel="Elite Guild Artisan"
            />
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
