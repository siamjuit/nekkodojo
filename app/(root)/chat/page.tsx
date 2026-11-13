import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Hammer, MessageCircle, Sparkles } from "lucide-react";

const workNotes = [
  "Laying down fresh tatami",
  "Tuning the chat rooms",
  "Keeping the cats on task (mostly)",
];

export const metadata = {
  title: "NekkoChat Under Construction",
  description: "NekkoChat is taking a little time in the workshop. The dojo cats are on it.",
};

export default function ChatPage() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-7rem)] w-full items-center overflow-hidden px-5 py-12 sm:px-8 lg:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(104,62,35,0.24),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(90deg,transparent 49%,#d4af37 50%,transparent 51%)", backgroundSize: "84px 100%" }} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="relative z-10 order-2 lg:order-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/25 bg-[#1a110d]/75 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#d4af37] uppercase shadow-lg shadow-black/20">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#d4af37] opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-[#d4af37]" />
            </span>
            Workshop in progress
          </div>

          <p className="mb-3 font-mono text-xs tracking-[0.32em] text-[#a1887f] uppercase">NekkoDojo · NekkoChat</p>
          <h1 className="max-w-xl text-5xl leading-[1.02] font-black tracking-tight text-[#eaddcf] sm:text-6xl xl:text-7xl">
            A little more
            <span className="mt-2 block text-[#d4af37]">pawlishing.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#c4ab9c] sm:text-lg">
            NekkoChat is taking a short break while we get the dojo ready. Our resident builders are hard at work—and only slightly distracted by the sunbeam.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#d4af37]/20 bg-[#1a110d]/75 px-4 py-3 text-sm text-[#eaddcf]">
              <Hammer className="size-4 text-[#d4af37]" />
              Under construction
            </div>
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#d4af37]/20 bg-[#1a110d]/75 px-4 py-3 text-sm text-[#eaddcf]">
              <MessageCircle className="size-4 text-[#d4af37]" />
              Chat is resting
            </div>
          </div>

          <div className="mt-9 max-w-lg border-l-2 border-[#d4af37]/55 pl-5">
            <p className="font-serif text-sm italic text-[#a1887f]">Today’s training plan</p>
            <ul className="mt-3 space-y-2">
              {workNotes.map((note, index) => (
                <li key={note} className="flex items-center gap-3 text-sm text-[#eaddcf]/85">
                  <span className="font-mono text-xs text-[#d4af37]/75">0{index + 1}</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <Link href="/" className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-[#d4af37] transition-colors hover:text-[#f0d976]">
            <ArrowLeft className="size-4" /> Back to the dojo
          </Link>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-2xl lg:order-2">
          <div className="absolute -inset-4 rounded-[2rem] bg-[#d4af37]/6 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#1a110d] p-2 shadow-[0_28px_90px_-34px_rgba(0,0,0,0.9)] sm:p-3">
            <div className="relative aspect-[1.38] overflow-hidden rounded-xl">
              <Image src="/construction.png" alt="A quiet wooden dojo among cherry blossoms, with a cat waiting on the engawa" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-linear-to-t from-[#100b08]/85 via-[#100b08]/5 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-[#160f0b]/75 px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#f2e6d5] uppercase backdrop-blur-md sm:left-6 sm:top-6 sm:text-xs">
                <Sparkles className="size-3.5 text-[#d4af37]" /> The dojo is getting ready
              </div>
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between sm:bottom-6 sm:left-7 sm:right-7">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.28em] text-[#d4af37] uppercase">Quiet work, careful craft</p>
                  <p className="mt-1 font-serif text-xl text-[#fff6e8] sm:text-2xl">Doors opening soon</p>
                </div>
                <span className="hidden rounded-sm border border-[#d4af37]/30 bg-[#160f0b]/70 px-3 py-2 font-mono text-xs text-[#eaddcf] sm:block">道場</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
