"use client";

import { useState } from "react";
import { X, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedProfileId: string;
  reportedProfileName: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  reportedProfileId,
  reportedProfileName,
}: ReportModalProps) {
  const [category, setCategory] = useState("INCORRECT_INFO");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: reportedProfileId,
          category,
          details,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDetails("");
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            Integrity & Trust Center
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Report Profile: {reportedProfileName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            IgamaZi takes false identities, non-consensual listings, and fraudulent claims seriously. All reports are escalated to human compliance officers.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Report Received</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Our moderation team has placed this profile under review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Report *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="INCORRECT_INFO">Factual Inaccuracies / Outdated Credentials</option>
                <option value="IMPERSONATION">Impersonation / False Identity</option>
                <option value="UNAUTHORIZED_INFO">Non-consensual Data or Privacy Violation</option>
                <option value="FRAUD">Fraudulent Claims / Phony Accreditations</option>
                <option value="HARASSMENT">Harassment or Defamatory Information</option>
                <option value="OFFENSIVE_CONTENT">Offensive or Inappropriate Media</option>
                <option value="OTHER">Other Compliance Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Provide Specific Evidence / Details *
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe why this profile is inaccurate or in violation. Provide relevant links or license registers if applicable..."
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-md disabled:opacity-50"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {loading ? "Submitting..." : "Submit Incident Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
