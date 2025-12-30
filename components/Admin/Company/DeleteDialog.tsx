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
  company: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteCompanyDialog({ company, open, onOpenChange, onSuccess }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!company) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/companies/delete?companyId=${company.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        // Handle constraint error
        if (res.status === 409) {
          toast.error("Cannot delete: This company has questions attached.");
          return;
        }
        throw new Error("Failed to delete");
      }

      toast.success("Company deleted successfully!");
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {company?.name}?</AlertDialogTitle>
          <AlertDialogDescription className="text-[#a1887f]">
            This will permanently delete the company and its logo. This action cannot be undone.
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