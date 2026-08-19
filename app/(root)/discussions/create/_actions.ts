"use server";

import { isShadowBanned } from "@/utils/check-shadowban";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const ensureUserStatus = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return { authenticated: false, shadowBanned: false };
  }

  const shadowBanned = await isShadowBanned(userId);

  return {
    authenticated: true,
    shadowBanned,
  };
});
