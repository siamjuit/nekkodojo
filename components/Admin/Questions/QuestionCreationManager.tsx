"use client";

import { useState } from "react";
import { Plus, FileJson, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import your EXISTING component
import CreateQuestionForm from "./CreateQuestionForm";
// Import the NEW component
import BulkQuestionForm from "./BulkQuestionForm";

interface Option {
  label: string;
  value: string;
}

interface Props {
  categoryOptions: Option[];
  companyOptions: Option[];
}

export default function QuestionCreationManager({ categoryOptions, companyOptions }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold gap-2">
          <Plus className="w-4 h-4" /> Bulk Upload
        </Button>
      </SheetTrigger>

      {/* Wide sheet to fit your form comfortably */}
      <SheetContent className="w-full sm:max-w-3xl p-4 bg-[#0f0b0a] border-l border-[#3e2723] overflow-y-auto text-[#eaddcf]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-[#eaddcf] text-2xl font-black uppercase">
            New Katas
          </SheetTitle>
          <SheetDescription className="text-[#a1887f]">
            Add a single question manually or bulk import via JSON.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a110d] border border-[#3e2723] mb-6">
            <TabsTrigger
              value="single"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] font-bold"
            >
              <PenTool className="w-4 h-4 mr-2" /> Manual
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] font-bold"
            >
              <FileJson className="w-4 h-4 mr-2" /> Bulk JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            {/* Using your existing form here */}
            <CreateQuestionForm categoryOptions={categoryOptions} companyOptions={companyOptions} />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkQuestionForm />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
