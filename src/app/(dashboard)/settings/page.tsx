"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Deletion states
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/login");
          return;
        }
        setCurrentUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/profile/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deleteConfirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      alert("Your account and all associated profile records have been permanently deleted.");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Loading account settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          <Settings className="w-3.5 h-3.5" />
          Account & Security
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your login credentials, legal consent logs, and account security.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Account Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-medium">Full Legal Name</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
              {currentUser?.fullName}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-medium">Email Address</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
              {currentUser?.email}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-medium">Country of Origin</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
              {currentUser?.country || "Nigeria"}
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-sky-500" />
          Change Password
        </h2>

        {passwordSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password (min 8 chars) *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition disabled:opacity-50"
          >
            {passwordSaving ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Danger Zone: Right to Erasure */}
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone — Right to Erasure (Permanent Account Deletion)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Under the Nigeria Data Protection Regulation (NDPR) Article 2.3, you have the absolute legal right to be forgotten. Deleting your account will permanently wipe your profile, experiences, verified badges, and messages from the IgamaZi network. This action cannot be undone.
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Permanently Delete My Account & Profile</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Confirm Permanent Erasure
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Please enter your password to confirm that you want to permanently delete your account:
            </p>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
                >
                  {deleting ? "Purging Data..." : "Permanently Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
