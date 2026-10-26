-- ==============================================================================
-- IgamaZi — Sovereign Identity & Verification Directory
-- Supabase PostgreSQL Schema & Security Blueprint
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Drop (if re-running fresh schema)
DROP TABLE IF EXISTS "recommendations" CASCADE;
DROP TABLE IF EXISTS "contact_messages" CASCADE;
DROP TABLE IF EXISTS "audit_logs" CASCADE;
DROP TABLE IF EXISTS "reports" CASCADE;
DROP TABLE IF EXISTS "verifications" CASCADE;
DROP TABLE IF EXISTS "verification_requests" CASCADE;
DROP TABLE IF EXISTS "public_links" CASCADE;
DROP TABLE IF EXISTS "skills" CASCADE;
DROP TABLE IF EXISTS "educations" CASCADE;
DROP TABLE IF EXISTS "experiences" CASCADE;
DROP TABLE IF EXISTS "profile_privacy" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ==============================================================================
-- 3. Core Tables
-- ==============================================================================

-- USERS TABLE
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "country" TEXT DEFAULT 'Nigeria',
  "role" TEXT DEFAULT 'USER', -- USER, MODERATOR, ADMIN, SUPER_ADMIN
  "status" TEXT DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, DELETED
  "termsAcceptedAt" TIMESTAMPTZ DEFAULT NOW(),
  "privacyConsentAt" TIMESTAMPTZ DEFAULT NOW(),
  "emailVerified" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- SESSIONS TABLE
CREATE TABLE "sessions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" TEXT UNIQUE NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILES TABLE
CREATE TABLE "profiles" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID UNIQUE NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "displayName" TEXT NOT NULL,
  "headline" TEXT,
  "bio" TEXT,
  "profession" TEXT,
  "organization" TEXT,
  "industry" TEXT,
  "city" TEXT,
  "country" TEXT DEFAULT 'Nigeria',
  "phone" TEXT,
  "email" TEXT,
  "profilePhotoUrl" TEXT,
  "isSearchable" BOOLEAN DEFAULT true,
  "completionScore" INTEGER DEFAULT 30,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILE PRIVACY CONTROLS (NDPR Compliance)
CREATE TABLE "profile_privacy" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID UNIQUE NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "overallVisibility" TEXT DEFAULT 'PUBLIC', -- PUBLIC, REGISTERED_ONLY, PRIVATE
  "emailVisibility" TEXT DEFAULT 'PRIVATE',
  "phoneVisibility" TEXT DEFAULT 'PRIVATE',
  "locationVisibility" TEXT DEFAULT 'CITY_ONLY', -- CITY_ONLY, COUNTRY_ONLY, EXACT, HIDDEN
  "experienceVisibility" TEXT DEFAULT 'PUBLIC',
  "educationVisibility" TEXT DEFAULT 'PUBLIC',
  "skillsVisibility" TEXT DEFAULT 'PUBLIC',
  "linksVisibility" TEXT DEFAULT 'PUBLIC',
  "allowContactForm" BOOLEAN DEFAULT true
);

-- WORK EXPERIENCES
CREATE TABLE "experiences" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "industry" TEXT,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT,
  "isCurrent" BOOLEAN DEFAULT false,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- EDUCATION
CREATE TABLE "educations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "institution" TEXT NOT NULL,
  "degree" TEXT NOT NULL,
  "fieldOfStudy" TEXT,
  "startYear" INTEGER NOT NULL,
  "endYear" INTEGER,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- SKILLS
CREATE TABLE "skills" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "category" TEXT DEFAULT 'General'
);

-- PUBLIC LINKS & PORTFOLIO
CREATE TABLE "public_links" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "platform" TEXT NOT NULL,
  "url" TEXT NOT NULL
);

-- VERIFICATION REQUESTS
CREATE TABLE "verification_requests" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL, -- IDENTITY, PROFESSION, ORGANIZATION
  "status" TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  "evidenceText" TEXT NOT NULL,
  "documentUrl" TEXT,
  "adminNotes" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- VERIFICATION BADGES (AWARDED)
