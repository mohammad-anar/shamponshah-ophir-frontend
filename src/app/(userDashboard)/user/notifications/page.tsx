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
  AlertCircle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "escrow" | "bid" | "message" | "event" | "dispute" | "review";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "bid",
    title: "New Bid Received on Chicago Wedding DJ",
    description: "Windy City Sound DJ submitted a custom $1,200 proposal with 2 milestones.",
    time: "15 min ago",
    read: false,
    actionUrl: "/user/jobs",
    actionLabel: "Compare Offers",
  },
  {
    id: "n2",
    type: "escrow",
    title: "Milestone 1 Funded in Escrow Vault",
    description: "$600 has been securely locked in Ophir Escrow for order #ORD-8821.",
    time: "2 hours ago",
    read: false,
    actionUrl: "/user/payments",
    actionLabel: "View Receipt",
  },
  {
    id: "n3",
    type: "message",
    title: "New Message from Lumina Cinematic Films",
    description: "'Our drone pilot permit has been approved for the lakefront ceremony.'",
    time: "5 hours ago",
    read: true,
    actionUrl: "/user/messages",
    actionLabel: "Reply",
  },
  {
    id: "n4",
    type: "event",
    title: "Event Reminder: Emily & David's Ophir",
    description: "Your milestone celebration is exactly 41 days away. 3 of 4 vendor slots confirmed.",
    time: "1 day ago",
    read: true,
    actionUrl: "/user/events",
    actionLabel: "Open Timeline",
  },
  {
    id: "n5",
    type: "review",
    title: "Rate your completed service",
    description: "Sparkle Decor & Rentals marked chair setup complete. Leave a review to earn points.",
    time: "2 days ago",
    read: true,
    actionUrl: "/user/reviews",
    actionLabel: "Write Review",
  }
];

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [filterType, setFilterType] = useState<string>("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "All") return true;
    if (filterType === "Unread") return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "escrow":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "bid":
        return <DollarSign className="w-4 h-4 text-brand-primary" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case "event":
        return <Calendar className="w-4 h-4 text-purple-600" />;
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
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Notifications Center</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F0C3B] text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates on bids, escrow milestones, vendor messages, and event schedule reminders.
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
        {["All", "Unread", "bid", "escrow", "message", "event"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
              filterType === tab
                ? "bg-[#0F0C3B] text-white font-bold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab === "bid" ? "Bids & Offers" : tab === "escrow" ? "Escrow" : tab}
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
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{item.description}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    className="px-3 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                  >
                    {item.actionLabel || "View"} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-500 text-xs">
            No notifications found in this view.
          </div>
        )}
      </div>
    </div>
  );
}
