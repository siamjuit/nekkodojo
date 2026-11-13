import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/sign-in(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
  "/api/metrics",
  "/forgot-password(.*)",
  "/guest(.*)",
  "/member(.*)",
  "/leaderboard(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/discussions/tag(.*)",
  "/api/questions/category(.*)",
  "/api/questions/create(.*)",
  "/api/questions/delete(.*)",
]);
const isModeratorRoute = createRouteMatcher(["/moderator(.*)"]);

const isApiRoute = (req: Request) => {
  return req.url.includes("/api/");
};

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();

  if (!isPublicRoute(req) && !userId) {
    if (isApiRoute(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await auth.protect();
  }

  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== "admin") {
    if (isApiRoute(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (isModeratorRoute(req) && sessionClaims?.metadata?.role !== "moderator") {
    if (isApiRoute(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
