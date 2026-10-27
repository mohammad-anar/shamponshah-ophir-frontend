"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { 
  useGetUserNotificationsQuery, 
  useMarkNotificationAsReadMutation, 
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "@/redux/service/notifications/notificationsApi";

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
  const { data: apiNotifications, isLoading } = useGetUserNotificationsQuery();
  const [markRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const [notifications, setNotifications] = useState<VendorNotificationItem[]>([]);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const rawNotifications = (apiNotifications as any)?.data || (Array.isArray(apiNotifications) ? apiNotifications : []);
    if (Array.isArray(rawNotifications)) {
      const mapped: VendorNotificationItem[] = rawNotifications.map((n: any) => ({
        id: n.id,
        type: n.type?.toLowerCase().includes("job") ? "job_match" :
              n.type?.toLowerCase().includes("milestone") ? "milestone" :
              n.type?.toLowerCase().includes("message") ? "message" :
              n.type?.toLowerCase().includes("review") ? "review" : "escrow",
        title: n.title,
        description: n.body,
        time: new Date(n.createdAt).toLocaleDateString(),
        read: n.isRead,
        actionUrl: n.link || "/vendor",
        actionLabel: "View Action",
      }));
      setNotifications(mapped);
    }
  }, [apiNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      // Preserve unread state when the server update fails.
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead().unwrap();
      setNotifications((items) => items.map((n) => ({ ...n, read: true })));
    } catch {
      // Preserve unread state when the server update fails.
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      setNotifications((items) => items.filter((n) => n.id !== id));
    } catch {
      // Keep the notification visible if deletion fails.
    }
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
        return <ShieldCheck className="w-4 h-4 text-success" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-info" />;
      case "review":
        return <Star className="w-4 h-4 text-warning" />;
      default:
        return <Bell className="w-4 h-4 text-foreground-muted" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Vendor Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F0C3B] text-foreground">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Real-time notifications for new event leads, milestone payout releases, and client inquiries.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-2 bg-surface-sunken hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-brand-primary" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["All", "Unread", "job_match", "milestone", "message", "review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterType === tab
                ? "bg-[#0F0C3B] text-foreground shadow-xs"
                : "bg-surface text-foreground-secondary border border-border hover:bg-surface-elevated"
            }`}
          >
            {tab === "All" ? "All Updates" :
             tab === "Unread" ? `Unread (${unreadCount})` :
             tab === "job_match" ? "Job Leads" :
             tab === "milestone" ? "Milestones & Escrow" :
             tab === "message" ? "Messages" : "Client Reviews"}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-foreground-muted gap-2 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
            <span>Loading notifications...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center text-foreground-muted text-xs">
            <Bell className="w-8 h-8 text-foreground-secondary mx-auto mb-2" />
            <p className="font-bold text-[#0F0C3B]">You&apos;re all caught up!</p>
            <p className="text-foreground-muted mt-0.5">No notifications matching selected filter.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                n.read
                  ? "bg-surface border-border shadow-2xs opacity-80"
                  : "bg-indigo-50/40 border-indigo-200 shadow-xs"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface border border-border shadow-2xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#0F0C3B]">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-foreground-muted flex-shrink-0">{n.time}</span>
                </div>

                <p className="text-xs text-foreground-secondary leading-relaxed">
                  {n.description}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={n.actionUrl}
                    className="text-[11px] font-bold text-brand-primary hover:text-indigo-900 flex items-center gap-1"
                  >
                    {n.actionLabel} <ChevronRight className="w-3 h-3" />
                  </Link>
                  <span className="text-foreground-secondary">&bull;</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n.id);
                    }}
                    className="text-[11px] text-foreground-muted hover:text-rose-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
