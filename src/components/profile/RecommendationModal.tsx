"use client";

import { useState } from "react";
import { X, Award, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientProfileId: string;
  recipientName: string;
  onSubmitted?: () => void;
}

const RELATIONSHIP_OPTIONS = [
  "Worked together directly on the same team",
  "Managed this professional directly",
  "Reported directly to this professional",
  "Client / Vendor or Strategic Business Partner",
  "Professional Colleague / Industry Peer",
  "Academic, Clinical, or Research Collaborator",
  "Legal, Advisory, or Board Associate",
];

export default function RecommendationModal({
  isOpen,
  onClose,
  recipientProfileId,
  recipientName,
  onSubmitted,
}: RecommendationModalProps) {
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (content.trim().length < 20) {
      setError("Please provide a more detailed recommendation (minimum 20 characters).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/profile/${recipientProfileId}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationship,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit recommendation.");
      }

      setSuccess(true);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setContent("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Endorse {recipientName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Write an authentic professional recommendation. In compliance with consent principles, {recipientName} will review and approve this before it appears publicly on their profile.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Recommendation Submitted!
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Your endorsement has been securely relayed to {recipientName}. Once they review and approve it, it will appear proudly on their verified profile.
            </p>
            <button
              onClick={resetAndClose}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Professional Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Endorsement / Recommendation
                </label>
                <span className="text-[10px] text-slate-400">
                  {content.length}/1500
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Describe ${recipientName}'s professional qualities, expertise, work ethic, or impact on your collaboration...`}
                maxLength={1500}
                className="w-full p-3 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Consent & Attribution Notice</span>
              </div>
              <p>
                Your name, headline, and verified badge will be attributed to this recommendation. False or misleading endorsements violate the IgamaZi Code of Integrity.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || content.trim().length < 20}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit for Approval"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
