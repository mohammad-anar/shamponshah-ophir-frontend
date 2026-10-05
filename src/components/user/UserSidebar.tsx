"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  Bookmark,
  Users2,
  CreditCard,
  Star,
  Bell,
  Scale,
  Settings,
  X
} from "lucide-react";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  highlight?: boolean;
  dot?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Overview", href: "/user", icon: LayoutDashboard },
      { label: "My Events", href: "/user/events", icon: Calendar },
      { label: "Post a Job", href: "/user/post-job", icon: PlusCircle, highlight: true },
      { label: "My Jobs", href: "/user/jobs", icon: Briefcase },
      { label: "Orders", href: "/user/orders", icon: ShoppingBag },
      { label: "Messages", href: "/user/messages", icon: MessageSquare, badge: "3" },
    ],
  },
  {
    title: "PLAN",
    items: [
      { label: "Saved Vendors", href: "/user/saved-vendors", icon: Bookmark },
      { label: "Family Hub", href: "/user/family-hub", icon: Users2, dot: true },
    ],
  },
  {
    title: "MONEY",
    items: [
      { label: "Payments & Invoices", href: "/user/payments", icon: CreditCard },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Reviews", href: "/user/reviews", icon: Star },
      { label: "Notifications", href: "/user/notifications", icon: Bell },
      { label: "Resolution Center", href: "/user/disputes", icon: Scale },
      { label: "Settings", href: "/user/settings", icon: Settings },
    ],
  },
];


export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
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
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Logo href="/user" />
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider mb-1.5 uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/user" && pathname.startsWith(item.href));
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
                          : item.highlight
                            ? "text-brand-primary hover:bg-indigo-50 font-bold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : item.highlight ? "text-brand-primary" : "text-slate-400")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0F0C3B] text-white">
                          {item.badge}
                        </span>
                      )}

                      {item.dot && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
