"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import slugify from "slugify"; // You might need: npm i slugify
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
import { generateSlug } from "@/lib/actions/makeSlug";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  categoryOrder: number;
}

interface Props {
  allCategories: CategoryData[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({ allCategories, open, onOpenChange }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState<number | "">(""); // Start empty
  const [prereqs, setPrereqs] = useState<string[]>([]);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = generateSlug(val);
    setSlug(autoSlug);
  };

  const togglePrereq = (catSlug: string) => {
    setPrereqs((prev) =>
      prev.includes(catSlug) ? prev.filter((s) => s !== catSlug) : [...prev, catSlug]
    );
  };

  const handleSubmit = async () => {
    if (!name || !slug || order === "") {
      toast.error("Please fill in Name, Slug, and Order.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/questions/category/create", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug,
          categoryOrder: Number(order),
          prerequisiteArray: prereqs,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Failed to create category");
      }

      toast.success("Category created successfully!");
      router.refresh(); // Refresh the page data
      
      // Reset Form
      setName("");
      setSlug("");
      setOrder("");
      setPrereqs([]);
      onOpenChange(false); // Close dialog

    } catch (error: any) {
      console.error(error);
      // Show the specific error message from the API (like "Slug exists")
      toast.error(typeof error.message === "string" ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription className="text-[#a1887f]">
            Add a new topic to your learning roadmap.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name & Slug Group */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name" className="text-[#a1887f]">Name</Label>
              <Input
                id="create-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Graphs"
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-slug" className="text-[#a1887f]">Slug (Auto)</Label>
              <Input
                id="create-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. graphs"
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] font-mono text-xs"
              />
            </div>
          </div>

          {/* Order Input */}
          <div className="grid gap-2">
            <Label htmlFor="create-order" className="text-[#a1887f]">Order Index</Label>
            <Input
              id="create-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="e.g. 12"
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
            <p className="text-[10px] text-[#5d4037]">
              Determines the position in the roadmap.
            </p>
          </div>

          {/* Prerequisites Selector */}
          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Prerequisites</Label>
            <div className="h-40 overflow-y-auto border border-[#3e2723] rounded-md bg-[#0f0b0a] p-2 custom-scrollbar">
              {allCategories.length === 0 ? (
                <div className="text-xs text-[#5d4037] p-2 text-center">No categories available.</div>
              ) : (
                allCategories.map((cat) => {
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
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#3e2723] bg-[#3e2723] text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#eaddcf]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#d4af37] text-black hover:bg-[#b5952f]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Create Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}