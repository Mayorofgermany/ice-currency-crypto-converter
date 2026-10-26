import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized access: Administrator role required." },
        { status: 403 }
      );
    }

    const result = await testSupabaseConnection();
    return NextResponse.json({
      success: true,
      supabase: result,
      config: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 20)}...`
          : "Not set",
      },
    });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Supabase test endpoint error:", error);
    return NextResponse.json({ error: "Failed to probe Supabase status" }, { status: 500 });
  }
}
