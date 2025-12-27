"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Trash2, Flag, Copy, Bookmark, BookmarkCheck } from "lucide-react";
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
import { ReportDialog } from "../Report/ReportDialog";

interface Props {
  discussion: DiscussionProps;
  authorId: string;
}

const DiscussionDropDown = ({ discussion, authorId }: Props) => {
  const { user } = useUser();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. OPTIMISTIC STATE: Initialize with prop value
  const [isBookmarked, setIsBookmarked] = useState(discussion.isBookmarked || false);

  if (!user) return null;

  const isAuthor = user.id === authorId;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    const action = !previousState ? "Bookmarked" : "Removed bookmark";
    toast.success(action); // Instant feedback

    try {
      const res = await fetch(`/api/discussions/${discussion.id}/bookmark`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed");
      }
    } catch (error) {
      setIsBookmarked(previousState);
      toast.error("Failed to update bookmark");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const id = discussion.id;
    try {
      const res = await fetch("/api/discussions/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
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
    navigator.clipboard.writeText(`${window.location.origin}/discussions/${discussion.id}`);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`
                relative group transition-all p-2 rounded-md focus:outline-none flex items-center justify-center
                ${
                  isBookmarked
                    ? "text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20"
                    : "text-[#5d4037] hover:text-[#d4af37] hover:bg-[#3e2723]/20"
                }
            `}
            title="Options"
          >
            <MoreHorizontal size={20} />

            {/* Visual Marker: A small bookmark badge if active */}
            {isBookmarked && (
              <span className="absolute -top-1 -right-1">
                <BookmarkCheck size={12} className="text-[#d4af37] fill-[#d4af37]" />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-[#1a110d]/95 backdrop-blur-xl border border-[#3e2723] text-[#eaddcf] min-w-48 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] z-50"
        >
          <DropdownMenuLabel className="text-xs font-mono text-[#a1887f] uppercase tracking-wider px-2 py-1.5">
            Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#3e2723]/50" />

          {/* Bookmark Option (Optimistic) */}
          <DropdownMenuItem
            className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37] gap-2 py-2"
            onClick={handleBookmark}
          >
            {isBookmarked ? (
              <BookmarkCheck size={16} className="text-[#d4af37] fill-[#d4af37]/20" />
            ) : (
              <Bookmark size={16} />
            )}
            <span>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37] gap-2 py-2"
          >
            <Copy size={16} />
            <span>Copy Link</span>
          </DropdownMenuItem>

          {isAuthor && (
            <>
              <DropdownMenuSeparator className="bg-[#3e2723]/50" />
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-red-400 focus:bg-red-900/10 focus:text-red-300 gap-2 py-2"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}

          {!isAuthor && (
            <ReportDialog
              contentId={discussion.id}
              type="discussion"
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()} // CRITICAL: Prevents dropdown from closing
                  className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37] gap-2 py-2 w-full"
                >
                  <Flag size={16} />
                  <span>Report</span>
                </DropdownMenuItem>
              }
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog (Unchanged) */}
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
