"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  MessageSquare, 
  Sparkles,
  LogOut,
  User,
  Settings,
  ExternalLink,
  Users2,
  Check
} from "lucide-react";

interface UserHeaderProps {
  onMenuToggle: () => void;
}

const joinedHubs = [
  { id: "hub-1", name: "Emily & David's Wedding" },
  { id: "hub-2", name: "Miller 40th Birthday" },
  { id: "hub-3", name: "Carter Family Holiday" },
];

export default function UserHeader({ onMenuToggle }: UserHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHubPicker, setShowHubPicker] = useState(false);
  const [activeHub, setActiveHub] = useState(joinedHubs[0]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
      {/* Left section: mobile hamburger & search */}
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
            placeholder="Search vendors, gigs, family services..."
            className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-[#0F0C3B] placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Workspace / Family Hub Switcher */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowHubPicker(!showHubPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Users2 className="w-3.5 h-3.5 text-brand-primary" />
            <span className="max-w-[130px] truncate">{activeHub.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showHubPicker && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
                Active Celebration Hub
              </span>
              {joinedHubs.map((hub) => (
                <div
                  key={hub.id}
                  onClick={() => {
                    setActiveHub(hub);
                    setShowHubPicker(false);
                  }}
                  className={`p-2 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                    activeHub.id === hub.id ? "bg-[#EDE9FE] text-[#0F0C3B] font-bold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="truncate">{hub.name}</span>
                  {activeHub.id === hub.id && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                </div>
              ))}
              <div className="pt-1.5 border-t border-slate-100">
                <Link
                  href="/user/family-hub"
                  onClick={() => setShowHubPicker(false)}
                  className="w-full py-1.5 px-3 rounded-lg text-brand-primary font-bold hover:bg-indigo-50 flex items-center gap-1.5"
                >
                  <Users2 className="w-3.5 h-3.5" /> View Family Board
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Link 
          href="/user/notifications"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border-2 border-white" />
        </Link>

        {/* Messages */}
        <Link 
          href="/user/messages"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors hidden sm:block"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              EC
            </div>
            <span className="hidden md:block text-xs font-bold text-[#0F0C3B]">
              Emily Carter
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-[#0F0C3B]">Emily Carter</p>
                <p className="text-[11px] text-slate-500">emily.carter@gmail.com</p>
              </div>
              <Link href="/vendor" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Switch to Seller Mode
              </Link>
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Admin Console
              </Link>
              <Link href="/user/settings" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Account Settings
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
