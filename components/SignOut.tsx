"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignOut = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // passing a callback to signOut ensures the redirect happens 
      // ONLY after the local session is completely destroyed.
      await signOut(() => router.push("/"));
    } catch (error) {
      console.error("Sign out error:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="group relative w-full flex items-center gap-3 px-4 py-3 text-left 
                 text-[#a1887f] hover:text-[#d4af37] 
                 bg-[#2c1810]/30 hover:bg-[#2c1810]/50 
                 border border-transparent hover:border-[#d4af37]/30
                 transition-all duration-300 rounded-md disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin text-[#d4af37]" />
      ) : (
        <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
      )}

      <div className="flex flex-col">
        <span className="font-mono text-sm tracking-widest uppercase font-bold">
          Sign Out
        </span>
        <span className="text-[10px] opacity-60 group-hover:text-[#d4af37]/70">
          Exit the Dojo
        </span>
      </div>
    </button>
  );
};

export default SignOut;