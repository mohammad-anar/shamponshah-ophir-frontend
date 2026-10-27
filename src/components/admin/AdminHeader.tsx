"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { 
  Search, 
  Bell, 
  Menu, 
  Command, 
  Activity, 
  ChevronDown, 
  ShieldAlert,
  LogOut,
  Settings,
  ExternalLink
} from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

const routeMap: Record<string, { section: string; title: string }> = {
  "/admin": { section: "Operations", title: "Overview" },
  "/admin/users": { section: "Operations", title: "Users" },
  "/admin/vendor-approvals": { section: "Operations", title: "Vendor Approvals" },
  "/admin/gigs": { section: "Operations", title: "Gigs Catalog" },
  "/admin/jobs": { section: "Operations", title: "Jobs & RFPs" },
  "/admin/orders": { section: "Finance", title: "Orders & Escrow" },
  "/admin/payouts": { section: "Finance", title: "Vendor Payouts" },
  "/admin/fees-reports": { section: "Finance", title: "Fees & Financial Reports" },
  "/admin/disputes": { section: "Trust & Safety", title: "Disputes & Mediation" },
  "/admin/reviews-reports": { section: "Trust & Safety", title: "Reviews & Trust Reports" },
  "/admin/support": { section: "Trust & Safety", title: "Support Ticket Desk" },
  "/admin/levels": { section: "Platform", title: "Levels & Merit Rules" },
  "/admin/categories": { section: "Platform", title: "Taxonomy & Categories" },
  "/admin/settings": { section: "Platform", title: "System Settings" },
};

import { useAppDispatch } from "@/redux/hooks/hooks";
import { logout } from "@/redux/features/auth";
import { baseApi } from "@/redux/api/baseApi";

export default function AdminHeader({ 
  onMenuToggle, 
  breadcrumbs
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: meData } = useGetMeQuery();
  const me = (meData as any)?.data || meData;
  const userName = me?.name || me?.clientProfile?.displayName || me?.vendorProfile?.businessName || "Admin (Ops)";
  const userRole = me?.role === "ADMIN" ? "Platform Administrator" : "Trust & Safety Lead";
  const initials = userName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  // Compute breadcrumbs dynamically if not provided
  let computedBreadcrumbs = breadcrumbs;
  if (!computedBreadcrumbs) {
    if (pathname.startsWith("/admin/gigs/")) {
      computedBreadcrumbs = [
        { label: "Ophir Admin", href: "/admin" },
        { label: "Operations", href: "/admin/gigs" },
        { label: "Gigs", href: "/admin/gigs" },
        { label: "Service Audit" }
      ];
    } else if (pathname.startsWith("/admin/jobs/")) {
      computedBreadcrumbs = [
        { label: "Ophir Admin", href: "/admin" },
        { label: "Operations", href: "/admin/jobs" },
        { label: "Jobs & RFPs", href: "/admin/jobs" },
        { label: "Job Inspection" }
      ];
    } else {
      const match = routeMap[pathname] || { section: "Admin", title: "Overview" };
      computedBreadcrumbs = [
        { label: "Ophir Admin", href: "/admin" },
        { label: match.section, href: "/admin" },
        { label: match.title }
      ];
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/95 backdrop-blur-md border-b border-border px-4 md:px-8 flex items-center justify-between text-foreground">
      {/* Left section: mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
          {computedBreadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-foreground-secondary">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-foreground-muted hover:text-brand transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-brand font-bold bg-surface-sunken px-2 py-0.5 rounded-md border border-border-brand/40">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users, orders, vendors, disputes..."
            className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-14 py-2 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand focus:bg-surface-sunken transition-all shadow-sm"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-foreground-muted bg-surface border border-border rounded shadow-xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* System Health Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-soft text-success border border-success/30/40 text-success text-[11px] font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-solid text-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-solid text-foreground"></span>
          </span>
          <div className="flex flex-col leading-tight">
            <span>System Operational</span>
            <span className="text-[9px] text-success font-normal">99.98% uptime</span>
          </div>
        </div>

        {/* Live Pod Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-sunken text-brand text-[10px] font-bold tracking-wider uppercase border border-border-brand/40">
          <Activity className="w-3 h-3 text-brand" />
          <span>LIVE POD 01</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand border-2 border-border" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-2xl border border-border py-3 z-50 animate-in fade-in slide-in-from-top-2 text-foreground">
              <div className="px-4 pb-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Action Alerts</span>
                <span className="text-[10px] font-semibold bg-surface-sunken text-brand border border-border-brand/40 px-2 py-0.5 rounded-full">4 Pending</span>
              </div>
              <div className="divide-y divide-border text-xs">
                <div className="p-3 hover:bg-surface-elevated transition-colors">
                  <p className="font-semibold text-danger flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> 1 Dispute Past 3-Day SLA
                  </p>
                  <p className="text-[11px] text-foreground-muted mt-0.5">Case #DS-1049 (Windy City Sound - $2,400 hold)</p>
                </div>
                <div className="p-3 hover:bg-surface-elevated transition-colors">
                  <p className="font-semibold text-foreground">12 Vendor Applications Pending &gt;48h</p>
                  <p className="text-[11px] text-foreground-muted mt-0.5">Chicago & Atlanta regional queues awaiting check</p>
                </div>
              </div>
              <div className="px-4 pt-2 border-t border-border text-center">
                <Link href="/admin/disputes" className="text-[11px] font-semibold text-brand hover:underline">
                  View All Escalations →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 py-1 rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-surface-sunken text-brand border border-border-brand/40 flex items-center justify-center font-bold text-xs shadow-sm">
              {initials}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-foreground">{userName}</span>
              <span className="text-[10px] text-foreground-muted">{userRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-foreground-muted" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-surface rounded-xl shadow-2xl border border-border py-1.5 z-50 text-xs text-foreground">
              <div className="px-3 py-2 border-b border-border lg:hidden">
                <p className="font-bold text-foreground">{userName}</p>
                <p className="text-[11px] text-foreground-muted">{userRole}</p>
              </div>
              <Link href="/user" className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:bg-surface-elevated hover:text-foreground">
                <ExternalLink className="w-3.5 h-3.5 text-brand" /> Switch to Client View
              </Link>
              <Link href="/vendor" className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:bg-surface-elevated hover:text-foreground">
                <ExternalLink className="w-3.5 h-3.5 text-brand" /> Switch to Vendor View
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:bg-surface-elevated hover:text-foreground">
                <Settings className="w-3.5 h-3.5 text-foreground-muted" /> Admin Settings
              </Link>
              <div className="border-t border-border my-1" />
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-danger hover:bg-danger-soft text-danger text-left cursor-pointer"
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
