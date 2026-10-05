"use client";

import { useState } from "react";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  ShieldCheck, 
  DollarSign, 
  MessageSquare, 
  Star, 
  Calendar,
  Briefcase,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface VendorNotificationItem {
  id: string;
  type: "job_match" | "escrow" | "milestone" | "message" | "review";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionUrl: string;
  actionLabel: string;
}

const mockVendorNotifications: VendorNotificationItem[] = [
  {
    id: "vn1",
    type: "job_match",
    title: "New Job Match: 15 miles from Chicago, IL",
    description: "Emily Carter posted: 'DJ & Emcee for Lakefront Wedding Reception' - Budget: $1,200 - $1,600",
    time: "10 min ago",
    read: false,
    actionUrl: "/vendor/find-jobs",
    actionLabel: "Submit Bid",
  },
  {
    id: "vn2",
    type: "milestone",
    title: "Milestone 1 Approved & Signed Off!",
    description: "Client signed off on Order #ORD-8821. $600 has been transferred to your Stripe wallet.",
    time: "1 hour ago",
    read: false,
    actionUrl: "/vendor/earnings",
    actionLabel: "View Wallet",
  },
  {
    id: "vn3",
    type: "review",
    title: "New 5-Star Review from Emily Carter",
    description: "'Marcus was incredible! He kept the dance floor packed all evening...'",
    time: "5 hours ago",
    read: true,
    actionUrl: "/vendor/reviews",
    actionLabel: "Post Reply",
  },
  {
    id: "vn4",
    type: "message",
    title: "New Inquiry from Robert Sterling",
    description: "'Can you provide acoustic background music during the cocktail hour?'",
    time: "Yesterday",
    read: true,
    actionUrl: "/vendor/messages",
    actionLabel: "Reply",
  }
];

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState<VendorNotificationItem[]>(mockVendorNotifications);
  const [filterType, setFilterType] = useState("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "All") return true;
    if (filterType === "Unread") return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: VendorNotificationItem["type"]) => {
    switch (type) {
      case "job_match":
        return <Briefcase className="w-4 h-4 text-brand-primary" />;
      case "milestone":
      case "escrow":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case "review":
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Vendor Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F0C3B] text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications for new event leads, milestone payout releases, and client inquiries.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-brand-primary" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        {["All", "Unread", "job_match", "milestone", "message", "review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
              filterType === tab
                ? "bg-[#0F0C3B] text-white font-bold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab === "job_match" ? "Job Leads" : tab === "milestone" ? "Milestone Payouts" : tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? "bg-[#F8F9FD]" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#0F0C3B]">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{item.description}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={item.actionUrl}
                  className="px-3 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                >
                  {item.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-500 text-xs">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}
