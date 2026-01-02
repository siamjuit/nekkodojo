"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
  const email = user.emailAddresses[0].emailAddress;
  const data = {
    username: formData.get("username") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    bio: formData.get("bio") as string,
    isOnboarded: true,
  };

  try {
    await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        profileUrl: user.imageUrl,
        isOnboarded: true,
      },
      create: {
        id: user.id,
        email: email,
        name: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        profileUrl: user.imageUrl,
        isOnboarded: true,
      },
    });
    user.publicMetadata.bio = data.bio;
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user profile" };
  }
}

export async function getUserData() {
  const user = await currentUser();

  if (!user || !user.emailAddresses?.[0].emailAddress) {
    return null;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        bio: true,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
