import { db } from "./db";

export async function logAuditEvent({
  actorUserId,
  action,
  entityType,
  entityId,
  ipAddress,
  details,
}: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string | null;
  details?: Record<string, unknown> | null;
}) {
  try {
    await db.auditLog.create({
      data: {
        actorUserId: actorUserId || null,
        action,
        entityType,
        entityId,
        ipAddress: ipAddress || null,
        detailsJson: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
