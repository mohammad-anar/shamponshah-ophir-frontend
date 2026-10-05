"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Logo from "@/components/shared/Logo/Logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-6">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Logo />
        <Link href="/" className="text-xs font-semibold text-slate-700 hover:text-obsidian">
          Home
        </Link>
      </div>

      <div className="max-w-lg mx-auto text-center space-y-6 my-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-700 flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            SYSTEM NOTICE 500
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-obsidian tracking-tight">
            Unexpected System Error
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Our technical team has been automatically alerted. Your escrow vault deposits and data remain 100% secure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-[#0F1228] hover:bg-[#1A1F40] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-[#EAE6DF] text-slate-800 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Ophir Technologies Inc. All rights reserved.
      </div>
    </div>
  );
}
