"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function checkIsDiscussionMarked(discussionId: string) {
  try {
    const user = await currentUser();
    if (!user) return false;

    const mark = await prisma.bookmark.findUnique({
      where: {
        userId_discussionId: { userId: user.id, discussionId },
      },
    });

    return mark ? true : false;
  } catch (error) {
    console.error("No bookmark found here!");
    return false;
  }
}
