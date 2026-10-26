import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { applyPrivacyTransformation } from "@/lib/privacy";
import { ProfileData } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();

    const profile = await db.profile.findUnique({
      where: { id },
      include: {
        privacy: true,
        experiences: { orderBy: { createdAt: "desc" } },
        educations: { orderBy: { startYear: "desc" } },
        skills: true,
        publicLinks: true,
        verifications: true,
        receivedRecommendations: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                displayName: true,
                headline: true,
                profession: true,
                organization: true,
                profilePhotoUrl: true,
                verifications: {
                  select: {
                    id: true,
                    type: true,
                    badgeLabel: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            fullName: true,
            country: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    if (profile.user.status === "SUSPENDED" || profile.user.status === "DELETED") {
      return NextResponse.json({ error: "This profile is currently unavailable." }, { status: 404 });
    }

    // Apply strict privacy filtering
    const sanitizedProfile = applyPrivacyTransformation(
      profile as unknown as ProfileData,
      session?.user || null
    );

    if (!sanitizedProfile) {
      return NextResponse.json(
        { error: "This profile is private or requires you to be signed in to view." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: sanitizedProfile,
      isOwner: session?.user.userId === profile.userId,
      isAdmin: session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN",
    });
  } catch (error) {
    console.error("Public profile fetch error:", error);
    return NextResponse.json({ error: "Failed to retrieve profile." }, { status: 500 });
  }
}
