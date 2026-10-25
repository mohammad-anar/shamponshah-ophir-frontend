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
          <Link
            href="/user/family-hub"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Users2 className="w-3.5 h-3.5 text-brand-primary" />
            <span className="max-w-[150px] truncate">{activeHubName}</span>
          </Link>
        </div>

        {/* Notifications */}
        <Link 
          href="/user/notifications"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center border border-white">
              {unreadNotifs}
            </span>
          )}
        </Link>

        {/* Messages */}
        <Link 
          href="/user/messages"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors hidden sm:block"
          title="Messages"
        >
          <MessageSquare className="w-4 h-4" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center border border-white">
              {unreadMessages}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {initials}
            </div>
            <span className="hidden md:block text-xs font-bold text-[#0F0C3B]">
              {userName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-[#0F0C3B] truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
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
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer text-left"
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
