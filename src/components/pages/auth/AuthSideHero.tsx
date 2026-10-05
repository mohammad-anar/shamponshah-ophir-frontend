"use client";

import React from "react";
import Image from "next/image";
import { Star, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

interface AuthSideHeroProps {
  badge?: string;
  vaultScore?: string;
  headline?: string;
  subheadline?: string;
  quote?: string;
  authorName?: string;
  authorRole?: string;
  authorLocation?: string;
  authorAvatar?: string;
  badgeLabel?: string;
  stats?: { value: string; label: string }[];
}

export default function AuthSideHero({
  badge = "FDIC-Insured Escrow • 100% Verified Artisans",
  vaultScore = "4.96/5 Vault Score",
  headline = "Every celebration deserves the right people.",
  subheadline = "Over 50,000 multi-generational milestones coordinated with unyielding contract clarity and milestone-based fund releases.",
  quote = "Ophir kept our 450-guest wedding completely on budget and stress-free. Releasing milestone funds gave us 100% peace of mind.",
  authorName = "Priya & Rohan S.",
  authorRole = "Married in Chicago, IL",
  badgeLabel = "5.0 Star Milestone Release",
  stats,
}: AuthSideHeroProps) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full h-full min-h-[680px] p-8 xl:p-12 rounded-[28px] overflow-hidden shadow-2xl bg-[#090C19] text-white">
      {/* Background Ambience Image with Rich Gradient Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Midnight Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#0C1022]/85 to-[#080B14]/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent" />

      {/* Top Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-amber-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>{badge}</span>
        </div>

        {vaultScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-gold/30 text-xs font-semibold text-gold-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{vaultScore}</span>
          </div>
        )}
      </div>

      {/* Middle Headline */}
      <div className="relative z-10 my-auto py-8 max-w-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
          <Lock className="w-3 h-3" />
          <span>Financially Protected Gatherings</span>
        </div>

        <h2 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-[1.15] text-white tracking-tight">
          {headline}
        </h2>

        <p className="text-slate-300 text-sm xl:text-base leading-relaxed font-normal">
          {subheadline}
        </p>

        {/* Optional Stats row */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-serif text-2xl font-bold text-gold-300">{s.value}</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Testimonial Box */}
      <div className="relative z-10 p-5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-semibold text-slate-200 ml-1.5">{badgeLabel}</span>
          </div>

          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
            Verified Escrow
          </span>
        </div>

        <p className="text-xs xl:text-sm text-slate-200 italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 text-obsidian font-bold flex items-center justify-center text-xs shadow-sm">
              {authorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-white">{authorName}</div>
              <div className="text-[11px] text-slate-400">{authorRole}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Escrow Released</span>
          </div>
        </div>
      </div>
    </div>
  );
}
