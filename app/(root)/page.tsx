"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

// ==========================================
// Animation Configurations (Unchanged)
// ==========================================
const overlayVariants: Variants = {
  closed: { opacity: 1, pointerEvents: "auto" },
  open: {
    opacity: 0,
    pointerEvents: "none",
    transition: { duration: 0.8, delay: 2.0 },
  },
};

const doorVariants: Variants = {
  closed: { x: 0 },
  open: (direction: "left" | "right") => ({
    x: direction === "left" ? "-100%" : "100%",
    transition: {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 1.5, duration: 1.0 },
  },
};

// ==========================================
// CAT POSES (New)
// ==========================================
const catPaths = [
  // Pose 1: Sitting (Original)
  "M9.5 8.5C8.7 8.5 8 7.8 8 7C8 6.2 8.7 5.5 9.5 5.5C10.3 5.5 11 6.2 11 7C11 7.8 10.3 8.5 9.5 8.5ZM14.5 8.5C13.7 8.5 13 7.8 13 7C13 6.2 13.7 5.5 14.5 5.5C15.3 5.5 16 6.2 16 7C16 7.8 15.3 8.5 14.5 8.5ZM17.5 2H19C20.1 2 21 2.9 21 4V9C21 11.8 18.8 14 16 14V16H18V18H16V22H8V18H6V16H8V14C5.2 14 3 11.8 3 9V4C3 2.9 3.9 2 5 2H6.5C7.3 2 8 2.7 8 3.5V4H16V3.5C16 2.7 16.7 2 17.5 2ZM5 9C5 10.7 6.3 12 8 12H16C17.7 12 19 10.7 19 9V4H5V9Z",
  // Pose 2: Sleeping / Curled
  "M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19ZM15.5 14.5C15.5 15.88 14.38 17 13 17C11.62 17 10.5 15.88 10.5 14.5C10.5 13.12 11.62 12 13 12C14.38 12 15.5 13.12 15.5 14.5ZM8.5 10.5C8.5 11.88 7.38 13 6 13C4.62 13 3.5 11.88 3.5 10.5C3.5 9.12 4.62 8 6 8C7.38 8 8.5 9.12 8.5 10.5Z",
  // Pose 3: Walking / Prowling
  "M20 10.5C20 9.12 18.88 8 17.5 8H16.5V6.5C16.5 4.57 14.93 3 13 3H9C7.07 3 5.5 4.57 5.5 6.5V8H4.5C3.12 8 2 9.12 2 10.5V14.5H3V17.5H5V21.5H7V17.5H9V21.5H11V17.5H13V21.5H15V17.5H17V21.5H19V17.5H21V14.5H22V10.5H20ZM16.5 10.5H14.5V8H16.5V10.5ZM9 6.5C9 5.67 9.67 5 10.5 5H11.5C12.33 5 13 5.67 13 6.5V8H9V6.5Z",
  // Pose 4: Stretching
  "M18.5,11H16.8C17.56,10.33 18,9.23 18,8C18,5.79 16.21,4 14,4C11.79,4 10,5.79 10,8C10,9.23 10.44,10.33 11.2,11H9.5C5.91,11 3,13.91 3,17.5V20H5V17.5C5,15.01 7.01,13 9.5,13H18.5C20.99,13 23,15.01 23,17.5V20H25V17.5C25,13.91 22.09,11 18.5,11M14,6A2,2 0 0,1 16,8A2,2 0 0,1 14,10A2,2 0 0,1 12,8A2,2 0 0,1 14,6Z",
];

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
    {/* Use the path corresponding to the index, fallback to 0 if out of bounds */}
    <path d={catPaths[poseIndex % catPaths.length]} />
  </svg>
);

