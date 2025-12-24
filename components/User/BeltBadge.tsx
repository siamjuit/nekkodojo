import React from "react";
import { Badge } from "../ui/badge";
import { BeltRanks } from "@/constants/belts";

const BeltBadge = ({ belt }: { belt: string }) => {
  const beltValue = BeltRanks.find((b) => b.key === belt)?.value || "Unknown Belt";
  return (
    <>
      <Badge
        variant={"outline"}
        className="text-[10px] uppercase tracking-wider text-[#5d4037] border-[#3e2723]"
      >
        {beltValue}
      </Badge>
    </>
  );
};

export default BeltBadge;
