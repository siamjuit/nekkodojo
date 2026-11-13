"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Onboarding from "./_components/Onboarding";

interface UserData {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  bio?: string | null;
  profileUrl?: string | null;
}

export default function OnboardingPage() {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/users/onboarding");
        if (!response.ok) throw new Error("Failed to load onboarding profile.");

        const userData = (await response.json()) as UserData | null;
        if (!cancelled) setData(userData);
      } catch (fetchError) {
        console.error("Failed to load onboarding profile:", fetchError);
        if (!cancelled) setError("Unable to load your profile. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadUserData();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <div className="relative flex min-h-screen min-h-svh w-full items-center justify-center bg-[#0f0b0a] px-4 py-8 font-sans text-[#eaddcf] sm:py-12">
      <div className="absolute inset-0 overflow-hidden bg-[#120c0a]">
        <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[radial-gradient(circle_at_center,rgba(62,39,35,0.2)_0%,rgba(10,5,3,1)_60%)] pointer-events-none"></div>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 40%, rgba(0,0,0,1) 100%)`,
            backgroundSize: "60px 100%",
          }}
        ></div>
      </div>
      {isLoading ? (
        <div className="relative z-10 flex items-center justify-center gap-3 text-[#d4af37]" role="status" aria-live="polite">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span>Loading your profile...</span>
        </div>
      ) : error ? (
        <div className="relative z-10 space-y-4 text-center">
          <p role="alert" className="text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="rounded-md border border-[#5d4037] px-4 py-2 hover:bg-[#1a110d]"
          >
            Try again
          </button>
        </div>
      ) : (
        <Onboarding initialData={data} />
      )}
    </div>
  );
}
