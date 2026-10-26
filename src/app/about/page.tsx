import Link from "next/link";
import { ShieldCheck, Target, HeartHandshake, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          <ShieldCheck className="w-4 h-4" />
          Our Mission & Heritage
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About IgamaZi
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>IgamaZi — Know the Person. Verify the Information.</strong>
        </p>
      </div>

      <div className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <p>
          In an era plagued by identity fraud, deepfakes, phishing scams, and invasive web-scraping data brokers, establishing verified professional trust has become nearly impossible.
        </p>
        <p>
          Traditional "people-search" directories profit by harvesting non-consensual personal data, republishing unverified rumors, and selling personal phone numbers to telemarketers.
        </p>
        <p>
          <strong>IgamaZi was founded on a simple premise: Truth requires consent.</strong> We provide a modern, secure directory where individuals consciously author their credentials, control the visibility of every single field, and earn verifiable trust through rigorous credential reviews.
        </p>

        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
          <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-2">
            <Target className="w-6 h-6 text-sky-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Our Vision</h3>
            <p className="text-xs text-slate-500">
              To build Africa's and the world's most trusted, consent-first professional registry where verification replaces speculation.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-2">
            <HeartHandshake className="w-6 h-6 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Our Core Standard</h3>
            <p className="text-xs text-slate-500">
              Zero unauthorized scraping. Zero data broker sales. 100% individual control over personal disclosures.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Regulatory Alignment</h2>
        <p>
          IgamaZi operates in strict accordance with the Nigeria Data Protection Act (NDPA), the Nigeria Data Protection Regulation (NDPR), and international frameworks such as the General Data Protection Regulation (GDPR). Every member has an inalienable right to data access, rectification, portability, and permanent erasure.
        </p>
      </div>
    </div>
  );
}
