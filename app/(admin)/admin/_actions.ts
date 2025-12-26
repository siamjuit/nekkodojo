"use server";

import { prisma } from "@/lib/prisma";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  // Check that the user trying to set the Role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const role = formData.get("role") as string;
    const id = formData.get("id") as string;
    const res = await client.users.updateUserMetadata(id, {
      publicMetadata: { role: role },
    });
    await prisma.user.update({
      where: { id },
      data: { role },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    const id = formData.get("id") as string;
    const res = await client.users.updateUserMetadata(id, {
      publicMetadata: { role: null },
    });
    await prisma.user.update({
      where: { id },
      data: { role: "user" },
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/users");
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function deleteDiscussion(formData: FormData) {
  const client = await clerkClient();
  
  // Security Check
  if (!checkRole("admin")) return { message: "Not Authorized" };

  try {
    const id = formData.get("id") as string;

    // Delete the discussion (Prisma will cascade delete comments/likes if configured, 
    // otherwise you might need to delete related data first depending on your schema)
    await prisma.discussions.delete({
      where: { id },
    });

    revalidatePath("/admin/content");
    return { message: "Success" };
  } catch (err) {
    console.error(err);
    return { message: "Error deleting discussion" };
  }
}
