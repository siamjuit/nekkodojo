"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
  tag: TagData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTagDialog({ tag, open, onOpenChange, onSuccess }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState(""); // Assuming you allow slug editing (be careful with SEO)
  const [color, setColor] = useState("");

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setSlug(tag.slug);
      setColor(tag.color!);
    }
  }, [tag]);

  const handleUpdate = async () => {
    if (!tag) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/discussions/tag/update?tagId=${tag.id}`, {
        method: "PUT",
        body: JSON.stringify({ name, slug, color }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Tag updated!");
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
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription className="text-[#a1887f]">
            Update tag details. Changing the slug may break existing links.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name" className="text-[#a1887f]">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-color" className="text-[#a1887f]">
              Color Class
            </Label>
            <div className="flex gap-3">
              <Input
                id="edit-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              />
              <div
                className={`w-10 h-10 rounded border border-[#3e2723] flex items-center justify-center text-xs ${color}`}
                title="Preview"
              >
                T
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#3e2723] text-[#a1887f] bg-[#3e2723] hover:bg-[#3e2723]/20 hover:text-[#eaddcf]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            className="bg-[#d4af37] text-black hover:bg-[#b5952f]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
