"use client";

import React from "react";
import Logo from "@/components/shared/Logo/Logo";

const MyLoading = () => {
  return (
    <div className="min-h-[50vh] w-full flex flex-col justify-center items-center gap-4 py-12">
      <Logo size="lg" />
      <div className="relative flex items-center justify-center mt-2">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-[#0F0C3B] animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          Loading Ophir Vault...
        </p>
      </div>
    </div>
  );
};

export default MyLoading;

