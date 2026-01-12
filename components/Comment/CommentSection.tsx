"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2, ArrowUpDown, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { NoComments } from "./NoComments";
import CommentItem from "./Comment";
import WriteComment from "./Create/WriteComment";

const CommentSection = ({ discussionId, authorId }: { discussionId: string; authorId: string }) => {
  const { user } = useUser();

  const [sort, setSort] = useState<"top" | "newest">("newest");
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // --- FETCH LOGIC ---
  const fetchComments = useCallback(
    async (isLoadMore = false) => {
      try {
        const currentPage = isLoadMore ? page + 1 : 1;

        const params = new URLSearchParams();
        params.set("discussionId", discussionId);
        params.set("sort", sort);
        params.set("page", currentPage.toString());
        params.set("limit", "5");

        const response = await fetch(`/api/comments?${params.toString()}`);
        if (!response.ok) throw new Error("Failed");

        const body = await response.json();

        if (isLoadMore) {
          setComments((prev) => {
            const newIds = new Set(body.data.map((c: any) => c.id));
            return [...prev, ...body.data.filter((c: any) => !newIds.has(c.id))];
          });
        } else {
          setComments(body.data);
        }

        setTotalCount(body.meta?.total || 0);
        setHasMore(body.meta.hasMore);
        setPage(currentPage);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load comments");
      } finally {
        setIsInitialLoading(false);
        setIsFetchingMore(false);
      }
    },
    [discussionId, sort, page]
  ); // Depend on page state

  // --- EFFECT: Initial Load & Sort Change ---
  useEffect(() => {
    setIsInitialLoading(true);
    setPage(1); // Reset page
    fetchComments(false); // Fetch page 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussionId, sort]); // Don't add fetchComments to deps to avoid loops

  // --- HANDLERS ---
  const handleLoadMore = () => {
    setIsFetchingMore(true);
    fetchComments(true);
  };

  const handleNewRootComment = (newComment: CommentProps) => {
    setComments((prev) => [newComment, ...prev]);
    setTotalCount((prev) => prev + 1);
  };
  if (!user) return null;
  return (
    <div className="w-full space-y-8">
      {/* 1. HEADER */}
      <div className="flex items-center justify-between border-b border-[#3e2723] pb-4">
        <h3 className="text-lg font-bold text-[#eaddcf]">{totalCount} Comments</h3>

        <Select value={sort} onValueChange={(val: "top" | "newest") => setSort(val)}>
          <SelectTrigger className="w-[130px] h-8 bg-transparent border-none text-[#a1887f] hover:text-[#d4af37] focus:ring-0 gap-2 cursor-pointer">
            <span className="text-xs font-mono uppercase tracking-wider">Sort By</span>
            <ArrowUpDown size={14} />
          </SelectTrigger>
          <SelectContent
            className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] z-100"
            position="popper"
            align="end"
          >
            <SelectItem
              value="newest"
              className="focus:bg-[#3e2723]/40 focus:text-[#d4af37] cursor-pointer"
            >
              Newest
            </SelectItem>
            <SelectItem
              value="top"
              className="focus:bg-[#3e2723]/40 focus:text-[#d4af37] cursor-pointer"
            >
              Top Rated
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <WriteComment
          discussionId={discussionId}
          authorId={user?.id || ""}
          userAvatar={user?.imageUrl}
          onCommentSubmitted={handleNewRootComment}
        />
      </div>

      {/* 3. COMMENT LIST */}
      <div className="w-full flex flex-col gap-6 text-left">
        {isInitialLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#d4af37]" />
          </div>
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserAvatar={user?.imageUrl}
                currentUserId={user?.id}
                authorId={authorId}
                depth={0}
              />
            ))}

            {/* LOAD MORE BUTTON */}
            {hasMore && (
              <Button
                variant="ghost"
                onClick={handleLoadMore}
                disabled={isFetchingMore}
                className="w-full text-[#d4af37] hover:bg-[#3e2723]/20 hover:text-[#d4af37] rounded-full py-6 font-bold flex gap-2 mt-4"
              >
                {isFetchingMore ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <ArrowDown className="size-4" />
                )}
                Show more scrolls
              </Button>
            )}
          </>
        ) : (
          <NoComments />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
