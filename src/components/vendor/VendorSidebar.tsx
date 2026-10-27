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
  Scale,
  X
} from "lucide-react";
import { useGetVendorOrdersQuery } from "@/redux/service/orders/ordersApi";
import { useGetUserConversationsQuery } from "@/redux/service/messages/messagesApi";

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

export default function VendorSidebar({ isOpen, onClose }: VendorSidebarProps) {
  const pathname = usePathname();

  const { data: rawOrders } = useGetVendorOrdersQuery();
  const { data: rawConversations } = useGetUserConversationsQuery();

  const ordersList = (rawOrders as any)?.data?.orders || (rawOrders as any)?.orders || (Array.isArray(rawOrders) ? rawOrders : []);
  const activeOrdersCount = ordersList.filter((o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length;

  const convList = (rawConversations as any)?.data || (Array.isArray(rawConversations) ? rawConversations : []);
  const unreadMessagesCount = convList.reduce((acc: number, c: any) => acc + (c.unreadCount || 0), 0);

  const navSections: NavSection[] = [
    {
      title: "WORK",
      items: [
        { label: "Overview", href: "/vendor", icon: LayoutDashboard },
        { 
          label: "Orders", 
          href: "/vendor/orders", 
          icon: ShoppingBag, 
          badge: activeOrdersCount > 0 ? String(activeOrdersCount) : undefined, 
          badgeColor: "bg-indigo-100 text-indigo-800" 
        },
        { 
          label: "Messages", 
          href: "/vendor/messages", 
          icon: MessageSquare, 
          badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined, 
          badgeColor: "bg-warning-solid text-on-brand text-foreground" 
        },
        { label: "Calendar", href: "/vendor/calendar", icon: Calendar },
        { label: "Disputes", href: "/vendor/disputes", icon: Scale },
      ],
    },
    {
      title: "SERVICES",
      items: [
        { label: "My Gigs", href: "/vendor/gigs", icon: Sparkles },
        { label: "Find Jobs", href: "/vendor/find-jobs", icon: Search },
        { label: "My Offers", href: "/vendor/offers", icon: FileCheck },
        { label: "Reviews", href: "/vendor/reviews", icon: Star },
        { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
      ],
    },
    {
      title: "MONEY",
      items: [
        { label: "Earnings & Wallet", href: "/vendor/earnings", icon: Wallet },
        { label: "Payout Settings", href: "/vendor/payout-settings", icon: Settings },
      ],
    },
  ];

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
        "fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#0B0C0E] border-r border-[#26282E] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#26282E] bg-[#0B0C0E]">
          <Logo variant="vendor" href="/vendor" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-none text-foreground-muted hover:text-foreground hover:bg-[#16181F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-3 text-[10px] font-bold text-[#DFB76C] tracking-[0.2em] mb-1.5 uppercase font-sans">
                {sec.title}
              </p>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-none text-xs font-medium transition-all",
                        isActive
                          ? "bg-[#16181F] text-[#DFB76C] border-l-2 border-[#DFB76C]"
                          : "text-foreground-muted hover:bg-[#121418] hover:text-[#F3F4F6]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4", isActive ? "text-[#DFB76C]" : "text-foreground-muted")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-none text-[10px] font-bold bg-[#DFB76C] text-[#0B0C0E]">
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
        <div className="p-3.5 border-t border-[#26282E] bg-[#121418] text-[11px] text-foreground-secondary flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#DFB76C] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-[#F3F4F6] font-serif">Keep 100% of your price</p>
            <p className="text-[10px] text-foreground-muted">Clients pay 5% platform fee</p>
          </div>
        </div>
      </aside>
    </>
  );
}
