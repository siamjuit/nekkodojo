"use client";

import { useOptimistic, useTransition } from "react";
import Image from "next/image";
import {
  ShieldAlert,
  UserX,
  Mail,
  ShieldCheck,
  CalendarDays,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeRole, setRole } from "../admin/_actions"; // Adjust import if needed
import { toast } from "sonner";
import BeltBadge from "@/components/User/BeltBadge";

export function AdminUserCard({ user }: { user: UserProps }) {
  const [optimisticRole, setOptimisticRole] = useOptimistic(
    user.role,
    (state, newRole: string) => newRole
  );
  const [isPending, startTransition] = useTransition();

  const handleSetRole = async (newRole: string) => {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("role", newRole);

    startTransition(async () => {
      setOptimisticRole(newRole);
      try {
        await setRole(formData);
        toast.success(`Role updated to ${newRole}`);
      } catch (error) {
        toast.error("Failed to update role");
      }
    });
  };

  const handleRemoveRole = async () => {
    const formData = new FormData();
    formData.append("id", user.id);

    startTransition(async () => {
      setOptimisticRole("user");
      try {
        await removeRole(formData);
        toast.success("Role revoked");
      } catch (error) {
        toast.error("Failed to remove role");
      }
    });
  };

  const fullName = `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim();

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-4 transition-all hover:border-[#d4af37]/50 hover:bg-[#1a110d]/80 hover:shadow-lg hover:shadow-[#d4af37]/5">
      {/* LEFT: Avatar + Info Wrapper (Flex-1 ensures it takes available space) */}
      <div className="flex flex-1 items-center gap-4 min-w-0">
        {/* Avatar (Fixed Size) */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#3e2723] shadow-inner group-hover:border-[#d4af37]/50 transition-colors">
          <Image
            src={user.profileUrl || "/default-avatar.png"}
            alt={fullName}
            fill
            className="object-cover"
          />
        </div>

        {/* Text Info (Min-w-0 allows truncation) */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          {/* Top Row: Name + Badge */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#eaddcf] truncate">{fullName}</h3>
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
            <BeltBadge belt={user.beltRank} />
            <Badge
              variant="outline"
              className={`
                shrink-0 h-5 px-1.5 text-[10px] capitalize font-mono tracking-wide rounded-md transition-colors duration-300
                ${optimisticRole === "admin" ? "border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10" : ""}
                ${optimisticRole === "moderator" ? "border-blue-500/50 text-blue-400 bg-blue-900/10" : ""}
                ${optimisticRole === "user" ? "border-[#3e2723] text-[#5d4037] opacity-70" : ""}
              `}
            >
              {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              {optimisticRole}
            </Badge>
          </div>

          {/* Bottom Row: Email + Date (Stacked on mobile, Row on desktop) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 text-xs text-[#a1887f]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Mail size={12} className="shrink-0 opacity-70" />
              <span className="truncate">{user.email}</span>
            </div>

            <div className="hidden sm:block h-3 w-px bg-[#3e2723]" />

            <div className="flex items-center gap-1.5 shrink-0 opacity-80">
              <CalendarDays size={12} className="opacity-70" />
              <span>{format(new Date(user.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Actions (Static position, prevents overlap) */}
      <div className="shrink-0 self-start sm:self-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#5d4037] hover:bg-[#3e2723]/30 hover:text-[#d4af37] transition-colors"
              disabled={isPending}
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 border-[#3e2723] bg-[#1a110d] text-[#eaddcf] shadow-xl z-50"
          >
            <div className="px-2 py-1.5 text-xs font-semibold text-[#5d4037] uppercase tracking-wider">
              Change Role
            </div>

            <DropdownMenuItem
              disabled={optimisticRole === "admin"}
              onClick={() => handleSetRole("admin")}
              className="cursor-pointer focus:bg-[#3e2723]/40 focus:text-[#d4af37] gap-3 py-2.5"
            >
              <ShieldAlert
                size={16}
                className={optimisticRole === "admin" ? "text-[#d4af37]" : "text-[#5d4037]"}
              />
              <div className="flex flex-col">
                <span>Promote to Admin</span>
                <span className="text-[10px] text-[#5d4037]">Full access to all settings</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={optimisticRole === "moderator"}
              onClick={() => handleSetRole("moderator")}
              className="cursor-pointer focus:bg-[#3e2723]/40 focus:text-blue-400 gap-3 py-2.5"
            >
              <ShieldCheck
                size={16}
                className={optimisticRole === "moderator" ? "text-blue-400" : "text-[#5d4037]"}
              />
              <div className="flex flex-col">
                <span>Promote to Mod</span>
                <span className="text-[10px] text-[#5d4037]">Can moderate content</span>
              </div>
            </DropdownMenuItem>

            {optimisticRole !== "user" && (
              <>
                <div className="h-px bg-[#3e2723] my-1 mx-1" />
                <DropdownMenuItem
                  onClick={handleRemoveRole}
                  className="cursor-pointer focus:bg-red-900/20 focus:text-red-400 text-red-400 gap-3 py-2.5"
                >
                  <UserX size={16} />
                  <span>Revoke Permissions</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
