"use client";

import SignOut from "./SignOut";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
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

const Navbar = () => {
  const { user } = useUser();
  // 2. Get current path
  const pathname = usePathname();
  return (
    <header className="fixed top-6 left-0 right-0 mx-auto w-[95%] max-w-7xl h-20 z-40 rounded-2xl border border-[#d4af37]/10 bg-[#1a110d]/40 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05), 0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300">
      <div className="w-full h-full px-6 md:px-8 flex items-center justify-between">
        <div className="shrink-0">
          <Link
            href={user ? `/member/${user.username}` : "/"}
            className="group flex items-center gap-2"
          >
            <span className="font-black text-xl tracking-tighter text-[#eaddcf] select-none">
              NEKKO
              <span className="text-[#d4af37] group-hover:text-white transition-colors duration-300">
                DOJO
              </span>
            </span>
            <span className="hidden lg:block text-[10px] text-[#5d4037] font-mono tracking-[0.2em] ml-3 pt-1 border-l border-[#3e2723] pl-3 uppercase">
              System Online
            </span>
          </Link>
        </div>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:flex flex-1 justify-center items-center">
          <div className="flex gap-2 text-sm font-medium text-[#a1887f]">
            {NavLinks.map((navLink) => {
              let href = navLink.url;
              if (user) {
                if (navLink.name === "Profile" && user.username) {
                  href = navLink.url + `/${user.username}`;
                }
              }
              const isActive = pathname === href;

              return (
                <Link
                  key={navLink.name}
                  href={href}
                  className={`
                      px-4 py-2 rounded-lg transition-all duration-300
                      ${
                        isActive
                          ? "text-[#d4af37] bg-[#d4af37]/10 font-bold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                          : "text-[#a1887f] hover:text-[#d4af37] hover:bg-[#d4af37]/5"
                      }
                    `}
                >
                  {navLink.name}
                </Link>
              );
            })}
            {user?.publicMetadata.role === "admin" || user?.publicMetadata.role === "moderator" ? (
              <Link
                href={
                  user.publicMetadata.role === "admin" ? "/admin/dashboard" : "/moderator/dashboard"
                }
                className={`
                    px-4 py-2 rounded-lg transition-all duration-300
                    ${
                      pathname.includes("/dashboard")
                        ? "text-[#d4af37] bg-[#d4af37]/10 font-bold"
                        : "text-[#a1887f] hover:text-[#d4af37] hover:bg-[#d4af37]/5"
                    }
                  `}
              >
                Dashboard
              </Link>
            ) : (
              ""
            )}
          </div>
          <div className="w-px h-0"></div>
        </nav>

        <div className="shrink-0 flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="hidden md:block group relative px-5 py-2 overflow-hidden rounded-sm border border-[#d4af37]/30 text-[#d4af37] font-mono text-xs tracking-[0.15em] uppercase hover:border-[#d4af37] transition-all duration-300 cursor-pointer">
                <span className="absolute inset-0 w-0 bg-[#d4af37]/10 transition-all duration-250 ease-out group-hover:w-full"></span>
                <span className="relative">Log In</span>
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="relative px-6 py-2 bg-[#d4af37] text-[#1a110d] font-bold font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#c5a028] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer">
                Join
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4" suppressHydrationWarning={true}>
              <div className="min-w-8 min-h-8">
                {user ? (
                  <>
                    <Link href={`/member/${user.username}`}>
                      <Image
                        src={user.imageUrl}
                        alt={user.username || "profile_image"}
                        className="w-8 h-8 rounded-full border border-[#d4af37]/50 ring-2 ring-transparent hover:ring-[#d4af37]/20 transition-all"
                        width={32}
                        height={32}
                      />
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="w-px h-5 bg-[#3e2723]"></div>
              <SignOut />
            </div>
          </SignedIn>

          {/* --- MOBILE NAV --- */}
          <div className="block md:hidden">
            <Menubar className="border-none bg-transparent p-0">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer bg-transparent data-[state=open]:bg-[#d4af37]/10 p-2 rounded-md text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors focus:bg-[#d4af37]/10">
                  <MenuIcon size={24} />
                </MenubarTrigger>

                <MenubarContent
                  align="end"
                  className="min-w-[200px] mt-2 z-60 bg-[#1a110d]/95 backdrop-blur-xl border border-[#3e2723] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] rounded-xl p-2 mr-4"
                >
                  {user && (
                    <MenubarLabel className="text-xs font-mono text-[#a1887f] uppercase tracking-wider px-2 py-1.5">
                      Click to visit
                    </MenubarLabel>
                  )}
                  {user ? (
                    NavLinks.map((navLink) => {
                      const Icon = navLink.icon;
                      // Mobile Active Logic
                      let href = navLink.url;
                      if (user) {
                        if (navLink.name === "Profile" && user.username) {
                          href = navLink.url + `/${user.username}`;
                        }
                      }
                      const isActive = pathname === href;

                      return (
                        <div key={navLink.name}>
                          <MenubarSeparator className="bg-[#3e2723]/50 my-1" />
                          <MenubarItem
                            asChild
                            className={`
                              cursor-pointer rounded-lg px-3 py-2.5 my-0.5
                              ${
                                isActive
                                  ? "bg-[#d4af37]/10 text-[#d4af37]"
                                  : "text-[#eaddcf] focus:bg-[#d4af37]/10 focus:text-[#d4af37]"
                              }
                            `}
                          >
                            <Link
                              href={href}
                              className="flex items-center gap-3 font-mono text-sm tracking-wide"
                            >
                              <Icon size={16} className={isActive ? "opacity-100" : "opacity-70"} />
                              {navLink.name}
                            </Link>
                          </MenubarItem>
                        </div>
                      );
                    })
                  ) : (
                    <MenubarItem
                      asChild
                      className="focus:bg-[#d4af37]/10 focus:text-[#d4af37] text-[#eaddcf] cursor-pointer rounded-lg px-3 py-2.5 my-0.5"
                    >
                      <Link href={"/guest"}>
                        <UserCircleIcon size={16} className="opacity-70" />
                        Join as guest
                      </Link>
                    </MenubarItem>
                  )}
                  {/* ... (Admin/Moderator logic remains mostly same, can apply similar highlighting if desired) ... */}
                  {user?.publicMetadata.role === "admin" ||
                  user?.publicMetadata.role === "moderator" ? (
                    <>
                      <MenubarSeparator className="bg-[#3e2723]/50 my-1" />
                      <MenubarItem
                        asChild
                        className="focus:bg-[#d4af37]/10 focus:text-[#d4af37] text-[#eaddcf] cursor-pointer rounded-lg px-3 py-2.5 my-0.5"
                      >
                        <Link
                          href={
                            user.publicMetadata.role === "admin"
                              ? "/admin/dashboard"
                              : "/moderator/dashboard"
                          }
                        >
                          <LayoutDashboard size={16} className="opacity-70" />
                          Dashboard
                        </Link>
                      </MenubarItem>
                    </>
                  ) : (
                    ""
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
