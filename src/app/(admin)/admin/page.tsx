"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  Ban,
  Unlock,
  Activity,
  Database,
  Copy,
  Check,
  Server,
} from "lucide-react";
import VerificationBadge from "@/components/profile/VerificationBadge";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"verifications" | "reports" | "users" | "logs" | "supabase">("verifications");
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    try {
      const res = await fetch("/api/admin/supabase-status");
      const data = await res.json();
      setSupabaseStatus(data);
    } catch (err: any) {
      setSupabaseStatus({
        success: false,
        supabase: { connected: false, message: err.message || "Failed to reach endpoint" },
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, verRes, repRes, usersRes, logsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/verifications"),
        fetch("/api/admin/reports"),
        fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}`),
        fetch("/api/admin/audit-logs"),
      ]);

      if (statsRes.status === 403 || verRes.status === 403) {
        router.push("/dashboard");
        return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
      if (verRes.ok) {
        const verData = await verRes.json();
        setVerifications(verData.requests || []);
      }
      if (repRes.ok) {
        const repData = await repRes.json();
        setReports(repData.reports || []);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [router]);

  const handleReviewVerification = async (requestId: string, action: "APPROVE" | "REJECT") => {
    const adminNotes = prompt(`Enter optional review notes for ${action}:`);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action, adminNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionFeedback(`Verification ${action.toLowerCase()}d successfully.`);
      setTimeout(() => setActionFeedback(null), 3000);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const handleResolveReport = async (reportId: string, status: "RESOLVED" | "DISMISSED" | "INVESTIGATING") => {
    const actionTaken = prompt(`Enter action taken details for ${status}:`);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status, actionTaken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionFeedback(`Report marked as ${status.toLowerCase()}.`);
      setTimeout(() => setActionFeedback(null), 3000);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!confirm(`Are you sure you want to change this user status to ${newStatus}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionFeedback(`User updated to ${newStatus}.`);
      setTimeout(() => setActionFeedback(null), 3000);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  };

  if (loading && !stats) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Loading Administrator Center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            IgamaZi Trust & Governance Portal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Administrative Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review credential verification applications, resolve community reports, and manage directory compliance.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Registry
        </button>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* KPI Metrics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Users</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalUsers}</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Profiles</span>
            <p className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">{stats.totalProfiles}</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Searchable</span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.searchableProfiles}</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Verified Badges</span>
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{stats.totalVerifications}</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-amber-200 dark:border-amber-800/60 bg-amber-50/20">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Pending Verifications</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendingVerifications}</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-rose-200 dark:border-rose-800/60 bg-rose-50/20">
            <span className="text-[11px] font-bold text-rose-700 uppercase">Pending Reports</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{stats.pendingReports}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("verifications")}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 ${
            activeTab === "verifications"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          Verification Queue ({verifications.length})
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 ${
            activeTab === "reports"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Integrity & Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 ${
            activeTab === "users"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          User Registry ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 ${
            activeTab === "logs"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          Audit Trail & Security ({auditLogs.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("supabase");
            if (!supabaseStatus) handleTestSupabase();
          }}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 ${
            activeTab === "supabase"
              ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Database className="w-4 h-4 text-emerald-500 dark:text-emerald-300" />
          Supabase Live Database
        </button>
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === "verifications" && (
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Verification Applications Under Review
          </h2>

          {verifications.length > 0 ? (
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {verifications.map((req) => (
                <div key={req.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {req.profile?.displayName}
                      </div>
                      <span className="text-xs text-slate-500">
                        {req.profile?.profession} • {req.profile?.organization}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                        {req.type}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : req.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong>Evidence:</strong> {req.evidenceText}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      {req.documentUrl && (
                        <a
                          href={req.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sky-600 hover:underline font-semibold"
                        >
                          <span>Inspect Cloud Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <Link
                        href={`/p/${req.profileId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 underline"
                      >
                        <Eye className="w-3 h-3" />
                        Inspect Public Profile
                      </Link>
                    </div>

                    {req.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReviewVerification(req.id, "REJECT")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleReviewVerification(req.id, "APPROVE")}
                          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve & Issue Badge
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-6 text-center">No verification requests found.</p>
          )}
        </div>
      )}

      {/* TAB 2: REPORTS & MODERATION */}
      {activeTab === "reports" && (
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Community Reports & Dispute Resolution
          </h2>

          {reports.length > 0 ? (
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((rep) => (
                <div key={rep.id} className="pt-4 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Target: {rep.reportedProfile?.displayName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Category: <strong className="text-rose-600">{rep.category}</strong> • Reporter: {rep.reporter ? `${rep.reporter.fullName} (${rep.reporter.email})` : "Anonymous Visitor"}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : rep.status === "DISMISSED"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                    {rep.details}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/p/${rep.reportedProfileId}`}
                      target="_blank"
                      className="text-xs text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Reported Profile
                    </Link>

                    {rep.status !== "RESOLVED" && rep.status !== "DISMISSED" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveReport(rep.id, "DISMISSED")}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, "RESOLVED")}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-6 text-center">No reports filed.</p>
          )}
        </div>
      )}

      {/* TAB 3: USER REGISTRY */}
      {activeTab === "users" && (
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              User Directory & Account Status
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAdminData()}
                placeholder="Search user email or name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-2.5 px-3">User / Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Directory Search</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-3">
                      <div className="font-bold">{u.fullName}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{u.role}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px]">
                        {u.profile?.isSearchable ? "Searchable" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                            u.status === "ACTIVE"
                              ? "text-rose-600 hover:bg-rose-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL & SECURITY LOGS */}
      {activeTab === "logs" && (
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Immutable System Audit Logs & Forensic Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographic logging of sensitive identity updates, administrative actions, and NDPR compliance events.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {auditLogs.length} events logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor / Admin</th>
                  <th className="py-2.5 px-3">Entity Type</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      {log.actor ? (
                        <span>
                          <strong className="text-slate-900 dark:text-white">{log.actor.fullName}</strong>{" "}
                          <span className="text-[10px] text-slate-400">({log.actor.role})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Public / System</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] text-slate-500">
                      {log.entityType}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500 max-w-xs truncate">
                      {log.detailsJson || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE LIVE DATABASE */}
      {activeTab === "supabase" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Supabase Live Client Connection
                    {supabaseStatus?.supabase?.connected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Awaiting Credentials
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect and verify your live Supabase database via the official <code className="font-mono text-emerald-600">@supabase/supabase-js</code> client library.
                  </p>
                </div>
              </div>

              <button
                onClick={handleTestSupabase}
                disabled={testingSupabase}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-sm shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? "animate-spin" : ""}`} />
                {testingSupabase ? "Testing Connection..." : "Test Connection Now"}
              </button>
            </div>

            {/* Test Result Banner */}
            {supabaseStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                  supabaseStatus.supabase?.connected
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800"
                }`}
              >
                {supabaseStatus.supabase?.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-semibold">
                    {supabaseStatus.supabase?.connected
                      ? "Supabase Live Connection Active"
                      : "Supabase Connection Status"}
                  </strong>
                  <span>{supabaseStatus.supabase?.message}</span>
                </div>
              </div>
            )}

            {/* Environment Variables Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  NEXT_PUBLIC_SUPABASE_URL
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block truncate">
                  {supabaseStatus?.config?.urlPreview || "Not configured in .env"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  {supabaseStatus?.config?.hasAnonKey ? "Configured ✓" : "Missing in .env"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  SUPABASE_SERVICE_ROLE_KEY
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  {supabaseStatus?.config?.hasServiceRoleKey ? "Configured ✓" : "Optional / Missing"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Setup Instructions & Schema Runner */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-sky-500" />
              Live Database Setup in 3 Quick Steps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Run SQL Schema</h4>
                <p className="text-slate-500 leading-relaxed">
                  Open your <strong>Supabase SQL Editor</strong> and paste the contents of <code className="font-mono text-emerald-600">supabase_schema.sql</code> to create all 14 tables, indexes, and RLS policies.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    fetch("/supabase_schema.sql")
                      .then((r) => r.text())
                      .then((sql) => {
                        navigator.clipboard.writeText(sql);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2000);
                      })
                      .catch(() => alert("File located at supabase_schema.sql in project root."));
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[11px]"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? "Copied to Clipboard!" : "Copy supabase_schema.sql"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Add Keys to .env</h4>
                <p className="text-slate-500 leading-relaxed">
                  Go to <strong>Project Settings → API</strong> in Supabase, copy your Project URL and Anon Key, and paste them into <code className="font-mono text-emerald-600">.env</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Verify Connection</h4>
                <p className="text-slate-500 leading-relaxed">
                  Click the <strong>Test Connection Now</strong> button above to confirm real-time querying against your live Supabase database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
