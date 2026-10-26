import Link from "next/link";
import Image from "next/image";
import { MapPin, Briefcase, Building, ArrowUpRight, ShieldCheck } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

interface ProfileCardProps {
  profile: {
    id: string;
    displayName: string;
    headline?: string | null;
    profession?: string | null;
    organization?: string | null;
    industry?: string | null;
    city?: string | null;
    country?: string | null;
    profilePhotoUrl?: string | null;
    verifications?: { id: string; type: string; badgeLabel: string }[];
    skills?: { id: string; name: string }[];
    completionScore?: number;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const primaryVerification = profile.verifications && profile.verifications.length > 0 ? profile.verifications[0] : null;

  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const locationText = [profile.city, profile.country].filter(Boolean).join(", ");

  return (
    <div className="group relative rounded-2xl glass-panel p-6 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 flex flex-col justify-between">
      <div>
        {/* Top Header: Avatar & Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative">
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                {initials}
              </div>
            )}
            {primaryVerification && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md" title="Verified Profile">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {primaryVerification ? (
              <VerificationBadge type={primaryVerification.type} label={primaryVerification.badgeLabel} size="sm" />
            ) : (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Self-Reported
              </span>
            )}
          </div>
        </div>

        {/* Identity & Headline */}
        <Link href={`/p/${profile.id}`} className="block group-hover:text-sky-600 transition-colors">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug">
            {profile.displayName}
            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-sky-500" />
          </h3>
        </Link>

        {profile.headline && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {profile.headline}
          </p>
        )}

        {/* Professional Meta info */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {(profile.profession || profile.organization) && (
            <div className="flex items-center gap-2 truncate">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {profile.profession || "Professional"}
                {profile.organization ? ` • ${profile.organization}` : ""}
              </span>
            </div>
          )}

          {locationText && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
          )}
        </div>

        {/* Skills Chips */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {skill.name}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5">
                +{profile.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">Consent Verified</span>
        <Link
          href={`/p/${profile.id}`}
          className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 inline-flex items-center gap-1"
        >
          View Profile
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
