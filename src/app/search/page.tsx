"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building,
  MapPin,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import VerificationBadge from "@/components/profile/VerificationBadge";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [profession, setProfession] = useState(searchParams.get("profession") || "");
  const [organization, setOrganization] = useState(searchParams.get("organization") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verifiedOnly") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (profession) params.set("profession", profession);
      if (organization) params.set("organization", organization);
      if (industry) params.set("industry", industry);
      if (city) params.set("city", city);
      if (country) params.set("country", country);
      if (verifiedOnly) params.set("verifiedOnly", "true");
      if (sortBy) params.set("sortBy", sortBy);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, profession, organization, industry, city, country, verifiedOnly, sortBy, page]);

  const handleResetFilters = () => {
    setQuery("");
    setProfession("");
    setOrganization("");
    setIndustry("");
    setCity("");
    setCountry("");
    setVerifiedOnly(false);
    setSortBy("relevance");
    setPage(1);
    router.push("/search");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Search Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Consent-Based Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Discover Verified Professionals & Public Figures
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search individuals who have authorized their information to be discoverable in compliance with NDPR privacy standards.
          </p>
        </div>

        {/* Global Search Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, headline, skills, or organization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {verifiedOnly && "• Active"}
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar (Desktop + Mobile Toggle) */}
        <aside
          className={`${
            mobileFiltersOpen ? "block" : "hidden"
          } lg:block lg:col-span-1 rounded-2xl glass-panel p-6 border border-slate-200 dark:border-slate-800 space-y-6 sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-500" />
              Filter Directory
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Verified Only Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Only
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                Official council or ID confirmed
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setPage(1);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Industry Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Industries</option>
              <option value="Information Security">Information Security & Trust</option>
              <option value="Healthcare & Medicine">Healthcare & Medicine</option>
              <option value="Financial Technology">Financial Technology</option>
              <option value="Legal Services">Legal Services & Advocacy</option>
              <option value="Architecture & Civil Engineering">Architecture & Civil Engineering</option>
              <option value="Technology">Technology & Software</option>
              <option value="Governance">Civil Service & Governance</option>
            </select>
          </div>

          {/* Profession Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Profession
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => {
                setProfession(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Surgeon, Architect, Lawyer"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Organization Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Organization / Company
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Hospital, Bank, Firm"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* City / Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Lagos, Abuja, London"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </aside>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Status & Controls Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">
                Found <strong className="text-slate-900 dark:text-white font-bold">{total}</strong> consent-verified profiles
              </span>
              {loading && <span className="text-sky-500 animate-pulse font-medium">Updating...</span>}
            </div>

            {/* Sorting & Layout Switcher */}
            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="relevance">Sort: Relevance (Default)</option>
                  <option value="recent">Sort: Recently Updated</option>
                  <option value="name_asc">Sort: Name (A – Z)</option>
                  <option value="name_desc">Sort: Name (Z – A)</option>
                  <option value="completion">Sort: Most Complete</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid or List */}
          {loading && results.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-500">Querying verified registry...</p>
            </div>
          ) : results.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              /* High-Density Row List View */
              <div className="space-y-3">
                {results.map((profile) => {
                  const initials = profile.displayName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const locationText = [profile.city, profile.country].filter(Boolean).join(", ");

                  return (
                    <div
                      key={profile.id}
                      className="rounded-2xl glass-panel p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {profile.profilePhotoUrl ? (
                          <img
                            src={profile.profilePhotoUrl}
                            alt={profile.displayName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-slate-100 dark:ring-slate-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/p/${profile.id}`}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 transition truncate"
                            >
                              {profile.displayName}
                            </Link>

                            {profile.verifications?.map((v: any) => (
                              <VerificationBadge
                                key={v.id}
                                type={v.type}
                                label={v.badgeLabel}
                                size="sm"
                              />
                            ))}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                            {profile.headline || profile.profession || "Registered Member"}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            {profile.organization && (
                              <span className="truncate">{profile.organization}</span>
                            )}
                            {locationText && <span>• {locationText}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {profile.skills && profile.skills.length > 0 && (
                          <div className="hidden md:flex gap-1">
                            {profile.skills.slice(0, 2).map((s: any) => (
                              <span
                                key={s.id}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/p/${profile.id}`}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition shadow-sm"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="rounded-2xl glass-panel p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                No matching profiles found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No individuals currently match your search criteria. Try removing or adjusting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-xs text-slate-500">Loading directory...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
