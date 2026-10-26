import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

// GET /api/profile/[id]/recommendations
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();

    // Check if profile exists
    const targetProfile = await db.profile.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const isOwner = session?.user.userId === targetProfile.userId;

    // Fetch recommendations
    // If owner, fetch APPROVED, PENDING, and HIDDEN. If public visitor, fetch APPROVED only.
    const whereCondition = isOwner
      ? { recipientProfileId: id, status: { in: ["APPROVED", "PENDING", "HIDDEN"] } }
      : { recipientProfileId: id, status: "APPROVED" };

    const recommendations = await db.recommendation.findMany({
      where: whereCondition,
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
    });

    return NextResponse.json({
      success: true,
      recommendations,
      isOwner,
    });
  } catch (error) {
    console.error("Fetch recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations." },
      { status: 500 }
    );
  }
}

// POST /api/profile/[id]/recommendations - Submit a new recommendation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to submit a professional recommendation." },
        { status: 401 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`recommend:${session.user.userId}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Submission rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    // Get author's profile
    const authorProfile = await db.profile.findUnique({
      where: { userId: session.user.userId },
      select: { id: true, displayName: true },
    });

    if (!authorProfile) {
      return NextResponse.json(
        { error: "Please complete your own profile before endorsing other professionals." },
        { status: 400 }
      );
    }

    if (authorProfile.id === id) {
      return NextResponse.json(
        { error: "You cannot write a recommendation for yourself." },
        { status: 400 }
      );
    }

    // Verify recipient profile exists
    const recipientProfile = await db.profile.findUnique({
      where: { id },
      select: { id: true, displayName: true, userId: true },
    });

    if (!recipientProfile) {
      return NextResponse.json({ error: "Recipient profile not found." }, { status: 404 });
    }

    const body = await req.json();
    const { relationship, content } = body;

    if (!relationship || typeof relationship !== "string" || relationship.trim().length < 3) {
      return NextResponse.json(
        { error: "Please specify your professional relationship (e.g., Colleague, Client, Manager)." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length < 20) {
      return NextResponse.json(
        { error: "Recommendation content must be at least 20 characters long." },
        { status: 400 }
      );
    }

    if (content.trim().length > 1500) {
      return NextResponse.json(
        { error: "Recommendation content cannot exceed 1500 characters." },
        { status: 400 }
      );
    }

    // Check if an existing recommendation was already submitted
    const existing = await db.recommendation.findFirst({
      where: {
        recipientProfileId: id,
        authorProfileId: authorProfile.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a recommendation for this professional." },
        { status: 409 }
      );
    }

    const newRecommendation = await db.recommendation.create({
      data: {
        recipientProfileId: id,
        authorProfileId: authorProfile.id,
        relationship: relationship.trim(),
        content: content.trim(),
        status: "PENDING", // Recipient must consent and approve before it goes public!
      },
      include: {
        author: {
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
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "RECOMMENDATION_SUBMITTED",
      entityType: "RECOMMENDATION",
      entityId: newRecommendation.id,
      ipAddress: ip,
      details: {
        recipientProfileId: id,
        recipientName: recipientProfile.displayName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Recommendation submitted successfully! It will appear on their profile once they review and approve it.",
      recommendation: newRecommendation,
    });
  } catch (error) {
    console.error("Submit recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to submit recommendation." },
      { status: 500 }
    );
  }
}
