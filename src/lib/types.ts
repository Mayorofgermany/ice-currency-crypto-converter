export type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export type VisibilityLevel = "PUBLIC" | "REGISTERED_ONLY" | "PRIVATE";
export type LocationVisibility = "CITY_ONLY" | "COUNTRY_ONLY" | "EXACT" | "HIDDEN";

export type VerificationType = "IDENTITY" | "PROFESSION" | "ORGANIZATION" | "EMAIL";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReportCategory =
  | "INCORRECT_INFO"
  | "IMPERSONATION"
  | "HARASSMENT"
  | "FRAUD"
  | "UNAUTHORIZED_INFO"
  | "OFFENSIVE_CONTENT"
  | "OTHER";

export type ReportStatus = "PENDING" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";

export interface UserSession {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  country: string;
}

export interface ProfileData {
  id: string;
  userId: string;
  displayName: string;
  headline?: string | null;
  bio?: string | null;
  profession?: string | null;
  organization?: string | null;
  industry?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  profilePhotoUrl?: string | null;
  isSearchable: boolean;
  completionScore: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: {
    email: string;
    fullName: string;
    country: string;
    role: UserRole;
    status: UserStatus;
  };
  privacy?: ProfilePrivacyData | null;
  experiences?: ExperienceData[];
  educations?: EducationData[];
  skills?: SkillData[];
  publicLinks?: PublicLinkData[];
  verifications?: VerificationData[];
  receivedRecommendations?: RecommendationData[];
  authoredRecommendations?: RecommendationData[];
}

export interface RecommendationData {
  id: string;
  recipientProfileId: string;
  authorProfileId: string;
  relationship: string;
  content: string;
  status: "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";
  createdAt: string | Date;
  updatedAt: string | Date;
  author?: {
    id: string;
    displayName: string;
    headline?: string | null;
    profession?: string | null;
    organization?: string | null;
    profilePhotoUrl?: string | null;
    verifications?: VerificationData[];
  };
  recipient?: {
    id: string;
    displayName: string;
    headline?: string | null;
    profession?: string | null;
    organization?: string | null;
    profilePhotoUrl?: string | null;
  };
}

export interface ProfilePrivacyData {
  id: string;
  profileId: string;
  overallVisibility: VisibilityLevel;
  emailVisibility: VisibilityLevel;
  phoneVisibility: VisibilityLevel;
  locationVisibility: LocationVisibility;
  experienceVisibility: VisibilityLevel;
  educationVisibility: VisibilityLevel;
  skillsVisibility: VisibilityLevel;
  linksVisibility: VisibilityLevel;
  allowContactForm: boolean;
}

export interface ExperienceData {
  id: string;
  profileId: string;
  title: string;
  company: string;
  industry?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
}

export interface EducationData {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startYear: number;
  endYear?: number | null;
}

export interface SkillData {
  id: string;
  profileId: string;
  name: string;
  category?: string | null;
}

export interface PublicLinkData {
  id: string;
  profileId: string;
  platform: string;
  url: string;
}

export interface VerificationData {
  id: string;
  profileId: string;
  type: VerificationType;
  badgeLabel: string;
  verifiedAt: string | Date;
}

export interface VerificationRequestData {
  id: string;
  profileId: string;
  userId: string;
  type: VerificationType;
  status: VerificationStatus;
  evidenceText: string;
  documentUrl?: string | null;
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | Date | null;
  createdAt: string | Date;
  profile?: {
    displayName: string;
    headline?: string | null;
  };
}

export interface ReportData {
  id: string;
  reporterUserId?: string | null;
  reportedProfileId: string;
  category: ReportCategory;
  details: string;
  status: ReportStatus;
  actionTaken?: string | null;
  resolvedBy?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  reportedProfile?: {
    displayName: string;
    headline?: string | null;
  };
  reporter?: {
    fullName: string;
    email: string;
  } | null;
}

export interface ContactMessageData {
  id: string;
  recipientProfileId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

export interface SearchQueryFilters {
  query?: string;
  profession?: string;
  organization?: string;
  industry?: string;
  city?: string;
  country?: string;
  verifiedOnly?: boolean;
  page?: number;
  limit?: number;
}
