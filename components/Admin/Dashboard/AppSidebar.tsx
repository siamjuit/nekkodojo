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
  Layers,
  Tag,
  Building2,
  Plus,
  List,
  Key,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const isModeratorPath = pathname.startsWith("/moderator");
  const basePath = isModeratorPath ? "/moderator" : "/admin";
  const userRole = (user?.publicMetadata.role as string) || "user";

  // --- CONFIGURATION ---
  const items = [
    {
      title: "Dashboard",
      url: `${basePath}/dashboard`,
      icon: LayoutDashboard,
      allowedRoles: ["admin", "moderator"],
    },
    {
      title: "Disciples",
      url: `${basePath}/users`,
      icon: Users,
      allowedRoles: ["admin"],
    },
    {
      title: "Scrolls",
      url: `${basePath}/content`,
      icon: ScrollText,
      allowedRoles: ["admin", "moderator"],
    },
    {
      title: "Inscriptions",
      url: `${basePath}/comments`,
      icon: MessageSquareText,
      allowedRoles: ["admin", "moderator"],
    },
    {
      title: "Reports",
      url: `${basePath}/reports`,
      icon: MessageSquareWarning,
      allowedRoles: ["admin", "moderator"],
    },
    {
      title: "Katas",
      url: `${basePath}/questions`, // Parent URL (optional if using sub-items)
      icon: Feather,
      allowedRoles: ["admin"],
      // 1. NESTED SUB-ITEMS
      subItems: [
        {
          title: "All Questions",
          url: `${basePath}/questions`,
          icon: List,
        },
        {
          title: "Create New",
          url: `${basePath}/questions/create`,
          icon: Plus,
        },
        {
          title: "Categories",
          url: `${basePath}/questions/category`,
          icon: Layers,
        },
        {
          title: "Discussion Tags",
          url: `${basePath}/questions/tag`,
          icon: Tag,
        },
        {
          title: "Companies",
          url: `${basePath}/questions/company`,
          icon: Building2,
        },
      ],
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
            <span className="font-black tracking-tight text-[#eaddcf]">NEKKODOJO</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
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
                // Permission Check
                if (!item.allowedRoles.includes(userRole)) return null;

                // 2. CHECK IF PARENT IS ACTIVE
                // Used to keep the collapsible open if we are visiting a sub-route
                const isParentActive = pathname.startsWith(item.url);

                // --- RENDER NESTED ITEM (KATAS) ---
                if (item.subItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isParentActive} // Auto-open if we are in this section
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isParentActive}
                            className={`
                              transition-all duration-200 h-10
                              ${
                                isParentActive
                                  ? "bg-[#3e2723]/30 text-[#d4af37]"
                                  : "text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#eaddcf]"
                              }
                            `}
                          >
                            <item.icon className={isParentActive ? "text-[#d4af37]" : "opacity-70"} />
                            <span className="font-medium">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-l-[#3e2723]">
                            {item.subItems.map((subItem) => {
                              const isSubActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className={`
                                      h-9 text-xs transition-colors
                                      ${
                                        isSubActive
                                          ? "text-[#d4af37] bg-[#d4af37]/10"
                                          : "text-[#a1887f] hover:text-[#eaddcf] hover:bg-transparent"
                                      }
                                    `}
                                  >
                                    <Link href={subItem.url} className="flex items-center gap-2">
                                      {/* Optional: Show small icons for sub-items too */}
                                      {subItem.icon && <subItem.icon className="w-3 h-3 opacity-70" />}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // --- RENDER STANDARD ITEM ---
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
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
                  <DropdownMenuItem asChild className="focus:bg-[#3e2723]/30 focus:text-[#d4af37]">
                    <Link
                      href="/auth/update"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Key className="size-4 opacity-70" />
                      Change Sudo Password
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