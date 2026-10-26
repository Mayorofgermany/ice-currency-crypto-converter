import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.userId },
      include: { privacy: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, privacy: profile.privacy });
  } catch (error) {
    console.error("Fetch privacy error:", error);
    return NextResponse.json({ error: "Failed to fetch privacy settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.userId },
      include: { privacy: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      overallVisibility,
      emailVisibility,
      phoneVisibility,
      locationVisibility,
      experienceVisibility,
      educationVisibility,
      skillsVisibility,
      linksVisibility,
      allowContactForm,
    } = body;

    const updatedPrivacy = await db.profilePrivacy.upsert({
      where: { profileId: profile.id },
      create: {
        profileId: profile.id,
        overallVisibility: overallVisibility || "PUBLIC",
        emailVisibility: emailVisibility || "PRIVATE",
        phoneVisibility: phoneVisibility || "PRIVATE",
        locationVisibility: locationVisibility || "CITY_ONLY",
        experienceVisibility: experienceVisibility || "PUBLIC",
        educationVisibility: educationVisibility || "PUBLIC",
        skillsVisibility: skillsVisibility || "PUBLIC",
        linksVisibility: linksVisibility || "PUBLIC",
        allowContactForm: allowContactForm !== undefined ? !!allowContactForm : true,
      },
      update: {
        overallVisibility: overallVisibility || undefined,
        emailVisibility: emailVisibility || undefined,
        phoneVisibility: phoneVisibility || undefined,
        locationVisibility: locationVisibility || undefined,
        experienceVisibility: experienceVisibility || undefined,
        educationVisibility: educationVisibility || undefined,
        skillsVisibility: skillsVisibility || undefined,
        linksVisibility: linksVisibility || undefined,
        allowContactForm: allowContactForm !== undefined ? !!allowContactForm : undefined,
      },
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "PRIVACY_CHANGE",
      entityType: "PROFILE_PRIVACY",
      entityId: updatedPrivacy.id,
      details: { ...body },
    });

    return NextResponse.json({
      success: true,
      message: "Privacy settings updated successfully.",
      privacy: updatedPrivacy,
    });
  } catch (error) {
    console.error("Update privacy error:", error);
    return NextResponse.json({ error: "Failed to update privacy settings." }, { status: 500 });
  }
}
