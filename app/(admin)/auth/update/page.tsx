"use client";

import { useState } from "react";
import { Loader2, LockKeyhole, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function UpdateSudoPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("User not loaded");
      return;
    }
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    const payload = {
      oldPass: formData.get("currentPassword") as string,
      newPass: formData.get("newPassword") as string,
      confirmPass: formData.get("confirmPassword") as string,
    };

    try {
      const role = (user.publicMetadata.role as string) || "user";
      const res = await fetch(`/api/users/admin/update-auth?role=${role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = typeof data === "string" ? data : data.message || "Failed to update";
        throw new Error(errorMessage);
      }
      toast.success(data.message || "Password updated successfully");
      form.reset();
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37]/5 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3e2723]/10 blur-[100px]" />

      <div className="w-full max-w-md bg-[#1a110d] border border-[#3e2723] rounded-2xl shadow-2xl relative z-10">
        {/* Header */}
        <div className="p-8 border-b border-[#3e2723] text-center">
          <div className="mx-auto w-12 h-12 bg-[#3e2723]/50 rounded-full flex items-center justify-center mb-4 text-[#d4af37]">
            <RefreshCw size={24} />
          </div>
          <h1 className="text-xl font-bold text-[#eaddcf]">Update Credentials</h1>
          <p className="text-[#a1887f] text-sm mt-1">Change your Sudo Access password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#795548] uppercase tracking-wider flex items-center gap-2">
              <LockKeyhole size={12} /> Current Password
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              placeholder="Enter current password"
              className="w-full bg-[#0f0b0a] border border-[#3e2723] rounded-lg px-4 py-3 text-[#eaddcf] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all placeholder:text-[#3e2723]"
            />
          </div>

          <div className="h-px bg-[#3e2723]/50 my-2" />

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#795548] uppercase tracking-wider">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={6}
              placeholder="Min. 6 characters"
              className="w-full bg-[#0f0b0a] border border-[#3e2723] rounded-lg px-4 py-3 text-[#eaddcf] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all placeholder:text-[#3e2723]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#795548] uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Re-enter new password"
              className="w-full bg-[#0f0b0a] border border-[#3e2723] rounded-lg px-4 py-3 text-[#eaddcf] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all placeholder:text-[#3e2723]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-[#0f0b0a] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/auth"
              className="text-xs text-[#5d4037] hover:text-[#d4af37] transition-colors"
            >
              &larr; Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
