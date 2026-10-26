"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Quote, ShieldCheck, Plus, CheckCircle2 } from "lucide-react";
import VerificationBadge from "./VerificationBadge";
import RecommendationModal from "./RecommendationModal";

interface RecommendationsListProps {
  profileId: string;
  profileName: string;
  initialRecommendations?: any[];
  isOwner?: boolean;
}

export default function RecommendationsList({
  profileId,
  profileName,
  initialRecommendations = [],
  isOwner = false,
}: RecommendationsListProps) {
  const [recommendations, setRecommendations] = useState<any[]>(initialRecommendations);
  const [modalOpen, setModalOpen] = useState(false);

  const refreshRecommendations = async () => {
    try {
      const res = await fetch(`/api/profile/${profileId}/recommendations`);
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:divide-slate-800 gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Peer Endorsements & Recommendations ({recommendations.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified testimonials confirmed by registered colleagues and industry peers.
          </p>
        </div>

        {!isOwner && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Endorse {profileName.split(" ")[0]}</span>
          </button>
        )}
      </div>

      {/* Recommendations Cards */}
      {recommendations.length > 0 ? (
        <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
          {recommendations.map((rec, idx) => {
            const author = rec.author;
            const initials = author?.displayName
              ? author.displayName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "??";

            return (
              <div key={rec.id} className={idx > 0 ? "pt-6" : ""}>
                <div className="space-y-3">
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {author?.profilePhotoUrl ? (
                        <img
                          src={author.profilePhotoUrl}
                          alt={author.displayName}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-sm">
                          {initials}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/p/${author?.id}`}
                            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition"
                          >
                            {author?.displayName}
                          </Link>

                          {author?.verifications?.map((v: any) => (
                            <VerificationBadge
                              key={v.id}
                              type={v.type}
                              label={v.badgeLabel}
                              size="sm"
                            />
                          ))}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {author?.headline || author?.profession}
                          {author?.organization ? ` at ${author.organization}` : ""}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      {new Date(rec.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Relationship tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>{rec.relationship}</span>
                  </div>

                  {/* Endorsement Content */}
                  <div className="relative pl-6 pr-2 pt-1">
                    <Quote className="w-4 h-4 text-amber-500/40 absolute left-0 top-1 rotate-180" />
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{rec.content}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            No public endorsements yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isOwner
              ? "Endorsements submitted by your verified colleagues will appear here once you approve them."
              : `Have you worked with ${profileName}? Submit an authentic recommendation to validate their expertise.`}
          </p>
          {!isOwner && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Be the first to endorse</span>
            </button>
          )}
        </div>
      )}

      {/* Write Recommendation Modal */}
      <RecommendationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        recipientProfileId={profileId}
        recipientName={profileName}
        onSubmitted={refreshRecommendations}
      />
    </div>
  );
}
