"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect, Option } from "@/components/ui/multi-select"; // Import your reusable component

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Company {
  name: string;
  slug: string;
}

interface Props {
  question: Question | null;
  categoryOptions: Option[];
  companyOptions: Option[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditQuestionDialog({
  question,
  categoryOptions,
  companyOptions,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [externalUrl, setExternalUrl] = useState("");
  const [solutionUrl, setSolutionUrl] = useState("");

  // Multi-Select State (Slugs)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Pre-fill data when dialog opens
  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setDescription(question.description || "");
      setDifficulty(question.difficulty);
      setExternalUrl(question.externalPlatformUrl || "");
      setSolutionUrl(question.solutionUrl || "");

      // Map objects to slugs for MultiSelect
      setSelectedCategories(question.categories.map((c) => c.slug));
      setSelectedCompanies(question.companyTag.map((c) => c.slug));
    }
  }, [question]);

  const handleUpdate = async () => {
    if (!question) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/questions/update?questionId=${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          externalPlatformUrl: externalUrl,
          solutionUrl,
          categories: selectedCategories,
          companyTag: selectedCompanies,
        }),
      });

      if (!res.ok) throw new Error("Failed to update question");

      toast.success("Question updated!");
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update question");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Kata</DialogTitle>
          <DialogDescription className="text-[#a1887f]">Update problem details.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[#a1887f]">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[#a1887f]">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
                  <SelectItem value="Easy" className="text-green-400">
                    Easy
                  </SelectItem>
                  <SelectItem value="Medium" className="text-yellow-400">
                    Medium
                  </SelectItem>
                  <SelectItem value="Hard" className="text-red-400">
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] min-h-[100px]"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[#a1887f]">Platform URL</Label>
              <Input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[#a1887f]">Solution URL</Label>
              <Input
                value={solutionUrl}
                onChange={(e) => setSolutionUrl(e.target.value)}
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Categories</Label>
            <MultiSelect
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Select Categories..."
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Companies</Label>
            <MultiSelect
              options={companyOptions}
              selected={selectedCompanies}
              onChange={setSelectedCompanies}
              placeholder="Select Companies..."
            />
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
