"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Google from "@/public/logos/google.svg";
import Github from "@/public/logos/github.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

type ClerkErr = { errors?: { message?: string }[] };

const PETALS = [
  { x: 120, y: 180, r: 20, s: 1 },
  { x: 260, y: 90, r: -35, s: 0.8 },
  { x: 610, y: 240, r: 50, s: 1.1 },
  { x: 700, y: 420, r: -10, s: 0.9 },
  { x: 180, y: 520, r: 70, s: 0.8 },
  { x: 560, y: 640, r: 15, s: 1 },
  { x: 330, y: 760, r: -55, s: 0.9 },
  { x: 90, y: 840, r: 30, s: 0.7 },
  { x: 680, y: 860, r: -25, s: 0.8 },
];

const BLOSSOMS = [
  { x: 640, y: 120, s: 1.1 },
  { x: 560, y: 175, s: 0.9 },
  { x: 470, y: 215, s: 1 },
  { x: 700, y: 60, s: 0.8 },
  { x: 395, y: 275, s: 0.8 },
];

function Petal({ s = 1 }: { s?: number }) {
  return (
    <path
      d="M0 -12 C 9 -8, 9 6, 0 12 C -9 6, -9 -8, 0 -12 Z"
      transform={`scale(${s})`}
      fill="#d4af37"
    />
  );
}

function Blossom({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a}) translate(0 -14)`} opacity="0.9">
          <Petal s={1.1} />
        </g>
      ))}
      <circle r="4" fill="#1a110d" />
    </g>
  );
}

function RegisterArt() {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-50"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5d4037" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5d4037" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="1000" fill="#150e0b" />
      <circle cx="400" cy="560" r="420" fill="url(#glow)" />

      {                                }
      <path
        d="M 400 330 A 230 230 0 1 1 250 400"
        fill="none"
        stroke="#eaddcf"
        strokeOpacity="0.9"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M 400 345 A 215 215 0 1 1 262 408"
        fill="none"
        stroke="#d4af37"
        strokeOpacity="0.5"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {                                              }
      <path
        d="M 800 30 C 700 70, 600 130, 520 190 S 400 260, 340 300"
        fill="none"
        stroke="#3e2723"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M 640 110 C 650 90, 670 75, 700 62 M 540 175 C 550 150, 560 140, 575 130"
        fill="none"
        stroke="#3e2723"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {BLOSSOMS.map((b, i) => (
        <Blossom key={i} {...b} />
      ))}

      {                    }
      {PETALS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`} opacity="0.55">
          <Petal s={p.s} />
        </g>
      ))}
    </svg>
  );
}

