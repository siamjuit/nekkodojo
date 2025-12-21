"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Flag, Copy } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
  discussionId: string;
  authorId: string;
}

const DiscussionDropDown = ({ discussionId, authorId }: Props) => {
  const { user } = useUser();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const isAuthor = user.id === authorId;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/discussions/delete", {
        method: "POST",
        body: JSON.stringify({ discussionId }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Discussion deleted successfully");
      router.push("/discussions");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete discussion");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/discussions/${discussionId}`);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-[#5d4037] hover:text-[#d4af37] transition-colors p-1 hover:bg-[#3e2723]/20 rounded focus:outline-none">
            <MoreHorizontal size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-[#1a110d]/95 backdrop-blur-xl border border-[#3e2723] text-[#eaddcf] min-w-40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
        >
          <DropdownMenuLabel className="text-xs font-mono text-[#a1887f] uppercase tracking-wider">
            Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#3e2723]/50" />

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37] gap-2"
          >
            <Copy size={14} />
            <span>Copy Link</span>
          </DropdownMenuItem>
          {isAuthor && (
            <>
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-red-400 focus:bg-red-900/10 focus:text-red-300 gap-2"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
          {!isAuthor && (
            <DropdownMenuItem className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37] gap-2">
              <Flag size={14} />
              <span>Report</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#1a110d] border border-[#d4af37]/30 text-[#eaddcf] sm:max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#d4af37] font-bold text-xl">
              Delete Discussion?
            </DialogTitle>
            <DialogDescription className="text-[#a1887f]">
              This action cannot be undone. This will permanently delete your discussion and all
              associated comments.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-3 my-2">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <Trash2 size={16} />
              <span>You are about to destroy this scroll.</span>
            </p>
          </div>

          <DialogFooter className="gap-2 mt-4 flex flex-wrap">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="hover:bg-[#3e2723]/30 hover:text-[#eaddcf] text-[#a1887f]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiscussionDropDown;
