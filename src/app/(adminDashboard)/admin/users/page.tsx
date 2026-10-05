"use client";

import { useState } from "react";
import { Users, Shield, Search, Filter, MoreHorizontal, CheckCircle2, UserX } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const usersList = [
  {
    id: "USR-1092",
    name: "Emily Carter",
    email: "emily.carter@gmail.com",
    role: "Host (Buyer)",
    eventsPlanned: 3,
    totalSpent: "$5,420.00",
    status: "ACTIVE",
    joined: "Aug 2026",
  },
  {
    id: "USR-1093",
    name: "Marcus Reed",
    email: "marcus@partypulse.com",
    role: "Pro Vendor",
    eventsPlanned: 14,
    totalSpent: "$2,340.00 Earned",
    status: "ACTIVE",
    joined: "May 2026",
  },
  {
    id: "USR-1094",
    name: "Sarah Jenkins",
    email: "sarah.j@outlook.com",
    role: "Host (Buyer)",
    eventsPlanned: 1,
    totalSpent: "$1,850.00",
    status: "ACTIVE",
    joined: "Sep 2026",
  },
  {
    id: "USR-1095",
    name: "Windy City Sound LLC",
    email: "contact@windycitysound.com",
    role: "Rising Vendor",
    eventsPlanned: 8,
    totalSpent: "$4,800.00 Earned",
    status: "DISPUTE_HOLD",
    joined: "Jun 2026",
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const handleAction = (name: string, action: string) => {
    toast.success(`${action} applied to user ${name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0C3B]">User Management & Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of buyers, vendors, identity verifications, and trust flags
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8F9FD] border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4">User ID & Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Activity / GMV</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F0C3B]">
                    {usr.name}
                    <p className="text-[10px] text-slate-400 font-normal">{usr.id} • Joined {usr.joined}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{usr.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-100">
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{usr.totalSpent}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      usr.status === "ACTIVE" && "bg-emerald-100 text-emerald-800",
                      usr.status === "DISPUTE_HOLD" && "bg-amber-100 text-amber-800",
                    )}>
                      {usr.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleAction(usr.name, "Profile Audit")}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
