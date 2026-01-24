"use client";

import { useState } from "react";
import { Upload, FileJson, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function BulkQuestionForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{ success: number; total: number } | null>(null);

  // Helper to download a template JSON file
  const downloadTemplate = () => {
    const template = [
      {
        title: "Example Question",
        slug: "example-question-slug",
        description: "Problem description goes here...",
        difficulty: "Easy",
        externalPlatformUrl: "https://leetcode.com/...",
        solutionUrl: "https://youtube.com/...",
        categories: ["arrays", "dynamic-programming"],
        companies: ["google", "amazon"],
      },
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const fileContent = await file.text();
      let jsonData;
      try {
        jsonData = JSON.parse(fileContent);
      } catch (e) {
        throw new Error("Invalid JSON file.");
      }

      if (!Array.isArray(jsonData)) throw new Error("JSON must be an array.");

      // Ensure you have created the API route at /api/admin/questions/bulk
      const response = await fetch("/api/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Upload failed");

      setStats({ success: result.data.length, total: jsonData.length });
      toast.success(`Uploaded ${result.data.length} questions!`);
      setFile(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="bg-[#1a110d]/40 p-6 rounded-xl border border-[#3e2723] space-y-4">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-[#0f0b0a] rounded-lg border border-[#3e2723]">
          <div className="text-sm text-[#a1887f]">
            <p className="font-bold text-[#eaddcf]">Need the format?</p>
            <p>Download the JSON template.</p>
          </div>
          <Button
            variant="outline"
            onClick={downloadTemplate}
            size="sm"
            className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black bg-[#3e2723]"
          >
            <Download className="w-4 h-4" /> Template
          </Button>
        </div>

        {/* File Input */}
        <div className="space-y-4">
          <Input
            type="file"
            accept=".json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] file:bg-[#3e2723] file:text-[#eaddcf] file:mr-4 hover:file:bg-[#5d4037] cursor-pointer"
          />

          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Processing..." : "Upload JSON"}
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <Alert className="bg-green-900/20 border-green-900 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Processed {stats.success} / {stats.total} questions.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
