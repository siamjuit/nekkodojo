"use client";

import { useOptimistic, useTransition } from "react";
import {
  ShieldAlert,
  UserX,
  ShieldCheck,
  MoreVertical,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { removeRole, setRole } from "@/app/(admin)/(protected)/_actions";
import { toast } from "sonner";

// We only need the Logic and the Dropdown. 
// The Parent component handles the visual row layout.
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="h-8 w-8 text-[#5d4037] hover:bg-[#3e2723]/30 hover:text-[#d4af37] transition-colors focus-visible:ring-1 focus-visible:ring-[#d4af37]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 border-[#3e2723] bg-[#1a110d] text-[#eaddcf] shadow-xl z-50"
      >
        <DropdownMenuLabel className="text-xs font-semibold text-[#5d4037] uppercase tracking-wider">
          Manage {user.firstName}'s Role
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#3e2723]" />

        {/* 1. PROMOTE TO ADMIN */}
        <DropdownMenuItem
          disabled={optimisticRole === "admin" || isPending}
          onClick={() => handleSetRole("admin")}
          className="cursor-pointer focus:bg-[#3e2723]/40 focus:text-[#d4af37] gap-3 py-2.5 my-1"
        >
          <ShieldAlert
            size={16}
            className={optimisticRole === "admin" ? "text-[#d4af37]" : "text-[#5d4037]"}
          />
          <div className="flex flex-col">
            <span className={optimisticRole === "admin" ? "text-[#d4af37] font-bold" : ""}>
              {optimisticRole === "admin" ? "Currently Sensei" : "Promote to Sensei"}
            </span>
            <span className="text-[10px] text-[#5d4037]">Full system access</span>
          </div>
        </DropdownMenuItem>

        {/* 2. PROMOTE TO MODERATOR */}
        <DropdownMenuItem
          disabled={optimisticRole === "moderator" || isPending}
          onClick={() => handleSetRole("moderator")}
          className="cursor-pointer focus:bg-[#3e2723]/40 focus:text-blue-400 gap-3 py-2.5 my-1"
        >
          <ShieldCheck
            size={16}
            className={optimisticRole === "moderator" ? "text-blue-400" : "text-[#5d4037]"}
          />
          <div className="flex flex-col">
            <span className={optimisticRole === "moderator" ? "text-blue-400 font-bold" : ""}>
              {optimisticRole === "moderator" ? "Currently Guardian" : "Promote to Guardian"}
            </span>
            <span className="text-[10px] text-[#5d4037]">Content moderation</span>
          </div>
        </DropdownMenuItem>

        {/* 3. REVOKE ROLE */}
        {optimisticRole !== "user" && (
          <>
            <DropdownMenuSeparator className="bg-[#3e2723]" />
            <DropdownMenuItem
              disabled={isPending}
              onClick={handleRemoveRole}
              className="cursor-pointer focus:bg-red-900/20 focus:text-red-400 text-red-400 gap-3 py-2.5 my-1"
            >
              <UserX size={16} />
              <div className="flex flex-col">
                <span>Revoke Rank</span>
                <span className="text-[10px] opacity-70">Revert to Disciple</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}