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

const SignUpPage = () => {
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
    if (!isLoaded || !code) return;
    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/onboarding");
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
    setIsLoading(false);
  }
  async function googleSignIn() {
    setError("");
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
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
        redirectUrlComplete: "/onboarding",
      });
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0b0a]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-12 animate-spin text-[#d4af37]" />
          <p className="text-sm text-[#d4af37]/60 font-mono tracking-widest">LOADING DOJO...</p>
        </div>
      </div>
    );
  }
  return (
    <Card className="max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#5d4037] bg-[#1a110d]/90 backdrop-blur-md relative z-10 text-[#eaddcf]">
      <CardHeader className="space-y-3 pb-6 border-b border-[#3e2723]">
        <div className="mx-auto w-12 h-12 bg-linear-to-br from-[#2c1810] to-[#0f0b0a] border border-[#d4af37]/50 rounded-xl flex items-center justify-center shadow-lg group">
          {!pendingVerification ? (
            <UserPlus className="size-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <Mail className="size-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
          )}
        </div>
        <CardTitle className="text-3xl font-bold text-center text-[#d4af37] tracking-tight drop-shadow-sm">
          {!pendingVerification ? "Join the Dojo" : "Verify Email"}
        </CardTitle>
        <CardDescription className="text-center text-base text-[#a1887f] font-light">
          {!pendingVerification ? (
            "Create your ID and begin the path."
          ) : (
            <div className="flex flex-col gap-1">
              <p>Enter the code sent to your scroll:</p>
              <span className="text-[#eaddcf] font-mono text-xs bg-[#0f0b0a] py-1 px-2 rounded-sm border border-[#3e2723] self-center">
                {email}
              </span>
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {!pendingVerification ? (
          <div className="space-y-5 flex flex-col w-full">
            <div className="flex gap-4 w-full items-center justify-center">
              <Button
                onClick={googleSignIn}
                className="flex-1 btn btn-outline bg-[#2c1810]/50 border-[#5d4037] text-[#eaddcf] hover:bg-[#3e2723] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-300 h-12"
              >
                <Image src={Google} alt="Google" width={18} height={18} className="opacity-80" />
                <span className="ml-2 hidden sm:block">Google</span>
              </Button>
              <Button
                onClick={githubSignIn}
                className="flex-1 btn btn-outline bg-[#2c1810]/50 border-[#5d4037] text-[#eaddcf] hover:bg-[#3e2723] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-300 h-12"
              >
                <Image
                  src={Github}
                  alt="Github"
                  width={18}
                  height={18}
                  className="invert opacity-80"
                />
                <span className="ml-2 hidden sm:block">GitHub</span>
              </Button>
            </div>
            <div className="relative flex items-center py-2">
              <div className="grow border-t border-[#3e2723]"></div>
              <span className="shrink-0 mx-4 text-[#5d4037] text-xs uppercase tracking-widest font-mono">
                Or register with
              </span>
              <div className="grow border-t border-[#3e2723]"></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="initiate@nekodojo.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider"
                >
                  Username
                </Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Dojo Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider"
                >
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
                    className="h-11 pr-10 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d4037] hover:text-[#d4af37] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-900/50 text-red-200 animate-in fade-in slide-in-from-top-1"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div id="clerk-captcha" className="self-center" />

            <Button
              className="w-full h-12 text-base font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer 
                         bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]"
              type="button"
              onClick={submit}
              disabled={isLoading}
            >
              {isLoading && <Loader className="size-4 animate-spin mr-2" />}
              Sign up
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4 flex flex-col items-center">
              <Label
                htmlFor="code"
                className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider text-center"
              >
                Enter Code
              </Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    {[0, 1, 2].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-12 w-10 text-lg bg-[#0f0b0a]/50 border-[#3e2723] text-[#d4af37] transition-all focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-[#5d4037]" />
                  <InputOTPGroup>
                    {[3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-12 w-10 text-lg bg-[#0f0b0a]/50 border-[#3e2723] text-[#d4af37] transition-all focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
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
              className="w-full h-12 text-base font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer 
                         bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]"
              type="button"
              onClick={onPressVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" /> Verifying...
                </>
              ) : (
                <p>Complete Registration</p>
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
                className="text-xs text-[#a1887f] hover:text-[#d4af37] transition-colors tracking-widest uppercase"
              >
                ← Back to setup
              </button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col space-y-4 pt-4 border-t border-[#3e2723] bg-[#120c0a]/30">
        <p className="text-sm text-center text-[#a1887f]">
          Already have a belt?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#d4af37] hover:text-[#eaddcf] hover:underline underline-offset-4 transition-all"
          >
            Sign in now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpPage;
