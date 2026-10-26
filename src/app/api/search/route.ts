import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`search:${ip}`, 45, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Search rate limit exceeded. Please wait a moment before searching again." },
        { status: 429 }
      );
    }

    const session = await getCurrentUser();
    const isRegistered = !!session;

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const profession = searchParams.get("profession")?.trim() || "";
    const organization = searchParams.get("organization")?.trim() || "";
    const industry = searchParams.get("industry")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const country = searchParams.get("country")?.trim() || "";
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const sortBy = searchParams.get("sortBy")?.trim() || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(30, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    let orderBy: Prisma.ProfileOrderByWithRelationInput[] = [
      { completionScore: "desc" },
      { updatedAt: "desc" },
    ];

    if (sortBy === "recent") {
      orderBy = [{ updatedAt: "desc" }];
    } else if (sortBy === "name_asc") {
      orderBy = [{ displayName: "asc" }];
    } else if (sortBy === "name_desc") {
      orderBy = [{ displayName: "desc" }];
    } else if (sortBy === "completion") {
      orderBy = [{ completionScore: "desc" }];
    }

    // Base query conditions
    const whereClause: Prisma.ProfileWhereInput = {
      isSearchable: true,
      user: {
        status: "ACTIVE",
      },
    };

    // Overall visibility filter based on authentication
    if (!isRegistered) {
      whereClause.privacy = {
        overallVisibility: "PUBLIC",
      };
    } else {
      whereClause.privacy = {
        overallVisibility: {
          in: ["PUBLIC", "REGISTERED_ONLY"],
        },
      };
    }

    // Keyword search filter across multiple fields and related skills
    if (q) {
      whereClause.OR = [
        { displayName: { contains: q } },
        { headline: { contains: q } },
        { bio: { contains: q } },
        { profession: { contains: q } },
        { organization: { contains: q } },
        { industry: { contains: q } },
        { city: { contains: q } },
        { skills: { some: { name: { contains: q } } } },
      ];
    }

    if (profession) {
      whereClause.profession = { contains: profession };
    }

    if (organization) {
      whereClause.organization = { contains: organization };
    }

    if (industry) {
      whereClause.industry = { contains: industry };
    }

    if (city) {
      whereClause.city = { contains: city };
    }

    if (country) {
      whereClause.country = { contains: country };
    }

    if (verifiedOnly) {
      whereClause.verifications = {
        some: {},
      };
    }

    const [total, profiles] = await Promise.all([
      db.profile.count({ where: whereClause }),
      db.profile.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
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
          completionScore: true,
          verifications: {
            select: {
              id: true,
              type: true,
              badgeLabel: true,
            },
          },
          skills: {
            take: 4,
            select: {
              id: true,
              name: true,
            },
          },
          privacy: {
            select: {
              locationVisibility: true,
              overallVisibility: true,
            },
          },
        },
      }),
    ]);

    // Sanitize location if masked
    const results = profiles.map((p) => {
      let displayCity = p.city;
      let displayCountry = p.country;

      if (p.privacy?.locationVisibility === "HIDDEN") {
        displayCity = null;
        displayCountry = null;
      } else if (p.privacy?.locationVisibility === "COUNTRY_ONLY") {
        displayCity = null;
      }

      return {
        id: p.id,
        displayName: p.displayName,
        headline: p.headline,
        profession: p.profession,
        organization: p.organization,
        industry: p.industry,
        city: displayCity,
        country: displayCountry,
        profilePhotoUrl: p.profilePhotoUrl,
        verifications: p.verifications,
        skills: p.skills,
        completionScore: p.completionScore,
      };
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      results,
    });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to query directory." }, { status: 500 });
  }
}
