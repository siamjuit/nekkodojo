import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

const layout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const user = await currentUser();
  if (user && !user.username) redirect("/onboarding");

  return (
    <>
      <div className="min-h-screen bg-[#0f0b0a] relative selection:bg-[#d4af37] selection:text-[#1a110d]">
        <Navbar/>
        {children}
      </div>
    </>
  );
};

export default layout;
