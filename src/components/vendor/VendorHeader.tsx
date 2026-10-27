"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowLeftRight,
  User
} from "lucide-react";
import { useGetMyVendorProfileQuery } from "@/redux/service/vendors/vendorsApi";
import { useGetUserNotificationsQuery } from "@/redux/service/notifications/notificationsApi";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { logout } from "@/redux/features/auth";
import { baseApi } from "@/redux/api/baseApi";

interface VendorHeaderProps {
  onMenuToggle: () => void;
}

export default function VendorHeader({ onMenuToggle }: VendorHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showProfile, setShowProfile] = useState(false);

  const { data: rawProfile } = useGetMyVendorProfileQuery();
  const { data: rawNotifications } = useGetUserNotificationsQuery();

  const profile = (rawProfile as any)?.data || rawProfile;
  const notificationsList = (rawNotifications as any)?.data || (Array.isArray(rawNotifications) ? rawNotifications : []);
  const unreadCount = notificationsList.filter((n: any) => !n.isRead).length;

  const vendorName = profile?.user?.name || profile?.businessName || "Marcus Reed";
  const businessName = profile?.businessName || profile?.name || "Party Pulse Events";
  const initials = vendorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "VR";
  const tier = profile?.tier ? `${profile.tier} Vendor` : "Rising Vendor";

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0C0E] border-b border-[#26282E] px-4 md:px-8 flex items-center justify-between">
      {/* Left section: mobile toggle & search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-none text-foreground-muted hover:bg-[#16181F] hover:text-foreground"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, jobs, messages..."
            className="w-full bg-[#121418] border border-[#26282E] rounded-none pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C] transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Switch to Buying Button */}
        <Link
          href="/user"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#26282E] bg-[#121418] text-xs font-semibold uppercase tracking-wider text-foreground-secondary hover:text-[#DFB76C] hover:border-border-brand/40 transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span>Switch to Buying</span>
        </Link>

        {/* Tier Badge */}
        <Link
          href="/vendor/levels"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40 text-[11px] font-bold uppercase tracking-wider hover:bg-[#20242D] transition-colors"
        >
          <Award className="w-3.5 h-3.5 text-[#DFB76C]" />
          <span>{tier}</span>
        </Link>

        {/* Notifications */}
        <Link
          href="/vendor/notifications"
          className="relative p-2 rounded-none text-foreground-muted hover:text-foreground hover:bg-[#16181F] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-none bg-[#DFB76C] animate-pulse" />
          )}
        </Link>

        {/* Vendor Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 py-1 rounded-none hover:bg-[#16181F] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-foreground">{vendorName}</span>
              <span className="text-[10px] text-foreground-muted">{businessName}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-foreground-muted hidden lg:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-[#121418] rounded-none shadow-2xl border border-[#26282E] py-1.5 z-50 text-xs animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#26282E]">
                <p className="font-bold text-foreground font-serif">{vendorName}</p>
                <p className="text-[11px] text-foreground-muted">{businessName}</p>
              </div>
              <Link href="/vendor/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:bg-[#16181F] hover:text-[#DFB76C]">
                <User className="w-3.5 h-3.5 text-foreground-muted" /> Public Profile
              </Link>
              <Link href="/user" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:bg-[#16181F] hover:text-[#DFB76C]">
                <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" /> Client View
              </Link>
              <Link href="/vendor/payout-settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:bg-[#16181F] hover:text-[#DFB76C]">
                <Settings className="w-3.5 h-3.5 text-foreground-muted" /> Payout Settings
              </Link>
              <div className="border-t border-[#26282E] my-1" />
              <button 
                onClick={handleSignOut} 
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-danger hover:bg-danger-soft text-danger cursor-pointer font-semibold"
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
