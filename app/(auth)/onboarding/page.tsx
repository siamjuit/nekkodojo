"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import updateUsername from "./action";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !username || username.length < 4) return;

    setLoading(true);
    setError("");

    try {
      await user.update({
        username: username,
      });

      updateUsername(username, user.emailAddresses[0].emailAddress);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.errors[0].longMessage || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b0a] font-sans text-[#eaddcf] relative overflow-hidden">
      {/* ==========================================
          BACKGROUND ATMOSPHERE
      ========================================== */}
      <div className="absolute inset-0 bg-[#120c0a]">
        {/* Spotlight Effect */}
        <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[radial-gradient(circle_at_center,rgba(62,39,35,0.2)_0%,rgba(10,5,3,1)_60%)] pointer-events-none"></div>
        {/* Floor Texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 40%, rgba(0,0,0,1) 100%)`,
            backgroundSize: "60px 100%",
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#5d4037] bg-[#1a110d]/90 backdrop-blur-md relative z-10 text-[#eaddcf]">
          <CardHeader className="space-y-3 pb-6 border-b border-[#3e2723]">
            {/* Icon Container */}
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-[#2c1810] to-[#0f0b0a] border border-[#d4af37]/50 rounded-2xl flex items-center justify-center shadow-lg relative group">
              <UserCircle className="size-8 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center shadow-md border border-[#1a110d]">
                <Sparkles className="size-3 text-[#1a110d]" />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-center text-[#d4af37] tracking-tight drop-shadow-sm">
              One last thing...
            </CardTitle>

            <CardDescription className="text-center text-base text-[#a1887f] font-light">
              Choose a username to complete your setup
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            <div
              className="space-y-5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Sensei_Dev"
                  className="h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={4}
                />
                <p className="text-xs text-[#5d4037] flex justify-between">
                  <span>Minimum 4 characters</span>
                  <span>{username.length} / 4+</span>
                </p>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-900/50 text-red-200 animate-in fade-in slide-in-from-top-1"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full h-12 text-base font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer 
                         bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]"
                disabled={loading || username.length < 4}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  "Finish Setup"
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-4 pt-4 border-t border-[#3e2723] bg-[#120c0a]/30">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#3e2723]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1a110d] px-2 text-[#5d4037] tracking-widest">
                  Almost there
                </span>
              </div>
            </div>

            <p className="text-sm text-center text-[#a1887f]">
              Welcome aboard! We're excited to have you join the Dojo{" "}
              <span className="text-[#d4af37]">🥋</span>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#3e2723] tracking-widest font-mono opacity-60">
            NEKODOJO // PROFILE_INIT
          </p>
        </div>
      </div>
    </div>
  );
}
