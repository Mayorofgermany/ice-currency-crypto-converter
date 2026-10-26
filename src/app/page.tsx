"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  EyeOff,
  UserCheck,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  FileCheck2,
  Share2,
} from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  // Featured sample profiles for the showcase
  const featuredProfiles = [
    {
      id: "demo-amina",
      displayName: "Dr. Amina Aisha Bello",
      headline: "Consultant Cardiothoracic Surgeon | Clinical Lead at Lagos Heart Institute",
      profession: "Cardiothoracic Surgeon",
      organization: "Lagos Heart & Vascular Institute",
      city: "Lagos",
      country: "Nigeria",
      profilePhotoUrl: "https://images.unsplash.com/photo-1594824813580-c112e4ebc518?auto=format&fit=crop&w=400&q=80",
      verifications: [{ id: "v1", type: "PROFESSION", badgeLabel: "Medical Council Verified" }],
      skills: [{ id: "s1", name: "Cardiac Surgery" }, { id: "s2", name: "Aortic Root Repair" }],
    },
    {
      id: "demo-chidi",
      displayName: "Chidi Anthony Okafor",
      headline: "Co-Founder & CTO at PayNexus | Ex-Stripe | Y Combinator Alum",
      profession: "Fintech CTO & Software Architect",
      organization: "PayNexus Financial Technologies",
      city: "Lagos",
      country: "Nigeria",
      profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      verifications: [{ id: "v2", type: "ORGANIZATION", badgeLabel: "Verified Executive" }],
      skills: [{ id: "s3", name: "Fintech Rails" }, { id: "s4", name: "Distributed Systems" }],
    },
    {
      id: "demo-fola",
      displayName: "Folashade Adeyemi, SAN",
      headline: "Managing Partner at Adeyemi & Partners Law Chambers | Arbitrator",
      profession: "Senior Advocate of Nigeria (SAN)",
      organization: "Adeyemi & Partners Law Chambers",
      city: "Abuja",
      country: "Nigeria",
      profilePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      verifications: [{ id: "v3", type: "PROFESSION", badgeLabel: "Senior Advocate Confirmed" }],
      skills: [{ id: "s5", name: "Arbitration" }, { id: "s6", name: "Commercial Law" }],
    },
  ];

  const faqs = [
    {
      q: "How is IgamaZi different from traditional people-search sites and data brokers?",
      a: "Traditional people search sites scrape private records without permission, expose sensitive home addresses, and sell personal data. IgamaZi is 100% consent-based: every profile is created voluntarily by the individual, protected by granular field-level privacy controls, and verified through official credentials under Nigerian Data Protection Regulation (NDPR) standards.",
    },
    {
      q: "Can someone find my personal phone number or private email on IgamaZi?",
      a: "No. Personal phone numbers and emails are set to PRIVATE by default. Visitors and verified professionals connect with you through our Zero-Knowledge Contact Relay, which forwards inquiries to your private dashboard without exposing your actual contact information.",
    },
    {
      q: "What does the IgamaZi Verified Badge mean?",
      a: "A verified badge signifies that our compliance and trust team has reviewed official credentials — such as a Government National ID (NIN/Passport), Professional Council Licensing (e.g., MDCN, NBA/SAN, COREN, ICAN), or Corporate Executive Registry documents.",
    },
    {
      q: "Can I remove my profile or make it private at any time?",
      a: "Yes. You maintain full sovereignty over your data. With a single click in your Privacy Settings, you can switch your profile to Registered-Only, completely Private, or purge your account and all associated data permanently under your NDPR Right to Erasure.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/10 via-emerald-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>The Consent-Driven People Information Directory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Find. Connect. <span className="text-gradient">Verify.</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            IgamaZi helps people create trusted public profiles and makes it easier to discover information that individuals have <em>chosen</em> to share.
          </p>

          {/* Large Hero Search Box with Autocomplete */}
          <div className="mt-10 max-w-2xl mx-auto">
            <SearchAutocomplete />

            {/* Quick Filter Pills */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Trending searches:</span>
              <button
                onClick={() => router.push("/search?q=Surgeon")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
              >
                Cardiothoracic Surgeons
              </button>
              <button
                onClick={() => router.push("/search?q=CTO")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
              >
                Fintech CTOs
              </button>
              <button
                onClick={() => router.push("/search?q=SAN")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
              >
                Senior Advocates (SAN)
              </button>
              <button
                onClick={() => router.push("/search?q=Engineer")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
              >
                Structural Engineers
              </button>
            </div>
          </div>

          {/* Dual Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-md transition"
            >
              <Search className="w-4 h-4" />
              <span>Search Directory</span>
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition"
            >
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Create Your Profile</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW IGAMAZI WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-2">
            The Trust Framework
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How IgamaZi Works
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A radical departure from unvetted scrapers and data brokers. You control every byte of your public record.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-2xl glass-panel p-8 border border-slate-200 dark:border-slate-800 relative group hover:border-sky-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-sky-500" />
              Explicit Consent
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every profile is voluntarily created by the individual. You decide what is public, what is restricted to registered members, and what remains private.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl glass-panel p-8 border border-slate-200 dark:border-slate-800 relative group hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Verified Authenticity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit identity documents, professional licenses, or corporate executive credentials for review by our compliance team to earn gold-standard badges.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl glass-panel p-8 border border-slate-200 dark:border-slate-800 relative group hover:border-indigo-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-500" />
              Zero-Knowledge Relay
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect with partners, clients, and peers without ever revealing your personal phone number or private email to search engines or scrapers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED PROFILES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              Curated Directory
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Verified Profiles Spotlight
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real professionals who have established verified public trust on IgamaZi.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700"
          >
            <span>Explore all directory listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProfiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      </section>

      {/* 4. WHY USE IGAMAZI (Comparison Table) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              A Safer Standard
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why IgamaZi Over Predatory Data Brokers?
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Feature / Safeguard</th>
                  <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">IgamaZi</th>
                  <th className="py-3 px-4 text-slate-500">Unvetted Data Brokers / Scrapers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-medium">User Consent & Opt-in</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 100% Voluntary Opt-in
                  </td>
                  <td className="py-3.5 px-4 text-rose-500">Zero Consent (Invasive Scraping)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Personal Contact Coordinates</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Private by Default / Relay Form
                  </td>
                  <td className="py-3.5 px-4 text-rose-500">Sold to Spammers & Telemarketers</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Credential Verification</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Human Compliance Review
                  </td>
                  <td className="py-3.5 px-4 text-rose-500">None (Often Outdated or False)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Right to Erasure (Be Forgotten)</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Instant 1-Click Self-Service
                  </td>
                  <td className="py-3.5 px-4 text-rose-500">Complex, Hostile Opt-Out Funnels</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Data Portability (JSON Export)</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> NDPR Article Compliant
                  </td>
                  <td className="py-3.5 px-4 text-rose-500">Unavailable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            Questions & Answers
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800"
            >
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-sky-900/50">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Take Ownership of Your Professional Identity
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of verified surgeons, engineers, advocates, corporate leaders, and entrepreneurs who have chosen verified transparency over unauthorized web scraping.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-105 transition shadow-lg shadow-emerald-500/20"
              >
                Create Your Profile Today
              </Link>
              <Link
                href="/search"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 transition"
              >
                Search Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
