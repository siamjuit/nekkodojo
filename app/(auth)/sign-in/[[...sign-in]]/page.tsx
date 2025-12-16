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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Google from "@/public/logos/google.svg";
import Github from "@/public/logos/github.svg";
import { useState } from "react";
import { Eye, EyeOff, Loader, Loader2, Shield, Mail, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email"); // Track active tab

  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0b0a]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-12 animate-spin text-[#d4af37]" />
          <p className="text-sm text-[#d4af37]/60 font-mono tracking-widest">
            LOADING DOJO...
          </p>
        </div>
      </div>
    );
  }

  // ... (Social Auth functions remain the same) ...
  async function googleSignIn() { /* ... */ }
  async function githubSignIn() { /* ... */ }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    // Determine which identifier to use based on the active tab
    const identifier = activeTab === "email" ? email : username;

    if (!isLoaded || !identifier || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const session = await signIn.create({
        identifier: identifier,
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b0a] font-sans text-[#eaddcf] relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[#120c0a]">
        <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[radial-gradient(circle_at_center,rgba(62,39,35,0.2)_0%,rgba(10,5,3,1)_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 40%, rgba(0,0,0,1) 100%)`, backgroundSize: "60px 100%" }}></div>
      </div>

      <Card className="max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#5d4037] bg-[#1a110d]/90 backdrop-blur-md relative z-10 text-[#eaddcf]">
        <CardHeader className="space-y-3 pb-6 border-b border-[#3e2723]">
          <div className="mx-auto w-12 h-12 bg-linear-to-br from-[#2c1810] to-[#0f0b0a] border border-[#d4af37]/50 rounded-xl flex items-center justify-center shadow-lg group">
            <Shield className="size-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-[#d4af37] tracking-tight drop-shadow-sm">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-base text-[#a1887f] font-light">
            Enter the <span className="text-[#eaddcf] font-medium">Dojo</span> to resume training.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-6">
            {/* Social Buttons (Unchanged) */}
            {/* ... Your Social Buttons Code Here ... */}

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-[#3e2723]"></div>
              <span className="shrink-0 mx-4 text-[#5d4037] text-xs uppercase tracking-widest font-mono">
                Or continue with
              </span>
              <div className="grow border-t border-[#3e2723]"></div>
            </div>

            {/* TABS IMPLEMENTATION */}
            <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
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

              <div className="mt-4 space-y-4">
                {/* Email Tab Content */}
                <TabsContent value="email" className="space-y-2 mt-0">
                  <Label htmlFor="email" className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="ronin@nekodojo.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                  />
                </TabsContent>

                {/* Username Tab Content */}
                <TabsContent value="username" className="space-y-2 mt-0">
                  <Label htmlFor="username" className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Sensei_Dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                  />
                </TabsContent>
              </div>
            </Tabs>

            {/* Password Input (Shared) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider">
                  Password
                </Label>
                <Link href="#" className="text-xs text-[#a1887f] hover:text-[#d4af37] transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="h-11 pr-10 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d4037] hover:text-[#d4af37] transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200 animate-in fade-in slide-in-from-top-1">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full h-12 text-base font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer 
                         bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]"
              type="button"
              onClick={submit}
              disabled={isLoading}
            >
              {isLoading && <Loader className="size-4 animate-spin mr-2" />}
              Sign in
            </Button>
          </div>
        </CardContent>
        {/* Footer (Unchanged) */}
        <CardFooter className="flex-col space-y-4 pt-4 border-t border-[#3e2723] bg-[#120c0a]/30">
          <p className="text-sm text-center text-[#a1887f]">
            No belt yet?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#d4af37] hover:text-[#eaddcf] hover:underline underline-offset-4 transition-all"
            >
              Begin your training
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}