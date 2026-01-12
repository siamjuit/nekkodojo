import { getIsOnboarded } from "./action";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currUser = await currentUser();
  const isOnboarded = await getIsOnboarded();
  if (isOnboarded && currUser) {
    redirect("/problems");
  }
  return (
    <div data-theme="luxury" className="min-h-screen min-w-full">
      {children}
    </div>
  );
}