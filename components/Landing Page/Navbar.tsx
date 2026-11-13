"use client";

import SignOut from "./SignOut";
import { SignInButton, SignUpButton, useUser, Show } from "@clerk/nextjs";
import { LayoutDashboard, MenuIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { NavLinks } from "@/constants/nav-links";
import Image from "next/image";

const tatamiStyle: React.CSSProperties = {
  backgroundColor: "rgba(18, 12, 10, 0.78)",
  backgroundImage: [
    "repeating-linear-gradient(0deg, rgba(234,221,207,0.025) 0px, rgba(234,221,207,0.025) 1px, transparent 1px, transparent 4px)",
    "repeating-linear-gradient(90deg, rgba(212,175,55,0.025) 0px, rgba(212,175,55,0.025) 1px, transparent 1px, transparent 32px)",
    "linear-gradient(135deg, rgba(62,39,35,0.18), rgba(15,11,10,0.12))",
  ].join(", "),
  backdropFilter: "blur(12px)",
};

const tabBase =
  "relative px-4 py-2 rounded-sm text-sm font-medium transition-all duration-300 ease-out " +
  "after:absolute after:left-3 after:right-3 after:bottom-0.5 after:h-0.5 after:origin-center " +
  "after:bg-[#d4af37] after:transition-transform after:duration-300 after:ease-out " +
  "hover:bg-[#0f0b0a]/30 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)] hover:text-[#d4af37] hover:after:scale-x-100";

const tabClass = (active: boolean) =>
  `${tabBase} ${active ? "text-[#d4af37] after:scale-x-100" : "text-[#c4ab9c] after:scale-x-0"}`;

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const userAvatarSrc = user?.imageUrl?.trim() ? user.imageUrl : null;
  const userProfileHref = user?.username ? `/member/${user.username}` : "/";
  const isStaff =
    user?.publicMetadata.role === "admin" || user?.publicMetadata.role === "moderator";
  const dashboardHref =
    user?.publicMetadata.role === "admin" ? "/admin/dashboard" : "/moderator/dashboard";

  return (
    <header
      style={tatamiStyle}
      className="fixed top-6 left-0 right-0 mx-auto w-[95%] max-w-7xl h-20 z-40 rounded-2xl overflow-hidden
                 border border-[#d4af37]/10 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(234,221,207,0.06)]"
    >
      <div className="absolute inset-x-6 top-0.5 h-px bg-linear-to-r from-transparent via-[#d4af37]/20 to-transparent" />
      <div className="absolute inset-x-6 bottom-0.5 h-px bg-linear-to-r from-transparent via-[#d4af37]/10 to-transparent" />

      <div className="relative w-full h-full px-6 md:px-8 pt-2 pb-2 flex items-center justify-between">
        <div className="shrink-0">
          <Link
            href={user ? `/member/${user.username}` : "/"}
            className="group flex items-center gap-2"
          >
            <span className="font-brand font-black text-xl tracking-tighter text-[#eaddcf] select-none">
              NEKKO
              <span className="text-[#d4af37] group-hover:text-white transition-colors duration-300">
                DOJO
              </span>
            </span>
          </Link>
        </div>

        {                         }
        <nav className="hidden lg:flex flex-1 justify-center items-center">
          <div className="flex gap-1">
            {NavLinks.map((navLink) => {
              let href = navLink.url;
              if (user && navLink.name === "Profile" && user.username) {
                href = navLink.url + `/${user.username}`;
              }
              return (
                <Link key={navLink.name} href={href} className={tabClass(pathname === href)}>
                  {navLink.name}
                </Link>
              );
            })}
            {isStaff && (
              <Link href={dashboardHref} className={tabClass(pathname.includes("/dashboard"))}>
                Dashboard
              </Link>
            )}
          </div>
        </nav>

        <div className="shrink-0 flex items-center gap-3">
          {                        }
          {isLoaded && (
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button className={`${tabBase} hidden md:block text-[#eaddcf] cursor-pointer`}>
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="px-5 py-2 rounded-sm bg-[#d4af37] text-[#1a110d] text-sm font-semibold hover:bg-[#c5a028] active:translate-y-px transition-all duration-200 cursor-pointer">
                  Join
                </button>
              </SignUpButton>
            </Show>
          )}

          {                       }
          {isLoaded && (
            <Show when="signed-in">
              <div className="flex items-center gap-4" suppressHydrationWarning={true}>
                <div className="min-w-8 min-h-8">
                  {user && (
                    <Link
                      href={userProfileHref}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#1a110d] text-[#d4af37] ring-2 ring-transparent transition-all hover:ring-[#d4af37]/30"
                    >
                      {userAvatarSrc ? (
                        <Image
                          src={userAvatarSrc}
                          alt={user.username || "profile_image"}
                          className="h-auto w-8 rounded-full object-cover"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <UserCircleIcon size={20} aria-hidden="true" />
                      )}
                    </Link>
                  )}
                </div>
                <div className="w-px h-5 bg-[#d4af37]/20" />
                <SignOut />
              </div>
            </Show>
          )}

          {                        }
          <div className="block lg:hidden">
            <Menubar className="border-none bg-transparent p-0">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer bg-transparent data-[state=open]:bg-[#0f0b0a]/40 data-[state=open]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)] p-2 rounded-sm text-[#d4af37] hover:bg-[#0f0b0a]/30 transition-colors focus:bg-[#0f0b0a]/30">
                  <MenuIcon size={24} />
                </MenubarTrigger>

                <MenubarContent
                  align="end"
                  style={tatamiStyle}
                  className="min-w-[200px] mt-3 z-60 border border-[#d4af37]/10 shadow-[0_18px_30px_-12px_rgba(0,0,0,0.85)] rounded-xl p-2 mr-4"
                >
                  {user && (
                    <MenubarLabel className="text-xs font-mono text-[#a1887f] uppercase tracking-wider px-2 py-1.5">
                      Click to visit
                    </MenubarLabel>
                  )}
                  {user ? (
                    NavLinks.map((navLink) => {
                      const Icon = navLink.icon;
                      let href = navLink.url;
                      if (navLink.name === "Profile" && user.username) {
                        href = navLink.url + `/${user.username}`;
                      }
                      const isActive = pathname === href;

                      return (
                        <div key={navLink.name}>
                          <MenubarSeparator className="bg-[#d4af37]/10 my-1" />
                          <MenubarItem
                            asChild
                            className={`cursor-pointer rounded-sm px-3 py-2.5 my-0.5 ${
                              isActive
                                ? "bg-[#0f0b0a]/40 text-[#d4af37] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)]"
                                : "text-[#eaddcf] focus:bg-[#0f0b0a]/30 focus:text-[#d4af37] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)]"
                            }`}
                          >
                            <Link href={href} className="flex items-center gap-3 text-sm">
                              <Icon size={16} className={isActive ? "opacity-100" : "opacity-70"} />
                              {navLink.name}
                            </Link>
                          </MenubarItem>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <MenubarItem
                        asChild
                        className="focus:bg-[#0f0b0a]/30 focus:text-[#d4af37] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)] text-[#eaddcf] cursor-pointer rounded-sm px-3 py-2.5 my-0.5"
                      >
                        <Link href="/sign-in">
                          <UserCircleIcon size={16} className="opacity-70" />
                          Log in
                        </Link>
                      </MenubarItem>
                      <MenubarItem
                        asChild
                        className="focus:bg-[#0f0b0a]/30 focus:text-[#d4af37] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)] text-[#eaddcf] cursor-pointer rounded-sm px-3 py-2.5 my-0.5"
                      >
                        <Link href="/guest">
                          <UserCircleIcon size={16} className="opacity-70" />
                          Join as guest
                        </Link>
                      </MenubarItem>
                    </>
                  )}
                  {isStaff && (
                    <>
                      <MenubarSeparator className="bg-[#d4af37]/10 my-1" />
                      <MenubarItem
                        asChild
                        className="focus:bg-[#0f0b0a]/30 focus:text-[#d4af37] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)] text-[#eaddcf] cursor-pointer rounded-sm px-3 py-2.5 my-0.5"
                      >
                        <Link href={dashboardHref}>
                          <LayoutDashboard size={16} className="opacity-70" />
                          Dashboard
                        </Link>
                      </MenubarItem>
                    </>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
