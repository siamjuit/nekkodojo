"use client";

import { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteComment } from "@/app/(admin)/(protected)/_actions"; 
import { toast } from "sonner";

// Define the interface here if not imported
interface CommentProps {
  id: string;
  description: string;
  createdAt: Date;
  author: {
    firstName: string | null;
    lastName: string | null;
    profileUrl: string | null;
  };
  discussion: {
    id: string;
    title: string;
  };
}

export function AdminCommentItem({ data }: { data: CommentProps }) {
  const [isPending, startTransition] = useTransition();

  const executeDelete = async () => {
    const formData = new FormData();
    formData.append("id", data.id);

    startTransition(async () => {
      try {
        await deleteComment(formData);
        toast.success("Inscription burned (deleted)");
      } catch (error) {
        toast.error("Failed to delete");
      }
    });
  };

  const authorName = `${data.author.firstName || "Unknown"} ${data.author.lastName || ""}`.trim();

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-[#3e2723] bg-[#1a110d] p-4 transition-all hover:border-[#d4af37]/50 hover:bg-[#1a110d]/80">
      
      {/* Header: Wrapped for Mobile Responsiveness */}
      <div className="flex flex-wrap items-start justify-between gap-y-2 gap-x-4">
        
        {/* Author Info */}
        <div className="flex items-center gap-2 min-w-0 max-w-full">
          <Avatar className="h-6 w-6 shrink-0 border border-[#3e2723]">
            <AvatarImage src={data.author.profileUrl || ""} />
            <AvatarFallback className="text-[9px] bg-[#3e2723]">?</AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold text-[#eaddcf] truncate">
              {authorName}
            </span>
            <span className="text-xs text-[#5d4037] shrink-0">•</span>
            <span className="text-xs text-[#5d4037] shrink-0 whitespace-nowrap">
              {formatDistanceToNow(new Date(data.createdAt))} ago
            </span>
          </div>
        </div>
        
        {/* Context Link */}
        <Link 
          href={`/discussions/${data.discussion.id}`} 
          target="_blank"
          className="flex items-center gap-1 text-[10px] text-[#a1887f] hover:text-[#d4af37] transition-colors max-w-full sm:max-w-[200px]"
        >
          <span className="shrink-0 opacity-70">on</span>
          <span className="truncate font-medium italic">
            &quot;{data.discussion.title}&quot;
          </span>
          <ArrowUpRight size={12} className="shrink-0" />
        </Link>
      </div>

      {/* The Comment Content */}
      <div className="pl-0 sm:pl-8">
        <p className="text-sm text-[#a1887f] line-clamp-3 leading-relaxed wrap-break-word">
          {data.description}
        </p>
      </div>

      {/* Actions with Alert Dialog */}
      <div className="flex justify-end pt-2 border-t border-[#3e2723]/50 mt-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              className="h-7 px-2 text-xs text-[#5d4037] hover:text-red-400 hover:bg-red-900/10 transition-colors"
            >
              {isPending ? (
                <Loader2 size={12} className="animate-spin mr-1.5" />
              ) : (
                <Trash2 size={12} className="mr-1.5" />
              )}
              Burn Inscription
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle size={20} />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#a1887f]">
                This action cannot be undone. This will permanently remove the inscription from the dojo walls.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#3e2723] text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#eaddcf]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeDelete}
                className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}