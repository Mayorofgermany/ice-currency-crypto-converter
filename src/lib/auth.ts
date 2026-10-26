import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";
import { UserRole, UserSession } from "./types";

export const SESSION_COOKIE_NAME = "igamazi_session";

// Hash password with salt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate cryptographically secure token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Create a database session and set HTTP-only cookie
export async function createSession(userId: string, reqHeaders?: { ip?: string; userAgent?: string }) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress: reqHeaders?.ip || null,
      userAgent: reqHeaders?.userAgent || null,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return session;
}

// Delete session and clear cookie
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await db.session.deleteMany({
        where: { token },
      });
    } catch {
      // Ignore if session already deleted
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

// Fetch the current logged in user and active profile
export async function getCurrentUser(): Promise<{
  user: UserSession;
  profileId?: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await db.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await db.session.delete({ where: { id: session.id } }).catch(() => {});
      }
      return null;
    }

    if (session.user.status === "SUSPENDED" || session.user.status === "DELETED") {
      return null;
    }

    return {
      user: {
        id: session.id,
        userId: session.user.id,
        email: session.user.email,
        fullName: session.user.fullName,
        role: session.user.role as UserRole,
        country: session.user.country,
      },
      profileId: session.user.profile?.id,
    };
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Error retrieving current user:", error);
    return null;
  }
}