export default function Home() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  // Update state type to include poseIndex
  const [backgroundElements, setBackgroundElements] = useState<
    {
      type: "particle" | "cat";
      top: string;
      left: string;
      duration: number;
      delay: number;
      scale?: number;
      rotation?: number;
      poseIndex?: number; // New property
    }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsDoorOpen(true), 800);

    // Generate positions and POSES on the client
    const elements = [
      // Particles (Unchanged)
      ...[...Array(8)].map((_, i) => ({
        type: "particle" as const,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 5 + 5,
        delay: i,
      })),
      // Cats with varied poses
      ...[...Array(7)].map((_, i) => ({
        type: "cat" as const,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        duration: Math.random() * 10 + 15,
        delay: i * 1.5,
        scale: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 30 - 15,
        // Randomly select one of the 4 poses
        poseIndex: Math.floor(Math.random() * catPaths.length),
      })),
    ];
    setBackgroundElements(elements);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-[#0f0b0a] text-[#eaddcf]">
      {/* ==========================================
          THE TRADITIONAL WOODEN GATES (Unchanged)
      ========================================== */}
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial="closed"
        animate={isDoorOpen ? "open" : "closed"}
        variants={overlayVariants}
      >
        {/* ... (Left & Right Door code remains exactly the same) ... */}
        <motion.div
          className="relative h-full w-1/2 flex items-center justify-end border-r border-[#1a110d]"
          style={{
            backgroundColor: "#2c1810",
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.2) 50px, rgba(0,0,0,0.2) 53px), linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6))`,
          }}
          custom="left"
          variants={doorVariants}
        >
          <div className="absolute inset-0 border-16 border-[#3e2723] opacity-100 box-border pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(0,0,0,0.3)_96%)] bg-size-[100%_100px]"></div>
          <div className="mr-[-50px] z-10 w-[100px] h-[100px] bg-[#d4af37] rounded-l-full flex items-center justify-center border-l-4 border-t-4 border-b-4 border-[#5d4037] shadow-xl">
            <div className="w-[60%] h-[60%] border-2 border-[#5d4037] rounded-l-full opacity-50"></div>
          </div>
          <div className="absolute right-12 h-48 w-3 bg-[#1a0f0a] rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] border-l border-[#3e2723]/30"></div>
        </motion.div>
        <motion.div
          className="relative h-full w-1/2 flex items-center justify-start border-l border-[#1a110d]"
          style={{
            backgroundColor: "#2c1810",
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.2) 50px, rgba(0,0,0,0.2) 53px), linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6))`,
          }}
          custom="right"
          variants={doorVariants}
        >
          <div className="absolute inset-0 border-16 border-[#3e2723] opacity-100 box-border pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(0,0,0,0.3)_96%)] bg-size-[100%_100px]"></div>
          <div className="ml-[-50px] z-10 w-[100px] h-[100px] bg-[#d4af37] rounded-r-full flex items-center justify-center border-r-4 border-t-4 border-b-4 border-[#5d4037] shadow-xl">
            <div className="w-[60%] h-[60%] border-2 border-[#5d4037] rounded-r-full opacity-50"></div>
          </div>
          <div className="absolute left-12 h-48 w-3 bg-[#1a0f0a] rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] border-r border-[#3e2723]/30"></div>
        </motion.div>
      </motion.div>

      {/* ==========================================
          MAIN DOJO HALL (Landing Page)
      ========================================== */}
      <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* --- Background (Unchanged) --- */}
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

        {/* --- Background Elements (Particles & Varied Cats) --- */}
        <div className="absolute inset-0 pointer-events-none">
          {backgroundElements.map((el, i) => {
            // Render Particles
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
            // Render Cats with Varied Poses
            return (
              <motion.div
                key={`cat-${i}`}
                className="absolute text-[#d4af37] opacity-10 mix-blend-screen"
                style={{
                  left: el.left,
                  top: el.top,
                  scale: el.scale,
                  rotate: el.rotation,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: el.delay,
                }}
              >
                {/* Pass the random pose index to the component */}
                <CatSilhouette className="w-24 h-24" poseIndex={el.poseIndex} />
              </motion.div>
            );
          })}
        </div>

        {/* --- Main Content (Unchanged) --- */}
        <motion.div
          className="z-10 text-center px-6 relative max-w-7xl w-full"
          initial="hidden"
          animate={isDoorOpen ? "visible" : "hidden"}
          variants={contentVariants}
        >
          <div className="mb-4">
            <span className="text-[#d4af37] text-sm tracking-[0.5em] opacity-80 font-serif">
              アルゴリズムを極める
            </span>
          </div>
          <div className="relative group inline-block">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-[#eaddcf] mix-blend-screen drop-shadow-[0_0_15px_rgba(234,221,207,0.1)] whitespace-nowrap">
              NEKKO
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

        {/* Vertical Japanese Side Text (Unchanged) */}
        <div className="absolute left-6 bottom-0 hidden lg:block pb-12">
          <div className="writing-vertical-rl text-[#3e2723] text-opacity-40 text-sm tracking-[0.8em] font-mono h-48 border-l border-[#3e2723]/20 pl-4">
            継続は力なり
          </div>
        </div>

        {/* Footer (Unchanged) */}
        <div className="absolute bottom-6 w-full text-center">
          <p className="text-[#3e2723] text-xs tracking-[0.4em] font-mono opacity-50">
            EST. 2025 // AENANSH
          </p>
        </div>
      </main>
    </div>
  );
}
