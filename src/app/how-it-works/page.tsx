import Link from "next/link";
import { ShieldCheck, CheckCircle2, Lock, Eye, Mail, Award, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>The IgamaZi Trust Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          How IgamaZi Protects Truth & Privacy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          IgamaZi was created to replace unauthorized, non-consensual web scrapers and predatory data brokers with a consent-driven, verifiable professional identity directory.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl glass-panel p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg">
            01
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            100% Consent-Based Profiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike directories that scrape social networks or public court documents without notice, an IgamaZi profile can only be created by the individual themselves through verified registration and explicit NDPR consent checkboxes.
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            02
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Granular Field-Level Privacy Masking
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            You hold the keys to every data point. You can set personal emails and phone numbers to Private, mask your location to "City Only" to deter physical stalking, or restrict work history to registered members only.
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
            03
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white" id="contact-relay">
            Zero-Knowledge Contact Relay
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Need to receive business inquiries without opening yourself to spam calls or phishing? Our relay technology delivers incoming inquiries directly into your authenticated dashboard without publishing your actual phone number or email address.
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
            04
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Human Verification & Badging
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Members can submit government identity credentials, medical or legal council license numbers, or corporate registrations. Our human compliance team verifies these against official records before awarding verified status badges.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to take control of your public presence?</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Establish verified trust with prospective clients, employers, and colleagues on the only directory built on sovereign consent.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
          >
            Create Your Profile
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-xl font-semibold text-xs border border-slate-700 hover:bg-slate-800 transition"
          >
            Search Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
