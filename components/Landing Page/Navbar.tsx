import SignOut from "./SignOut";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="fixed top-6 left-0 right-0 mx-auto w-[95%] max-w-7xl h-20 z-40 rounded-2xl border border-[#d4af37]/10 bg-[#1a110d]/40 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05), 0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300">
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
          <div className="flex gap-8 text-sm font-medium text-[#a1887f]">
            <Link href={"/"} className="hover:text-[#d4af37] transition-colors">
              Home
            </Link>
            <Link href={"/profile"} className="hover:text-[#d4af37] transition-colors">
              Profile
            </Link>
            <Link href="/problems" className="hover:text-[#d4af37] transition-colors">
              Problems
            </Link>
            <Link href="/discussions" className="hover:text-[#d4af37] transition-colors">
              Discussions
            </Link>
            <Link href="/dashboard" className="hover:text-[#d4af37] transition-colors">
              Dashboard
            </Link>
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
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 border border-[#d4af37]/50 ring-2 ring-transparent hover:ring-[#d4af37]/20 transition-all",
                    userButtonPopoverCard: "border border-[#5d4037] bg-[#1a110d] text-[#eaddcf]",
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
  );
};

export default Navbar;
