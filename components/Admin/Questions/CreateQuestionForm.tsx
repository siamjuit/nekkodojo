"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
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
import { MultiSelect } from "@/components/ui/multi-select"; // Import from step 1

// Types for props passed from server
interface Option {
  label: string;
  value: string;
}

interface Props {
  categoryOptions: Option[];
  companyOptions: Option[];
}

export default function CreateQuestionForm({ categoryOptions, companyOptions }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [externalUrl, setExternalUrl] = useState("");
  const [solutionUrl, setSolutionUrl] = useState("");

  // Multi-Select State (Stores Array of Slugs)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/questions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          externalPlatformUrl: externalUrl,
          solutionUrl,
          categories: selectedCategories, // Sends array of slugs
          companyTag: selectedCompanies, // Sends array of slugs
        }),
      });

      if (!res.ok) {
        const errorMsg = await res.json();
        throw new Error(errorMsg || "Failed to create question");
      }

      toast.success("Question created successfully!");
      router.push("/admin/questions"); // Redirect back to list
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* 1. Basic Info */}
      <div className="space-y-4 p-6 rounded-xl border border-[#3e2723] bg-[#1a110d]/40">
        <h3 className="text-lg font-semibold text-[#eaddcf] border-b border-[#3e2723] pb-2">
          Problem Details
        </h3>

        <div className="grid gap-2">
          <Label htmlFor="title" className="text-[#a1887f]">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Two Sum"
            className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="difficulty" className="text-[#a1887f]">
            Difficulty
          </Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] w-[180px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
              <SelectItem
                value="Easy"
                className="text-green-400 focus:text-green-400 focus:bg-[#3e2723]/20"
              >
                Easy
              </SelectItem>
              <SelectItem
                value="Medium"
                className="text-yellow-400 focus:text-yellow-400 focus:bg-[#3e2723]/20"
              >
                Medium
              </SelectItem>
              <SelectItem
                value="Hard"
                className="text-red-400 focus:text-red-400 focus:bg-[#3e2723]/20"
              >
                Hard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="desc" className="text-[#a1887f]">
            Description
          </Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem statement..."
            className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] min-h-[150px]"
            required
          />
        </div>
      </div>

      {/* 2. Links */}
      <div className="space-y-4 p-6 rounded-xl border border-[#3e2723] bg-[#1a110d]/40">
        <h3 className="text-lg font-semibold text-[#eaddcf] border-b border-[#3e2723] pb-2">
          Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-[#a1887f]">
              LeetCode / Platform URL
            </Label>
            <Input
              id="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sol" className="text-[#a1887f]">
              Solution URL (Video/Article)
            </Label>
            <Input
              id="sol"
              value={solutionUrl}
              onChange={(e) => setSolutionUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
              required
            />
          </div>
        </div>
      </div>

      {/* 3. Tags (Multi-Selects) */}
      <div className="space-y-4 p-6 rounded-xl border border-[#3e2723] bg-[#1a110d]/40">
        <h3 className="text-lg font-semibold text-[#eaddcf] border-b border-[#3e2723] pb-2">
          Tags & Categories
        </h3>

        <div className="grid gap-2">
          <Label className="text-[#a1887f]">Categories</Label>
          <MultiSelect
            options={categoryOptions}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select Categories..."
          />
          <p className="text-[10px] text-[#5d4037]">Which topic does this belong to?</p>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#a1887f]">Companies</Label>
          <MultiSelect
            options={companyOptions}
            selected={selectedCompanies}
            onChange={setSelectedCompanies}
            placeholder="Select Companies..."
          />
          <p className="text-[10px] text-[#5d4037]">Who asked this question?</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#d4af37] text-black hover:bg-[#b5952f] w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Create Question
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
