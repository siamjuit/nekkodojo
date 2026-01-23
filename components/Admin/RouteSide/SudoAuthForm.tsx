"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, KeyRound, UserCog } from "lucide-react";
import { toast } from "sonner"; // Assuming you use Sonner or standard toast

export default function SudoAuthForm() {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data || "Authentication failed");
      }

      toast.success(`Identity Verified, Welcome back ${role}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Visual Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#3e2723] via-[#d4af37] to-[#3e2723] opacity-50" />

      <div className="w-full max-w-md bg-[#1a110d] border border-[#3e2723] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1f1512] p-8 text-center border-b border-[#3e2723]">
          <div className="mx-auto bg-[#d4af37]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#d4af37]">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#eaddcf] tracking-tight">Restricted Access</h1>
          <p className="text-[#a1887f] text-sm mt-2">Verify your Sudo credentials to proceed.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#795548] flex items-center gap-2">
              <UserCog size={14} /> Claim Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                  role === "admin"
                    ? "bg-[#d4af37] border-[#d4af37] text-[#0f0b0a]"
                    : "bg-[#0f0b0a] border-[#3e2723] text-[#a1887f] hover:border-[#795548]"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("moderator")}
                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                  role === "moderator"
                    ? "bg-[#d4af37] border-[#d4af37] text-[#0f0b0a]"
                    : "bg-[#0f0b0a] border-[#3e2723] text-[#a1887f] hover:border-[#795548]"
                }`}
              >
                Moderator
              </button>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#795548] flex items-center gap-2">
              <KeyRound size={14} /> Sudo Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#0f0b0a] border border-[#3e2723] rounded-lg px-4 py-3 text-[#eaddcf] placeholder-[#3e2723] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#d4af37] hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed text-[#0f0b0a] font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Identity"}
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-[#5d4037] uppercase tracking-widest">
        NekoDojo Security Protocol
      </p>
    </div>
  );
}
