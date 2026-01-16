"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Flag,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import WriteComment from "./Create/WriteComment";
import BeltBadge from "../User/BeltBadge";
import CommentAttachment from "../Attachment/AttLightbox";
import { ReportDialog } from "../Report/ReportDialog";
import Link from "next/link";

interface Props {
  comment: CommentProps;
  currentUserAvatar?: string | null;
  currentUserId?: string;
  authorId?: string;
  depth: number;
  onDelete?: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  currentUserAvatar,
  currentUserId,
  authorId,
  depth = 0,
  onDelete,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(comment.isBookmarked || false);
  const [deleting, setDeleting] = useState(false);

  // 2. Local state to hide this component immediately
  const [isDeleted, setIsDeleted] = useState(false);

  const [localReplies, setLocalReplies] = useState<CommentProps[]>(comment.replies || []);

  const originalLength = comment.replies?.length || 0;
  const replyCount = (comment._count?.replies || 0) + (localReplies.length - originalLength);

  const [voteState, setVoteState] = useState({
    userVote: comment.isLiked
      ? "like"
      : comment.isDisliked
        ? "dislike"
        : (null as "like" | "dislike" | null),
    likeCount: comment.likeCount,
    dislikeCount: comment.dislikeCount,
  });

  const [debouncedVote] = useDebounce(voteState.userVote, 500);
  const isMounted = useRef(false);
  const previousVoteRef = useRef(voteState.userVote);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const syncVote = async () => {
      if (debouncedVote === previousVoteRef.current) return;
      const type = debouncedVote || "remove";
      try {
        await fetch(`/api/comments/${comment.id}/${type}`, {
          method: "PATCH",
          body: JSON.stringify({ commentId: comment.id, type }),
        });
        previousVoteRef.current = debouncedVote;
      } catch (error) {
        toast.error("Failed to register vote");
      }
    };
    syncVote();
  }, [debouncedVote, comment.id]);

  const handleVote = (type: "like" | "dislike") => {
    setVoteState((prev) => {
      const isSame = prev.userVote === type;
      const isSwitching = prev.userVote && prev.userVote !== type;
      let newUp = prev.likeCount;
      let newDown = prev.dislikeCount;
      let newVote: "like" | "dislike" | null = type;

      if (isSame) {
        newVote = null;
        if (type === "like") newUp = Math.max(0, newUp - 1);
        else newDown = Math.max(0, newDown - 1);
      } else if (isSwitching) {
        if (type === "like") {
          newUp++;
          newDown = Math.max(0, newDown - 1);
        } else {
          newUp = Math.max(0, newUp - 1);
          newDown++;
        }
      } else {
        if (type === "like") newUp++;
        else newDown++;
      }
      return { userVote: newVote, likeCount: newUp, dislikeCount: newDown };
    });
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    const action = !previousState ? "Bookmarked" : "Removed bookmark";
    toast.success(action);

    try {
      const res = await fetch(`/api/comments/${comment.id}/bookmark`, {
        method: "PATCH",
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

  const handleDeleteComment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI: Hide immediately
    setDeleting(true);
    setIsDeleted(true);

    try {
      const res = await fetch(`/api/comments/delete?commentId=${comment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed");
      }
      toast.success("Comment deleted!");

      // Notify parent to clean up data structure
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error: any) {
      // Revert Optimistic UI on error
      setIsDeleted(false);
      setDeleting(false);
      toast.error("Couldn't delete the comment!");
      console.error(error);
    }
    // Note: We don't setDeleting(false) on success because the component is hidden/gone
  };

  // 3. Helper to remove child replies locally
  const handleChildDelete = (childId: string) => {
    setLocalReplies((prev) => prev.filter((reply) => reply.id !== childId));
  };

  const isLongText = comment.description.length > 300;
  const displayText = isExpanded ? comment.description : comment.description.slice(0, 300);
  const fullName = `${comment.author.firstName || "User"} ${comment.author.lastName || ""}`.trim();
  const handle = comment.author.name;

  const handleReplyClick = () => {
    setIsReplying(true);
    setShowReplies(true);
  };

  const handleReplySubmit = (newReply: CommentProps) => {
    setIsReplying(false);
    setLocalReplies((prev) => [...prev, newReply]);
    setShowReplies(true);
  };
  const MAX_INDENT_DEPTH = 3;
  const shouldIndent = depth < MAX_INDENT_DEPTH;
  if (isDeleted) return null;

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="group flex gap-3 w-full py-3 relative">
        {/* AVATAR */}
        <Link
          href={`/member/${handle}`}
          className="shrink-0 relative w-10 h-10 rounded-full overflow-hidden border border-[#3e2723] mt-1 bg-[#1a110d]"
        >
          <Image
            src={comment.author.profileUrl || "/default-avatar.png"}
            alt="Author"
            fill
            className="object-cover"
          />
        </Link>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/member/${handle}`}
                className="font-bold text-[#eaddcf] text-sm cursor-pointer hover:text-[#d4af37] transition-colors"
              >
                {fullName}
              </Link>
              <span className="text-[#5d4037] text-xs">•</span>
              <span className="text-[#5d4037] text-xs hover:text-[#a1887f] cursor-pointer transition-colors">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/member/${handle}`} className="text-[11px] text-[#a1887f] font-mono">
                @{handle}
              </Link>
              <BeltBadge belt={comment.author.beltRank} />
            </div>
          </div>

          <div className="text-sm text-[#dcd7c9] leading-relaxed whitespace-pre-wrap wrap-break-word mt-1">
            {displayText}
            {isLongText && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-[#5d4037] font-bold hover:text-[#d4af37] hover:underline text-xs"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {comment.attachments && (
            <div className="mt-2">
              <div className="relative h-48 sm:w-80 rounded-lg overflow-hidden border border-[#3e2723]/50 bg-[#0f0b0a]">
                <CommentAttachment attachment={comment.attachments} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 pt-2 -ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("like")}
              className={`h-8 px-2 transition-colors duration-200 rounded-full ${
                voteState.userVote === "like"
                  ? "text-[#d4af37] bg-[#d4af37]/10"
                  : "text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/20"
              }`}
            >
              <ThumbsUp
                size={14}
                className={`mr-1.5 transition-transform ${voteState.userVote === "like" ? "fill-current scale-110" : ""}`}
              />
              <span className="text-xs font-mono font-bold">{voteState.likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("dislike")}
              className={`h-8 px-2 transition-colors duration-200 rounded-full ${
                voteState.userVote === "dislike"
                  ? "text-red-400 bg-red-900/10"
                  : "text-[#a1887f] hover:text-red-400 hover:bg-[#3e2723]/20"
              }`}
            >
              <ThumbsDown
                size={14}
                className={`transition-transform ${voteState.userVote === "dislike" ? "fill-current scale-110" : ""}`}
              />
              <span className="ml-1.5 text-xs font-mono font-bold">{voteState.dislikeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="h-8 px-3 text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/20 rounded-full text-xs font-bold"
            >
              Reply
            </Button>

            <div className="opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#5d4037] hover:text-[#d4af37] hover:bg-[#5d4037] rounded-full"
                  >
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]"
                >
                  <DropdownMenuItem
                    className="focus:bg-[#3e2723]/40 focus:text-[#d4af37] cursor-pointer"
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={14} className="mr-2 text-[#d4af37] fill-[#d4af37]/20" />
                    ) : (
                      <Bookmark size={14} className="mr-2" />
                    )}
                    {isBookmarked ? "Remove Bookmark" : "Bookmark"}
                  </DropdownMenuItem>
                  {(currentUserId === comment.authorId || currentUserId === authorId) && (
                    <DropdownMenuItem
                      onClick={handleDeleteComment}
                      className="group flex items-center gap-2 cursor-pointer text-red-400 focus:bg-red-900/10 focus:text-red-300"
                    >
                      {deleting ? (
                        <Loader2 size={14} className="mr-2 animate-spin text-red-400" />
                      ) : (
                        <Trash2 size={16} className="mr-2 text-red-400" />
                      )}
                      <span>{deleting ? "Deleting" : "Delete"}</span>
                    </DropdownMenuItem>
                  )}
                  <ReportDialog
                    contentId={comment.id}
                    type="comment"
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="focus:bg-[#3e2723]/40 focus:text-[#d4af37] cursor-pointer"
                      >
                        <Flag size={14} className="mr-2" />
                        Report
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {replyCount > 0 && (
            <div className="mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="h-8 px-2 text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#b5952f] rounded-full text-xs font-bold flex items-center gap-2"
              >
                {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* NESTED REPLY SECTION */}
      {showReplies && (
        <div className="flex w-full">
          {shouldIndent && (
            <div className="w-10 flex justify-center shrink-0 group-hover:bg-[#3e2723]/10 transition-colors">
              <div className="w-px bg-[#3e2723]/40 h-full"></div>
            </div>
          )}

          <div className="flex-1 pb-2">
            {isReplying && (
              <div className="mb-4 pt-2 animate-in slide-in-from-top-2">
                <WriteComment
                  discussionId={comment.discussionId}
                  parentId={comment.id}
                  authorId={currentUserId || ""}
                  userAvatar={currentUserAvatar}
                  onCommentSubmitted={handleReplySubmit}
                />
              </div>
            )}

            <div
              className={`space-y-2 ${!shouldIndent ? "mt-2 pl-2 ml-1 border-l-2 border-[#d4af37]/30" : ""}`}
            >
              {localReplies.length > 0
                ? localReplies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentUserAvatar={currentUserAvatar}
                      currentUserId={currentUserId}
                      authorId={authorId}
                      depth={depth + 1}
                      // 5. Pass handler to children so they can delete themselves from local state
                      onDelete={handleChildDelete}
                    />
                  ))
                : !isReplying && (
                    <p className="text-xs text-[#5d4037] italic py-2 pl-2">No replies loaded.</p>
                  )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
