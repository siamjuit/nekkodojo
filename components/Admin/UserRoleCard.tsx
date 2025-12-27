"use client";

import { useOptimistic, useTransition } from "react";
import Image from "next/image";
import { 
  ShieldAlert, 
  UserX, 
  Mail, 
  ShieldCheck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { removeRole, setRole } from "../../app/(admin)/_actions"; // Import your server actions directly
import { toast } from "sonner"; // Optional: For success/error feedback

interface UserProps {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  email: string | undefined;
  initialRole: string;
}

export function UserRoleCard({ user }: { user: UserProps }) {
  // 1. Setup Optimistic State
  // 'optimisticRole' is what we show immediately. 
  // It reverts to 'user.initialRole' if the server action fails or hasn't run yet.
  const [optimisticRole, setOptimisticRole] = useOptimistic(
    user.initialRole,
    (state, newRole: string) => newRole
  );

  const [isPending, startTransition] = useTransition();

  // 2. Action Handlers
  const handleSetRole = async (formData: FormData) => {
    const newRole = formData.get("role") as string;
    
    // A. Optimistically update UI instantly
    startTransition(async () => {
      setOptimisticRole(newRole);
      
      // B. Call Server Action
      try {
        await setRole(formData);
        toast.success(`Role updated to ${newRole}`);
      } catch (error) {
        toast.error("Failed to update role");
        // The optimistic state automatically reverts on next render if revalidation fails
      }
    });
  };

  const handleRemoveRole = async (formData: FormData) => {
    startTransition(async () => {
      setOptimisticRole("user"); // Default role
      try {
        await removeRole(formData);
        toast.success("Role revoked");
      } catch (error) {
        toast.error("Failed to remove role");
      }
    });
  };

  return (
    <Card className="bg-[#1a110d] border border-[#3e2723] hover:border-[#d4af37]/50 transition-colors group flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
        <div className="relative w-20 h-20 rounded-full border-2 border-[#3e2723] overflow-hidden bg-black group-hover:border-[#d4af37] transition-colors">
          <Image 
            src={user.imageUrl} 
            alt={user.firstName || "User"} 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="space-y-1 w-full">
          <h3 className="text-lg font-bold text-[#eaddcf] truncate">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center justify-center gap-2 text-xs text-[#a1887f]">
            <Mail size={12} />
            <span className="truncate max-w-[200px]">{user.email}</span>
          </div>
        </div>

        {/* ROLE BADGE (Uses optimisticRole) */}
        <div className="pt-2">
          <Badge variant="outline" className={`
            capitalize px-3 py-1 font-mono tracking-wide transition-colors duration-300
            ${optimisticRole === 'admin' ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : ''}
            ${optimisticRole === 'moderator' ? 'border-blue-500/50 text-blue-400 bg-blue-900/10' : ''}
            ${optimisticRole === 'user' ? 'border-[#3e2723] text-[#5d4037]' : ''}
          `}>
            {optimisticRole}
          </Badge>
        </div>
      </CardContent>

      {/* FOOTER ACTIONS */}
      <CardFooter className="p-3 bg-[#0f0b0a] border-t border-[#3e2723] grid grid-cols-3 gap-2">
        
        {/* Make Admin */}
        <form action={handleSetRole} className="w-full">
          <input type="hidden" value={user.id} name="id" />
          <input type="hidden" value="admin" name="role" />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm"
            disabled={optimisticRole === 'admin' || isPending}
            className="w-full flex flex-col h-auto py-2 gap-1 text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37] disabled:opacity-50"
          >
            <ShieldAlert size={16} />
            <span className="text-[10px] uppercase font-bold">Admin</span>
          </Button>
        </form>

        {/* Make Mod */}
        <form action={handleSetRole} className="w-full">
          <input type="hidden" value={user.id} name="id" />
          <input type="hidden" value="moderator" name="role" />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm"
            disabled={optimisticRole === 'moderator' || isPending}
            className="w-full flex flex-col h-auto py-2 gap-1 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-bold">Mod</span>
          </Button>
        </form>

        {/* Revoke */}
        <form action={handleRemoveRole} className="w-full">
          <input type="hidden" value={user.id} name="id" />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm"
            disabled={optimisticRole === 'user' || isPending}
            className="w-full flex flex-col h-auto py-2 gap-1 text-[#a1887f] hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
          >
            <UserX size={16} />
            <span className="text-[10px] uppercase font-bold">Revoke</span>
          </Button>
        </form>

      </CardFooter>
    </Card>
  );
}