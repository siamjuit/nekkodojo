"use client";

import {
  LayoutDashboard,
  Users,
  ScrollText,
  ShieldAlert,
  LogOut,
  ChevronsUpDown,
  Home,
  MessageSquareWarning,
  Feather,
  MessageSquareText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

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

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // 1. DETERMINE BASE PATH
  // If the user is on a /moderator page, use "/moderator" base. Otherwise "/admin".
  const isModeratorPath = pathname.startsWith("/moderator");
  const basePath = isModeratorPath ? "/moderator" : "/admin";

  // Helper to safely get the user's role
  const userRole = (user?.publicMetadata.role as string) || "user";

  // 2. DYNAMIC ITEMS CONFIGURATION
  // We recreate this array on every render so 'basePath' is always correct.
  const items = [
    {
      title: "Dashboard",
      url: `${basePath}/dashboard`, // e.g. /moderator/dashboard
      icon: LayoutDashboard,
      allowedRoles: ["admin", "moderator"],
    },
    {
      title: "Disciples",
      url: `${basePath}/users`,
      icon: Users,
      allowedRoles: ["admin"], // Admin Only
    },
    {
      title: "Scrolls",
      url: `${basePath}/content`,
      icon: ScrollText,
      allowedRoles: ["admin", "moderator"], // Both
    },
    {
      title: "Inscriptions", // Thematic name for Comments
      url: `${basePath}/comments`,
      icon: MessageSquareText,
      allowedRoles: ["admin", "moderator"],
    },
    {
      title: "Reports",
      url: `${basePath}/reports`,
      icon: MessageSquareWarning,
      allowedRoles: ["admin", "moderator"], // Both
    },
    {
      title: "Add Katas",
      url: `${basePath}/questions`,
      icon: Feather,
      allowedRoles: ["admin"],
    },
  ];

  return (
    <Sidebar className="border-r border-[#3e2723] bg-[#1a110d] text-[#eaddcf]">
      {/* --- HEADER --- */}
      <SidebarHeader className="border-b border-[#3e2723] p-4 bg-[#1a110d]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3e2723]/30 text-[#d4af37]">
            <ShieldAlert size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight text-[#eaddcf]">NEKODOJO</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              {/* Dynamic Label based on Path */}
              {isModeratorPath ? "Moderator Panel" : "Admin Panel"}
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
                // 3. ACTIVE STATE CHECK
                // Since item.url now includes the correct base path, exact matching works
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

                // 4. PERMISSION CHECK
                if (!item.allowedRoles.includes(userRole)) {
                  return null;
                }

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
                        <item.icon className={isActive ? "text-[#d4af37]" : "opacity-70"} />
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

      <SidebarFooter className="border-t border-[#3e2723] bg-[#1a110d] p-4">
        {/* ... Footer logic remains exactly the same ... */}
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
                      <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                      <AvatarFallback className="rounded-lg bg-[#3e2723] text-[#d4af37]">
                        {user.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-[#eaddcf]">{user.fullName}</span>
                      <span className="truncate text-xs text-[#a1887f]">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-[#a1887f]" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#1a110d] border-[#3e2723] text-[#eaddcf]"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild className="focus:bg-[#3e2723]/30 focus:text-[#d4af37]">
                    <Link
                      href="/"
                      className="cursor-pointer flex items-center gap-2"
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
