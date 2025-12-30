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
import { Checkbox } from "@/components/ui/checkbox";
import { LogoUploader } from "./LogoUploader";

interface Props {
  company: CompanyData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditCompanyDialog({ company, open, onOpenChange, onSuccess }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  
  // Logic: "Include Logo" Checkbox
  const [includeLogo, setIncludeLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoId, setLogoId] = useState<string | null>(null);

  // Load data on open
  useEffect(() => {
    if (company) {
      setName(company.name);
      setWebsiteUrl(company.websiteUrl || "");
      
      // Checkbox Logic: If DB has a logo, check the box.
      if (company.logo) {
        setIncludeLogo(true);
        setLogoUrl(company.logo);
        setLogoId(company.logoId);
      } else {
        setIncludeLogo(false);
        setLogoUrl(null);
        setLogoId(null);
      }
    }
  }, [company]);

  // Handle Checkbox Toggle
  const handleCheckboxChange = (checked: boolean) => {
    setIncludeLogo(checked);
    if (!checked) {
      // If unchecked, we intend to delete the logo
      setLogoUrl(null);
      setLogoId(null);
    }
  };

  const handleUpdate = async () => {
    if (!company) return;
    
    // Validation: If checked, must have a file
    if (includeLogo && !logoUrl) {
      toast.error("Please upload a logo or uncheck the 'Has Logo' option.");
      return;
    }

    setIsLoading(true);

    // Prepare payload
    // If !includeLogo, send nulls to trigger deletion in API
    const finalLogoUrl = includeLogo ? logoUrl : null;
    const finalLogoId = includeLogo ? logoId : null;

    try {
      const res = await fetch(`/api/companies/update?companyId=${company.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          websiteUrl,
          logo: finalLogoUrl,
          logoId: finalLogoId,
          // Note: We do NOT send slug update here to avoid breaking links
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Company updated successfully!");
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
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription className="text-[#a1887f]">
            Update company details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="edit-name" className="text-[#a1887f]">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>

          {/* Read-Only Slug */}
          <div className="grid gap-2">
            <Label className="text-[#a1887f]">Slug (Read-only)</Label>
            <div className="px-3 py-2 rounded-md bg-[#0f0b0a]/50 border border-[#3e2723] text-[#5d4037] font-mono text-sm">
              {company?.slug}
            </div>
          </div>

          {/* Website Input */}
          <div className="grid gap-2">
            <Label htmlFor="edit-web" className="text-[#a1887f]">Website URL</Label>
            <Input
              id="edit-web"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf]"
            />
          </div>

          {/* Checkbox Logic */}
          <div className="flex items-center space-x-2 border border-[#3e2723] p-3 rounded-md bg-[#0f0b0a]/30 mt-2">
            <Checkbox 
              id="has-logo" 
              checked={includeLogo}
              onCheckedChange={handleCheckboxChange}
              className="border-[#d4af37] data-[state=checked]:bg-[#d4af37] data-[state=checked]:text-black"
            />
            <Label htmlFor="has-logo" className="text-[#eaddcf] cursor-pointer font-medium select-none">
              Company has a logo
            </Label>
          </div>

          {/* Uploader (Conditionally Rendered) */}
          {includeLogo && (
            <div className="grid gap-2 animate-in fade-in zoom-in-95 duration-200">
              <LogoUploader 
                currentLogoUrl={logoUrl}
                onUploadSuccess={(res) => {
                  setLogoUrl(res.url);
                  setLogoId(res.fileId);
                }}
                onRemove={() => {
                  setLogoUrl(null);
                  setLogoId(null);
                  // Note: We don't uncheck the box here automatically, 
                  // keeping it checked allows user to upload a different one.
                }}
              />
            </div>
          )}
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