import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          NDPR & GDPR Privacy Governance
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy & Data Subject Safeguards
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last Updated: October 2026 • Nigeria Data Protection Regulation Compliant
        </p>
      </div>

      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Core Privacy Philosophy</h2>
          <p>
            IgamaZi does not scrape the web. We do not acquire third-party data broker databases. Every data point published on IgamaZi exists because the individual explicitly consented to its inclusion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Personal Data We Collect</h2>
          <p>
            When registering and maintaining an IgamaZi profile, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Credentials:</strong> Full name, verified email address, cryptographically hashed passwords.</li>
            <li><strong>Profile Information (Optional & User-Controlled):</strong> Headline, bio, profession, organization, industry, city, country, profile photo, employment history, academic credentials, skills, and public social/professional links.</li>
            <li><strong>Verification Records:</strong> Evidence descriptions, license numbers, and cloud document links submitted for badge verification.</li>
            <li><strong>Relay Messages:</strong> Communications routed between users through our Zero-Knowledge contact proxy.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Zero-Knowledge Contact Relay</h2>
          <p>
            To prevent stalking, scrapers, and spam, personal phone numbers and direct email addresses are hidden by default. Inquiries sent via profile pages are held securely on IgamaZi servers and shown in the recipient's authenticated dashboard without revealing their actual contact details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Your Statutory Data Subject Rights</h2>
          <p>
            Under the NDPR and GDPR, you have the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Rectification:</strong> You can edit any field of your profile instantly via the <Link href="/profile/edit" className="text-sky-600 underline">Profile Editor</Link>.</li>
            <li><strong>Right to Restrict Processing:</strong> You can hide your profile from search results or restrict visibility to registered users only via <Link href="/profile/privacy" className="text-sky-600 underline">Privacy Settings</Link>.</li>
            <li><strong>Right to Data Portability:</strong> You can download a complete, machine-readable JSON copy of all data stored on your account at any time.</li>
            <li><strong>Right to Erasure (Be Forgotten):</strong> You can delete your profile, purging all associated public records from our database.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Security Standards</h2>
          <p>
            All passwords are salted and hashed using Bcrypt. Session tokens are transmitted via HTTPS in HTTP-Only, SameSite secure cookies. Rate limiting algorithms defend against brute-force attacks and bulk scraping attempts.
          </p>
        </section>
      </div>
    </div>
  );
}
