import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const profiles = await db.profile.findMany({
      where: {
        isSearchable: true,
        user: { status: "ACTIVE" },
        privacy: { overallVisibility: "PUBLIC" },
        OR: [
          { displayName: { contains: q } },
          { profession: { contains: q } },
          { organization: { contains: q } },
        ],
      },
      take: 6,
      select: {
        id: true,
        displayName: true,
        profession: true,
        organization: true,
        profilePhotoUrl: true,
      },
    });

    const suggestions = profiles.map((p) => ({
      id: p.id,
      title: p.displayName,
      subtitle: [p.profession, p.organization].filter(Boolean).join(" • "),
      photo: p.profilePhotoUrl,
    }));

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Suggestions error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
