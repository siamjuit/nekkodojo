import { ReactNode } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const layout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const user = await currentUser();
  if (user && !user.username) redirect("/onboarding");
  return (
    <>
      <div className="min-h-screen bg-base-100 relative">
        <header className="flex justify-end items-center py-8 md:py-10 px-6 md:px-12 gap-4 h-16 bg-transparent z-1 absolute">
        <SignedOut>
          <SignInButton>
            <button className="btn btn-outline btn-accent border-2">Sign in</button>
          </SignInButton>
          <SignUpButton>
            <button className="btn btn-accent">Sign up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {children}
      </div>
    </>
  );
};

export default layout;
