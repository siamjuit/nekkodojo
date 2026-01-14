"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const DeleteProgress = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Ensure this URL matches your actual API route path
      const res = await fetch("/api/progress/delete", { 
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete progress");
      }

      toast.success("Progress reset. A new journey begins!", {
        description: "Your solved count and belts have been cleared.",
      });
      
      setIsOpen(false);
      router.refresh(); // Crucial: Refreshes server components (Charts/Belts)
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset progress. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-10 p-6 border border-red-900/30 bg-red-950/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-red-400/70 max-w-md">
          Resetting your progress is permanent. You will lose all your solved katas, belts, and activity history.
        </p>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all font-mono tracking-wider"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            RESET PROGRESS
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-[#1a110d] border border-[#3e2723] text-[#eaddcf]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#a1887f]">
              This action cannot be undone. This will permanently delete your
              solved questions history and reset your belt rank to White Belt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#3e2723] text-[#a1887f] hover:bg-[#3e2723]/50 hover:text-[#eaddcf]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-close to handle loading state
                handleDelete();
              }}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700 border-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Reset Everything"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteProgress;