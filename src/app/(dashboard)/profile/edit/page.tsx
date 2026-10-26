"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
} from "lucide-react";

export default function ProfileEditPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "experience" | "education" | "skills" | "links">("basic");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [organization, setOrganization] = useState("");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [isSearchable, setIsSearchable] = useState(true);

  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [publicLinks, setPublicLinks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        const p = data.profile;
        if (p) {
          setDisplayName(p.displayName || "");
          setHeadline(p.headline || "");
          setBio(p.bio || "");
          setProfession(p.profession || "");
          setOrganization(p.organization || "");
          setIndustry(p.industry || "");
          setCity(p.city || "");
          setCountry(p.country || "Nigeria");
          setProfilePhotoUrl(p.profilePhotoUrl || "");
          setIsSearchable(p.isSearchable);
          setExperiences(p.experiences || []);
          setEducations(p.educations || []);
          setSkills(p.skills ? p.skills.map((s: any) => s.name) : []);
          setPublicLinks(p.publicLinks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          headline,
          bio,
          profession,
          organization,
          industry,
          city,
          country,
          profilePhotoUrl,
          isSearchable,
          experiences,
          educations,
          skills: skills.map((name) => ({ name, category: "General" })),
          publicLinks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile changes.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  // Experience handlers
  const addExperience = () => {
    setExperiences([
      ...experiences,
      { title: "", company: "", startDate: "", endDate: "", isCurrent: true, description: "" },
    ]);
  };
  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };
  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Education handlers
  const addEducation = () => {
    setEducations([
      ...educations,
      { institution: "", degree: "", fieldOfStudy: "", startYear: 2020, endYear: "" },
    ]);
  };
  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };
  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // Skill handlers
  const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const removeSkill = (name: string) => {
    setSkills(skills.filter((s) => s !== name));
  };

  // Link handlers
  const addPublicLink = () => {
    setPublicLinks([...publicLinks, { platform: "LinkedIn", url: "" }]);
  };
  const updatePublicLink = (index: number, field: string, value: string) => {
    const updated = [...publicLinks];
    updated[index][field] = value;
    setPublicLinks(updated);
  };
  const removePublicLink = (index: number) => {
    setPublicLinks(publicLinks.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-medium text-slate-500">Loading profile editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Edit Your Verified Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish authentic credentials and control your presence across the IgamaZi directory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile/privacy"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Privacy Controls
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved and published to the directory!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("basic")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "basic"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Basic Details
        </button>

        <button
          onClick={() => setActiveTab("experience")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "experience"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Experience ({experiences.length})
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "education"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Education ({educations.length})
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "skills"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Skills ({skills.length})
        </button>

        <button
          onClick={() => setActiveTab("links")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "links"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Public Links ({publicLinks.length})
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* TAB 1: BASIC DETAILS */}
        {activeTab === "basic" && (
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            {/* Global Directory Visibility Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Publish to Searchable Directory
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  When enabled, your profile can be discovered by people searching IgamaZi.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSearchable}
                  onChange={(e) => setIsSearchable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Photo URL (Direct image link)
                </label>
                <input
                  type="url"
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Headline / Professional Title *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Consultant Cardiothoracic Surgeon at Lagos Heart Institute"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Profession
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Surgeon, Attorney, Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / Firm
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Lagos University Hospital"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Industry</option>
                  <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                  <option value="Financial Technology">Financial Technology</option>
                  <option value="Legal Services">Legal Services</option>
                  <option value="Information Security">Information Security</option>
                  <option value="Architecture & Civil Engineering">Architecture & Civil Engineering</option>
                  <option value="Technology">Technology</option>
                  <option value="Governance">Civil Service & Governance</option>
                  <option value="Other">Other Industry</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos, Abuja, Port Harcourt"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bio / Professional Summary
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your career highlights, areas of practice, and verified achievements..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: EXPERIENCE */}
        {activeTab === "experience" && (
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Career History
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            {experiences.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative bg-slate-50/50 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                  title="Remove this role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(idx, "title", e.target.value)}
                      placeholder="e.g. Lead Surgeon"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Company / Institution
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, "company", e.target.value)}
                      placeholder="e.g. St. Nicholas Hospital"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Year / Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                      placeholder="e.g. 2019"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Year (or Present)
                    </label>
                    <input
                      type="text"
                      disabled={exp.isCurrent}
                      value={exp.isCurrent ? "Present" : exp.endDate || ""}
                      onChange={(e) => updateExperience(idx, "endDate", e.target.value)}
                      placeholder="e.g. 2023"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => updateExperience(idx, "isCurrent", e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Current Position</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role Description
                  </label>
                  <textarea
                    rows={2}
                    value={exp.description || ""}
                    onChange={(e) => updateExperience(idx, "description", e.target.value)}
                    placeholder="Key responsibilities and achievements..."
                    className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EDUCATION */}
        {activeTab === "education" && (
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Academic Degrees & Fellowships
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Degree
              </button>
            </div>

            {educations.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative bg-slate-50/50 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                  title="Remove this degree"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Institution / University
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                      placeholder="e.g. University of Lagos"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Degree / Qualification
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                      placeholder="e.g. MBBS, LL.M, B.Sc"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy || ""}
                      onChange={(e) => updateEducation(idx, "fieldOfStudy", e.target.value)}
                      placeholder="e.g. Surgery, Law"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Year
                    </label>
                    <input
                      type="number"
                      value={edu.startYear}
                      onChange={(e) => updateEducation(idx, "startYear", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      value={edu.endYear || ""}
                      onChange={(e) => updateEducation(idx, "endYear", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === "skills" && (
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Areas of Professional Competence
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type a skill (e.g. 'Aortic Root Surgery') and press Add or Enter..."
                className="flex-1 px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PUBLIC LINKS */}
        {activeTab === "links" && (
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Official Web & Social Channels
              </h3>
              <button
                type="button"
                onClick={addPublicLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Link
              </button>
            </div>

            {publicLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <select
                  value={link.platform}
                  onChange={(e) => updatePublicLink(idx, "platform", e.target.value)}
                  className="w-36 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="GitHub">GitHub</option>
                  <option value="Website">Personal Website</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="Substack">Substack / Blog</option>
                </select>

                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updatePublicLink(idx, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />

                <button
                  type="button"
                  onClick={() => removePublicLink(idx)}
                  className="p-2 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
