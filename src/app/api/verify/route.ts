import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// GET /api/verify - Public verification check for Digital ID passes and credentials
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim() || "";
    const serial = searchParams.get("serial")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";

    if (!id && !serial && !q) {
      return NextResponse.json(
        { error: "Please provide a Profile ID, Serial Number, or Name to verify." },
        { status: 400 }
      );
    }

    let profile: any = null;

    // 1. If explicit ID provided
    if (id) {
      profile = await db.profile.findUnique({
        where: { id },
        include: {
          verifications: true,
          privacy: true,
          user: { select: { status: true, createdAt: true } },
          receivedRecommendations: { where: { status: "APPROVED" }, select: { id: true } },
        },
      });
    }

    // 2. If Serial Number provided (e.g. IGZ-NG-2026-676A5A)
    if (!profile && serial) {
      // Extract profile ID prefix from serial if formatted IGZ-XX-2026-XXXXXX
      const parts = serial.split("-");
      const idPrefix = parts[parts.length - 1]?.toLowerCase();

      if (idPrefix && idPrefix.length >= 4) {
        profile = await db.profile.findFirst({
          where: {
            id: { startsWith: idPrefix },
          },
          include: {
            verifications: true,
            privacy: true,
            user: { select: { status: true, createdAt: true } },
            receivedRecommendations: { where: { status: "APPROVED" }, select: { id: true } },
          },
        });
      }
    }

    // 3. Fallback to query
    if (!profile && q) {
      // First check if q matches an exact ID
      profile = await db.profile.findFirst({
        where: {
          OR: [
            { id: q },
            { displayName: { contains: q } },
          ],
        },
        include: {
          verifications: true,
          privacy: true,
          user: { select: { status: true, createdAt: true } },
          receivedRecommendations: { where: { status: "APPROVED" }, select: { id: true } },
        },
      });
    }

    if (!profile) {
      return NextResponse.json({
        found: false,
        message: "No registered identity matches the provided credentials.",
      });
    }

    // Determine trust status
    const isSuspended = profile.user.status === "SUSPENDED" || profile.user.status === "DELETED";
    const hasVerifications = profile.verifications && profile.verifications.length > 0;

    let trustStatus = "REGISTERED_UNVERIFIED";
    if (isSuspended) {
      trustStatus = "SUSPENDED";
    } else if (hasVerifications) {
      trustStatus = "VERIFIED_AUTHENTIC";
    }

    const serialNumber = `IGZ-${(profile.country || "NG").slice(0, 2).toUpperCase()}-2026-${profile.id.slice(0, 6).toUpperCase()}`;

    // Generate cryptographic verification signature (HMAC simulation for tamper proof verification)
    const verificationHash = crypto
      .createHash("sha256")
      .update(`${profile.id}:${serialNumber}:${profile.user.status}:${profile.updatedAt.toISOString()}`)
      .digest("hex")
      .slice(0, 32)
      .toUpperCase();

    // Sanitize location if hidden
    let displayCity = profile.city;
    let displayCountry = profile.country;
    if (profile.privacy?.locationVisibility === "HIDDEN") {
      displayCity = null;
      displayCountry = null;
    } else if (profile.privacy?.locationVisibility === "COUNTRY_ONLY") {
      displayCity = null;
    }

    return NextResponse.json({
      found: true,
      trustStatus,
      certificate: {
        id: profile.id,
        serialNumber,
        verificationHash,
        displayName: profile.displayName,
        headline: profile.headline,
        profession: profile.profession,
        organization: profile.organization,
        industry: profile.industry,
        city: displayCity,
        country: displayCountry,
        profilePhotoUrl: profile.profilePhotoUrl,
        verifications: profile.verifications,
        registeredSince: profile.user.createdAt,
        lastVerifiedUpdate: profile.updatedAt,
        approvedEndorsementsCount: profile.receivedRecommendations?.length || 0,
        ndprStatus: "COMPLIANT_SOVEREIGN_DIRECTORY",
        registryAuthority: "IgamaZi Trust & Verification Authority (West Africa)",
      },
    });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Verification resolution error:", error);
    return NextResponse.json(
      { error: "Failed to resolve verification." },
      { status: 500 }
    );
  }
}
