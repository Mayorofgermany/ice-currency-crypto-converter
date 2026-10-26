"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Building,
  UserCheck,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import VerificationBadge from "@/components/profile/VerificationBadge";

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"IDENTITY" | "PROFESSION" | "ORGANIZATION">("PROFESSION");
  const [evidenceText, setEvidenceText] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
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
    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          evidenceText,
          documentUrl: documentUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setEvidenceText("");
      setDocumentUrl("");
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || "Failed to submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Loading verification center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Trust & Identity Verification
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Apply for Verified Status
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verified badges distinguish authentic professionals from unverified or impersonated profiles on the IgamaZi network.
        </p>
      </div>

      {/* Active Badges Showcase */}
      {profile?.verifications && profile.verifications.length > 0 && (
        <div className="rounded-2xl glass-panel p-6 border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Currently Awarded Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.verifications.map((v: any) => (
              <VerificationBadge key={v.id} type={v.type} label={v.badgeLabel} size="md" />
            ))}
          </div>
        </div>
      )}

      {/* Verification Application Form */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Submit New Verification Request
        </h2>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Your application was submitted to the compliance team for review!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tier Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Verification Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "PROFESSION",
                  title: "Professional License",
                  desc: "Medical Council, Bar / SAN, COREN, ICAN, etc.",
                  icon: <Award className="w-4 h-4 text-emerald-500" />,
                },
                {
                  id: "IDENTITY",
                  title: "National Identity",
                  desc: "Government NIN, Passport, or National ID",
                  icon: <UserCheck className="w-4 h-4 text-sky-500" />,
                },
                {
                  id: "ORGANIZATION",
                  title: "Corporate Officer",
                  desc: "Founders, C-Suite, Managing Directors",
                  icon: <Building className="w-4 h-4 text-indigo-500" />,
                },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setType(tier.id as any)}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    type === tier.id
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">{tier.title}</span>
                    {tier.icon}
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">{tier.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Evidence Details, License Number & Registration Records *
            </label>
            <textarea
              required
              rows={4}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              placeholder="e.g. Registered with the Medical and Dental Council of Nigeria (MDCN), Folio No. 49281. Year of registration: 2011. Certified by West African College of Surgeons."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supporting Document URL (Cloud link to license/ID scan)
            </label>
            <input
              type="url"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              placeholder="https://drive.google.com/... or https://example.com/certificate.pdf"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting Application..." : "Submit for Verification"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Request History */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Submission History
        </h2>

        {profile?.verificationRequests && profile.verificationRequests.length > 0 ? (
          <div className="space-y-3">
            {profile.verificationRequests.map((req: any) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Category: {req.type}
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

                <p className="text-slate-600 dark:text-slate-400">
                  {req.evidenceText}
                </p>

                {req.documentUrl && (
                  <a
                    href={req.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:underline"
                  >
                    <span>View Submitted Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {req.adminNotes && (
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                    <strong>Admin feedback:</strong> {req.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No verification requests filed yet.</p>
        )}
      </div>
    </div>
  );
}
