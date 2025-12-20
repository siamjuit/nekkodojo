"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { Loader, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPassword = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isLoaded || !email) return;

    setIsLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setPendingVerification(true);
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      setError(error.errors?.[0]?.longMessage || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isLoaded || !code || !newPassword) {
      setError("Please enter the code and your new password.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.log(result);
        setError("Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      setError(error.errors?.[0]?.longMessage || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#5d4037] bg-[#1a110d]/90 backdrop-blur-md relative z-10 text-[#eaddcf]">
      <CardHeader className="space-y-3 pb-6 border-b border-[#3e2723]">
        <div className="mx-auto w-12 h-12 bg-linear-to-br from-[#2c1810] to-[#0f0b0a] border border-[#d4af37]/50 rounded-xl flex items-center justify-center shadow-lg group">
          <Mail className="size-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
        </div>
        <CardTitle className="text-3xl font-bold text-center text-[#d4af37] tracking-tight drop-shadow-sm">
          {pendingVerification ? "Secure Access" : "Forgot Password?"}
        </CardTitle>
        <CardDescription className="text-center text-base text-[#a1887f] font-light">
          {!pendingVerification ? (
            "Enter your email to receive a reset code."
          ) : (
            <div className="flex flex-col gap-1">
              <p>Enter the code sent to:</p>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-[#5d4037]" />
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="initiate@nekodojo.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-900/50 text-red-200"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full cursor-pointer h-12 text-base font-bold tracking-widest uppercase shadow-md transition-all bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] border border-[#d4af37]"
              type="button"
              onClick={requestCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" /> Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
            
            <div className="text-center">
               <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className="text-xs text-[#a1887f] hover:text-[#d4af37] transition-colors tracking-widest uppercase"
                >
                  Return to Login
                </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4 flex flex-col items-center">
              <Label className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider text-center">
                Verification Code
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
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-xs font-medium text-[#d4af37]/80 uppercase tracking-wider"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-[#5d4037]" />
                <Input
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-11 bg-[#0f0b0a]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
                />
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-900/50 text-red-200"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full h-12 text-base font-bold tracking-widest uppercase shadow-md transition-all bg-[#d4af37] text-[#1a110d] hover:bg-[#b5952f] border border-[#d4af37]"
              type="button"
              onClick={onPressVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setPendingVerification(false);
                  setError("");
                  setCode("");
                  setNewPassword("");
                }}
                className="text-xs text-[#a1887f] hover:text-[#d4af37] transition-colors tracking-widest uppercase"
              >
                ← Back to Email
              </button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-4 pt-4 border-t border-[#3e2723] bg-[#120c0a]/30"></CardFooter>
    </Card>
  );
};

export default ForgotPassword;