CREATE TABLE "verifications" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "profileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL, -- IDENTITY, PROFESSION, ORGANIZATION, EMAIL
  "badgeLabel" TEXT NOT NULL,
  "verifiedAt" TIMESTAMPTZ DEFAULT NOW(),
  "verifiedByAdminId" TEXT
);

-- INCIDENT REPORTS & COMPLAINTS
CREATE TABLE "reports" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "reporterUserId" UUID REFERENCES "users"("id") ON DELETE SET NULL,
  "reportedProfileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "category" TEXT NOT NULL, -- INCORRECT_INFO, IMPERSONATION, HARASSMENT, FRAUD, UNAUTHORIZED_INFO, OFFENSIVE_CONTENT, OTHER
  "details" TEXT NOT NULL,
  "status" TEXT DEFAULT 'PENDING', -- PENDING, INVESTIGATING, RESOLVED, DISMISSED
  "actionTaken" TEXT,
  "resolvedBy" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT TRAIL (NDPR FORENSIC COMPLIANCE)
CREATE TABLE "audit_logs" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "actorUserId" UUID REFERENCES "users"("id") ON DELETE SET NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "ipAddress" TEXT,
  "detailsJson" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ZERO-KNOWLEDGE CONTACT MESSAGES
CREATE TABLE "contact_messages" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "recipientProfileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "senderName" TEXT NOT NULL,
  "senderEmail" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "replyMessage" TEXT,
  "repliedAt" TIMESTAMPTZ,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- PEER ENDORSEMENTS & RECOMMENDATIONS
CREATE TABLE "recommendations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "recipientProfileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "authorProfileId" UUID NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "relationship" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, HIDDEN, REJECTED
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. High-Performance Indexes
-- ==============================================================================

CREATE INDEX idx_profiles_searchable ON "profiles"("isSearchable");
CREATE INDEX idx_profiles_profession ON "profiles"("profession");
CREATE INDEX idx_profiles_organization ON "profiles"("organization");
CREATE INDEX idx_profiles_industry ON "profiles"("industry");
CREATE INDEX idx_profiles_city ON "profiles"("city");
CREATE INDEX idx_profiles_country ON "profiles"("country");
CREATE INDEX idx_sessions_token ON "sessions"("token");
CREATE INDEX idx_verifications_profileId ON "verifications"("profileId");
CREATE INDEX idx_recommendations_recipient ON "recommendations"("recipientProfileId");

-- ==============================================================================
-- 5. Row Level Security (RLS) Configuration
-- ==============================================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_privacy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experiences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "educations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recommendations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;

-- Allow public read of searchable profiles and public privacy metadata
CREATE POLICY "Public profiles are viewable by everyone" 
  ON "profiles" FOR SELECT 
  USING ("isSearchable" = true);

CREATE POLICY "Public privacy configs are viewable" 
  ON "profile_privacy" FOR SELECT 
  USING (true);

CREATE POLICY "Public experiences are viewable" 
  ON "experiences" FOR SELECT 
  USING (true);

CREATE POLICY "Public educations are viewable" 
  ON "educations" FOR SELECT 
  USING (true);

CREATE POLICY "Public skills are viewable" 
  ON "skills" FOR SELECT 
  USING (true);

CREATE POLICY "Public links are viewable" 
  ON "public_links" FOR SELECT 
  USING (true);

CREATE POLICY "Public verifications are viewable" 
  ON "verifications" FOR SELECT 
  USING (true);

CREATE POLICY "Approved recommendations are viewable" 
  ON "recommendations" FOR SELECT 
  USING ("status" = 'APPROVED');

-- Service role bypass policy for backend Next.js API operations
CREATE POLICY "Service role full access on users" ON "users" USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access on profiles" ON "profiles" USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access on privacy" ON "profile_privacy" USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access on messages" ON "contact_messages" USING (auth.jwt() ->> 'role' = 'service_role');

-- ==============================================================================
-- 6. Seed Realistic Initial Profiles
-- ==============================================================================

