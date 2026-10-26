"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo/Logo";
import { cn } from "@/lib/utils";
import { 
  useGetAdminStatsQuery,
  useGetVendorApprovalsQuery, 
  useGetAllDisputesQuery 
} from "@/redux/service/admin/adminApi";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingBag,
  Briefcase,
  ShieldCheck,
  CreditCard,
  FileBarChart,
  Scale,
  Star,
  LifeBuoy,
  Award,
  Layers,
  Settings,
  Lock,
  X,
  Clock,
  AlertTriangle
} from "lucide-react";

interface AdminSidebarProps {
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
    title: "OPERATIONS",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Vendor Approvals", href: "/admin/vendor-approvals", icon: UserCheck, badge: "0", badgeColor: "bg-amber-500 text-[#0F0C3B]" },
      { label: "Pending Gigs", href: "/admin/gigs/pending", icon: Clock, badge: "0", badgeColor: "bg-amber-400 text-slate-950" },
      { label: "Gigs Catalog", href: "/admin/gigs", icon: ShoppingBag },
      { label: "Jobs & Bids", href: "/admin/jobs", icon: Briefcase },
    ],
  },

  {
    title: "FINANCE",
    items: [
      { label: "Orders & Escrow", href: "/admin/orders", icon: ShieldCheck },
      { label: "Payouts", href: "/admin/payouts", icon: CreditCard },
      { label: "Fees & Reports", href: "/admin/fees-reports", icon: FileBarChart },
    ],
  },
  {
    title: "TRUST & SAFETY",
    items: [
      { label: "Disputes", href: "/admin/disputes", icon: Scale, badge: "0", badgeColor: "bg-red-500 text-white" },
      { label: "Service Reports", href: "/admin/reports", icon: AlertTriangle, badge: "0", badgeColor: "bg-rose-500 text-white" },
      { label: "Reviews & Reports", href: "/admin/reviews-reports", icon: Star },
      { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
    ],
  },
  {
    title: "PLATFORM",
    items: [
      { label: "Levels & Rules", href: "/admin/levels", icon: Award },
      { label: "Content & Categories", href: "/admin/categories", icon: Layers },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: statsData } = useGetAdminStatsQuery();
  const { data: approvalsData } = useGetVendorApprovalsQuery();
  const { data: disputesData } = useGetAllDisputesQuery();

  const stats = statsData?.data || statsData || {};
  const pendingGigsCount = stats.pendingGigs || 0;
  const pendingReportsCount = stats.pendingReports || 0;

  const pendingApprovalsCount = stats.pendingApprovals ?? (Array.isArray(approvalsData) ? approvalsData.length : (approvalsData as any)?.data?.length || 0);
  const disputesList = Array.isArray(disputesData) ? disputesData : (disputesData as any)?.data || [];
  const openDisputesCount = stats.openDisputes ?? disputesList.filter((d: any) => d.status !== "RESOLVED").length;

  const dynamicSections = navSections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.href === "/admin/vendor-approvals") {
        return {
          ...item,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount.toString() : undefined,
        };
      }
      if (item.href === "/admin/gigs/pending") {
        return {
          ...item,
          badge: pendingGigsCount > 0 ? pendingGigsCount.toString() : undefined,
        };
      }
      if (item.href === "/admin/disputes") {
        return {
          ...item,
          badge: openDisputesCount > 0 ? openDisputesCount.toString() : undefined,
        };
      }
      if (item.href === "/admin/reports") {
        return {
          ...item,
          badge: pendingReportsCount > 0 ? pendingReportsCount.toString() : undefined,
        };
      }
      return item;
    }),
  }));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F0C3B] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-white/5 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Logo variant="admin" href="/admin" />
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {dynamicSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[11px] font-semibold text-indigo-300/60 tracking-wider mb-2 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                        isActive
                          ? "bg-indigo-600/30 text-white border-l-3 border-indigo-400 font-semibold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn("px-1.5 py-0.5 text-[10px] font-bold rounded-full", item.badgeColor)}>
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

        {/* Footer status */}
        <div className="p-3 border-t border-white/10 bg-[#0A0826]/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Internal Ops v2.4</span>
          </div>
          <Lock className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </aside>
    </>
  );
}
