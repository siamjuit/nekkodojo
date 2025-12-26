"use client";

import {
  LayoutDashboard,
  Users,
  ScrollText,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronsUpDown,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs"; // Import useClerk for sign out

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu Configuration
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Disciples",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Scrolls",
    url: "/admin/content",
    icon: ScrollText,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk(); // Hook to handle logout

  return (
    <Sidebar className="border-r border-[#3e2723] bg-[#1a110d] text-[#eaddcf]">
      {/* --- HEADER --- */}
      <SidebarHeader className="border-b border-[#3e2723] p-4 bg-[#1a110d]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3e2723]/30 text-[#d4af37]">
            <ShieldAlert size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight text-[#eaddcf]">
              NEKODOJO
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* --- CONTENT --- */}
      <SidebarContent className="bg-[#1a110d]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#5d4037] uppercase tracking-wider text-xs font-bold mt-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        transition-all duration-200 h-10
                        ${
                          isActive
                            ? "bg-[#d4af37]/10 text-[#d4af37] ring-1 ring-[#d4af37]/20 hover:bg-[#d4af37]/20 hover:text-[#d4af37]"
                            : "text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#eaddcf]"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={isActive ? "text-[#d4af37]" : "opacity-70"}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* --- FOOTER --- */}
      <SidebarFooter className="border-t border-[#3e2723] bg-[#1a110d] p-4">
        <SidebarMenu>
          {isLoaded && user && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-[#3e2723]/20 data-[state=open]:text-[#eaddcf] hover:bg-[#3e2723]/20 hover:text-[#eaddcf] transition-colors"
                  >
                    <Avatar className="h-8 w-8 rounded-lg border border-[#3e2723]">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                      />
                      <AvatarFallback className="rounded-lg bg-[#3e2723] text-[#d4af37]">
                        {user.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-[#eaddcf]">
                        {user.fullName}
                      </span>
                      <span className="truncate text-xs text-[#a1887f]">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-[#a1887f]" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                {/* Styled Dropdown Content */}
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#1a110d] border-[#3e2723] text-[#eaddcf]"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/"
                      className="cursor-pointer flex items-center gap-2 focus:bg-[#3e2723]/30 focus:text-[#d4af37]"
                    >
                      <Home className="size-4 opacity-70" />
                      Return to Dojo
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-[#3e2723]" />
                  
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 text-red-400 focus:bg-red-900/10 focus:text-red-300"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    <LogOut className="size-4 opacity-70" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}