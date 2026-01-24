"use client";

import { useState } from "react";
import Image from "next/image";
import { Unlock, Loader2, UserX } from "lucide-react";
import { toast } from "sonner";
import { unbanUser } from "@/app/(admin)/(protected)/_actions"; // Import your actions

interface BannedUserProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileUrl: string | null;
    email: string;
    createdAt: Date;
  };
}

export function BannedUserCard({ user }: BannedUserProps) {
  const [loading, setLoading] = useState(false);

  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Unknown User";

  const handleUnban = async () => {
    setLoading(true);
    try {
      const res = await unbanUser(user.id);
      if (res?.success) {
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Failed to unban");
      }
    } catch (err) {
      toast.error("Error unbanning user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#1a110d] border border-red-900/30 rounded-xl group hover:border-red-900/60 transition-all">
      <div className="flex items-center gap-4">
        {/* Avatar with Banned Overlay */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#3e2723]">
          {user.profileUrl ? (
            <Image src={user.profileUrl} alt={fullName} fill className="object-cover grayscale" />
          ) : (
            <div className="w-full h-full bg-[#3e2723] flex items-center justify-center">
              <UserX className="text-[#a1887f]" />
            </div>
          )}
          <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
            <UserX size={20} className="text-white drop-shadow-md" />
          </div>
        </div>

        <div>
          <h3 className="text-[#eaddcf] font-bold">{fullName}</h3>
          <p className="text-xs text-[#a1887f] font-mono">{user.email}</p>
          <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-bold">
            Currently Banned
          </p>
        </div>
      </div>

      <button
        onClick={handleUnban}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900/10 text-green-600 border border-green-900/20 hover:bg-green-900/30 hover:border-green-900/50 transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Unlock size={16} />}
        Unban
      </button>
    </div>
  );
}
