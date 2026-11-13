import type { Metadata } from "next";
import { Grain, Paw } from "@/components/Landing Page/DojoGraphics";

export const metadata: Metadata = {
  title: "Release Notes",
  description: "What has changed in the dojo, newest first.",
};

type Kind = "New" | "Improved" | "Fixed";

const RELEASES: {
  version: string;
  date: string;
  title: string;
  changes: { kind: Kind; text: string }[];
}[] = [
  {
    version: "1.2.0",
    date: "October 2026",
    title: "A quieter, more crafted dojo",
    changes: [
      { kind: "New", text: "Redesigned sign in and sign up with a split layout." },
      { kind: "New", text: "Member search, the archives hub and the new loading screen." },
      {
        kind: "Improved",
        text: "Question explorer: belts for difficulty and a paw stamp for solved katas.",
      },
      {
        kind: "Fixed",
        text: "Social links no longer stay in a loading state after a failed sign-in.",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "January 2026",
    title: "Shelf and bookmarks",
    changes: [
      { kind: "New", text: "The Shelf: mark problems as later, revisit, important or stuck." },
      { kind: "New", text: "Saved scrolls for bookmarking community discussions." },
      { kind: "Improved", text: "Solutions unlock only after you have attempted the kata." },
    ],
  },
  {
    version: "1.0.0",
    date: "December 2025",
    title: "The dojo opens",
    changes: [
      { kind: "New", text: "Ranked kata, progress tracking and member profiles." },
      { kind: "New", text: "Sign in with email, username, Google or GitHub." },
    ],
  },
];

const KIND_STYLE: Record<Kind, string> = {
  New: "border-[#d4af37]/60 bg-[#d4af37]/10 text-[#d4af37]",
  Improved: "border-[#8d6e63]/60 bg-[#8d6e63]/10 text-[#eaddcf]",
  Fixed: "border-emerald-700/60 bg-emerald-900/20 text-emerald-400",
};

export default function ReleaseNotesPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0f0b0a] px-6 pb-28 pt-40 text-[#eaddcf]">
      <Grain variant="tatami" strength={0.9} />

      <div className="relative mx-auto max-w-5xl">
        {                                                                          }
        <header className="mb-16 border-b border-[#5c3d21] pb-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="font-serif text-sm tracking-[0.5em] text-[#d4af37]/80">更新</span>
              <h1 className="mt-3 font-serif text-4xl font-bold tracking-wide md:text-5xl">
                Release <span className="text-[#d4af37]">Notes</span>
              </h1>
            </div>
            <p className="hidden max-w-xs text-right text-sm text-[#8d6e63] sm:block">
              A running record of what changed in the dojo, newest first.
            </p>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-[160px_1fr]">
          {                                         }
          <aside className="hidden lg:block">
            <nav aria-label="Versions" className="sticky top-32">
              <p className="mb-3 text-xs text-[#5d4037]">Versions</p>
              <ul className="space-y-1 border-l border-[#3a2318]">
                {RELEASES.map((r) => (
                  <li key={r.version}>
                    <a
                      href={`#v${r.version}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 font-mono text-sm text-[#8d6e63] transition-colors hover:border-[#d4af37] hover:text-[#d4af37]"
                    >
                      v{r.version}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <nav aria-label="Versions" className="-mb-6 min-w-0 lg:hidden">
            <p className="mb-3 text-xs text-[#5d4037]">Jump to version</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {RELEASES.map((release) => (
                <a
                  key={release.version}
                  href={`#v${release.version}`}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-[#3a2318] px-3 text-sm text-[#a1887f] transition-colors hover:border-[#d4af37]/50 hover:text-[#d4af37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
                >
                  v{release.version}
                </a>
              ))}
            </div>
          </nav>

          {                                    }
          <ol className="relative">
            {              }
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[15px] top-2 w-[3px] rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, #5c3d21 0px, #5c3d21 6px, #3a2318 6px, #3a2318 9px)",
              }}
            />

            {RELEASES.map((r, i) => (
              <li
                key={r.version}
                id={`v${r.version}`}
                className="relative scroll-mt-32 pb-14 pl-14"
              >
                {                                   }
                <span
                  className={`absolute left-0 top-1 flex size-8 items-center justify-center rounded-full border bg-[#18120e] ${
                    i === 0 ? "border-[#d4af37] text-[#d4af37]" : "border-[#5c3d21] text-[#8d6e63]"
                  }`}
                >
                  <Paw className="size-4 -rotate-12" />
                </span>

                <article className="rounded-md border border-[#5c3d21] bg-[#18120e]">
                  <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#3a2318] px-6 py-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-lg font-semibold text-[#d4af37]">
                        v{r.version}
                      </span>
                      {i === 0 && (
                        <span className="rounded-sm border border-[#d4af37]/50 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-[#d4af37]">
                          Latest
                        </span>
                      )}
                    </div>
                    <time className="text-sm text-[#8d6e63]">{r.date}</time>
                  </header>

                  <div className="px-6 py-5">
                    <h2 className="font-serif text-xl font-semibold text-[#eaddcf]">{r.title}</h2>

                    {                  }
                    <ul className="mt-4 divide-y divide-dashed divide-[#3a2318]">
                      {r.changes.map((c, j) => (
                        <li key={j} className="flex items-start gap-4 py-3">
                          <span
                            className={`mt-0.5 w-[72px] shrink-0 rounded-sm border px-2 py-0.5 text-center text-[11px] font-medium ${KIND_STYLE[c.kind]}`}
                          >
                            {c.kind}
                          </span>
                          <span className="text-sm leading-relaxed text-[#a1887f]">{c.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
