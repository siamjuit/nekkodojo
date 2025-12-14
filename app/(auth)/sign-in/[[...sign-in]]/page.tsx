"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff, Loader, Loader2, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || !email || !password) {
      return;
    }
    setIsLoading(true);
    try {
      const session = await signIn.create({
        identifier: email,
        password,
      });

      if (session.status === "complete") {
        await setActive({ session: session.createdSessionId });
        router.push("/");
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute inset-0 bg-grid-slate-200/50 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <Card className="max-w-md w-full shadow-xl border-slate-200/60 backdrop-blur-sm bg-white/95 relative z-10">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto w-12 h-12 bg-linear-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="size-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Welcome Back to the Dojo!
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to continue your journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="h-11 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
              type="button"
              onClick={submit}
              disabled={isLoading}
            >
              {isLoading && <Loader className="size-4 animate-spin" />}
              Sign in
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-4 pt-2">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">New here?</span>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Sign up now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
