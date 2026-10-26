"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Search,
  MapPin,
  Users,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import VerificationBadge from "@/components/profile/VerificationBadge";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadOrgs() {
      try {
        const res = await fetch("/api/organizations");
        if (res.ok) {
          const data = await res.json();
          setOrganizations(data.organizations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrgs();
  }, []);

  const filtered = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      (org.industry && org.industry.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Building2 className="w-4 h-4" />
          Institutional Trust Registry
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Verified Organizations & Institutions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Discover accredited institutions, healthcare centers, law firms, and fintech companies whose executive leaders and staff have established verified credentials on IgamaZi.
        </p>

        {/* Search */}
        <div className="pt-2 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations or industries..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-xs font-medium text-slate-500">Loading institutional registry...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((org) => (
            <div
              key={org.name}
              className="rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition shadow-sm space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-sky-500 shrink-0" />
                      <span>{org.name}</span>
                    </h2>
                    {org.industry && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                        {org.industry}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{org.verifiedCount} Verified</span>
                  </span>
                </div>

                {org.location && (
                  <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{org.location}</span>
                  </p>
                )}

                {/* Affiliated Members Preview */}
                <div className="mt-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Verified Personnel & Leadership
                  </span>
                  <div className="space-y-2">
                    {org.members.slice(0, 3).map((m: any) => (
                      <Link
                        key={m.id}
                        href={`/p/${m.id}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 hover:border-sky-500/50 transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          {m.profilePhotoUrl ? (
                            <img
                              src={m.profilePhotoUrl}
                              alt={m.displayName}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                              {m.displayName[0]}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition block">
                              {m.displayName}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate block max-w-xs">
                              {m.profession || m.headline}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{org.members.length} registered profiles</span>
                </span>
                <Link
                  href={`/search?organization=${encodeURIComponent(org.name)}`}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Search all at {org.name.slice(0, 16)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-500 text-xs">
          No organizations matching your search term.
        </div>
      )}
    </div>
  );
}
