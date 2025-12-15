"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Google from "@/public/logos/google.svg";
import Github from "@/public/logos/github.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus, Mail, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
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
    if (!isLoaded || !email || !username || !password) {
      return;
    }
    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        username,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
    setIsLoading(false);
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!isLoaded || !code) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
    setIsLoading(false);
  }
  async function googleSignIn() {
    setIsLoading(true);
    setError("");
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
  }

  async function githubSignIn() {
    setIsLoading(true);
    setError("");
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute inset-0 bg-grid-slate-200/50 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <Card className="max-w-md w-full shadow-xl border-slate-200/60 backdrop-blur-sm bg-white/95 relative z-10">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto w-12 h-12 bg-linear-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
            {!pendingVerification ? (
              <UserPlus className="size-6 text-white" />
            ) : (
              <Mail className="size-6 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {!pendingVerification ? "Create your Dojo ID" : "Verify your email"}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {!pendingVerification ? (
              "Join the Dojo and start your journey"
            ) : (
              <>
                <p>Enter the code we sent to your email</p>
                <span className="text-muted-foreground text-xs">{email}</span>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {!pendingVerification ? (
            <div className="space-y-5 flex flex-col w-full">
              <div className="flex gap-4 w-full items-center justify-center">
                <Button
                  onClick={googleSignIn}
                  className="btn btn-outline bg-transparent text-accent-foreground hover:text-accent"
                >
                  <Image src={Google} alt="Google" width={16} height={16} />
                  <span className="sm:block hidden mx-auto">Join with Google</span>
                  <span className="sm:hidden block">Google</span>
                </Button>
                <Button
                  onClick={githubSignIn}
                  className="btn btn-outline bg-transparent text-accent-foreground hover:text-accent"
                >
                  <Image src={Github} alt="Google" width={16} height={16} />
                  <span className="sm:block hidden mx-auto">Join with GitHub</span>
                  <span className="sm:hidden block">GitHub</span>
                </Button>
              </div>
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
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <div id="clerk-captcha" className="self-center" />
              <Button
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
                type="button"
                onClick={submit}
                disabled={isLoading}
              >
                {isLoading && <Loader className="size-4 animate-spin" />} Sign up
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2 flex flex-col items-center">
                <Label htmlFor="code" className="text-sm font-medium text-center">
                  Verification code
                </Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="h-11 w-11 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-11 w-11 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-11 w-11 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="h-11 w-11 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-11 w-11 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-11 w-11 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </InputOTPGroup>
                  </InputOTP>
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
                onClick={onPressVerify}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="size-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <p>Verify email</p>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPendingVerification(false);
                    setError("");
                    setCode("");
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to sign up
                </button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col space-y-4 pt-2">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Already a member?</span>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Sign in now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
