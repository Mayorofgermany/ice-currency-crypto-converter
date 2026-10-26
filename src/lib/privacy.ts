import { ProfileData, UserSession } from "./types";

/**
 * Transforms a profile data object according to its privacy settings and the viewer's session.
 * Protects personal information against unauthorized disclosure (NDPR & GDPR compliance).
 */
export function applyPrivacyTransformation(
  profile: ProfileData,
  viewerSession?: UserSession | null
): ProfileData | null {
  const isOwner = viewerSession?.userId === profile.userId;
  const isAdmin = viewerSession?.role === "ADMIN" || viewerSession?.role === "SUPER_ADMIN";

  // Owner and admins can view full profile details
  if (isOwner || isAdmin) {
    return profile;
  }

  const privacy = profile.privacy || {
    overallVisibility: "PUBLIC",
    emailVisibility: "PRIVATE",
    phoneVisibility: "PRIVATE",
    locationVisibility: "CITY_ONLY",
    experienceVisibility: "PUBLIC",
    educationVisibility: "PUBLIC",
    skillsVisibility: "PUBLIC",
    linksVisibility: "PUBLIC",
    allowContactForm: true,
  };

  const isRegistered = !!viewerSession;

  // Check overall profile visibility
  if (privacy.overallVisibility === "PRIVATE") {
    return null; // Invisible to non-owners
  }

  if (privacy.overallVisibility === "REGISTERED_ONLY" && !isRegistered) {
    return null; // Invisible to unauthenticated visitors
  }

  // Clone profile to prevent mutating the original
  const sanitized: ProfileData = {
    ...profile,
    // Never expose internal user object details to public viewers
    user: undefined,
  };

  // 1. Email masking
  if (privacy.emailVisibility === "PRIVATE") {
    sanitized.email = null;
  } else if (privacy.emailVisibility === "REGISTERED_ONLY" && !isRegistered) {
    sanitized.email = null;
  }

  // 2. Phone masking
  if (privacy.phoneVisibility === "PRIVATE") {
    sanitized.phone = null;
  } else if (privacy.phoneVisibility === "REGISTERED_ONLY" && !isRegistered) {
    sanitized.phone = null;
  }

  // 3. Location masking
  if (privacy.locationVisibility === "HIDDEN") {
    sanitized.city = null;
    sanitized.country = null;
  } else if (privacy.locationVisibility === "COUNTRY_ONLY") {
    sanitized.city = null;
  }

  // 4. Experience visibility
  if (privacy.experienceVisibility === "PRIVATE") {
    sanitized.experiences = [];
  } else if (privacy.experienceVisibility === "REGISTERED_ONLY" && !isRegistered) {
    sanitized.experiences = [];
  }

  // 5. Education visibility
  if (privacy.educationVisibility === "PRIVATE") {
    sanitized.educations = [];
  } else if (privacy.educationVisibility === "REGISTERED_ONLY" && !isRegistered) {
    sanitized.educations = [];
  }

  // 6. Skills visibility
  if (privacy.skillsVisibility === "PRIVATE") {
    sanitized.skills = [];
  } else if (privacy.skillsVisibility === "REGISTERED_ONLY" && !isRegistered) {
    sanitized.skills = [];
  }

  // 7. Public links visibility
  if (privacy.linksVisibility === "PRIVATE") {
    sanitized.publicLinks = [];
  } else if (privacy.linksVisibility === "REGISTERED_ONLY" && !isRegistered) {
    sanitized.publicLinks = [];
  }

  return sanitized;
}
