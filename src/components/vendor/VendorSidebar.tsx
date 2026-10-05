"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Calendar,
  Sparkles,
  Search,
  FileCheck,
  TrendingUp,
  Star,
  Award,
  Wallet,
  Settings,
  Coins,
  ShieldCheck,
  X
} from "lucide-react";

interface VendorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "WORK",
    items: [
      { label: "Overview", href: "/vendor", icon: LayoutDashboard },
      { label: "Orders", href: "/vendor/orders", icon: ShoppingBag, badge: "5", badgeColor: "bg-indigo-100 text-indigo-800" },
      { label: "Messages", href: "/vendor/messages", icon: MessageSquare, badge: "2", badgeColor: "bg-amber-500 text-white" },
      { label: "Calendar", href: "/vendor/calendar", icon: Calendar },
    ],
  },

  {
    title: "GROW",
    items: [
      { label: "My Gigs", href: "/vendor/gigs", icon: Sparkles },
      { label: "Find Jobs", href: "/vendor/find-jobs", icon: Search },
      { label: "My Offers", href: "/vendor/offers", icon: FileCheck },
      { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
      { label: "Reviews", href: "/vendor/reviews", icon: Star },
      { label: "Levels", href: "/vendor/levels", icon: Award },
    ],
  },
  {
    title: "MONEY",
    items: [
      { label: "Earnings & Wallet", href: "/vendor/earnings", icon: Wallet },
      { label: "Payout Settings", href: "/vendor/payout-settings", icon: Settings },
      { label: "Bid Credits", href: "/vendor/bid-credits", icon: Coins },
    ],
  },
];

export default function VendorSidebar({ isOpen, onClose }: VendorSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Logo variant="vendor" href="/vendor" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider mb-1.5 uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                        isActive
                          ? "bg-[#EDE9FE] text-[#0F0C3B]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : "text-slate-400")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={cn("px-1.5 py-0.2 rounded-full text-[10px] font-bold", item.badgeColor)}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Payout Guarantee Banner */}
        <div className="p-3 border-t border-slate-100 bg-[#F8F9FD] text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-[#0F0C3B]">Keep 100% of your price</p>
            <p className="text-[10px] text-slate-400">Clients pay 5% platform fee</p>
          </div>
        </div>
      </aside>
    </>
  );
}
