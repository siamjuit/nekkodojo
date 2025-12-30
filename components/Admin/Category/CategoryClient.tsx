"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCategoryDialog } from "./CreateDialog";
import { EditCategoryDialog } from "./EditDialog";
import { DeleteCategoryDialog } from "./DeleteDialog";

export default function CategoryClient({ data }: { data: CategoryWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithRelations | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryWithRelations | null>(null);

  const filteredCategories = data.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3e2723] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#eaddcf]">Categories</h1>
          <p className="text-[#a1887f] text-sm mt-1">Manage your learning path hierarchy.</p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#d4af37] text-black hover:bg-[#b5952f] cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* --- SEARCH & STATS --- */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5d4037]" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a110d]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037]"
          />
        </div>
        <div className="text-xs font-mono text-[#5d4037] uppercase">
          Total: {filteredCategories.length}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-xl border border-[#3e2723] bg-[#1a110d]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3e2723] bg-[#0f0b0a]/50 text-[#a1887f]">
                <th className="p-4 font-medium w-20">Order</th>
                <th className="p-4 font-medium">Name & Slug</th>
                <th className="p-4 font-medium">Prerequisites</th>
                <th className="p-4 font-medium text-center">Questions</th>
                <th className="p-4 font-medium text-right">Last Updated</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3e2723]">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5d4037]">
                    No categories found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-[#3e2723]/10 transition-colors">
                    {/* Order Column */}
                    <td className="p-4 font-mono text-[#d4af37]">#{cat.categoryOrder}</td>

                    {/* Name & Slug Column */}
                    <td className="p-4">
                      <div className="font-medium text-[#eaddcf]">{cat.name}</div>
                      <div className="text-xs text-[#5d4037] font-mono mt-0.5">{cat.slug}</div>
                    </td>

                    {/* Prerequisites Column */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cat.prerequisiteArray.length > 0 ? (
                          cat.prerequisiteArray.map((pre) => (
                            <Badge
                              key={pre.slug}
                              variant="outline"
                              className="border-[#3e2723] text-[#a1887f] text-[10px] bg-[#0f0b0a]"
                            >
                              {pre.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[#5d4037] text-xs italic">None (Root)</span>
                        )}
                      </div>
                    </td>

                    {/* Questions Count Column */}
                    <td className="p-4 text-center">
                      <Badge className="bg-[#3e2723]/50 text-[#eaddcf]">
                        {cat._count.questions}
                      </Badge>
                    </td>

                    {/* Date Column */}
                    <td className="p-4 text-right text-[#5d4037] tabular-nums">
                      {format(new Date(cat.updatedAt), "MMM d, yyyy")}
                    </td>

                    {/* Actions Column */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setCategoryToEdit(cat)}
                          className="h-8 w-8 text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setCategoryToDelete(cat)}
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

      {/* 1. Create Dialog */}
      <CreateCategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        allCategories={data}
      />

      {/* 2. Edit Dialog */}
      <EditCategoryDialog
        open={!!categoryToEdit}
        onOpenChange={(open) => !open && setCategoryToEdit(null)}
        category={categoryToEdit}
        allCategories={data}
        onSuccess={() => setCategoryToEdit(null)}
      />

      {/* 3. Delete Dialog */}
      <DeleteCategoryDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        category={categoryToDelete}
        onSuccess={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
