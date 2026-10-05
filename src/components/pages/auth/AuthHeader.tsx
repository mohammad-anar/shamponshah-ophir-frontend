"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import Logo from "@/components/shared/Logo/Logo";

export default function AuthHeader() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
      <Logo />

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-obsidian hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        <Link
          href="/login"
          className="w-9 h-9 rounded-full bg-[#0F1228] text-white flex items-center justify-center hover:bg-obsidian transition-colors shadow-xs"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
