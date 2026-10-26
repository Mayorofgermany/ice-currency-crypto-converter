import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, destroySession, verifyPassword } from "@/lib/auth";
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
      include: {
        privacy: true,
        experiences: { orderBy: { createdAt: "desc" } },
        educations: { orderBy: { startYear: "desc" } },
        skills: true,
        publicLinks: true,
        verifications: true,
        verificationRequests: { orderBy: { createdAt: "desc" } },
        contactMessages: { orderBy: { createdAt: "desc" } },
        receivedRecommendations: {
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
        authoredRecommendations: {
          orderBy: { createdAt: "desc" },
          include: {
            recipient: {
              select: {
                id: true,
                displayName: true,
                headline: true,
                profession: true,
                organization: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Fetch profile/me error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      displayName,
      headline,
      bio,
      profession,
      organization,
      industry,
      city,
      country,
      phone,
      email,
      profilePhotoUrl,
      isSearchable,
      experiences,
      educations,
      skills,
      publicLinks,
    } = body;

    const existingProfile = await db.profile.findUnique({
      where: { userId: session.user.userId },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Calculate completion score
    let score = 20; // base score for account creation
    if (displayName) score += 10;
    if (headline) score += 15;
    if (bio && bio.length > 20) score += 15;
    if (profession) score += 10;
    if (organization) score += 10;
    if (city && country) score += 10;
    if (profilePhotoUrl) score += 10;
    score = Math.min(100, score);

    // Update profile core fields
    const updatedProfile = await db.$transaction(async (tx) => {
      // If experiences array provided, sync them
      if (Array.isArray(experiences)) {
        await tx.experience.deleteMany({ where: { profileId: existingProfile.id } });
        if (experiences.length > 0) {
          await tx.experience.createMany({
            data: experiences.map((exp: any) => ({
              profileId: existingProfile.id,
              title: exp.title,
              company: exp.company,
              industry: exp.industry || null,
              startDate: exp.startDate || "",
              endDate: exp.endDate || null,
              isCurrent: !!exp.isCurrent,
              description: exp.description || null,
            })),
          });
        }
      }

      // If educations array provided, sync them
      if (Array.isArray(educations)) {
        await tx.education.deleteMany({ where: { profileId: existingProfile.id } });
        if (educations.length > 0) {
          await tx.education.createMany({
            data: educations.map((edu: any) => ({
              profileId: existingProfile.id,
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy || null,
              startYear: parseInt(edu.startYear, 10) || 2020,
              endYear: edu.endYear ? parseInt(edu.endYear, 10) : null,
            })),
          });
        }
      }

      // If skills array provided, sync them
      if (Array.isArray(skills)) {
        await tx.skill.deleteMany({ where: { profileId: existingProfile.id } });
        if (skills.length > 0) {
          await tx.skill.createMany({
            data: skills.map((s: any) => ({
              profileId: existingProfile.id,
              name: typeof s === "string" ? s : s.name,
              category: typeof s === "object" ? s.category || "General" : "General",
            })),
          });
        }
      }

      // If publicLinks array provided, sync them
      if (Array.isArray(publicLinks)) {
        await tx.publicLink.deleteMany({ where: { profileId: existingProfile.id } });
        if (publicLinks.length > 0) {
          await tx.publicLink.createMany({
            data: publicLinks.map((l: any) => ({
              profileId: existingProfile.id,
              platform: l.platform,
              url: l.url,
            })),
          });
        }
      }

      return tx.profile.update({
        where: { id: existingProfile.id },
        data: {
          displayName: displayName || existingProfile.displayName,
          headline: headline !== undefined ? headline : existingProfile.headline,
          bio: bio !== undefined ? bio : existingProfile.bio,
          profession: profession !== undefined ? profession : existingProfile.profession,
          organization: organization !== undefined ? organization : existingProfile.organization,
          industry: industry !== undefined ? industry : existingProfile.industry,
          city: city !== undefined ? city : existingProfile.city,
          country: country !== undefined ? country : existingProfile.country,
          phone: phone !== undefined ? phone : existingProfile.phone,
          email: email !== undefined ? email : existingProfile.email,
          profilePhotoUrl: profilePhotoUrl !== undefined ? profilePhotoUrl : existingProfile.profilePhotoUrl,
          isSearchable: isSearchable !== undefined ? !!isSearchable : existingProfile.isSearchable,
          completionScore: score,
        },
        include: {
          privacy: true,
          experiences: true,
          educations: true,
          skills: true,
          publicLinks: true,
          verifications: true,
        },
      });
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "PROFILE_UPDATE",
      entityType: "PROFILE",
      entityId: existingProfile.id,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile/me error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    const user = await db.user.findUnique({
      where: { id: session.user.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (password) {
      const isMatch = await verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect password confirmation." }, { status: 400 });
      }
    }

    await logAuditEvent({
      actorUserId: user.id,
      action: "ACCOUNT_DELETION_ERASURE",
      entityType: "USER",
      entityId: user.id,
    });

    // Cascade deletion
    await db.user.delete({
      where: { id: user.id },
    });

    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Account and profile data permanently purged under NDPR Right to Erasure.",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}

