"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreateTagDialog } from "./CreateDialog";
import { EditTagDialog } from "./EditDialog";
import { DeleteTagDialog } from "./DeleteDialog";

export default function TagClient({ data }: { data: TagData[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagData | null>(null);
  const [tagToEdit, setTagToEdit] = useState<TagData | null>(null);

  const filteredTags = data.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3e2723] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#eaddcf]">Discussion Tags</h1>
          <p className="text-[#a1887f] text-sm mt-1">
            Manage tags used to categorize community discussions.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#d4af37] text-black hover:bg-[#b5952f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {/* --- SEARCH --- */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5d4037]" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a110d]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037]"
          />
        </div>
        <div className="text-xs font-mono text-[#5d4037] uppercase">
          Total: {filteredTags.length}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-xl border border-[#3e2723] bg-[#1a110d]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3e2723] bg-[#0f0b0a]/50 text-[#a1887f]">
                <th className="p-4 font-medium">Tag Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Color Preview</th>
                <th className="p-4 font-medium text-center">Discussions</th>
                <th className="p-4 font-medium text-right">Last Updated</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3e2723]">
              {filteredTags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5d4037]">
                    No tags found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredTags.map((tag) => (
                  <tr key={tag.id} className="group hover:bg-[#3e2723]/10 transition-colors">
                    <td className="p-4 font-medium text-[#eaddcf]">{tag.name}</td>
                    <td className="p-4 font-mono text-xs text-[#5d4037]">{tag.slug}</td>
                    <td className="p-4">
                      {/* Actual visual preview of the tag style */}
                      <Badge
                        className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border hover:bg-transparent ${tag.color}`}
                      >
                        {tag.name}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className="bg-[#3e2723]/50 text-[#eaddcf]">
                        {tag._count.discussions}
                      </Badge>
                    </td>
                    <td className="p-4 text-right text-[#5d4037] tabular-nums">
                      {format(new Date(tag.updatedAt), "MMM d, yyyy")}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setTagToEdit(tag)}
                          className="h-8 w-8 text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setTagToDelete(tag)}
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
      <CreateTagDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <EditTagDialog
        open={!!tagToEdit}
        onOpenChange={(open) => !open && setTagToEdit(null)}
        tag={tagToEdit}
        onSuccess={() => setTagToEdit(null)}
      />

      <DeleteTagDialog
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
        tag={tagToDelete}
        onSuccess={() => setTagToDelete(null)}
      />
    </div>
  );
}
