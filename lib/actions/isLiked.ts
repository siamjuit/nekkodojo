"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function checkLike(discussionId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized!");

    const isLiked = await prisma.like.findUnique({
      where: {
        userId_discussionId: { userId: user.id, discussionId },
        type: "like",
      },
    });

    return isLiked ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function checkDislike(discussionId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized!");

    const isDisliked = await prisma.like.findUnique({
      where: {
        userId_discussionId: { userId: user.id, discussionId },
        type: "dislike",
      },
    });

    return isDisliked ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
