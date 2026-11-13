import Link from "next/link";
import Image from "next/image";
import Github from "@/public/logos/github.svg";
import { Grain, Hanko } from "./DojoGraphics";

const NAV = [
  {
    heading: "Training",
    links: [
      { label: "Problems", href: "/problems" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Archives", href: "/archives" },
      { label: "NekkoChat", href: "/chat" },
    ],
  },
  {
    heading: "Sanctuary",
    links: [
      { label: "Community Guidelines", href: "/community-guidelines" },
      { label: "Dojo Rules", href: "/code-of-bushido" },
      { label: "Wall of Fame", href: "/wall-of-fame" },
      { label: "Release Notes", href: "/release-notes" },
    ],
  },
  {
    heading: "Developer",
    links: [
      { label: "About Developer", href: "/developers" },
      { label: "GitHub Repository", href: "https://github.com/siamjuit/nekkodojo", external: true },
      { label: "System Status", href: "/status" },
    ],
  },
];

const SOCIALS = {
  github: "https://github.com/Aenansh",
  linkedIn: "https://www.linkedin.com/in/aenansh",
  x: "https://x.com/kj00_00",
};

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#120d0a] text-[#eaddcf]">
      <Grain variant="hinoki" strength={0.6} />

      {                          }
      <div className="absolute inset-x-0 top-0 h-px bg-[#5c3d21]" />
      <div className="absolute inset-x-0 top-px h-px bg-linear-to-r from-transparent via-[#d4af37]/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6 pb-8 pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {                                           }
          <div className="space-y-5 lg:col-span-4">
            <Link href="/" className="inline-block">
              <span className="font-brand font-black text-xl tracking-tighter text-[#eaddcf] select-none">
                NEKKO
                <span className="text-[#d4af37] group-hover:text-white transition-colors duration-300">
                  DOJO
                </span>
              </span>
            </Link>

            <div className="flex items-start gap-4">
              <Hanko char="猫" className="size-11 text-xl" />
              <p className="max-w-[16rem] pt-0.5 font-serif italic leading-snug text-[#a1887f]">
                Forging algorithmic sharpness in quiet discipline.
              </p>
            </div>
          </div>

          {                                      }
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {NAV.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-4 font-serif text-sm tracking-wide text-[#d4af37]">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...("external" in link && link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group relative inline-block text-sm text-[#a1887f] transition-colors hover:text-[#eaddcf]"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#d4af37] transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {                                                }
          <div className="flex flex-col items-start gap-6 lg:col-span-3 lg:items-end">
            <div className="flex items-center gap-2">
              <SocialLink href={SOCIALS.github} label="GitHub">
                <Image src={Github} alt="" width={18} height={18} className="invert opacity-80" />
              </SocialLink>
              <SocialLink href={SOCIALS.linkedIn} label="LinkedIn">
                <Image
                  src={"/logos/linkedIn.svg"}
                  alt="linkedIn"
                  width={18}
                  height={18}
                  className="opacity-80"
                />
              </SocialLink>
              <SocialLink href={SOCIALS.x} label="X (Twitter)">
                <Image src="/logos/x.svg" alt="x" width={12} height={12} className="opacity-80" />
              </SocialLink>
            </div>
          </div>
        </div>

        {                                      }
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#3a2318] pt-6 text-xs text-[#8d6e63] md:flex-row">
          <p>&copy; {new Date().getFullYear()} NekkoDojo. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-[#d4af37]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#d4af37]">
              Terms
            </Link>
          </div>
          <p className="text-[#5d4037]">Crafted with discipline for developers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-md border border-[#5c3d21] bg-[#18120e] text-[#a1887f] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:text-[#d4af37]"
    >
      {children}
    </a>
  );
}
