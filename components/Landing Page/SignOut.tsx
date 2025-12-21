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
      await signOut(() => router.push("/"));
    } catch (error) {
      console.error("Sign out error:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      suppressHydrationWarning
      disabled={loading}
      className="group relative flex items-center justify-center p-2 rounded-lg 
                 text-[#a1887f] hover:text-[#d4af37] 
                 hover:bg-[#d4af37]/10 
                 transition-all duration-300 disabled:opacity-50"
      title="Exit Dojo"
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin text-[#d4af37]" />
      ) : (
        <LogOut className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
      )}
      <span className="sr-only">Sign Out</span>
    </button>
  );
};

export default SignOut;