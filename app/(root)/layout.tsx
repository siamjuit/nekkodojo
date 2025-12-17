import { ReactNode } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";

const layout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const user = await currentUser();
  if (user && !user.username) redirect("/onboarding");

  return (
    <>
      <div className="min-h-screen bg-[#0f0b0a] relative selection:bg-[#d4af37] selection:text-[#1a110d]">
        <header className="fixed top-6 left-0 right-0 mx-auto w-[95%] max-w-7xl h-20 z-10 rounded-2xl border border-[#d4af37]/10 bg-[#1a110d]/40 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05), 0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300">
          <div className="w-full h-full px-6 md:px-8 flex items-center justify-between">
            <div className="shrink-0">
              <Link href="/" className="group flex items-center gap-2">
                <span className="font-black text-xl tracking-tighter text-[#eaddcf] select-none">
                  NEKO
                  <span className="text-[#d4af37] group-hover:text-white transition-colors duration-300">
                    DOJO
                  </span>
                </span>
                <span className="hidden lg:block text-[10px] text-[#5d4037] font-mono tracking-[0.2em] ml-3 pt-1 border-l border-[#3e2723] pl-3 uppercase">
                  System Online
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex flex-1 justify-center items-center">
              {/* <div className="flex gap-8 text-sm font-medium text-[#a1887f]">
                    <Link href="/dashboard" className="hover:text-[#d4af37] transition-colors">Dashboard</Link>
                    <Link href="/roadmap" className="hover:text-[#d4af37] transition-colors">Roadmap</Link>
                  </div>  */}
              <div className="w-px h-0"></div> {/* Invisible spacer for now */}
            </nav>
            <div className="shrink-0 flex items-center gap-4">
              <SignedOut>
                {/* Sign In (Secondary Ghost Style) */}
                <SignInButton>
                  <button className="hidden md:block group relative px-5 py-2 overflow-hidden rounded-sm border border-[#d4af37]/30 text-[#d4af37] font-mono text-xs tracking-[0.15em] uppercase hover:border-[#d4af37] transition-all duration-300 cursor-pointer">
                    <span className="absolute inset-0 w-0 bg-[#d4af37]/10 transition-all duration-250 ease-out group-hover:w-full"></span>
                    <span className="relative">Log In</span>
                  </button>
                </SignInButton>

                {/* Sign Up (Primary Gold Style) */}
                <SignUpButton>
                  <button className="relative px-6 py-2 bg-[#d4af37] text-[#1a110d] font-bold font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#c5a028] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer">
                    Join
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-4">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-8 h-8 border border-[#d4af37]/50 ring-2 ring-transparent hover:ring-[#d4af37]/20 transition-all",
                        userButtonPopoverCard:
                          "border border-[#5d4037] bg-[#1a110d] text-[#eaddcf]",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                  />
                  <div className="w-px h-5 bg-[#3e2723]"></div>
                  <SignOut />
                </div>
              </SignedIn>
            </div>
          </div>
        </header>
        {children}
      </div>
    </>
  );
};

export default layout;
