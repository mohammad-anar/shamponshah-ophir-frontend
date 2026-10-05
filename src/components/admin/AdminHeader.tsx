"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function AdminHeader({ 
  onMenuToggle, 
  breadcrumbs
}: AdminHeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
      {/* Left section: mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          {computedBreadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-slate-300">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-slate-600 hover:text-[#0F0C3B] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#0F0C3B] font-black bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100/80">
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users, orders, vendors, disputes..."
            className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-14 py-2 text-xs text-[#0F0C3B] placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* System Health Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex flex-col leading-tight">
            <span>System Operational</span>
            <span className="text-[9px] text-emerald-600 font-normal">99.98% uptime</span>
          </div>
        </div>

        {/* Live Pod Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wider uppercase border border-indigo-100">
          <Activity className="w-3 h-3 text-indigo-500" />
          <span>LIVE POD 01</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border-2 border-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F0C3B]">Action Alerts</span>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">4 Pending</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-red-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> 1 Dispute Past 3-Day SLA
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Case #DS-1049 (Windy City Sound - $2,400 hold)</p>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-[#0F0C3B]">12 Vendor Applications Pending &gt;48h</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Chicago & Atlanta regional queues awaiting check</p>
                </div>
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <Link href="/admin/disputes" className="text-[11px] font-semibold text-brand-primary hover:underline">
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
            className="flex items-center gap-2.5 pl-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              JO
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-[#0F0C3B]">Jordan (Ops)</span>
              <span className="text-[10px] text-slate-500">Trust & Safety Lead</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 lg:hidden">
                <p className="font-bold text-[#0F0C3B]">Jordan (Ops)</p>
                <p className="text-[11px] text-slate-500">Trust & Safety Lead</p>
              </div>
              <Link href="/user" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Switch to Client View
              </Link>
              <Link href="/vendor" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Switch to Vendor View
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Admin Settings
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
