"use client";

import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);
  return (
    <div data-theme="luxury" className="min-h-screen min-w-full">
      {children}
    </div>
  );
};

export default layout;
