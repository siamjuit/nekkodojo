"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCompanyDialog } from "./CreateDialog";
import { EditCompanyDialog } from "./EditDialog";
import { DeleteCompanyDialog } from "./DeleteDialog";

export default function CompanyClient({ data }: { data: CompanyData[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [compToDelete, setCompToDelete] = useState<CompanyData | null>(null);
  const [compToEdit, setCompToEdit] = useState<CompanyData | null>(null);

  // Filter
  const filtered = data.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3e2723] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#eaddcf]">Companies</h1>
          <p className="text-[#a1887f] text-sm mt-1">
            Manage tech companies and their question associations.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#d4af37] text-black hover:bg-[#b5952f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* --- SEARCH --- */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5d4037]" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a110d]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037]"
          />
        </div>
        <div className="text-xs font-mono text-[#5d4037] uppercase">Total: {filtered.length}</div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-xl border border-[#3e2723] bg-[#1a110d]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3e2723] bg-[#0f0b0a]/50 text-[#a1887f]">
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Website</th>
                <th className="p-4 font-medium text-center">Questions</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3e2723]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#5d4037]">
                    No companies found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filtered.map((comp) => (
                  <tr key={comp.id} className="group hover:bg-[#3e2723]/10 transition-colors">
                    {/* Name & Logo */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/5 border border-[#3e2723] flex items-center justify-center overflow-hidden relative shrink-0">
                          {comp.logo ? (
                            <Image
                              src={comp.logo}
                              alt={comp.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <span className="text-[10px] text-[#5d4037] font-bold">
                              {comp.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-[#eaddcf]">{comp.name}</span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4 font-mono text-xs text-[#5d4037]">{comp.slug}</td>

                    {/* Website */}
                    <td className="p-4">
                      {comp.websiteUrl ? (
                        <Link
                          href={comp.websiteUrl}
                          target="_blank"
                          className="text-[#d4af37] hover:underline flex items-center gap-1 text-xs"
                        >
                          Visit <ExternalLink size={10} />
                        </Link>
                      ) : (
                        <span className="text-[#5d4037] text-xs">-</span>
                      )}
                    </td>

                    {/* Questions Count */}
                    <td className="p-4 text-center">
                      <Badge className="bg-[#3e2723]/50 text-[#eaddcf]">
                        {comp._count.questions}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setCompToEdit(comp)}
                          className="h-8 w-8 text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setCompToDelete(comp)}
                          className="h-8 w-8 text-[#a1887f] hover:text-red-400 hover:bg-red-900/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DIALOGS --- */}
      <CreateCompanyDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditCompanyDialog
        open={!!compToEdit}
        onOpenChange={(open) => !open && setCompToEdit(null)}
        company={compToEdit}
        onSuccess={() => setCompToEdit(null)}
      />
      <DeleteCompanyDialog
        open={!!compToDelete}
        onOpenChange={(open) => !open && setCompToDelete(null)}
        company={compToDelete}
        onSuccess={() => setCompToDelete(null)}
      />
    </div>
  );
}
