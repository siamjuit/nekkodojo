"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

interface Props {
  discussionId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: "like" | "dislike" | null;
  isLiked: Boolean;
  isDisliked: Boolean;
}

export default function VoteControl({
  discussionId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
  isLiked,
  isDisliked,
}: Props) {
  const router = useRouter();

  const getStartingVote = () => {
    if (initialUserVote) return initialUserVote;
    if (isLiked) return "like";
    if (isDisliked) return "dislike";
    return null;
  };

  const [voteState, setVoteState] = useState({
    userVote: getStartingVote(),
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
  });
  const [debouncedVote] = useDebounce(voteState.userVote, 500);
  const isMounted = useRef(false);
  const previousVoteRef = useRef(voteState.userVote);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const syncVoteToServer = async () => {
      if (debouncedVote === previousVoteRef.current) return;

      const type = debouncedVote;

      try {
        const targetType = type || "remove";
        if (!type) return;

        const res = await fetch(`/api/discussions/${discussionId}/${type}`, {
          method: "PATCH",
          body: JSON.stringify({ discussionId, type }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Please sign in to vote");
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed");
        }
        previousVoteRef.current = debouncedVote;
        router.refresh();
      } catch (error) {
        toast.error("Failed to sync vote");
      }
    };

    syncVoteToServer();
  }, [debouncedVote]);

  const handleVote = (type: "like" | "dislike") => {
    setVoteState((prev) => {
      const isSame = prev.userVote === type;
      const isSwitching = prev.userVote && prev.userVote !== type;

      let newUp = prev.upvotes;
      let newDown = prev.downvotes;
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

      return { userVote: newVote, upvotes: newUp, downvotes: newDown };
    });
  };

  return (
    <div className="flex items-center gap-1 bg-[#1a110d] border border-[#3e2723] rounded-lg p-1 transition-all hover:border-[#d4af37]/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("like")}
        className={`h-8 px-3 gap-2 transition-colors duration-200 ${
          voteState.userVote === "like"
            ? "text-[#d4af37] bg-[#d4af37]/10"
            : "text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/30"
        }`}
      >
        <ThumbsUp
          size={16}
          className={`transition-transform ${voteState.userVote === "like" ? "fill-current scale-110" : ""}`}
        />
        <span className="font-mono text-xs font-bold">{voteState.upvotes}</span>
      </Button>

      <div className="w-px h-4 bg-[#3e2723]" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("dislike")}
        className={`h-8 px-3 transition-colors duration-200 ${
          voteState.userVote === "dislike"
            ? "text-red-400 bg-red-900/10"
            : "text-[#a1887f] hover:text-red-400 hover:bg-[#3e2723]/30"
        }`}
      >
        <ThumbsDown
          size={16}
          className={`transition-transform ${voteState.userVote === "dislike" ? "fill-current scale-110" : ""}`}
        />
        <span className="font-mono text-xs font-bold">{voteState.downvotes}</span>
      </Button>
    </div>
  );
}
