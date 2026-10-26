"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  Building,
  GraduationCap,
  Award,
  Globe,
  Share2,
  Mail,
  ShieldAlert,
  Edit3,
  Calendar,
  Lock,
  ExternalLink,
  Check,
  AlertTriangle,
} from "lucide-react";
import VerificationBadge from "@/components/profile/VerificationBadge";
import ContactModal from "@/components/profile/ContactModal";
import ReportModal from "@/components/profile/ReportModal";
import DigitalIdCard from "@/components/profile/DigitalIdCard";
import RecommendationsList from "@/components/profile/RecommendationsList";
import { QrCode, X } from "lucide-react";

function ProfileContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [profile, setProfile] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`/api/profile/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Profile unavailable");
        }

        setProfile(data.profile);
        setIsOwner(data.isOwner || false);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Retrieving verified credentials...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile Unavailable</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error || "This profile is either set to Private by its owner or does not exist."}
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const initials = profile.displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const locationText = [profile.city, profile.country].filter(Boolean).join(", ");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Consent Protected:</strong> This profile is managed under NDPR privacy standards. Direct personal contacts are masked to prevent unauthorized data collection.
          </span>
        </div>
        {isOwner && (
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-1 font-bold text-sky-700 dark:text-sky-300 hover:underline shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
        )}
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle accent ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-400" />

        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 pt-2">
          {/* Avatar */}
          <div className="relative shrink-0">
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                {initials}
              </div>
            )}
            {profile.verifications && profile.verifications.length > 0 && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg" title="Verified Member">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Info & Badges */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {profile.displayName}
              </h1>

              {profile.verifications?.map((v: any) => (
                <VerificationBadge key={v.id} type={v.type} label={v.badgeLabel} size="md" />
              ))}
            </div>

            {profile.headline && (
              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {profile.headline}
              </p>
            )}

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-1">
              {(profile.profession || profile.organization) && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>
                    {profile.profession}
                    {profile.organization ? ` at ${profile.organization}` : ""}
                  </span>
                </div>
              )}

              {profile.industry && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{profile.industry}</span>
                </div>
              )}

              {locationText && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{locationText}</span>
                </div>
              )}
            </div>

            {/* CTA action bar */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setContactModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md shadow-emerald-500/10 transition"
              >
                <Mail className="w-4 h-4" />
                <span>Contact via Relay</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? "Link Copied!" : "Share Profile"}</span>
              </button>

              <button
                onClick={() => setIdCardModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 transition shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Digital ID Pass</span>
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="Report inaccurate information"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio + Experience + Education */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio */}
          {profile.bio && (
            <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                About / Statement of Professional Practice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Experience */}
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-500" />
              Professional Experience
            </h2>

            {profile.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                {profile.experiences.map((exp: any, idx: number) => (
                  <div key={exp.id || idx} className={idx > 0 ? "pt-6" : ""}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No past roles published or marked private.
              </p>
            )}
          </div>

          {/* Education */}
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              Education & Academic Credentials
            </h2>

            {profile.educations && profile.educations.length > 0 ? (
              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                {profile.educations.map((edu: any, idx: number) => (
                  <div key={edu.id || idx} className={idx > 0 ? "pt-4" : ""}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {edu.institution}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {edu.startYear} – {edu.endYear || "Present"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No academic degrees published.
              </p>
            )}
          </div>

          {/* Peer Recommendations Section */}
          <RecommendationsList
            profileId={profile.id}
            profileName={profile.displayName}
            initialRecommendations={profile.receivedRecommendations || []}
            isOwner={isOwner}
          />
        </div>

        {/* Right Column: Skills + Public Links + Transparency Card */}
        <div className="space-y-8">
          {/* Skills Card */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-500" />
              Skills & Expertise
            </h2>

            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s: any) => (
                  <span
                    key={s.id}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No skills listed.</p>
            )}
          </div>

          {/* Public Links Card */}
          {profile.publicLinks && profile.publicLinks.length > 0 && (
            <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                Verified Public Links
              </h2>

              <div className="space-y-2">
                {profile.publicLinks.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                  >
                    <span>{link.platform}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Directory Integrity Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 space-y-3 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              IgamaZi Trust Seal
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This profile has undergone voluntary registration. Personal email and telephone records are protected by zero-knowledge routing.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Record Active • Updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Relay Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        recipientProfileId={profile.id}
        recipientName={profile.displayName}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedProfileId={profile.id}
        reportedProfileName={profile.displayName}
      />

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
                Verified Digital Identity Pass
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official credential issued under IgamaZi trust standards.
              </p>
            </div>

            <DigitalIdCard profile={profile} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            Verifying credential & loading identity profile...
          </p>
        </div>
      }
    >
      <ProfileContent params={params} />
    </Suspense>
  );
}
