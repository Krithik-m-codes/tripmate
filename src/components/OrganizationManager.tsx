"use client";

import React, { useState } from "react";
import {
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useInviteMemberMutation,
  OrganizationItem,
} from "@/store/api/organizationApi";
import { toast } from "react-toastify";
import { Building2, Plus, Users, Mail, Check, Shield, X, Loader2 } from "lucide-react";

interface OrganizationManagerProps {
  currentOrgId?: string;
  onSelectOrg: (orgId: string | undefined) => void;
}

export default function OrganizationManager({ currentOrgId, onSelectOrg }: OrganizationManagerProps) {
  const { data: orgsData, isLoading } = useGetOrganizationsQuery();
  const [createOrg, { isLoading: isCreating }] = useCreateOrganizationMutation();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [activeTab, setActiveTab] = useState<"switch" | "create" | "invite">("switch");

  const organizations = orgsData?.data || [];
  const currentOrg = organizations.find((o) => o._id === currentOrgId);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      const res = await createOrg({ name: newOrgName }).unwrap();
      if (res.success) {
        toast.success(`Workspace "${newOrgName}" created!`);
        setNewOrgName("");
        onSelectOrg(res.data._id);
        setIsOpen(false);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create workspace");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId) {
      toast.error("Please select a workspace first");
      return;
    }
    if (!inviteEmail.trim()) return;
    try {
      const res = await inviteMember({
        id: currentOrgId,
        email: inviteEmail.trim(),
        role: inviteRole,
      }).unwrap();
      if (res.success) {
        toast.success(`Invitation sent to ${inviteEmail}`);
        // Also trigger our Brevo invite email endpoint
        try {
          await fetch("/api/emails/send-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: inviteEmail.trim(),
              organizationName: currentOrg?.name || "TripMate Workspace",
              inviterName: "TripMate Team",
              inviteLink: `${window.location.origin}/dashboard?org=${currentOrgId}`,
            }),
          });
        } catch (e) {
          console.warn("Brevo email send warning:", e);
        }
        setInviteEmail("");
        setIsOpen(false);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to invite member");
    }
  };

  return (
    <div>
      {/* Workspace Selector trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-slate-100"
        >
          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate max-w-[150px]">
            {currentOrg ? currentOrg.name : "Personal Workspace"}
          </span>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
            {currentOrg ? "Team" : "Free"}
          </span>
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Workspace Manager</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-3 gap-4 bg-slate-50/50 dark:bg-slate-950/30 text-sm font-medium">
              <button
                onClick={() => setActiveTab("switch")}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === "switch"
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Switch Workspace
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === "create"
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Create Team
              </button>
              {currentOrg && (
                <button
                  onClick={() => setActiveTab("invite")}
                  className={`pb-3 border-b-2 transition-all ${
                    activeTab === "invite"
                      ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Invite Members
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              {activeTab === "switch" && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      onSelectOrg(undefined);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      !currentOrgId
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                        P
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Personal Workspace</p>
                        <p className="text-xs text-slate-500">Your private itineraries & saved places</p>
                      </div>
                    </div>
                    {!currentOrgId && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>

                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    organizations.map((org) => (
                      <button
                        key={org._id}
                        onClick={() => {
                          onSelectOrg(org._id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          currentOrgId === org._id
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 shrink-0 rounded-lg bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                              {org.name}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {org.members.length} member(s)
                            </p>
                          </div>
                        </div>
                        {currentOrgId === org._id && (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}

              {activeTab === "create" && (
                <form onSubmit={handleCreateOrg} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Organization / Team Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wanderlust Explorers, Family Vacation 2026"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create Workspace
                  </button>
                </form>
              )}

              {activeTab === "invite" && currentOrg && (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Collaborator Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="friend@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as "editor" | "viewer")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="editor">Editor — Can edit and create itineraries</option>
                      <option value="viewer">Viewer — Read-only access</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isInviting}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Send Brevo Invitation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
