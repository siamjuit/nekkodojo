"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Brain, ScrollText, Swords, Trophy } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function AboutHero() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const hasEntered = useInView(cardsRef, { once: true, amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();
  const shouldReveal = hasEntered || prefersReducedMotion;

  const features = [
    {
      icon: <Brain className="size-8 text-[#d4af37]" />,
      title: "Structured Mastery",
      desc: "Stop grinding random problems. Follow a battle-tested roadmap designed to build pattern recognition, not memorization.",
    },
    {
      icon: <Trophy className="size-8 text-[#d4af37]" />,
      title: "The Belt System",
      desc: "Gamify your growth. Earn belts from White to Black as you conquer data structures. Prove your worth in the arena.",
    },
    {
      icon: <Swords className="size-8 text-[#d4af37]" />,
      title: "Interview Ready",
      desc: "Focus on the 'Blind 75' and high-yield patterns used by top tech companies. Train smarter, not harder.",
    },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-32 px-6 bg-[#0f0b0a] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0f0b0a]"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 59px, #3e2723 59px, #3e2723 60px)`,
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(62,39,35,0.15)_0%,transparent_80%)]"></div>
        <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-[#0f0b0a] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-[#0f0b0a] to-transparent"></div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-linear-to-b from-transparent via-[#d4af37]/50 to-transparent"></div>
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-[#d4af37] font-mono text-xs tracking-[0.4em] uppercase opacity-80">
            Why the Dojo?
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-[#eaddcf] tracking-tight">
            FORGE YOUR <span className="text-[#d4af37]">LEGACY</span>
          </h2>
          <p className="mt-6 text-lg text-[#a1887f] max-w-2xl mx-auto font-light leading-relaxed">
            The path to full-stack mastery is cluttered with noise. NekoDojo strips away the
            distractions, leaving only the pure essence of code and logic.
          </p>
        </motion.div>
        <div ref={cardsRef} className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ x: "-100%" }}
              animate={{ x: shouldReveal ? "0%" : "-100%" }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute inset-x-0 top-1/2 z-0 hidden -translate-y-1/2 md:block"
            >
              <Image
                src="/wooden_sword.svg"
                alt=""
                width={351}
                height={94}
                className="h-auto w-full"
              />
            </motion.div>
          )}
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                borderColor: shouldReveal ? ["#3e2723", "#d4af37", "#3e2723"] : "#3e2723",
              }}
              transition={{
                borderColor: {
                  duration: 0.8,
                  delay: 0.4 + i * 0.8,
                  times: [0, 0.35, 1],
                },
              }}
              className="group relative z-10 overflow-hidden rounded-xl border p-8 transition-colors duration-500 hover:border-[#d4af37]/50"
            >
              <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-[#1a110d]/40 backdrop-blur-sm transition-colors duration-500 group-hover:bg-[#1a110d]/80" />
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: shouldReveal ? [0, 0.3, 0] : 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4 + i * 0.8,
                  times: [0, 0.35, 1],
                }}
                className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.4),transparent_72%)]"
              />
              <div className="pointer-events-none absolute inset-0 z-20 rounded-xl bg-[#d4af37]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={
                    shouldReveal
                      ? { x: "0%", opacity: 1 }
                      : { x: "-100%", opacity: 0 }
                  }
                  transition={{ duration: 0.55, delay: i * 0.72, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 md:hidden"
                >
                  <Image
                    src="/wooden_sword.svg"
                    alt=""
                    width={351}
                    height={94}
                    className="h-auto w-full"
                  />
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.8 }}
                className="relative z-30"
              >
                <div className="mb-6 p-3 w-fit rounded-lg bg-[#2c1810] border border-[#3e2723] group-hover:border-[#d4af37]/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#eaddcf] mb-3 font-mono tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-[#a1887f] leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-32 text-center"
      >
        <div className="flex flex-col items-center gap-4 opacity-30">
          <span className="text-[#d4af37] font-serif text-2xl">猫</span>
          <span className="h-12 w-px bg-[#d4af37]"></span>
        </div>
      </motion.div>
      <div className="mt-6 flex justify-center">
        <Link
          href="/code-of-bushido"
          className="group flex items-center gap-2 text-[10px] md:text-xs text-[#5d4037] hover:text-[#d4af37] transition-all duration-300 font-mono uppercase tracking-widest"
        >
          <ScrollText
            size={12}
            className="group-hover:-rotate-12 transition-transform duration-300"
          />
          <span className="relative">
            You must honor the{" "}
            <span className="text-[#8d6e63] group-hover:text-[#eaddcf] transition-colors">
              Code of Bushido
            </span>{" "}
            first
            {                               }
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-500" />
          </span>
        </Link>
      </div>
    </section>
  );
}
