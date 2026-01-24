"use server";

import { isShadowBanned } from "@/utils/check-shadowban";
import { currentUser } from "@clerk/nextjs/server";

export async function ensureUserStatus() {
  const user = await currentUser();
  if (!user) return;
  await isShadowBanned(user.id);
}
