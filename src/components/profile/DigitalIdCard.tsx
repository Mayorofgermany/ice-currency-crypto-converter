"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Award, QrCode, Download, Printer, CheckCircle2, Lock, ExternalLink } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

interface DigitalIdCardProps {
  profile: {
    id: string;
    displayName: string;
    headline?: string | null;
    profession?: string | null;
    organization?: string | null;
    city?: string | null;
    country?: string | null;
    profilePhotoUrl?: string | null;
    verifications?: { id: string; type: string; badgeLabel: string; verifiedAt?: string }[];
    createdAt?: string | Date;
  };
}

export default function DigitalIdCard({ profile }: DigitalIdCardProps) {
  const [downloading, setDownloading] = useState(false);

  const primaryVerification =
    profile.verifications && profile.verifications.length > 0 ? profile.verifications[0] : null;

  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const serialNumber = `IGZ-${(profile.country || "NG").slice(0, 2).toUpperCase()}-2026-${profile.id.slice(0, 6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* The Physical Card Rendering */}
      <div
        id="digital-id-card"
        className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl border border-emerald-500/30 flex flex-col justify-between"
      >
        {/* Background Holographic Glow Patterns */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight flex items-center">
                Igama<span className="text-emerald-400">Zi</span>
              </span>
              <span className="text-[8px] uppercase tracking-widest text-emerald-300 block -mt-1 font-semibold">
                Digital Identity Pass
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
              Serial No.
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
              {serialNumber}
            </span>
          </div>
        </div>

        {/* Card Body: Photo & Identity Details */}
        <div className="relative z-10 flex items-center gap-4 my-auto">
          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={profile.displayName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/60 shadow-lg shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shrink-0">
              {initials}
            </div>
          )}

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-extrabold text-sm sm:text-base text-white truncate">
                {profile.displayName}
              </h2>
              {primaryVerification && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-[11px] font-medium text-slate-300 truncate">
              {profile.profession || "Registered Professional"}
            </p>

            {profile.organization && (
              <p className="text-[10px] text-slate-400 truncate">
                {profile.organization}
              </p>
            )}

            <p className="text-[9px] text-slate-400">
              {[profile.city, profile.country].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        {/* Card Footer: Micro QR verification + Security features */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
          <Link
            href={`/verify?id=${profile.id}`}
            target="_blank"
            className="flex items-center gap-2 hover:opacity-80 transition"
            title="Click to verify credentials"
          >
            <div className="p-1 rounded-lg bg-white text-slate-900 shadow">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] text-slate-300 block font-medium">Scan / Click to Verify</span>
              <span className="text-[8px] text-emerald-400 font-mono">igamazi.com/verify?id={profile.id.slice(0, 8)}...</span>
            </div>
          </Link>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/80">
              <Lock className="w-2.5 h-2.5" />
              <span>NDPR Sovereign Seal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          href={`/verify?id=${profile.id}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Verify Standing Online</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-sky-500" />
          <span>Print Card / PDF</span>
        </button>
      </div>
    </div>
  );
}
