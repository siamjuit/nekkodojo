"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import slugify from "slugify";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTagDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = slugify(val, { lower: true, strict: true });
    setSlug(autoSlug);
  };

  const handleSubmit = async () => {
    if (!name || !slug || !color) {
      toast.error("Please fill in Name, Slug, and Color.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/discussions/tag/create", {
        method: "POST",
        body: JSON.stringify({ name, slug, color }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Failed to create tag");
      }

      toast.success("Tag created successfully!");
      router.refresh();
      
      // Reset
      setName("");
      setSlug("");
      setColor("");
      onOpenChange(false);

    } catch (error: any) {
      console.error(error);
      toast.error(typeof error.message === "string" ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription className="text-[#a1887f]">
            Define a new tag for discussions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="create-name" className="text-[#a1887f]">Name</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. System Design"
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="create-slug" className="text-[#a1887f]">Slug</Label>
            <Input
              id="create-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. system-design"
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] font-mono text-xs"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-color" className="text-[#a1887f]">Color Class</Label>
            <div className="flex gap-3">
              <Input
                id="create-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. bg-blue-500 text-white"
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              />
              {/* Live Preview */}
              <div 
                className={`w-10 h-10 rounded border border-[#3e2723] flex items-center justify-center text-xs ${color}`}
                title="Preview"
              >
                T
              </div>
            </div>
            <p className="text-[10px] text-[#5d4037]">
              Enter Tailwind classes (e.g., <code>bg-red-500 text-white</code>)
            </p>
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
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}