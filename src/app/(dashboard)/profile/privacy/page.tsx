"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [overallVisibility, setOverallVisibility] = useState("PUBLIC");
  const [emailVisibility, setEmailVisibility] = useState("PRIVATE");
  const [phoneVisibility, setPhoneVisibility] = useState("PRIVATE");
  const [locationVisibility, setLocationVisibility] = useState("CITY_ONLY");
  const [experienceVisibility, setExperienceVisibility] = useState("PUBLIC");
  const [educationVisibility, setEducationVisibility] = useState("PUBLIC");
  const [skillsVisibility, setSkillsVisibility] = useState("PUBLIC");
  const [linksVisibility, setLinksVisibility] = useState("PUBLIC");
  const [allowContactForm, setAllowContactForm] = useState(true);

  useEffect(() => {
    async function fetchPrivacy() {
      try {
        const res = await fetch("/api/profile/privacy");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        const p = data.privacy;
        if (p) {
          setOverallVisibility(p.overallVisibility);
          setEmailVisibility(p.emailVisibility);
          setPhoneVisibility(p.phoneVisibility);
          setLocationVisibility(p.locationVisibility);
          setExperienceVisibility(p.experienceVisibility);
          setEducationVisibility(p.educationVisibility);
          setSkillsVisibility(p.skillsVisibility);
          setLinksVisibility(p.linksVisibility);
          setAllowContactForm(p.allowContactForm);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrivacy();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overallVisibility,
          emailVisibility,
          phoneVisibility,
          locationVisibility,
          experienceVisibility,
          educationVisibility,
          skillsVisibility,
          linksVisibility,
          allowContactForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update privacy settings");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    window.open("/api/profile/export", "_blank");
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Loading privacy controls...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            NDPR & GDPR Sovereign Controls
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Privacy & Consent Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fine-tune field-level visibility and exercise your statutory data subject rights.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Privacy Rulebook"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Privacy preferences updated across the global directory!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Overall Profile Exposure */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Overall Profile Visibility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { val: "PUBLIC", title: "Public (Recommended)", desc: "Visible to all web visitors and searchers" },
              { val: "REGISTERED_ONLY", title: "Registered Members", desc: "Visible only to signed-in verified users" },
              { val: "PRIVATE", title: "Private", desc: "Hidden completely from search and public URLs" },
            ].map((opt) => (
              <label
                key={opt.val}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  overallVisibility === opt.val
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{opt.title}</span>
                  <input
                    type="radio"
                    name="overallVisibility"
                    value={opt.val}
                    checked={overallVisibility === opt.val}
                    onChange={(e) => setOverallVisibility(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Contact Masking & Zero-Knowledge Relay */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-sky-500" />
            Contact Coordinates & Anti-Stalking Safeguards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Personal Email Address Visibility
              </label>
              <select
                value={emailVisibility}
                onChange={(e) => setEmailVisibility(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="PRIVATE">Private (Zero-Knowledge Relay Only)</option>
                <option value="REGISTERED_ONLY">Visible to Registered Users Only</option>
                <option value="PUBLIC">Public to All Visitors</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Personal Telephone Number Visibility
              </label>
              <select
                value={phoneVisibility}
                onChange={(e) => setPhoneVisibility(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="PRIVATE">Private (Never Revealed on Web)</option>
                <option value="REGISTERED_ONLY">Visible to Registered Users Only</option>
                <option value="PUBLIC">Public to All</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Geographic Location Precision
            </label>
            <select
              value={locationVisibility}
              onChange={(e) => setLocationVisibility(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="CITY_ONLY">City & Country (e.g. Lagos, Nigeria)</option>
              <option value="COUNTRY_ONLY">Country Only (e.g. Nigeria)</option>
              <option value="EXACT">Exact Address (If published)</option>
              <option value="HIDDEN">Completely Hidden</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Allow Zero-Knowledge Contact Relay
              </span>
              <span className="text-[11px] text-slate-500">
                Enables visitors to send messages through IgamaZi without seeing your email address.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={allowContactForm}
                onChange={(e) => setAllowContactForm(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Section 3: Field-Level Section Visibility */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Section-by-Section Exposure
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Work Experience History
              </label>
              <select
                value={experienceVisibility}
                onChange={(e) => setExperienceVisibility(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="PUBLIC">Public</option>
                <option value="REGISTERED_ONLY">Registered Users Only</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Education & Degrees
              </label>
              <select
                value={educationVisibility}
                onChange={(e) => setEducationVisibility(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="PUBLIC">Public</option>
                <option value="REGISTERED_ONLY">Registered Users Only</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skills & Competencies
              </label>
              <select
                value={skillsVisibility}
                onChange={(e) => setSkillsVisibility(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="PUBLIC">Public</option>
                <option value="REGISTERED_ONLY">Registered Users Only</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Public Links & Social Profiles
              </label>
              <select
                value={linksVisibility}
                onChange={(e) => setLinksVisibility(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="PUBLIC">Public</option>
                <option value="REGISTERED_ONLY">Registered Users Only</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: NDPR & GDPR Statutory Rights */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Data Subject Rights (NDPR & GDPR Compliance)
          </h2>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-sky-500" />
                Right to Data Portability (JSON Archive)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Download a complete, machine-readable JSON copy of all personal, profile, and audit trail data stored on your account.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download My Data
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
