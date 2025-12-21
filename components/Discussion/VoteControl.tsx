"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(false);

  const [voteState, setVoteState] = useState({
    userVote: initialUserVote,
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
  });

  const handleVote = async (type: "like" | "dislike") => {
    setLoading(true);

    const previousState = { ...voteState };
    const isSame = voteState.userVote === type;
    const isSwitching = voteState.userVote && voteState.userVote !== type;

    setVoteState((prev) => {
      let newUp = prev.upvotes;
      let newDown = prev.downvotes;
      let newVote = prev.userVote;

      if (isSame) {
        newVote = null;
        if (type === "like") newUp--;
        else newDown--;
      } else if (isSwitching) {
        newVote = type;
        if (type === "like") {
          newUp++;
          newDown--;
        } else {
          newUp--;
          newDown++;
        }
      } else {
        newVote = type;
        if (type === "like") newUp++;
        else newDown++;
      }

      return { userVote: newVote, upvotes: newUp, downvotes: newDown };
    });

    try {
      const res = await fetch(`/api/discussions/${discussionId}/${type}`, {
        method: "PUT",
        body: JSON.stringify({ discussionId, type }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please sign in to vote");
          router.push("/sign-in");
        }
        throw new Error("Failed");
      }

      router.refresh();
    } catch (error) {
      setVoteState(previousState);
      toast.error("Failed to register vote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-[#1a110d] border border-[#3e2723] rounded-lg p-1 transition-all hover:border-[#d4af37]/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("like")}
        disabled={loading}
        className={`h-8 px-3 gap-2 transition-colors ${
          voteState.userVote === "like" || isLiked
            ? "text-[#d4af37] bg-[#d4af37]/10"
            : "text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/30"
        }`}
      >
        <ThumbsUp size={16} className={voteState.userVote === "like" ? "fill-current" : ""} />
        <span className="font-mono text-xs font-bold">{voteState.upvotes}</span>
      </Button>

      <div className="w-px h-4 bg-[#3e2723]" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("dislike")}
        disabled={loading}
        className={`h-8 px-3 transition-colors ${
          voteState.userVote === "dislike" || isDisliked
            ? "text-red-400 bg-red-900/10"
            : "text-[#a1887f] hover:text-red-400 hover:bg-[#3e2723]/30"
        }`}
      >
        <ThumbsDown size={16} className={voteState.userVote === "dislike" ? "fill-current" : ""} />
        <span className="font-mono text-xs font-bold">{voteState.downvotes}</span>
      </Button>
    </div>
  );
}
