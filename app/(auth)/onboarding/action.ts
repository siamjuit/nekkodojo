"use server";

import { prisma } from "@/lib/prisma";

export default async function updateUsername(username: string, email: string) {
  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: username,
      },
    });
  } catch (error) {
    console.error("Failed to update the username", error);
  }
}
