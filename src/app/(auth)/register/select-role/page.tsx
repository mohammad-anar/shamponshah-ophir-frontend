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
  const [selectedRole, setSelectedRole] = useState<"client" | "collaborator" | "vendor">("client");

  const handleContinue = () => {
    if (selectedRole === "client") {
      router.push("/signup?role=client");
    } else if (selectedRole === "collaborator") {
      router.push("/signup?role=collaborator");
    } else {
      router.push("/signup?role=vendor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          {/* Left: Role Selection Form Card */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            <div className="w-full max-w-xl mx-auto bg-surface rounded-none p-6 sm:p-8 lg:p-10 shadow-luxury border border-border space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-sunken text-brand text-xs font-bold uppercase tracking-wider border border-border">
                  <span className="w-1.5 h-1.5 bg-brand text-on-brand" />
                  STEP 2 OF 3
                </span>
                <span className="text-xs font-semibold text-foreground-muted">
                  Identity Architecture
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Choose Your Path
                </h1>
                <p className="text-foreground-muted text-xs sm:text-sm">
                  Select how you want to experience Ophir Reserve. You can switch roles or join multiple workspaces with unified credentials.
                </p>
              </div>

              {/* Role Cards Grid - 3 Path Cards matching Figma */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {/* Option 1: Client / Host */}
                <div
                  onClick={() => setSelectedRole("client")}
                  className={cn(
                    "relative p-4 rounded-none border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3",
                    selectedRole === "client"
                      ? "bg-surface-elevated border-brand shadow-sm"
                      : "bg-surface border-border hover:border-brand/40"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 bg-brand-soft text-brand flex items-center justify-center border border-brand/20">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center transition-all",
                        selectedRole === "client"
                          ? "bg-brand text-black"
                          : "border border-border bg-surface"
                      )}
                    >
                      {selectedRole === "client" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand">Host / Planner</span>
                    <h3 className="font-serif font-bold text-base text-foreground mt-0.5">
                      Client
                    </h3>
                    <p className="text-[11px] text-foreground-muted mt-1 leading-snug">
                      Plan celebrations, curate artisans, and manage escrow milestones.
                    </p>
                  </div>

                  <div className="space-y-1 pt-1 text-[10px] text-foreground-secondary border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>FDIC milestone escrow</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Heritage artisans</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Collaboration Suite</span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Team Collaborator */}
                <div
                  onClick={() => setSelectedRole("collaborator")}
                  className={cn(
                    "relative p-4 rounded-none border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3",
                    selectedRole === "collaborator"
                      ? "bg-surface-elevated border-brand shadow-sm"
                      : "bg-surface border-border hover:border-brand/40"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 bg-brand-soft text-brand flex items-center justify-center border border-brand/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center transition-all",
                        selectedRole === "collaborator"
                          ? "bg-brand text-black"
                          : "border border-border bg-surface"
                      )}
                    >
                      {selectedRole === "collaborator" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand">Team Workspace</span>
                    <h3 className="font-serif font-bold text-base text-foreground mt-0.5">
                      Collaborator
                    </h3>
                    <p className="text-[11px] text-foreground-muted mt-1 leading-snug">
                      Join an existing celebration, brainstorm vendors, and cast votes.
                    </p>
                  </div>

                  <div className="space-y-1 pt-1 text-[10px] text-foreground-secondary border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Invited workspace access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Decision voting</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Brain Dump & Kanban</span>
                    </div>
                  </div>
                </div>

                {/* Option 3: Vendor / Provider */}
                <div
                  onClick={() => setSelectedRole("vendor")}
                  className={cn(
                    "relative p-4 rounded-none border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3",
                    selectedRole === "vendor"
                      ? "bg-surface-elevated border-brand shadow-sm"
                      : "bg-surface border-border hover:border-brand/40"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 bg-brand-soft text-brand flex items-center justify-center border border-brand/20">
                      <Store className="w-4 h-4" />
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center transition-all",
                        selectedRole === "vendor"
                          ? "bg-brand text-black"
                          : "border border-border bg-surface"
                      )}
                    >
                      {selectedRole === "vendor" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand">Artisan Studio</span>
                    <h3 className="font-serif font-bold text-base text-foreground mt-0.5">
                      Vendor
                    </h3>
                    <p className="text-[11px] text-foreground-muted mt-1 leading-snug">
                      Offer heritage craftsmanship, manage pipelines, and receive payouts.
                    </p>
                  </div>

                  <div className="space-y-1 pt-1 text-[10px] text-foreground-secondary border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>0% commission on gigs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Guaranteed payouts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand flex-shrink-0" />
                      <span>Direct client RFP leads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Callout */}
              <div className="p-3.5 rounded-none bg-surface-elevated border border-border text-xs text-foreground-secondary flex items-center gap-2.5">
                <div className="w-7 h-7 bg-surface border border-border flex items-center justify-center flex-shrink-0 text-foreground-secondary">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  Protected by <span className="font-semibold text-foreground">Ophir Reserve Escrow</span>. Milestone funds release solely on verified completion.
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-12 flex items-center justify-center gap-2 bg-brand text-black font-semibold rounded-none shadow-md hover:bg-brand-hover active:scale-99 transition-all uppercase tracking-wider text-xs"
              >
                <span>
                  {selectedRole === "client" && "Continue as Client (Host)"}
                  {selectedRole === "collaborator" && "Continue as Team Collaborator"}
                  {selectedRole === "vendor" && "Continue with Vendor Studio"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[11px] text-foreground-muted">
                You can switch between client, collaborator, and vendor modes anytime from your profile.
              </p>

              {/* Bottom Sign In Link */}
              <div className="pt-2 text-center text-xs text-foreground-secondary border-t border-border">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  className="font-bold text-foreground hover:text-gold-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Rich Hero Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <AuthSideHero
              badge="Trusted by 8,000+ Verified Vendors"
              vaultScore="4.96/5 Vault Score"
              headline="Every celebration deserves the right people."
              subheadline="Whether assembling your dream multi-day vendor collective or booking high-value commissions with total fund protection."
              quote="Ophir Reserve eliminated all awkward deposit negotiations. Clients deposit safely into escrow, and we do our best creative work without chasing invoices."
              authorName="Elena Rostova"
              authorRole="Velvet & Bloom Floral • Elite Guild"
              badgeLabel="Elite Guild Vendor"
            />
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
