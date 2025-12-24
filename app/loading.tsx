"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0f0b0a]">
      {/* 1. Animated Logo / Icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#d4af37] blur-3xl opacity-20 rounded-full" />
        
        {/* Icon */}
        <Loader2 className="w-16 h-16 text-[#d4af37] animate-spin" />
      </motion.div>

      {/* 2. Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center space-y-2"
      >
        <h2 className="text-2xl font-bold text-[#eaddcf] tracking-widest uppercase">
          Nekko<span className="text-[#d4af37]">Dojo</span>
        </h2>
        <p className="text-[#a1887f] text-sm font-mono animate-pulse">
          Loading assets...
        </p>
      </motion.div>

      {/* 3. Progress Bar Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1a110d]">
        <motion.div
          className="h-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>
    </div>
  );
}