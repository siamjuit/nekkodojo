"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 2.2, duration: 1.0 },
  },
};

function Leaf({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path
        d="M12 23 L12.8 13 C 5 13, 1.5 8, 2 3 C 5 4.5, 8.5 3.5, 12 2 C 15.5 3.5, 19 4.5, 22 3 C 22.5 8, 19 13, 12.8 13 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Floater =
  | {
      type: "firefly";
      top: string;
      left: string;
      duration: number;
      delay: number;
      dx: number[];
      dy: number[];
    }
  | {
      type: "leaf";
      left: string;
      duration: number;
      delay: number;
      size: number;
      sway: number;
      color: string;
      spin: number;
    };

const LEAF_COLORS = ["#d4af37", "#c5851f", "#a1773a", "#8d6e63"];
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function DojoInterior() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#8b6042]">
      <Image
        src="/scene.svg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-[1.08] object-cover object-center mix-blend-multiply opacity-90"
        style={{ filter: "sepia(0.22) saturate(0.85) brightness(1.08)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-[#0f0b0a]/55 via-[#0f0b0a]/20 to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  const [backgroundElements, setBackgroundElements] = useState<Floater[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const elements: Floater[] = [
        ...Array.from(
          { length: 16 },
          (_, i): Floater => ({
            type: "firefly",
            top: `${rand(28, 96)}%`,
            left: `${rand(2, 98)}%`,
            duration: rand(7, 13),
            delay: i * 0.6,
            dx: [0, rand(-60, 60), rand(-60, 60), 0],
            dy: [0, rand(-50, 20), rand(-50, 20), 0],
          })
        ),
        ...Array.from(
          { length: 10 },
          (_, i): Floater => ({
            type: "leaf",
            left: `${rand(0, 100)}%`,
            duration: rand(16, 28),
            delay: i * 2.2,
            size: rand(14, 26),
            sway: rand(40, 110),
            color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
            spin: rand(180, 420) * (Math.random() > 0.5 ? 1 : -1),
          })
        ),
      ];
      setBackgroundElements(elements);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);
  const { user } = useUser();
  return (
    <main className="relative -mt-24 min-h-[calc(100vh+6rem)] w-full flex flex-col items-center justify-center overflow-hidden pt-24 sm:-mt-28 sm:min-h-[calc(100vh+7rem)] sm:pt-28">
      {                                                       }
      <div className="absolute inset-0 bg-[#120c0a]">
        <DojoInterior />
        {                                                                            }
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,11,10,0.82)_0%,rgba(15,11,10,0.5)_40%,rgba(15,11,10,0.1)_75%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,5,3,0.75)_100%)]"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 40%, rgba(0,0,0,1) 100%)`,
            backgroundSize: "60px 100%",
          }}
        ></div>
      </div>

      {                                           }
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {backgroundElements.map((el, i) => {
          if (el.type === "firefly") {
            return (
              <motion.div
                key={`ff-${i}`}
                className="absolute size-1.5 rounded-full bg-[#f3d676]"
                style={{
                  left: el.left,
                  top: el.top,
                  boxShadow: "0 0 10px 3px rgba(243,214,118,0.5)",
                }}
                animate={{ x: el.dx, y: el.dy, opacity: [0, 1, 0.25, 1, 0] }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: el.delay,
                }}
              />
            );
          }

          return (
            <motion.div
              key={`leaf-${i}`}
              className="absolute top-0"
              style={{ left: el.left, color: el.color }}
              initial={{ y: "-8vh", opacity: 0 }}
              animate={{
                y: "108vh",
                x: [0, el.sway, -el.sway, el.sway / 2, 0],
                rotate: el.spin,
                opacity: [0, 0.55, 0.55, 0],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                ease: "linear",
                delay: el.delay,
              }}
            >
              <Leaf size={el.size} />
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
          <h1 className="font-brand text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-[#eaddcf] mix-blend-screen drop-shadow-[0_0_15px_rgba(234,221,207,0.1)] whitespace-nowrap">
            NEKKO
            <span className="text-[#d4af37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
              DOJO
            </span>
          </h1>
          <h1 className="font-brand absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-[#d4af37] opacity-0 group-hover:opacity-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300 pointer-events-none select-none whitespace-nowrap">
            NEKKO<span className="">DOJO</span>
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
          {user ? (
            <>
              <Link
                href="/problems"
                className="relative px-12 py-4 bg-[#2c1810] border border-[#5d4037] text-[#d4af37] tracking-[0.2em] font-bold uppercase hover:bg-[#3e2723] hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500 clip-path-slant"
              >
                Start Practice
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="relative px-12 py-4 bg-[#2c1810] border border-[#5d4037] text-[#d4af37] tracking-[0.2em] font-bold uppercase hover:bg-[#3e2723] hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500 clip-path-slant"
              >
                Enter Dojo
              </Link>
            </>
          )}
        </div>
      </motion.div>
      <div className="absolute left-6 bottom-0 hidden lg:block pb-12 z-10">
        <div className="writing-vertical-rl text-[#3e2723] text-opacity-40 text-sm tracking-[0.8em] font-mono h-48 border-l border-[#3e2723]/20 pl-4">
          継続は力なり
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-[#3e2723] text-xs tracking-[0.4em] font-mono opacity-50">
          EST. 2025 // NEKKODOJO
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
      <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-[#0f0b0a] via-[#0f0b0a]/90 to-transparent pointer-events-none z-20"></div>
    </main>
  );
}
