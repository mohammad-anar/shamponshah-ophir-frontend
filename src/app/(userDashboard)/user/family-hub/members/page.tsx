"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { useGetWorkspaceQuery, useInviteMemberMutation, useRemoveMemberMutation } from "@/redux/service/family-hub/familyHubApi";

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
  const { data: workspaceData, refetch } = useGetWorkspaceQuery();
  const [inviteMemberMutation, { isLoading: isInviting }] = useInviteMemberMutation();
  const [removeMemberMutation] = useRemoveMemberMutation();

  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Member["role"]>("Co-Planner");
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    const workspace = workspaceData?.data || workspaceData;
    if (workspace) {
      const mapped: Member[] = [
        ...(workspace.owner ? [{
          id: `owner-${workspace.ownerId}`,
          name: workspace.owner.displayName || "Workspace owner",
          email: workspace.owner.user?.email || "",
          role: "Host / Admin" as const,
          avatar: (workspace.owner.displayName || "OW").slice(0, 2).toUpperCase(),
          canVote: true,
          canFundEscrow: false,
          budgetContributed: 0,
          joinedDate: "Owner",
          status: "Active" as const,
        }] : []),
        ...(workspace.members || []).map((m: any): Member => ({
        id: m.id,
        name: m.user?.clientProfile?.displayName || m.user?.email?.split("@")[0] || "Member",
        email: m.user?.email || "member@example.com",
        role: m.role === "OWNER" ? "Host / Admin" : m.role === "VIEWER" ? "Guest Reviewer" : "Co-Planner",
        avatar: (m.user?.clientProfile?.displayName || m.user?.email || "MB").slice(0, 2).toUpperCase(),
        canVote: true,
        canFundEscrow: m.role !== "Guest Reviewer",
        budgetContributed: m.budgetContributed || 0,
        joinedDate: new Date(m.createdAt).toLocaleDateString(),
        status: "Active",
      }))];
      setMembers(mapped);
    }
  }, [workspaceData]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await inviteMemberMutation({ email: inviteEmail, role: inviteRole }).unwrap();
      toast.success(`${inviteEmail} was added to your family workspace.`);
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not send invitation.");
      return;
    }

    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleRemoveMember = async (id: string) => {
    try {
      await removeMemberMutation(id).unwrap();
      setMembers((items) => items.filter((m) => m.id !== id));
      toast.success("Family member removed.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not remove family member.");
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/user/family-hub"
          className="inline-flex items-center gap-1 text-xs font-bold text-foreground-muted hover:text-[#0F0C3B]"
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
          <p className="text-xs text-foreground-muted mt-1">
            Manage who can vote on vendor shortlist offers, co-fund escrow milestones, and post wedding ideas.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-foreground rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Invite Family Member
        </button>
      </div>

      {/* Members Table Card */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F0C3B]">Collaborator Access & Spending Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FD] border-b border-border text-foreground-muted font-bold uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-border font-medium">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-surface-elevated/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0F0C3B] text-foreground flex items-center justify-center font-bold text-xs shadow-xs">
                        {m.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-[#0F0C3B] flex items-center gap-1.5">
                          {m.name}
                          {m.role === "Host / Admin" && <Crown className="w-3.5 h-3.5 text-warning" />}
                        </div>
                        <div className="text-[11px] text-foreground-muted">{m.email}</div>
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
                      <span className="inline-flex items-center gap-1 text-success font-bold">
                        <Check className="w-3.5 h-3.5" /> Can Vote
                      </span>
                    ) : (
                      <span className="text-foreground-muted">View Only</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {m.canFundEscrow ? (
                      <span className="inline-flex items-center gap-1 text-success font-bold">
                        <DollarSign className="w-3.5 h-3.5" /> Authorized
                      </span>
                    ) : (
                      <span className="text-foreground-muted">Restricted</span>
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
                        className="p-1.5 text-foreground-muted hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-[#0F0C3B] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-primary" /> Invite Family Planner
              </h2>
              <button onClick={() => setShowInviteModal(false)} className="text-foreground-muted hover:text-foreground-secondary">
                &times;
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. auntie.claire@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none"
                >
                  <option value="Co-Planner">Co-Planner (Can vote & add vendors)</option>
                  <option value="Family Contributor">Family Contributor (Can pledge funds & vote)</option>
                  <option value="Guest Reviewer">Guest Reviewer (Vote & comment only)</option>
                </select>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                Invited members will receive an email with a secure link to join your <strong>Emily & David's Golden Ophir</strong> planning hub.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-surface-sunken hover:bg-slate-200 text-foreground-secondary rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-foreground rounded-xl font-bold flex items-center gap-1.5"
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
