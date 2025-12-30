"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  categoryOrder: number;
  prerequisiteArray: { slug: string }[];
}

interface Props {
  category: CategoryData | null;
  allCategories: CategoryData[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditCategoryDialog({ category, allCategories, open, onOpenChange, onSuccess }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [prereqs, setPrereqs] = useState<string[]>([]);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setOrder(category.categoryOrder);
      setPrereqs(category.prerequisiteArray.map((p) => p.slug));
    }
  }, [category]);

  const togglePrereq = (slug: string) => {
    setPrereqs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleUpdate = async () => {
    if (!category) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/questions/category/update?categoryId=${category.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          categoryOrder: Number(order),
          prerequisiteArray: prereqs,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Category updated!");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription className="text-[#a1887f]">
            Make changes to the category details here.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name" className="text-[#a1887f]">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-order" className="text-[#a1887f]">Order Index</Label>
            <Input
              id="edit-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Prerequisites</Label>
            <div className="h-40 overflow-y-auto border border-[#3e2723] rounded-md bg-[#0f0b0a] p-2 custom-scrollbar">
              {allCategories
                .filter((c) => c.id !== category?.id)
                .map((cat) => {
                  const isSelected = prereqs.includes(cat.slug);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => togglePrereq(cat.slug)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors mb-1",
                        isSelected
                          ? "bg-[#3e2723]/40 text-[#d4af37] border border-[#d4af37]/20"
                          : "text-[#a1887f] hover:bg-[#3e2723]/20"
                      )}
                    >
                      <span>{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#3e2723] text-[#a1887f] bg-[#3e2723]/80 hover:bg-[#3e2723]/20 hover:text-[#eaddcf]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            className="bg-[#d4af37] text-black hover:bg-[#b5952f] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}