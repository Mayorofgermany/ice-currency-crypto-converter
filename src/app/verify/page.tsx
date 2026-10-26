"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Building,
  MapPin,
  Calendar,
  Lock,
  Printer,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  FileText,
  BadgeCheck,
} from "lucide-react";
import VerificationBadge from "@/components/profile/VerificationBadge";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialId = searchParams.get("id") || "";
  const initialSerial = searchParams.get("serial") || "";
  const initialQ = searchParams.get("q") || "";

  const [inputQuery, setInputQuery] = useState(initialSerial || initialId || initialQ);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const resolveVerification = async (paramKey: string, paramValue: string) => {
    if (!paramValue.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/verify?${paramKey}=${encodeURIComponent(paramValue.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ found: false, message: "Error communicating with verification authority." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      resolveVerification("id", initialId);
    } else if (initialSerial) {
      resolveVerification("serial", initialSerial);
    } else if (initialQ) {
      resolveVerification("q", initialQ);
    }
  }, [initialId, initialSerial, initialQ]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    if (inputQuery.startsWith("IGZ-")) {
      resolveVerification("serial", inputQuery);
    } else if (inputQuery.includes("-") && inputQuery.length >= 30) {
      resolveVerification("id", inputQuery);
    } else {
      resolveVerification("q", inputQuery);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-slate-200 dark:border-slate-800 text-center space-y-3 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>Sovereign Identity & Regulatory Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Credential & Digital ID Pass Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Verify the authenticity of professional licenses, digital identity passes, and credentials issued or published under NDPR compliance standards.
        </p>

        {/* Verification Search Bar */}
        <form onSubmit={handleManualSearch} className="max-w-xl mx-auto pt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter Digital ID Serial (e.g. IGZ-NG-2026-...), Profile ID, or Name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition disabled:opacity-50 shadow-md shrink-0"
          >
            {loading ? "Verifying..." : "Verify Pass"}
          </button>
        </form>

        {/* Quick Demo Fillers */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
          <span>Quick verify:</span>
          <button
            type="button"
            onClick={() => {
              setInputQuery("Dr. Amina Aisha Bello");
              resolveVerification("q", "Dr. Amina Aisha Bello");
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Dr. Amina Bello (Surgeon)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setInputQuery("Folashade Adeyemi, SAN");
              resolveVerification("q", "Folashade Adeyemi, SAN");
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Folashade Adeyemi (SAN)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setInputQuery("Chidi Anthony Okafor");
              resolveVerification("q", "Chidi Anthony Okafor");
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Chidi Okafor (Fintech CTO)
          </button>
        </div>
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Querying sovereign verification register...</p>
        </div>
      ) : searched && result?.found ? (
        <div id="verification-certificate" className="space-y-6 animate-in fade-in duration-300">
          {/* Certificate Card */}
          <div className="rounded-3xl glass-panel p-6 sm:p-10 border-2 border-emerald-500/40 dark:border-emerald-600/40 shadow-2xl relative overflow-hidden bg-white/90 dark:bg-slate-900/90">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-400" />

            {/* Verification Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>Verified Authentic Identity</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Official Certificate of Professional Standing
                  </h2>
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  Serial Number
                </span>
                <span className="font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {result.certificate.serialNumber}
                </span>
              </div>
            </div>

            {/* Holder Information Grid */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-200 dark:border-slate-800">
              {/* Photo & Name */}
              <div className="md:col-span-2 flex items-center gap-4">
                {result.certificate.profilePhotoUrl ? (
                  <img
                    src={result.certificate.profilePhotoUrl}
                    alt={result.certificate.displayName}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
                    {result.certificate.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {result.certificate.displayName}
                    </h3>
                    {result.certificate.verifications?.map((v: any) => (
                      <VerificationBadge
                        key={v.id}
                        type={v.type}
                        label={v.badgeLabel}
                        size="sm"
                      />
                    ))}
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {result.certificate.headline || result.certificate.profession}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    {result.certificate.organization && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {result.certificate.organization}
                      </span>
                    )}
                    {(result.certificate.city || result.certificate.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {[result.certificate.city, result.certificate.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Forensic Hash Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Verification Hash (SHA-256)
                </div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 break-all">
                  {result.certificate.verificationHash}
                </div>
                <div className="text-[10px] text-slate-400">
                  Authority: {result.certificate.registryAuthority}
                </div>
              </div>
            </div>

            {/* Official Credentials Breakdown */}
            <div className="py-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" />
                Verified Attestations on Record ({result.certificate.verifications?.length || 0})
              </h4>

              {result.certificate.verifications && result.certificate.verifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.certificate.verifications.map((v: any) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {v.badgeLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                        CONFIRMED
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No individual institutional council badges attached.
                </p>
              )}
            </div>

            {/* Regulatory Seal & Compliance Notice */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>NDPR/GDPR Compliant:</strong> Public record attested with explicit owner consent. Protected by Zero-Knowledge proxy safeguards.
                </span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 shrink-0">
                Verified At: {new Date(result.certificate.lastVerifiedUpdate).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/p/${result.certificate.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition shadow-sm"
            >
              <span>View Full Directory Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Link Copied!" : "Copy Verification URL"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="rounded-2xl glass-panel p-10 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Unverified or Non-Existent Record
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {result?.message || "No registered professional matches the provided ID or Serial Number. The credential may be invalid or unlisted."}
          </p>
          <button
            onClick={() => setInputQuery("")}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition"
          >
            Try Another Search
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-xs text-slate-500">Loading verification portal...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
