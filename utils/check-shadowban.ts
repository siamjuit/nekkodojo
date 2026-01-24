import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function isShadowBanned(targetUserId?: string): Promise<boolean> {
  const session = await auth();
  const userId = targetUserId || session.userId;

  if (!userId) return false;
  let metadata: any;

  if (userId === session.userId && session.sessionClaims?.metadata) {
    metadata = session.sessionClaims.metadata;
  } else {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    metadata = user.publicMetadata;
  }
  if (!metadata?.shadowbanned) return false;
  if (metadata.shadowbanExpires) {
    const expiresAt = new Date(metadata.shadowbanExpires);
    const now = new Date();
    if (now > expiresAt) {
      console.log(`[Shadowban] Timer expired for user ${userId}. Auto-removing ban.`);

      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isShadowBanned: false },
        });

        (await clerkClient()).users.updateUserMetadata(userId, {
          publicMetadata: {
            shadowbanned: false,
            shadowbanExpires: null,
          },
        });
      } catch (error) {
        console.error("Failed to auto-cleanup shadowban:", error);
      }

      return false;
    }
  }
  return true;
}
