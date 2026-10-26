"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, X } from "lucide-react";

interface SearchAutocompleteProps {
  placeholder?: string;
  initialValue?: string;
  onSearchSubmit?: (query: string) => void;
  className?: string;
}

export default function SearchAutocomplete({
  placeholder = "Search by name, profession, organization, or location...",
  initialValue = "",
  onSearchSubmit,
  className = "",
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setIsOpen((data.suggestions || []).length > 0);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/search");
      }
    }
  };

  const handleSelectSuggestion = (id: string) => {
    setIsOpen(false);
    router.push(`/p/${id}`);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center rounded-2xl glass-panel p-2 shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500/80 transition"
      >
        <div className="pl-3 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full px-3 py-3 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md shadow-emerald-500/10 transition-all shrink-0"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown Popover */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verified Directory Matches
            </span>
            <span>{suggestions.length} suggestions</span>
          </div>

          <div className="py-1">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestion(item.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
              >
                <div className="flex items-center gap-3">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                      {item.title[0]}
                    </div>
                  )}

                  <div>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 transition block">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-sm">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800/40 text-center text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center justify-center gap-1"
          >
            <span>See all directory results for &ldquo;{query}&rdquo;</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
