"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  question: { id: string; title: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteQuestionDialog({ question, open, onOpenChange, onSuccess }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!question) return;
    setIsLoading(true);

    try {
      // Assumes you will create DELETE /api/questions?questionId=...
      const res = await fetch(`/api/questions/delete?questionId=${question.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete question");
      }

      toast.success("Question deleted successfully");
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Question?</AlertDialogTitle>
          <AlertDialogDescription className="text-[#a1887f]">
            This will permanently delete{" "}
            <span className="text-[#d4af37] font-bold">"{question?.title}"</span>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-[#3e2723] text-[#eaddcf] hover:bg-[#3e2723]/50 hover:text-[#eaddcf]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-900/50 text-red-200 border border-red-900 hover:bg-red-900"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
