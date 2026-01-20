import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/sign-in(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
  "/forgot-password(.*)",
  "/guest(.*)",
  "/member(.*)"
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
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const { sessionClaims } = await auth();

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
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
