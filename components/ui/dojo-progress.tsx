import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0 to 100
  className?: string;
}

export function DojoProgress({ value, className }: Props) {
  return (
    <div className={cn("h-1.5 w-full bg-[#0f0b0a] rounded-full overflow-hidden border border-[#3e2723]", className)}>
      <div 
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          value === 100 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-[#d4af37]"
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}