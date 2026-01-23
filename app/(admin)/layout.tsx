import React from "react";
import { currentUser } from "@clerk/nextjs/server";

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] selection:bg-[#d4af37] selection:text-[#1a110d] flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2c1810_0%,#0f0b0a_50%)] opacity-60" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>  
      <main className="relative flex-1 w-full mx-auto animate-in fade-in duration-500 slide-in-from-bottom-2">
        {children}
      </main>
    </div>
  );
}
