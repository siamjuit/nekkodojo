"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "18rem",
          "--sidebar-bg": "#1a110d",
          "--sidebar-fg": "#eaddcf",
          "--sidebar-border": "#3e2723",
          "--sidebar-accent": "#3e2723",
          "--sidebar-accent-foreground": "#d4af37",
          "--sidebar-ring": "#d4af37",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full bg-[#0f0b0a] text-[#eaddcf]">
        {/* The Sidebar Component */}
        <AppSidebar />

        {/* Main Content Area (Inset handles the width calculation automatically) */}
        <SidebarInset className="relative flex flex-col flex-1 overflow-hidden bg-[#0f0b0a]">
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#d4af37]/5 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3e2723]/10 blur-[120px]" />
          </div>

          {/* Sticky Header with Sidebar Trigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#3e2723] bg-[#1a110d]/50 px-4 backdrop-blur-sm sticky top-0 z-20">
            <SidebarTrigger className="text-[#d4af37] hover:bg-[#3e2723]/30" />
            <div className="h-4 w-px bg-[#3e2723] mx-2" />
            <span className="text-sm font-medium text-[#a1887f] font-mono tracking-wide">
              Admin Dashboard
            </span>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
