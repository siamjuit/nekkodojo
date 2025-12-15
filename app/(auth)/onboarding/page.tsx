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
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.errors[0].longMessage || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute inset-0 bg-grid-slate-200/50 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-xl border-slate-200/60 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-3 pb-6">
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg relative">
              <UserCircle className="size-8 text-white" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="size-3 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-center bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
              One last thing...
            </CardTitle>
            
            <CardDescription className="text-center text-base">
              Choose a username to complete your setup
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div 
              className="space-y-5"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose your username"
                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={4}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 4 characters
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSubmit}
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
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

          <CardFooter className="flex-col space-y-4 pt-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Almost there</span>
              </div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              Welcome aboard! We're excited to have you join the Dojo 🥋
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}