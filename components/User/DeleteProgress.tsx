"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Trash2, Loader2, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteProgress() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleReset() {
    try {
      setLoading(true);

      const res = await fetch("/api/progress/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      toast.success("Journey reset successfully");
      router.refresh();
    } catch {
      toast.error("Unable to reset progress");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-400">
            <ShieldAlert className="h-4 w-4" />
            Danger Zone
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Reset Your Progress</h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              This permanently removes solved questions, belt progress, stats, and activity history.
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Right */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 text-red-400 hover:bg-red-500 hover:text-white">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Progress
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="border-zinc-800 bg-[#0f0f0f] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-red-400">
                Confirm Reset
              </AlertDialogTitle>

              <AlertDialogDescription className="text-zinc-400">
                You are about to erase all profile progress. This includes solved problems, rank,
                charts, and history.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  if (!loading) handleReset();
                }}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Yes, Reset
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
