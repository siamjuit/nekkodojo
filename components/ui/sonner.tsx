"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-[#d4af37]" />,
        info: <InfoIcon className="size-5 text-[#a1887f]" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-red-400" />,
        loading: <Loader2Icon className="size-5 animate-spin text-[#d4af37]" />,
      }}
      toastOptions={{
        classNames: {
          toast: 
            "group toast group-[.toaster]:bg-[#1a110d]/95 group-[.toaster]:text-[#eaddcf] group-[.toaster]:border-[#d4af37]/30 group-[.toaster]:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-xl font-mono text-sm",
          description: 
            "group-[.toast]:text-[#a1887f]",
          actionButton:
            "group-[.toast]:bg-[#d4af37] group-[.toast]:text-[#1a110d] group-[.toast]:font-bold group-[.toast]:hover:bg-[#b5952f] transition-colors",
          cancelButton:
            "group-[.toast]:bg-[#3e2723]/50 group-[.toast]:text-[#eaddcf] group-[.toast]:hover:bg-[#3e2723] transition-colors",
          error: "group-[.toaster]:border-red-900/50 group-[.toaster]:bg-[#1a0505]/95",
          success: "group-[.toaster]:border-[#d4af37]/50 group-[.toaster]:bg-[#1a110d]/95",
          warning: "group-[.toaster]:border-amber-900/50",
          info: "group-[.toaster]:border-blue-900/50",
        },
      }}
      style={
        {
          "--normal-bg": "#1a110d",
          "--normal-text": "#eaddcf",
          "--normal-border": "rgba(212, 175, 55, 0.3)",
          "--border-radius": "12px",
          "--success-text": "#d4af37",
          "--error-text": "#f87171",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }