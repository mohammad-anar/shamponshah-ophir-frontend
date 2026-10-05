"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  Sparkles, 
  Award,
  LogOut,
  Settings,
  ExternalLink,
  ArrowLeftRight
} from "lucide-react";

interface VendorHeaderProps {
  onMenuToggle: () => void;
}

export default function VendorHeader({ onMenuToggle }: VendorHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
      {/* Left section: mobile toggle & search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, jobs, messages..."
            className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-[#0F0C3B] placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Switch to Buying Button */}
        <Link
          href="/user"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Switch to Buying</span>
        </Link>

        {/* Tier Badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Rising Vendor (91% to Pro)</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border-2 border-white" />
        </button>

        {/* Vendor Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              MR
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-[#0F0C3B]">Marcus Reed</span>
              <span className="text-[10px] text-slate-500">Party Pulse Events</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-[#0F0C3B]">Marcus Reed</p>
                <p className="text-[11px] text-slate-500">Party Pulse Events</p>
              </div>
              <Link href="/user" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Client View
              </Link>
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Admin Console
              </Link>
              <Link href="/vendor/payout-settings" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Payout Settings
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
