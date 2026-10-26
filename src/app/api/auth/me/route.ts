import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.userId },
      include: {
        privacy: true,
        verifications: true,
      },
    });

    return NextResponse.json({
      authenticated: true,
      user: session.user,
      profile,
    });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Auth me check error:", error);
    return NextResponse.json({ authenticated: false, error: "Failed to verify session" }, { status: 500 });
  }
}
