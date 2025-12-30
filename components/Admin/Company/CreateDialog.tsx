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
import { LogoUploader } from "./LogoUploader";
import attFromKit from "@/lib/actions/removeAtt";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCompanyDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Logo State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoId, setLogoId] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug (slugify handles special chars better than manual regex)
    setSlug(slugify(val, { lower: true, strict: true }));
  };

  const handleSubmit = async () => {
    if (!name || !slug) {
      toast.error("Name and Slug are required.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/companies/create", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug,
          websiteUrl,
          logo: logoUrl,
          logoId: logoId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Failed to create company");
      }

      toast.success("Company created successfully!");
      router.refresh();

      // Reset Form
      setName("");
      setSlug("");
      setWebsiteUrl("");
      setLogoUrl(null);
      setLogoId(null);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(typeof error.message === "string" ? error.message : "Failed to create company");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription className="text-[#a1887f]">
            Register a new company to tag questions with.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="create-name" className="text-[#a1887f]">
                Name
              </Label>
              <Input
                id="create-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Google"
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] py-2"
              />
            </div>
            {/* Slug Input */}
            <div className="grid gap-2">
              <Label htmlFor="create-slug" className="text-[#a1887f]">
                Slug
              </Label>
              <Input
                id="create-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. google"
                className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] font-mono text-xs py-2"
              />
            </div>
          </div>

          {/* Website Input */}
          <div className="grid gap-2">
            <Label htmlFor="create-web" className="text-[#a1887f]">
              Website URL
            </Label>
            <Input
              id="create-web"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>

          {/* Logo Upload */}
          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Logo</Label>
            <LogoUploader
              currentLogoUrl={logoUrl}
              onUploadSuccess={(res) => {
                setLogoUrl(res.url);
                setLogoId(res.fileId);
              }}
              onRemove={() => {
                setLogoUrl(null);
                setLogoId(null);
                attFromKit(logoId!);
              }}
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#d4af37] text-black hover:bg-[#b5952f]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create Company"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
