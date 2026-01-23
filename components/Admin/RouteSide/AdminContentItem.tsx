"use client";

import { useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Trash2, 
  MessageSquare, 
  ThumbsUp, 
  ExternalLink, 
  Loader2,
  AlertTriangle
} from "lucide-react";
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
import { deleteDiscussion } from "@/app/(admin)/(protected)/_actions"; 
import { toast } from "sonner";

interface DiscussionProps {
  id: string;
  title: string;
  author: {
    firstName: string | null;
    lastName: string | null;
    profileUrl: string | null;
  };
  likeCount: number;
  _count: {
    comments: number;
  };
  createdAt: Date;
}

export function AdminContentItem({ data }: { data: DiscussionProps }) {
  const [isPending, startTransition] = useTransition();

  const executeDelete = async () => {
    const formData = new FormData();
    formData.append("id", data.id);

    startTransition(async () => {
      try {
        await deleteDiscussion(formData);
        toast.success("Scroll burned (deleted)");
      } catch (error) {
        toast.error("Failed to delete scroll");
      }
    });
  };

  const authorName = `${data.author.firstName || "Unknown"} ${data.author.lastName || ""}`.trim();

  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-4 transition-all hover:border-[#d4af37]/50 hover:bg-[#1a110d]/80">
      
      {/* LEFT: Content Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Link 
            href={`/discussions/${data.id}`} 
            className="text-[#eaddcf] font-bold text-lg hover:text-[#d4af37] truncate transition-colors flex items-center gap-2"
            target="_blank"
          >
            {data.title}
            <ExternalLink size={14} className="opacity-50" />
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#a1887f]">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 border border-[#3e2723]">
              <AvatarImage src={data.author.profileUrl || ""} />
              <AvatarFallback className="text-[9px] bg-[#3e2723]">?</AvatarFallback>
            </Avatar>
            <span>{authorName}</span>
          </div>
          <span className="text-[#5d4037]">•</span>
          <span>{format(new Date(data.createdAt), "MMM d, yyyy")}</span>
        </div>
      </div>

      {/* MIDDLE: Stats */}
      <div className="flex items-center gap-4 px-4 border-l border-[#3e2723]/50 min-w-[120px]">
        <div className="flex items-center gap-1.5 text-[#a1887f] text-sm">
          <ThumbsUp size={14} />
          <span>{data.likeCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#a1887f] text-sm">
          <MessageSquare size={14} />
          <span>{data._count.comments}</span>
        </div>
      </div>

      {/* RIGHT: Actions with Alert Dialog */}
      <div className="pl-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              className="text-[#a1887f] hover:bg-red-900/10 hover:text-red-400 h-9 px-3"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle size={20} />
                Burn this Scroll?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#a1887f]">
                This action cannot be undone. This will permanently delete the discussion
                <span className="text-[#eaddcf] font-bold"> &quot;{data.title}&quot; </span>
                and all its comments.
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
                Burn Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}