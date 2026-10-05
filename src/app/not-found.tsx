"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Home, ArrowLeft, Search } from "lucide-react";
import Logo from "@/components/shared/Logo/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-6">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Logo />
        <Link href="/" className="text-xs font-semibold text-slate-700 hover:text-obsidian flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>

      <div className="max-w-lg mx-auto text-center space-y-6 my-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            ERROR 404
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-obsidian tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            The celebration or vendor page you are looking for has moved or does not exist in our directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#0F1228] hover:bg-[#1A1F40] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/vendors"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-[#EAE6DF] text-slate-800 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Browse Vendor Directory</span>
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Ophir Technologies Inc. All rights reserved.
      </div>
    </div>
  );
}
