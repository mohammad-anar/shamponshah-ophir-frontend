"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { useGetWorkspaceQuery } from "@/redux/service/family-hub/familyHubApi";
import { useGetUserNotificationsQuery } from "@/redux/service/notifications/notificationsApi";
import { useGetUserConversationsQuery } from "@/redux/service/messages/messagesApi";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { logout } from "@/redux/features/auth";
import { baseApi } from "@/redux/api/baseApi";

interface UserHeaderProps {
  onMenuToggle: () => void;
}

export default function UserHeader({ onMenuToggle }: UserHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showProfile, setShowProfile] = useState(false);
  const [showHubPicker, setShowHubPicker] = useState(false);

  const { data: meData } = useGetMeQuery();
  const { data: workspaceData } = useGetWorkspaceQuery();
  const { data: notificationsData } = useGetUserNotificationsQuery();
  const { data: conversationsData } = useGetUserConversationsQuery();

  const me = (meData as any)?.data || meData;
  const userName = me?.clientProfile?.fullName || me?.name || "Client Host";
  const userEmail = me?.email || "host@ophir.com";
  const initials = userName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CH";

  const workspace = (workspaceData as any)?.data || workspaceData;
  const activeHubName = workspace?.name || "Emma's Celebration Board";

  const notifList = Array.isArray(notificationsData) ? notificationsData : (notificationsData?.data || []);
  const unreadNotifs = notifList.filter((n: any) => !n.isRead).length;

  const convList = Array.isArray(conversationsData) ? conversationsData : (conversationsData?.data || []);
  const unreadMessages = convList.reduce((acc: number, c: any) => acc + (c.unreadCount || 0), 0);

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0C0E] border-b border-[#26282E] px-4 md:px-8 flex items-center justify-between">
      {/* Left section: mobile hamburger & search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-none text-slate-400 hover:bg-[#16181F] hover:text-white"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendors, gigs, family services..."
            className="w-full bg-[#121418] border border-[#26282E] rounded-none pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFB76C] transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Workspace / Family Hub Switcher */}
        <div className="relative hidden sm:block">
          <Link
            href="/user/family-hub"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#26282E] bg-[#121418] text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-[#DFB76C] hover:border-[#DFB76C]/60 transition-colors"
          >
            <Users2 className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span className="max-w-[150px] truncate">{activeHubName}</span>
          </Link>
        </div>

        {/* Notifications */}
        <Link 
          href="/user/notifications"
          className="relative p-2 rounded-none text-slate-400 hover:text-white hover:bg-[#16181F] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-none bg-[#DFB76C] text-[10px] font-bold text-[#0B0C0E] flex items-center justify-center">
              {unreadNotifs}
            </span>
          )}
        </Link>

        {/* Messages */}
        <Link 
          href="/user/messages"
          className="relative p-2 rounded-none text-slate-400 hover:text-white hover:bg-[#16181F] transition-colors hidden sm:block"
          title="Messages"
        >
          <MessageSquare className="w-4 h-4" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-none bg-[#DFB76C] text-[10px] font-bold text-[#0B0C0E] flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 py-1 rounded-none hover:bg-[#16181F] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <span className="hidden md:block text-xs font-bold text-white">
              {userName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-[#121418] rounded-none shadow-2xl border border-[#26282E] py-1.5 z-50 text-xs animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#26282E]">
                <p className="font-bold text-white font-serif truncate">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
              </div>
              <Link href="/vendor" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-[#16181F] hover:text-[#DFB76C]">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Switch to Seller Mode
              </Link>
              <Link href="/admin" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-[#16181F] hover:text-[#DFB76C]">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Admin Console
              </Link>
              <Link href="/user/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-[#16181F] hover:text-[#DFB76C]">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Account Settings
              </Link>
              <div className="border-t border-[#26282E] my-1" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/30 cursor-pointer text-left font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
