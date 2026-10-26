"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
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

import { useGetClientOrdersQuery } from "@/redux/service/orders/ordersApi";
import { useGetUserNotificationsQuery } from "@/redux/service/notifications/notificationsApi";
import { useGetUserConversationsQuery } from "@/redux/service/messages/messagesApi";

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

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();

  const { data: ordersData } = useGetClientOrdersQuery();
  const { data: notificationsData } = useGetUserNotificationsQuery();
  const { data: conversationsData } = useGetUserConversationsQuery();

  const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.data?.orders || ordersData?.orders || ordersData?.data || []);
  const activeOrdersCount = orders.filter((o: any) => o.status === "ACTIVE" || o.status === "IN_PROGRESS").length;

  const notifs = Array.isArray(notificationsData) ? notificationsData : (notificationsData?.data || []);
  const unreadNotifsCount = notifs.filter((n: any) => !n.isRead).length;

  const convs = Array.isArray(conversationsData) ? conversationsData : (conversationsData?.data || []);
  const unreadMessagesCount = convs.reduce((acc: number, c: any) => acc + (c.unreadCount || 0), 0);

  const navSections: NavSection[] = [
    {
      title: "MAIN",
      items: [
        { label: "Overview", href: "/user", icon: LayoutDashboard },
        { label: "Browse Services", href: "/services", icon: Sparkles },
        { label: "Post a Job", href: "/user/post-job", icon: PlusCircle, highlight: true },
        { label: "My Jobs", href: "/user/jobs", icon: Briefcase },
        { label: "Orders", href: "/user/orders", icon: ShoppingBag, badge: activeOrdersCount > 0 ? String(activeOrdersCount) : undefined },
        { label: "Messages", href: "/user/messages", icon: MessageSquare, badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined },
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
        { label: "Notifications", href: "/user/notifications", icon: Bell, badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined },
        { label: "Resolution Center", href: "/user/disputes", icon: Scale },
        { label: "Settings", href: "/user/settings", icon: Settings },
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
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#26282E] bg-[#0B0C0E]">
          <Logo href="/user" />
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-none text-slate-400 hover:text-white hover:bg-[#16181F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-3 text-[10px] font-bold text-[#DFB76C] tracking-[0.2em] mb-1.5 uppercase font-sans">
                {sec.title}
              </p>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/user" && pathname.startsWith(item.href));
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
                          : item.highlight
                            ? "text-[#DFB76C] hover:bg-[#121418] hover:text-[#ECC870] font-semibold"
                            : "text-slate-400 hover:bg-[#121418] hover:text-[#F3F4F6]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4", isActive ? "text-[#DFB76C]" : item.highlight ? "text-[#DFB76C]" : "text-slate-500")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-none text-[10px] font-bold bg-[#DFB76C] text-[#0B0C0E]">
                          {item.badge}
                        </span>
                      )}

                      {item.dot && (
                        <span className="w-2 h-2 rounded-none bg-[#DFB76C]" />
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
