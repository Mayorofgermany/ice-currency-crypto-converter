import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const profiles = await db.profile.findMany({
      where: {
        isSearchable: true,
        user: { status: "ACTIVE" },
        privacy: { overallVisibility: "PUBLIC" },
        organization: { not: null },
      },
      select: {
        id: true,
        displayName: true,
        headline: true,
        profession: true,
        organization: true,
        industry: true,
        city: true,
        country: true,
        profilePhotoUrl: true,
        verifications: {
          select: {
            id: true,
            badgeLabel: true,
            type: true,
          },
        },
      },
    });

    // Group profiles by organization
    const orgMap: Record<string, {
      name: string;
      industry: string | null;
      location: string | null;
      verifiedCount: number;
      members: typeof profiles;
    }> = {};

    for (const p of profiles) {
      if (!p.organization) continue;
      const orgName = p.organization.trim();

      if (!orgMap[orgName]) {
        orgMap[orgName] = {
          name: orgName,
          industry: p.industry || null,
          location: [p.city, p.country].filter(Boolean).join(", ") || null,
          verifiedCount: 0,
          members: [],
        };
      }

      orgMap[orgName].members.push(p);
      if (p.verifications && p.verifications.length > 0) {
        orgMap[orgName].verifiedCount += 1;
      }
    }

    const organizations = Object.values(orgMap).sort(
      (a, b) => b.verifiedCount - a.verifiedCount || b.members.length - a.members.length
    );

    return NextResponse.json({ success: true, organizations });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Organizations API error:", error);
    return NextResponse.json({ error: "Failed to load organizations" }, { status: 500 });
  }
}
