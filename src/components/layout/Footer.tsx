import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2, Globe, FileText, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Igama<span className="text-emerald-400">Zi</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>Know the Person. Verify the Information.</strong> A secure, consent-based people information and identity directory designed to defeat fraud, protect personal privacy, and foster verified professional relationships.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 rounded-lg px-3 py-1.5 w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>NDPR & GDPR Privacy by Design</span>
            </div>
          </div>

          {/* Directory & Discovery */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">Directory & Search</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  <span>Browse Directory</span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/search?verifiedOnly=true" className="text-slate-400 hover:text-white transition">
                  Verified Professionals
                </Link>
              </li>
              <li>
                <Link href="/search?industry=Technology" className="text-slate-400 hover:text-white transition">
                  Technology Leaders
                </Link>
              </li>
              <li>
                <Link href="/search?industry=Healthcare" className="text-slate-400 hover:text-white transition">
                  Healthcare & Medical
                </Link>
              </li>
              <li>
                <Link href="/search?industry=Legal+Services" className="text-slate-400 hover:text-white transition">
                  Legal & Advocates
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">Verification & Security</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-white transition">
                  How Verification Works
                </Link>
              </li>
              <li>
                <Link href="/verification" className="text-slate-400 hover:text-white transition">
                  Request Verification Badge
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition">
                  Privacy Safeguards
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#contact-relay" className="text-slate-400 hover:text-white transition">
                  Zero-Knowledge Contact Relay
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">
                  Anti-Scraping Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">Governance & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition">
                  Privacy Policy (NDPR)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
                  Data Portability & Export
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">
                  About IgamaZi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 IgamaZi Network Systems. All rights reserved. Strictly consent-based directory.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Scraping Policy</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>West Africa & Global Operations</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
