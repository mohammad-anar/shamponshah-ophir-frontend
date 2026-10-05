"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users2, 
  UserPlus, 
  Crown, 
  ShieldCheck, 
  Check, 
  Copy, 
  Trash2, 
  Vote, 
  DollarSign, 
  Mail, 
  ChevronLeft,
  Settings,
  Sparkles
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Host / Admin" | "Co-Planner" | "Family Contributor" | "Guest Reviewer";
  avatar: string;
  canVote: boolean;
  canFundEscrow: boolean;
  budgetContributed: number;
  joinedDate: string;
  status: "Active" | "Invite Pending";
}

const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Emily Carter",
    email: "emily.carter@gmail.com",
    role: "Host / Admin",
    avatar: "EC",
    canVote: true,
    canFundEscrow: true,
    budgetContributed: 8500,
    joinedDate: "Owner",
    status: "Active",
  },
  {
    id: "m2",
    name: "David Miller",
    email: "david.miller@gmail.com",
    role: "Co-Planner",
    avatar: "DM",
    canVote: true,
    canFundEscrow: true,
    budgetContributed: 3500,
    joinedDate: "Aug 12, 2025",
    status: "Active",
  },
  {
    id: "m3",
    name: "Grace Carter (Mom)",
    email: "grace.carter@yahoo.com",
    role: "Family Contributor",
    avatar: "GC",
    canVote: true,
    canFundEscrow: true,
    budgetContributed: 2000,
    joinedDate: "Aug 20, 2025",
    status: "Active",
  },
  {
    id: "m4",
    name: "Uncle Robert",
    email: "robert.c@gmail.com",
    role: "Guest Reviewer",
    avatar: "UR",
    canVote: true,
    canFundEscrow: false,
    budgetContributed: 0,
    joinedDate: "Sep 01, 2025",
    status: "Invite Pending",
  }
];

export default function FamilyHubMembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Member["role"]>("Co-Planner");
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const inviteCode = "OPHIR-GOLDEN-CARTER-2025";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMem: Member = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
      canVote: true,
      canFundEscrow: inviteRole === "Co-Planner" || inviteRole === "Family Contributor",
      budgetContributed: 0,
      joinedDate: "Just now",
      status: "Invite Pending",
    };

    setMembers([...members, newMem]);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/user/family-hub"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0F0C3B]"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Family Decision Board
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Family Hub Collaborators</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage who can vote on vendor shortlist offers, co-fund escrow milestones, and post wedding ideas.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Invite Family Member
        </button>
      </div>

      {/* Invite Share Banner */}
      <div className="bg-gradient-to-r from-[#0F0C3B] to-[#18124E] text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Fast Share Invitation Passcode</h3>
            <p className="text-xs text-indigo-200/80">Family members can enter this code in their Ophir account to join instantly.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
          <span className="font-mono text-xs font-bold text-amber-300">{inviteCode}</span>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Members Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F0C3B]">Collaborator Access & Spending Matrix</h2>
          <span className="text-xs text-slate-400">Total Pooled Contributions: <strong>$14,000</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FD] border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role & Permissions</th>
                <th className="py-3 px-4">Voting Rights</th>
                <th className="py-3 px-4">Escrow Funding</th>
                <th className="py-3 px-4">Contributed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {m.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-[#0F0C3B] flex items-center gap-1.5">
                          {m.name}
                          {m.role === "Host / Admin" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <div className="text-[11px] text-slate-400">{m.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-brand-primary border border-indigo-100">
                      {m.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {m.canVote ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <Check className="w-3.5 h-3.5" /> Can Vote
                      </span>
                    ) : (
                      <span className="text-slate-400">View Only</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {m.canFundEscrow ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <DollarSign className="w-3.5 h-3.5" /> Authorized
                      </span>
                    ) : (
                      <span className="text-slate-400">Restricted</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#0F0C3B]">
                      ${m.budgetContributed.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {m.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {m.role !== "Host / Admin" && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0F0C3B] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-primary" /> Invite Family Planner
              </h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. auntie.claire@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
                >
                  <option value="Co-Planner">Co-Planner (Can vote & add vendors)</option>
                  <option value="Family Contributor">Family Contributor (Can pledge funds & vote)</option>
                  <option value="Guest Reviewer">Guest Reviewer (Vote & comment only)</option>
                </select>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                Invited members will receive an email with a secure link to join your <strong>Emily & David's Golden Ophir</strong> planning hub.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
