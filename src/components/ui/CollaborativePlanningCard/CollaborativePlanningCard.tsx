"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ThumbsUp,
  Wallet,
  ShieldCheck,
  PlayCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function CollaborativePlanningCard() {
  const [upvotes, setUpvotes] = useState({
    cinema: 4,
    floral: 3,
  });
  const [hasVoted, setHasVoted] = useState({
    cinema: true,
    floral: true,
  });

  const [fundedAmount, setFundedAmount] = useState(3400);
  const totalTarget = 4250;
  const fundedPercent = Math.min(100, Math.round((fundedAmount / totalTarget) * 100));

  const handleVote = (type: "cinema" | "floral") => {
    if (hasVoted[type]) {
      setUpvotes((prev) => ({ ...prev, [type]: prev[type] - 1 }));
      setHasVoted((prev) => ({ ...prev, [type]: false }));
      toast.info("Vote removed");
    } else {
      setUpvotes((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      setHasVoted((prev) => ({ ...prev, [type]: true }));
      toast.success("Family vote recorded!");
    }
  };

  const handleFundEscrow = () => {
    setFundedAmount(totalTarget);
    toast.success("Escrow target 100% funded and locked into Vault!");
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-background border-y border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Descriptive Story & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-brand border border-border-brand/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Created for Milestone Celebrations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight leading-[1.15]">
              Plan Together. <br className="hidden sm:inline" />
              Protect Together.
            </h2>

            <p className="text-foreground-muted text-sm sm:text-base leading-relaxed font-light">
              Eliminate chaotic group chats, lost contracts, and awkward reimbursement requests. Invite your family council to deliberate and fund ceremonial milestones seamlessly.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-surface border border-border text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-light text-foreground">
                    Democratic Family Board
                  </h4>
                  <p className="text-xs text-foreground-muted leading-relaxed font-light mt-0.5">
                    Shortlist vetted artisans, review live portfolios, and vote on floral scenography and culinary menus.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-surface border border-border text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ThumbsUp className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-light text-foreground">
                    Consensus Approval
                  </h4>
                  <p className="text-xs text-foreground-muted leading-relaxed font-light mt-0.5">
                    Council members cast approval votes on proposals before any binding escrow commitments are locked.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-surface border border-border text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wallet className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-light text-foreground">
                    Split Milestone Escrow
                  </h4>
                  <p className="text-xs text-foreground-muted leading-relaxed font-light mt-0.5">
                    Family members pledge and fund custom shares directly into the FDIC-insured escrow pool with itemized receipts.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/register?role=client"
                className="px-6 py-3 bg-brand hover:bg-brand-hover text-on-brand font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Start a Family Board</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => toast.info("Opening 2-Minute Guided Interactive Overview...")}
                className="px-5 py-3 bg-surface hover:bg-surface-sunken border border-border text-brand font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-brand" />
                <span>Watch 2-Min Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Shared Workspace Card */}
          <div className="lg:col-span-6">
            <div className="w-full bg-surface p-6 sm:p-8 shadow-2xl border border-border space-y-6">
              {/* Workspace Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand block">
                    SHARED WORKSPACE
                  </span>
                  <h3 className="font-serif font-light text-lg sm:text-xl text-foreground">
                    The Johnson Family Wedding Hub
                  </h3>
                  <span className="text-xs text-foreground-muted font-light">Austin, TX • Verified Reserve</span>
                </div>

                {/* Family Avatars */}
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 bg-background border border-border-brand text-brand font-bold text-xs flex items-center justify-center">
                    M
                  </div>
                  <div className="inline-block h-8 w-8 bg-surface-elevated border border-border text-foreground font-bold text-xs flex items-center justify-center">
                    D
                  </div>
                  <div className="inline-block h-8 w-8 bg-surface-elevated border border-border text-foreground font-bold text-xs flex items-center justify-center">
                    E
                  </div>
                  <div className="inline-block h-8 w-8 bg-background border border-border text-brand font-bold text-xs flex items-center justify-center">
                    +2
                  </div>
                </div>
              </div>

              {/* Shortlisted Vendors List */}
              <div className="space-y-3">
                {/* Vendor 1 */}
                <div className="p-4 bg-background border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:border-border-brand/40">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 overflow-hidden flex-shrink-0 bg-surface-elevated">
                      <Image
                        src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200&auto=format&fit=crop"
                        alt="Lumina Cinema Studios"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-light text-sm text-foreground">
                        Lumina Cinema Studios
                      </h4>
                      <p className="text-xs text-foreground-muted font-light">Lead Cinematographer • $2,450</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleVote("cinema")}
                      className="px-3 py-1 bg-surface text-success text-xs font-bold flex items-center gap-1.5 border border-success/30 hover:bg-surface-sunken transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-success" />
                      <span>{upvotes.cinema} of 4 Approved</span>
                    </button>
                  </div>
                </div>

                {/* Vendor 2 */}
                <div className="p-4 bg-background border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:border-border-brand/40">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 overflow-hidden flex-shrink-0 bg-surface-elevated">
                      <Image
                        src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop"
                        alt="Velvet & Bloom Design"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-light text-sm text-foreground">
                        Velvet & Bloom Design
                      </h4>
                      <p className="text-xs text-foreground-muted font-light">Floral Mandap Package • $1,800</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleVote("floral")}
                      className="px-3 py-1 bg-surface text-warning text-xs font-bold flex items-center gap-1.5 border border-warning/30 hover:bg-surface-sunken transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-warning" />
                      <span>{upvotes.floral} of 4 Voted</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Escrow Pool Target Progress */}
              <div className="p-5 bg-background border border-border text-foreground space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-foreground-muted uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-4 h-4 text-brand" />
                    <span>ESCROW POOL TARGET</span>
                  </div>
                  <span className="font-serif font-light text-lg text-brand">
                    ${totalTarget.toLocaleString()} Total
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-surface-elevated overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all duration-500"
                    style={{ width: `${fundedPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-muted font-light">
                  <span>${fundedAmount.toLocaleString()} funded by 3 family members</span>
                  <span className="font-bold text-brand">{fundedPercent}% funded</span>
                </div>

                {/* Fund CTA */}
                <button
                  type="button"
                  onClick={handleFundEscrow}
                  className="w-full h-11 mt-2 bg-brand hover:bg-brand-hover active:scale-99 text-on-brand font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {fundedPercent === 100
                      ? "Escrow Target 100% Locked in Vault"
                      : `Fund & Lock ($${fundedAmount.toLocaleString()} into Escrow)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
