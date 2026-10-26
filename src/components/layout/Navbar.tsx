"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, User, LogOut, Menu, X, LayoutDashboard, ShieldAlert, Search, Settings, Building2, CheckCircle2 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setCurrentUser(data.user);
          } else {
            setCurrentUser(null);
          }
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
                Igama<span className="text-emerald-500">Zi</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                Find • Connect • Verify
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/search"
                  ? "text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
              Directory
            </Link>
            <Link
              href="/organizations"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/organizations"
                  ? "text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Organizations
            </Link>
            <Link
              href="/verify"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/verify"
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Verify Pass
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors ${
                pathname === "/how-it-works"
                  ? "text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                pathname === "/about"
                  ? "text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              href="/privacy"
              className={`text-sm font-medium transition-colors ${
                pathname === "/privacy"
                  ? "text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Privacy & NDPR
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50 hover:bg-rose-100 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin Center
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-500" />
                  Dashboard
                </Link>
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <User className="w-4 h-4 text-emerald-500" />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Account Settings"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Directory Search
          </Link>
          <Link
            href="/organizations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Verified Organizations
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            Verify Pass
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            About IgamaZi
          </Link>
          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Privacy & NDPR Compliance
          </Link>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!loading && currentUser ? (
              <>
                <div className="px-3 py-1 text-xs text-slate-500 font-medium">Signed in as {currentUser.fullName}</div>
                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                  >
                    Admin Control Center
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile/edit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-semibold shadow-md"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
