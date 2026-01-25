"use server";

import { BeltType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function updateBeltRank(userId: string, questionsSolved: number) {
  try {
    if (!userId) return false;
    let newBelt: BeltType = "white_belt";

    if (questionsSolved >= 500) {
      newBelt = "black_belt";
    } else if (questionsSolved >= 350) {
      newBelt = "brown_belt";
    } else if (questionsSolved >= 200) {
      newBelt = "purple_belt";
    } else if (questionsSolved >= 100) {
      newBelt = "blue_belt";
    } else if (questionsSolved >= 50) {
      newBelt = "green_belt";
    } else if (questionsSolved >= 25) {
      newBelt = "orange_belt";
    } else if (questionsSolved >= 10) {
      newBelt = "yellow_belt";
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { beltRank: true },
    });

    if (!currentUser) return false;
    if (currentUser.beltRank === newBelt) {
      return true;
    }
    await prisma.user.update({
      where: { id: userId },
      data: { beltRank: newBelt },
    });

    return true;
  } catch (error) {
    console.error("Failed to update belt rank:", error);
    return false;
  }
}
