"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

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

export default function DoorTransition() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDoorOpen(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex pointer-events-none"
      initial="closed"
      animate={isDoorOpen ? "open" : "closed"}
      variants={overlayVariants}
    >
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
  );
}