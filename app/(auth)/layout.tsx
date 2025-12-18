"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useSession();
  const user = useUser();
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      if (user.user?.username) router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return;
  return (
    <div data-theme="luxury" className="min-h-screen min-w-full">
      {children}
    </div>
  );
};

export default layout;
