"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Lock,
  Edit3,
  Award,
  Eye,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  QrCode,
  X,
  Send,
  Trash2,
  EyeOff,
  ThumbsUp,
  MessageSquare,
  Check,
  Quote,
} from "lucide-react";
import VerificationBadge from "@/components/profile/VerificationBadge";
import DigitalIdCard from "@/components/profile/DigitalIdCard";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);

  // Message reply states
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  // Recommendation management state
  const [recActionLoading, setRecActionLoading] = useState<string | null>(null);
  const [recTab, setRecTab] = useState<"received" | "authored">("received");

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleSendReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage: replyText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplySuccess(true);
        setSelectedMessage(data.contactMessage);
        // Refresh dashboard data
        fetchDashboardData();
        setTimeout(() => setReplySuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to reply:", err);
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact/${messageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedMessage(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  const handleUpdateRecStatus = async (recId: string, status: "APPROVED" | "HIDDEN" | "REJECTED") => {
    setRecActionLoading(recId);
    try {
      const res = await fetch(`/api/recommendations/${recId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Update recommendation error:", err);
    } finally {
      setRecActionLoading(null);
    }
  };

  const handleDeleteRec = async (recId: string) => {
    if (!confirm("Are you sure you want to permanently remove this endorsement?")) return;
    setRecActionLoading(recId);
    try {
      const res = await fetch(`/api/recommendations/${recId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Delete recommendation error:", err);
    } finally {
      setRecActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Loading your profile portal...</p>
      </div>
    );
  }

  if (!profile) return null;

  const pendingRecs = (profile.receivedRecommendations || []).filter((r: any) => r.status === "PENDING");
  const approvedRecs = (profile.receivedRecommendations || []).filter((r: any) => r.status === "APPROVED");
  const hiddenRecs = (profile.receivedRecommendations || []).filter((r: any) => r.status === "HIDDEN");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {profile.displayName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Welcome, {profile.displayName}
              </h1>
              {profile.verifications?.length > 0 && (
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {profile.headline || "No headline set yet."}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIdCardModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Digital ID Pass</span>
          </button>
          <Link
            href={`/p/${profile.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Eye className="w-3.5 h-3.5 text-sky-500" />
            View Public Profile
          </Link>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Completion Meter & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Profile Completion Score */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Profile Completeness
            </span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              {profile.completionScore}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${profile.completionScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {profile.completionScore < 100
              ? "Add your professional experiences, education, and credentials to achieve higher search visibility."
              : "Your verified profile is 100% complete and optimized for public discovery!"}
          </p>

          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Update profile details &rarr;
          </Link>
        </div>

        {/* Card 2: Privacy Controls */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Privacy & NDPR Status
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Protected
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Directory Search:</span>
              <strong className="text-emerald-600">{profile.isSearchable ? "Visible" : "Hidden"}</strong>
            </div>
            <div className="flex justify-between">
              <span>Overall Visibility:</span>
              <strong>{profile.privacy?.overallVisibility || "PUBLIC"}</strong>
            </div>
            <div className="flex justify-between">
              <span>Contact Relay:</span>
              <strong>{profile.privacy?.allowContactForm ? "Enabled" : "Disabled"}</strong>
            </div>
          </div>

          <Link
            href="/profile/privacy"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline pt-1"
          >
            Adjust privacy settings &rarr;
          </Link>
        </div>

        {/* Card 3: Verification Badges */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verification Tier
            </span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>

          {profile.verifications && profile.verifications.length > 0 ? (
            <div className="space-y-2">
              {profile.verifications.map((v: any) => (
                <div key={v.id}>
                  <VerificationBadge type={v.type} label={v.badgeLabel} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No official badges awarded yet. Submit your council license or identity document for review.
            </p>
          )}

          <Link
            href="/verification"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
          >
            Apply for verification badge &rarr;
          </Link>
        </div>
      </div>

      {/* Main Grid: Contact Relay Inbox + Verification Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Messages Relay Inbox */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500" />
                Protected Messages Received ({profile.contactMessages?.length || 0})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inquiries relayed through the Zero-Knowledge contact form without disclosing your personal email/phone.
              </p>
            </div>
          </div>

          {profile.contactMessages && profile.contactMessages.length > 0 ? (
            <div className="space-y-3">
              {profile.contactMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setReplyText("");
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedMessage?.id === msg.id
                      ? "border-sky-500 bg-sky-50/40 dark:bg-sky-950/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {msg.subject}
                        </h3>
                        {msg.repliedAt && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <Check className="w-2.5 h-2.5" />
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        From: <strong className="text-slate-700 dark:text-slate-300">{msg.senderName}</strong> ({msg.senderEmail})
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No messages received yet. Inquiries will appear here safely.
            </div>
          )}

          {/* Expanded Selected Message Viewer with Reply Form */}
          {selectedMessage && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 mt-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedMessage.subject}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 p-1"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-0.5">
                <div>From: <strong className="text-slate-800 dark:text-slate-200">{selectedMessage.senderName}</strong></div>
                <div>Relay Reply Address: <span className="font-mono text-emerald-600">{selectedMessage.senderEmail}</span></div>
                <div>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-200/60 dark:border-slate-800">
                {selectedMessage.message}
              </div>

              {/* Previous Reply if any */}
              {selectedMessage.replyMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Encrypted Response (Dispatched {new Date(selectedMessage.repliedAt).toLocaleDateString()}):</span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 whitespace-pre-wrap">
                    {selectedMessage.replyMessage}
                  </p>
                </div>
              )}

              {/* Zero-Knowledge In-App Reply Form */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-500" />
                  <span>Send Reply via Zero-Knowledge Relay</span>
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Type a response to ${selectedMessage.senderName}. Your personal email remains protected.`}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {replySuccess && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Reply safely dispatched through relay server!
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSendReply(selectedMessage.id)}
                    disabled={replying || !replyText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 transition disabled:opacity-50 shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>{replying ? "Dispatching..." : "Send Reply"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verification Submissions Tracker */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            Verification Tracker
          </h2>

          {profile.verificationRequests && profile.verificationRequests.length > 0 ? (
            <div className="space-y-3">
              {profile.verificationRequests.map((req: any) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                      {req.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

                  <p className="text-slate-500 line-clamp-2">
                    {req.evidenceText}
                  </p>

                  {req.adminNotes && (
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Admin note:</strong> {req.adminNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              You haven't submitted any verification requests yet.
            </p>
          )}

          <Link
            href="/verification"
            className="block text-center w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 transition"
          >
            Submit New Credentials
          </Link>
        </div>
      </div>

      {/* Peer Endorsements & Recommendations Manager */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Peer Endorsements & Recommendations Manager
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly consent-based: only recommendations you review and approve will appear on your public directory record.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setRecTab("received")}
              className={`px-3 py-1.5 rounded-lg transition ${
                recTab === "received"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Received ({profile.receivedRecommendations?.length || 0})
              {pendingRecs.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                  {pendingRecs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setRecTab("authored")}
              className={`px-3 py-1.5 rounded-lg transition ${
                recTab === "authored"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Written by You ({profile.authoredRecommendations?.length || 0})
            </button>
          </div>
        </div>

        {recTab === "received" ? (
          <div className="space-y-6">
            {/* Pending Approvals Notice */}
            {pendingRecs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Awaiting Your Consent & Approval ({pendingRecs.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRecs.map((rec: any) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                            {rec.author?.displayName
                              ? rec.author.displayName.slice(0, 2).toUpperCase()
                              : "??"}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {rec.author?.displayName}
                            </span>
                            <p className="text-[10px] text-slate-500 truncate">
                              {rec.author?.headline || rec.author?.profession}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                          Pending Approval
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Relationship: <span className="font-normal">{rec.relationship}</span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                        "{rec.content}"
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateRecStatus(rec.id, "REJECTED")}
                          disabled={recActionLoading === rec.id}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition disabled:opacity-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateRecStatus(rec.id, "APPROVED")}
                          disabled={recActionLoading === rec.id}
                          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Show on Profile</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved & Active Endorsements */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Active on Your Profile ({approvedRecs.length})
              </h3>

              {approvedRecs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedRecs.map((rec: any) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {rec.author?.displayName}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {rec.relationship}
                          </p>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {new Date(rec.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{rec.content}"
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleUpdateRecStatus(rec.id, "HIDDEN")}
                          disabled={recActionLoading === rec.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRec(rec.id)}
                          disabled={recActionLoading === rec.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No public recommendations currently approved.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Written by User */
          <div className="space-y-4">
            {profile.authoredRecommendations && profile.authoredRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.authoredRecommendations.map((rec: any) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Endorsed
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rec.recipient?.displayName}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : rec.status === "PENDING"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      "{rec.content}"
                    </p>

                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => handleDeleteRec(rec.id)}
                        disabled={recActionLoading === rec.id}
                        className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Recommendation</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                You haven't written recommendations for colleagues yet. Visit their profile in the directory to endorse them.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Digital ID Card Modal */}
      {idCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <button
              onClick={() => setIdCardModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Your Digital Identity Pass
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifiable digital credential with quick verification QR code.
              </p>
            </div>

            <DigitalIdCard profile={profile} />
          </div>
        </div>
      )}
    </div>
  );
}