-- Password hash for 'Password123!'
-- $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO "users" ("id", "email", "passwordHash", "fullName", "country", "role", "status", "emailVerified")
VALUES
  ('819d03a5-a677-44c7-8801-384a62902835', 'admin@igamazi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Babatunde Lawal', 'Nigeria', 'ADMIN', 'ACTIVE', true),
  ('62be0530-dbc0-4e48-a6ce-be25620bc567', 'amina.bello@lagosmed.ng', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Amina Aisha Bello', 'Nigeria', 'USER', 'ACTIVE', true),
  ('e36a9bc9-04d0-4e40-bc47-914aa723d7d9', 'chidi@paynexus.io', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Chidi Anthony Okafor', 'Nigeria', 'USER', 'ACTIVE', true),
  ('64b08aa1-a578-460d-baa9-eda36f67e27c', 'folashade@adeyemipartners.law', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Folashade Adeyemi, SAN', 'Nigeria', 'USER', 'ACTIVE', true)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "profiles" ("id", "userId", "displayName", "headline", "bio", "profession", "organization", "industry", "city", "country", "profilePhotoUrl", "isSearchable", "completionScore")
VALUES
  ('819d03a5-a677-44c7-8801-384a62902835', '819d03a5-a677-44c7-8801-384a62902835', 'Dr. Babatunde Lawal', 'Director of Trust, Identity & Verification at IgamaZi', 'Cybersecurity governance expert with 18+ years advisory experience in West Africa.', 'Cybersecurity & Identity Architect', 'IgamaZi Security & Trust Lab', 'Information Security', 'Abuja', 'Nigeria', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', true, 100),
  ('62be0530-dbc0-4e48-a6ce-be25620bc567', '62be0530-dbc0-4e48-a6ce-be25620bc567', 'Dr. Amina Aisha Bello', 'Consultant Cardiothoracic Surgeon | Clinical Lead at Lagos Heart Institute', 'Specializing in minimally invasive cardiac surgery and valve replacement. Fellow of the West African College of Surgeons.', 'Cardiothoracic Surgeon', 'Lagos Heart & Vascular Institute', 'Healthcare & Medicine', 'Lagos', 'Nigeria', 'https://images.unsplash.com/photo-1594824813580-c112e4ebc518?auto=format&fit=crop&w=400&q=80', true, 95),
  ('e36a9bc9-04d0-4e40-bc47-914aa723d7d9', 'e36a9bc9-04d0-4e40-bc47-914aa723d7d9', 'Chidi Anthony Okafor', 'Co-Founder & CTO at PayNexus | Ex-Stripe | Y Combinator Alum', 'Pioneering borderless payment rails for African creators and businesses.', 'Fintech CTO & Software Architect', 'PayNexus Financial Technologies', 'Financial Technology', 'Lagos', 'Nigeria', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', true, 92),
  ('64b08aa1-a578-460d-baa9-eda36f67e27c', '64b08aa1-a578-460d-baa9-eda36f67e27c', 'Folashade Adeyemi, SAN', 'Managing Partner at Adeyemi & Partners Law Chambers | Arbitrator', 'Commercial dispute arbitration, energy law, and cross-border M&A in West Africa.', 'Senior Advocate of Nigeria (SAN)', 'Adeyemi & Partners Law Chambers', 'Legal Services', 'Abuja', 'Nigeria', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', true, 90)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "verifications" ("id", "profileId", "type", "badgeLabel")
VALUES
  (uuid_generate_v4(), '62be0530-dbc0-4e48-a6ce-be25620bc567', 'PROFESSION', 'Medical Council Verified (MDCN #48190)'),
  (uuid_generate_v4(), '62be0530-dbc0-4e48-a6ce-be25620bc567', 'IDENTITY', 'Govt ID Verified (National NIN)'),
  (uuid_generate_v4(), 'e36a9bc9-04d0-4e40-bc47-914aa723d7d9', 'ORGANIZATION', 'Corporate Executive Verified (CAC RC #1849201)'),
  (uuid_generate_v4(), '64b08aa1-a578-460d-baa9-eda36f67e27c', 'PROFESSION', 'Senior Advocate Confirmed (Legal Practitioners Privileges Committee)')
ON CONFLICT DO NOTHING;
