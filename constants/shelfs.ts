import { ShelfType } from "@/generated/prisma/enums";
import { AlertCircle, Clock, RotateCcw, Star } from "lucide-react";

export const SHELF_BUTTONS = [
  {
    type: "later" as ShelfType,
    label: "Save for Later",
    icon: Clock,
    activeColor: "text-blue-400 bg-blue-400/10 border-blue-400",
    hoverColor: "hover:text-blue-400 hover:border-blue-400",
  },
  {
    type: "revisit" as ShelfType,
    label: "Needs Review",
    icon: RotateCcw,
    activeColor: "text-orange-400 bg-orange-400/10 border-orange-400",
    hoverColor: "hover:text-orange-400 hover:border-orange-400",
  },
  {
    type: "important" as ShelfType,
    label: "Important / Pattern",
    icon: Star,
    activeColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400",
    hoverColor: "hover:text-yellow-400 hover:border-yellow-400",
  },
  {
    type: "stuck" as ShelfType,
    label: "Stuck / Mental Block",
    icon: AlertCircle,
    activeColor: "text-red-500 bg-red-500/10 border-red-500",
    hoverColor: "hover:text-red-500 hover:border-red-500",
  },
];

export const SHELF_TABS = [
  { value: "revisit", label: "Needs Review", icon: RotateCcw, color: "text-orange-400" },
  { value: "important", label: "Important", icon: Star, color: "text-yellow-400" },
  { value: "stuck", label: "Stuck", icon: AlertCircle, color: "text-red-400" },
  { value: "later", label: "Saved for Later", icon: Clock, color: "text-blue-400" },
];
