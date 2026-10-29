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
  DollarSign, 
  Mail, 
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetWorkspaceQuery, 
  useInviteMemberMutation, 
  useRemoveMemberMutation 
} from "@/redux/service/family-hub/familyHubApi";
import { useGetMeQuery } from "@/redux/service/auth/authApi";

export default function CollaboratorsPage() {
  const { data: meData } = useGetMeQuery();
  const { data: wsData, isLoading } = useGetWorkspaceQuery();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("COLLABORATOR");
  const [copiedLink, setCopiedLink] = useState(false);

  const me = (meData as any)?.data || meData;
  const ws = wsData?.data || wsData;

  const handleCopyInviteLink = () => {
    if (typeof window !== "undefined") {
      const inviteUrl = `${window.location.origin}/signup?role=collaborator&workspaceId=${ws?.id || "main"}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      toast.success("Collaborator invite link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await inviteMember({ email: inviteEmail, role: inviteRole }).unwrap();
      toast.success(`Invitation dispatched to ${inviteEmail}!`);
      setInviteEmail("");
      setInviteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to invite collaborator.");
    }
  };

  const handleRemove = async (id: string, name: string) => {
    try {
      await removeMember(id).unwrap();
      toast.success(`Removed collaborator ${name} from workspace.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not remove collaborator.");
    }
  };

  // Compile members
  const members = [];
  const ownerName = ws?.owner?.displayName || ws?.owner?.user?.name || me?.name || "Lead Host";
  members.push({
    id: ws?.owner?.id || "owner",
    name: ownerName,
    email: ws?.owner?.user?.email || me?.email || "owner@workspace.com",
    role: "Lead Host / Workspace Owner",
    avatar: ownerName.slice(0, 2).toUpperCase(),
    isOwner: true,
    status: "Active",
  });

  if (ws?.members && Array.isArray(ws.members)) {
    ws.members.forEach((m: any, idx: number) => {
      if (m.userId !== ws?.owner?.userId && m.user?.id !== me?.id) {
        const name = m.user?.name || m.user?.email?.split("@")[0] || m.inviteEmail || `Collaborator ${idx + 1}`;
        members.push({
          id: m.id || `m-${idx}`,
          name,
          email: m.user?.email || m.inviteEmail || "collaborator@workspace.com",
          role: m.role || "Team Collaborator",
          avatar: name.slice(0, 2).toUpperCase(),
          isOwner: false,
          status: "Active",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/user/collaboration"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-brand transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Collaboration Suite</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
              Team Collaborators
            </h1>
            <span className="px-2.5 py-0.5 bg-brand-soft border border-brand/30 text-[11px] font-bold text-brand uppercase tracking-wider">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Manage who has permission to review candidates, vote on proposals, and allocate milestone escrow funds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyInviteLink}
            className="h-10 px-4 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copiedLink ? <Check className="w-4 h-4 text-brand" /> : <Copy className="w-4 h-4 text-brand" />}
            <span>{copiedLink ? "Link Copied" : "Copy Invite Link"}</span>
          </button>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="h-10 px-5 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-gold-glow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Collaborator</span>
          </button>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="bg-surface border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-elevated flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-secondary">
            Workspace Roster
          </span>
          <span className="text-[11px] text-foreground-muted">
            All collaborators operate under protected multi-party governance
          </span>
        </div>

        <div className="divide-y divide-border">
          {members.map((member) => (
            <div key={member.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-elevated/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-brand text-black font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{member.name}</h4>
                    {member.isOwner && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-brand text-black uppercase tracking-wider">
                        <Crown className="w-3 h-3" />
                        Host
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground-muted">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-sunken border border-border text-brand">
                    {member.role}
                  </span>
                </div>

                {!member.isOwner && (
                  <button
                    onClick={() => handleRemove(member.id, member.name)}
                    className="p-2 text-foreground-muted hover:text-danger hover:bg-surface-sunken transition-colors cursor-pointer"
                    title="Remove Collaborator"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full border border-border p-6 space-y-4 animate-in fade-in">
            <h3 className="font-serif font-bold text-base text-obsidian">Invite Team Collaborator</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Enter their email to add them to this workspace. They will be able to review candidates, vote on proposals, and share notes.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="collaborator@example.com"
                  className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-surface-elevated border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                >
                  <option value="COLLABORATOR">Team Collaborator</option>
                  <option value="CO_HOST">Co-Host</option>
                  <option value="PLANNER">Event Planner</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-5 py-2 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isInviting ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