const SignUpPage = () => {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (err: unknown) => {
    console.log(JSON.stringify(err, null, 2));
    setError((err as ClerkErr).errors?.[0]?.message ?? "An unexpected error occurred.");
    setIsLoading(false);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    if (!email || !username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await signUp.create({ emailAddress: email, password, username });
      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err: unknown) {
      handleError(err);
      return;
    }
    setIsLoading(false);
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!signUp || !code) return;
    setIsLoading(true);

    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status !== "complete") {
        console.log(JSON.stringify(signUp, null, 2));
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session }) => {
            if (session?.currentTask) return;
            router.push("/onboarding");
          },
        });
      }
    } catch (err: unknown) {
      handleError(err);
      return;
    }
    setIsLoading(false);
  }

  async function oauthSignUp(strategy: "oauth_google" | "oauth_github") {
    if (!signUp) return;
    setError("");
    setIsLoading(true);
    try {
      await signUp.sso({
        strategy,
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/onboarding",
      });
    } catch (err: unknown) {
      handleError(err);
    }
  }

  if (!signUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0b0a]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-12 animate-spin text-[#d4af37]" />
          <p className="text-sm text-[#d4af37] font-mono tracking-widest">LOADING DOJO...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all";
  const labelClass = "text-sm font-medium text-[#d4af37]/80";
  const socialClass =
    "flex-1 bg-[#2c1810]/50 border border-[#5d4037] text-[#eaddcf] hover:bg-[#3e2723] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-300 h-12";
  const primaryClass =
    "w-full h-12 text-base font-bold cursor-pointer bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37] transition-all";

  const errorAlert = error && (
    <Alert
      variant="destructive"
      className="bg-red-900/20 border-red-900/50 text-red-200 animate-in fade-in slide-in-from-top-1"
    >
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="grid min-h-screen min-h-svh w-full lg:grid-cols-2 bg-[#0f0b0a] text-[#eaddcf]">
      {                                      }
      <main className="relative flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(62,39,35,0.35),transparent_60%)]" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <Link href="/" className="font-brand lg:hidden block text-xl font-bold text-[#d4af37] w-fit">
            NekkoDojo
          </Link>

          {!pendingVerification ? (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-[#d4af37] tracking-tight">Join the Dojo</h1>
                <p className="text-[#a1887f]">Create your ID and begin the path.</p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => oauthSignUp("oauth_google")}
                  className={socialClass}
                >
                  <Image src={Google} alt="" width={18} height={18} className="opacity-80" />
                  <span className="ml-2">Google</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => oauthSignUp("oauth_github")}
                  className={socialClass}
                >
                  <Image src={Github} alt="" width={18} height={18} className="invert opacity-80" />
                  <span className="ml-2">GitHub</span>
                </Button>
              </div>

              <div className="relative flex items-center">
                <div className="grow border-t border-[#3e2723]" />
                <span className="shrink-0 mx-4 text-sm text-[#5d4037]">or register with email</span>
                <div className="grow border-t border-[#3e2723]" />
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className={labelClass}>
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="initiate@nekodojo.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className={labelClass}>
                    Username
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Dojo Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={labelClass}>
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-10`}
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

                {errorAlert}
                <div id="clerk-captcha" className="self-center" />

                <Button type="submit" disabled={isLoading} className={primaryClass}>
                  {isLoading && <Loader className="size-4 animate-spin mr-2" />}
                  Create account
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-[#d4af37] tracking-tight">
                  Check your email
                </h1>
                <p className="text-[#a1887f]">We sent a 6-digit code to</p>
                <span className="inline-block text-[#eaddcf] font-mono text-sm bg-[#0f0b0a] py-1 px-2 rounded-sm border border-[#3e2723]">
                  {email}
                </span>
              </div>

              <form onSubmit={onPressVerify} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="code" className={labelClass}>
                    Verification code
                  </Label>
                  <InputOTP id="code" maxLength={6} value={code} onChange={setCode}>
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

                {errorAlert}

                <Button type="submit" disabled={isLoading} className={primaryClass}>
                  {isLoading ? (
                    <>
                      <Loader className="size-4 animate-spin mr-2" /> Verifying...
                    </>
                  ) : (
                    "Verify and continue"
                  )}
                </Button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setPendingVerification(false);
                  setError("");
                  setCode("");
                }}
                className="text-sm text-[#a1887f] hover:text-[#d4af37] transition-colors"
              >
                ← Back to sign up
              </button>
            </>
          )}

          <p className="text-sm text-center text-[#a1887f]">
            Already have a belt?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#d4af37] hover:text-[#eaddcf] hover:underline underline-offset-4 transition-all"
            >
              Sign in now
            </Link>
          </p>
        </div>
      </main>

      {                                           }
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden border-l border-[#3e2723] bg-[#150e0b] p-12">
        <RegisterArt />
        <Link
          href="/"
          className="font-brand relative z-10 text-xl font-bold text-[#d4af37] tracking-tight w-fit ml-auto"
        >
          NekkoDojo
        </Link>
        <div className="relative z-10 max-w-sm space-y-3 pb-6">
          <p className="text-3xl font-semibold leading-tight text-[#eaddcf]">
            A new belt, a clean slate.
          </p>
          <p className="text-[#a1887f]">
            Make an account to track your problems, build a streak and start climbing.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default SignUpPage;
