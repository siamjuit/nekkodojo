"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Loader, Loader2, Mail, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Google from "@/public/logos/google.svg";
import Github from "@/public/logos/github.svg";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

type ClerkErr = { errors?: { message?: string }[] };

function DojoArt() {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f0b0a" />
          <stop offset="0.55" stopColor="#2c1810" />
          <stop offset="1" stopColor="#5d4037" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#d4af37" stopOpacity="0.35" />
          <stop offset="1" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="1000" fill="url(#sky)" />

      {                 }
      <circle cx="540" cy="360" r="260" fill="url(#moonGlow)" />
      <circle cx="540" cy="360" r="120" fill="#d4af37" opacity="0.9" />

      {                                    }
      <path
        d="M0 640 L120 560 L220 620 L340 520 L470 620 L600 540 L720 610 L800 570 L800 1000 L0 1000Z"
        fill="#3e2723"
        opacity="0.75"
      />
      <path
        d="M0 720 L100 660 L210 710 L330 640 L460 720 L590 650 L700 710 L800 670 L800 1000 L0 1000Z"
        fill="#2c1810"
        opacity="0.9"
      />
      <path
        d="M0 800 L140 760 L260 800 L400 750 L540 805 L680 765 L800 800 L800 1000 L0 1000Z"
        fill="#1a110d"
      />

      {                }
      <g fill="#0f0b0a" stroke="#d4af37" strokeOpacity="0.55" strokeWidth="1.5">
        <rect x="290" y="560" width="26" height="300" />
        <rect x="484" y="560" width="26" height="300" />
        <rect x="270" y="600" width="260" height="18" />
        <path d="M240 545 Q400 575 560 545 L572 518 Q400 552 228 518 Z" />
      </g>

      {                 }
      <rect x="0" y="860" width="800" height="140" fill="#0f0b0a" />
      <line x1="0" y1="860" x2="800" y2="860" stroke="#d4af37" strokeOpacity="0.25" />
    </svg>
  );
}

const SignInPage = () => {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  const handleError = (err: unknown) => {
    console.log(JSON.stringify(err, null, 2));
    setError((err as ClerkErr).errors?.[0]?.message ?? "An unexpected error occurred.");
    setIsLoading(false);
  };

  async function oauthSignIn(strategy: "oauth_google" | "oauth_github") {
    if (!signIn) return;
    setIsLoading(true);
    setError("");
    try {
      await signIn.sso({
        strategy,
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/problems",
      });
    } catch (err: unknown) {
      handleError(err);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const identifier = activeTab === "email" ? email : username;

    if (!signIn || !identifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await signIn.create({ identifier });
      const result = await signIn.password({ password });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session }) => {
            if (session?.currentTask) {
              console.log("Pending session task:", session.currentTask);
              return;
            }
            router.push("/problems");
          },
        });
      } else {
        console.log("Sign-in requires further action:", result);
      }
    } catch (err: unknown) {
      handleError(err);
      return;
    }
    setIsLoading(false);
  }

  if (!signIn) {
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

  return (
    <div className="grid min-h-screen min-h-svh w-full lg:grid-cols-2 bg-[#0f0b0a] text-[#eaddcf]">
      {                                          }
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-[#3e2723] p-12">
        <DojoArt />
        <Link
          href="/"
          className="font-brand relative z-10 text-xl font-bold text-[#d4af37] tracking-tight w-fit"
        >
          NekkoDojo
        </Link>
        <div className="relative z-10 max-w-sm space-y-3 pb-6">
          <p className="text-3xl font-semibold leading-tight text-[#eaddcf] drop-shadow">
            Every belt starts with showing up.
          </p>
          <p className="text-[#a1887f]">
            Pick up where you left off: your problems, your streak, your next belt.
          </p>
        </div>
      </aside>

      {                                       }
      <main className="relative flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(62,39,35,0.35),transparent_60%)]" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          {                                                 }
          <Link href="/" className="font-brand lg:hidden block text-xl font-bold text-[#d4af37] w-fit">
            NekkoDojo
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#d4af37] tracking-tight">Welcome back</h1>
            <p className="text-[#a1887f]">
              Enter the <span className="text-[#eaddcf] font-medium">Dojo</span> to resume training.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => oauthSignIn("oauth_google")}
              className={socialClass}
            >
              <Image src={Google} alt="" width={18} height={18} className="opacity-80" />
              <span className="ml-2">Google</span>
            </Button>
            <Button
              type="button"
              onClick={() => oauthSignIn("oauth_github")}
              className={socialClass}
            >
              <Image src={Github} alt="" width={18} height={18} className="invert opacity-80" />
              <span className="ml-2">GitHub</span>
            </Button>
          </div>

          <div className="relative flex items-center">
            <div className="grow border-t border-[#3e2723]" />
            <span className="shrink-0 mx-4 text-sm text-[#5d4037]">or sign in with</span>
            <div className="grow border-t border-[#3e2723]" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#0f0b0a]/50 border border-[#3e2723] p-1">
                <TabsTrigger
                  value="email"
                  className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a110d] text-[#a1887f] font-medium transition-all"
                >
                  <Mail className="w-4 h-4 mr-2" /> Email
                </TabsTrigger>
                <TabsTrigger
                  value="username"
                  className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a110d] text-[#a1887f] font-medium transition-all"
                >
                  <User className="w-4 h-4 mr-2" /> Username
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="email" className="space-y-2 mt-0">
                  <Label htmlFor="email" className={labelClass}>
                    Email address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="ronin@nekodojo.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </TabsContent>
                <TabsContent value="username" className="space-y-2 mt-0">
                  <Label htmlFor="username" className={labelClass}>
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Sensei_Dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                  />
                </TabsContent>
              </div>
            </Tabs>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className={labelClass}>
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#a1887f] hover:text-[#d4af37] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d4037] hover:text-[#d4af37] transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
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
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-bold cursor-pointer bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37] transition-all"
            >
              {isLoading && <Loader className="size-4 animate-spin mr-2" />}
              Sign in
            </Button>
          </form>

          <p className="text-sm text-center text-[#a1887f]">
            No belt yet?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#d4af37] hover:text-[#eaddcf] hover:underline underline-offset-4 transition-all"
            >
              Begin your training
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
  