"use client";

import React from "react";
import Link from "next/link";

export default function AuthFooter() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-[#26282E] mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div>
        <p>© {new Date().getFullYear()} Ophir Technologies Inc. All rights reserved.</p>
      </div>

      <div className="flex items-center gap-5 font-medium">
        <Link href="/help-center" className="hover:text-[#DFB76C] hover:underline transition-colors">
          Security & Escrow Terms
        </Link>
        <Link href="/terms" className="hover:text-[#DFB76C] hover:underline transition-colors">
          Privacy Policy
        </Link>
        <Link href="/contact-us" className="hover:text-[#DFB76C] hover:underline transition-colors">
          Support Concierge
        </Link>
      </div>
    </footer>
  );
}
