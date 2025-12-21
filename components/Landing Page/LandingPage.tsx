"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { catPaths } from "@/constants/animation-constants";

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 2.2, duration: 1.0 },
  },
};

const CatSilhouette = ({
  className,
  poseIndex = 0,
}: {
  className?: string;
  poseIndex?: number;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={catPaths[poseIndex % catPaths.length]} />
  </svg>
);

export default function LandingPage() {
  const [backgroundElements, setBackgroundElements] = useState<
    {
      type: "particle" | "cat";
      top: string;
      left: string;
      duration: number;
      delay: number;
      scale?: number;
      rotation?: number;
      poseIndex?: number;
    }[]
  >([]);

  useEffect(() => {
    const elements = [
      ...[...Array(8)].map((_, i) => ({
        type: "particle" as const,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 5 + 5,
        delay: i,
      })),
      ...[...Array(7)].map((_, i) => ({
        type: "cat" as const,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        duration: Math.random() * 10 + 15,
        delay: i * 1.5,
        scale: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 30 - 15,
        poseIndex: Math.floor(Math.random() * catPaths.length),
      })),
    ];
    setBackgroundElements(elements);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#120c0a]">
        <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[radial-gradient(circle_at_center,rgba(62,39,35,0.4)_0%,rgba(10,5,3,1)_60%)]"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 40%, rgba(0,0,0,1) 100%)`,
            backgroundSize: "60px 100%",
          }}
        ></div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((el, i) => {
          if (el.type === "particle") {
            return (
              <motion.div
                key={`part-${i}`}
                className="absolute w-1 h-1 bg-amber-100 rounded-full blur-[1px] opacity-40"
                animate={{ y: [0, -100], opacity: [0, 0.5, 0] }}
                transition={{ duration: el.duration, repeat: Infinity, delay: el.delay }}
                style={{ left: el.left, top: el.top }}
              />
            );
          }
          return (
            <motion.div
              key={`cat-${i}`}
              className="absolute text-[#d4af37] opacity-10 mix-blend-screen"
              style={{ left: el.left, top: el.top, scale: el.scale, rotate: el.rotation }}
              animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.05, 0.15, 0.05] }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: el.delay,
              }}
            >
              <CatSilhouette className="w-24 h-24" poseIndex={el.poseIndex} />
            </motion.div>
          );
        })}
      </div>
      <motion.div
        className="z-10 text-center px-6 relative max-w-7xl w-full"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <div className="mb-4">
          <span className="text-[#d4af37] text-sm tracking-[0.5em] opacity-80 font-serif">
            アルゴリズムを極める
          </span>
        </div>
        <div className="relative group inline-block">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-[#eaddcf] mix-blend-screen drop-shadow-[0_0_15px_rgba(234,221,207,0.1)] whitespace-nowrap">
            NEKO
            <span className="text-[#d4af37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
              DOJO
            </span>
          </h1>
          <h1 className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-[#d4af37] opacity-0 group-hover:opacity-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300 pointer-events-none select-none whitespace-nowrap">
            NEKO<span className="">DOJO</span>
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4 my-8 opacity-50">
          <div className="h-px w-12 bg-[#d4af37]"></div>
          <span className="text-[#d4af37] font-serif text-lg">猫</span>
          <div className="h-px w-12 bg-[#d4af37]"></div>
        </div>
        <p className="text-lg md:text-2xl font-light text-[#a1887f] max-w-3xl mx-auto leading-relaxed">
          Enhance your{" "}
          <span className="text-[#eaddcf] font-medium border-b border-[#d4af37]/30">
            Data Structures & Algorithms
          </span>{" "}
          skills
          <br className="hidden md:block" />
          in the sanctuary of code.
        </p>
        <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center items-center">
          <Link
            href="/sign-in"
            className="relative px-12 py-4 bg-[#2c1810] border border-[#5d4037] text-[#d4af37] tracking-[0.2em] font-bold uppercase hover:bg-[#3e2723] hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500 clip-path-slant"
          >
            Enter Dojo
          </Link>
        </div>
      </motion.div>
      <div className="absolute left-6 bottom-0 hidden lg:block pb-12 z-10">
        <div className="writing-vertical-rl text-[#3e2723] text-opacity-40 text-sm tracking-[0.8em] font-mono h-48 border-l border-[#3e2723]/20 pl-4">
          継続は力なり
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-[#3e2723] text-xs tracking-[0.4em] font-mono opacity-50">
          EST. 2025 // AENANSH
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-30"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-[#d4af37]/60 size-5" />
        </motion.div>
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-48 bg-linear-to-b from-[#0f0b0a] via-[#0f0b0a]/90 to-transparent pointer-events-none z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-[#0f0b0a] via-[#0f0b0a]/90 to-transparent pointer-events-none z-20"></div>
    </main>
  );
}