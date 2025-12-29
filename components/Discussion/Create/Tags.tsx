"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getTags } from "@/lib/getTags";
import { careerSlugs, isDojoTheme, languageSlugs, technicalSlugs } from "@/constants/tagGroups";

interface Props {
  value: TagProps;
  onChange: (value: TagProps) => void;
}

export function TagSelector({ value, onChange }: Props) {
  const [tags, setTags] = React.useState<TagProps[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const getAllTags = async () => {
      try {
        const t: TagProps[] = await getTags();
        if (t) setTags(t);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    getAllTags();
  }, []);

  const selectedTag =
    tags.find((tag) => tag.slug === value.slug) || tags.find((t) => t.name === "General Discussion");

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-14 justify-between bg-[#1a110d]/50 border-[#3e2723] text-[#eaddcf] hover:bg-[#1a110d] hover:text-[#d4af37] hover:border-[#d4af37]/50 rounded-xl transition-all"
          >
            {selectedTag ? (
              <div className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", selectedTag.color!.split(" ")[0])} />
                <span className="font-mono text-sm">{selectedTag.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#5d4037]">
                <Hash size={16} />
                <span className="text-sm">Select Tag...</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[280px] p-0 bg-[#1a110d] border-[#3e2723] text-[#eaddcf]"
          align="end"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search category..."
              className="text-[#eaddcf] placeholder:text-[#5d4037]"
            />
            <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-6 text-center text-sm text-[#5d4037]">
                No category found.
              </CommandEmpty>
              <CommandGroup heading="Dojo Themes" className="text-[#a1887f]">
                {tags
                  .filter((t) => isDojoTheme(t.slug))
                  .map((tag) => (
                    <CommandItem
                      key={tag.slug}
                      value={tag.name} // Search by name
                      onSelect={() => {
                        onChange(tag);
                        setOpen(false);
                      }}
                      className="cursor-pointer aria-selected:bg-[#3e2723]/30 aria-selected:text-[#d4af37] focus:bg-[#3e2723]/30 focus:text-[#d4af37] my-1"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn("w-2 h-2 rounded-full", tag.color!.split(" ")[0])} />
                        <span>{tag.name}</span>
                        {value.slug === tag.slug && <Check className="ml-auto h-4 w-4 text-[#d4af37]" />}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              {/* Group 2: Technical Topics */}
              <CommandGroup heading="Technical Topics" className="text-[#a1887f]">
                {tags
                  .filter((t) => technicalSlugs.includes(t.slug))
                  .map((tag) => (
                    <CommandItem
                      key={tag.slug}
                      value={tag.name}
                      onSelect={() => {
                        onChange(tag);
                        setOpen(false);
                      }}
                      className="cursor-pointer aria-selected:bg-[#3e2723]/30 aria-selected:text-[#d4af37] focus:bg-[#3e2723]/30 focus:text-[#d4af37] my-1"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn("w-2 h-2 rounded-full", tag.color!.split(" ")[0])} />
                        <span>{tag.name}</span>
                        {value.slug === tag.slug && <Check className="ml-auto h-4 w-4 text-[#d4af37]" />}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              {/* Group 3: Languages */}
              <CommandGroup heading="Languages and Stack" className="text-[#a1887f]">
                {tags
                  .filter((t) => languageSlugs.includes(t.slug))
                  .map((tag) => (
                    <CommandItem
                      key={tag.slug}
                      value={tag.name}
                      onSelect={() => {
                        onChange(tag);
                        setOpen(false);
                      }}
                      className="cursor-pointer aria-selected:bg-[#3e2723]/30 aria-selected:text-[#d4af37] focus:bg-[#3e2723]/30 focus:text-[#d4af37] my-1"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn("w-2 h-2 rounded-full", tag.color!.split(" ")[0])} />
                        <span>{tag.name}</span>
                        {value.slug === tag.slug && <Check className="ml-auto h-4 w-4 text-[#d4af37]" />}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              {/* Group 4: Career */}
              <CommandGroup heading="Career" className="text-[#a1887f]">
                {tags
                  .filter((t) => careerSlugs.includes(t.slug))
                  .map((tag) => (
                    <CommandItem
                      key={tag.slug}
                      value={tag.name}
                      onSelect={() => {
                        onChange(tag);
                        setOpen(false);
                      }}
                      className="cursor-pointer aria-selected:bg-[#3e2723]/30 aria-selected:text-[#d4af37] focus:bg-[#3e2723]/30 focus:text-[#d4af37] my-1"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn("w-2 h-2 rounded-full", tag.color!.split(" ")[0])} />
                        <span>{tag.name}</span>
                        {value.slug === tag.slug && <Check className="ml-auto h-4 w-4 text-[#d4af37]" />}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
