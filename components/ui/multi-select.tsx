"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  // We need the width of the trigger to match the popover width perfectly
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState(0);

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current, open]);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] hover:bg-[#3e2723]/20 h-auto min-h-10 py-2"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && (
              <span className="text-[#5d4037] font-normal">{placeholder || "Select..."}</span>
            )}
            {selected.map((item) => {
              const label = options.find((opt) => opt.value === item)?.label || item;
              return (
                <Badge
                  key={item}
                  variant="secondary"
                  className="bg-[#3e2723] text-[#d4af37] border-transparent hover:bg-[#3e2723]/80 pl-2 pr-1 py-0.5"
                >
                  {label}
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-[#1a110d]/50 p-0.5 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-[#a1887f] hover:text-[#d4af37]" />
                  </div>
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-[#a1887f]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 bg-[#1a110d] border-[#3e2723] text-[#eaddcf] overflow-hidden" 
        style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
      >
        <Command className="bg-transparent w-full">
          {/* Styled Search Input */}
          <div className="border-b border-[#3e2723] bg-[#0f0b0a]">
            <CommandInput 
              placeholder={`Search ${placeholder?.toLowerCase()}...`} 
              className="text-[#eaddcf] placeholder:text-[#5d4037] py-3" 
            />
          </div>
          
          <CommandList className="custom-scrollbar p-2">
            <CommandEmpty className="py-4 text-center text-sm text-[#5d4037]">No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const isSelected = selected.includes(option.value);
                    const newSelected = isSelected
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value];
                    onChange(newSelected);
                  }}
                  // UPDATED STYLING HERE
                  className={cn(
                    "cursor-pointer transition-colors my-1 rounded-md px-2 py-1.5 text-sm",
                    // Default state
                    "text-[#a1887f] hover:bg-[#3e2723]/30 hover:text-[#eaddcf]",
                    // Selected state (checked)
                    selected.includes(option.value) && "bg-[#3e2723]/20 text-[#d4af37]",
                    // Focus state (keyboard navigation)
                    "aria-selected:bg-[#3e2723]/40 aria-selected:text-[#d4af37]"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 transition-opacity",
                      selected.includes(option.value) ? "opacity-100 text-[#d4af37]" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}