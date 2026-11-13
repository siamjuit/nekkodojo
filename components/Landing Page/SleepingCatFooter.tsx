"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function SleepingCatFooter({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative z-20">
      <div
        className="pointer-events-none absolute left-1/2 top-[-270px] z-30 w-[min(440px,92vw)] -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          className="absolute left-[72%] top-[14%] z-0 h-[48%] w-[20%] origin-[56%_100%]"
          animate={reduceMotion ? undefined : { rotate: [-9, 9, -9] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/cattail.png"
            alt=""
            width={1100}
            height={3900}
            className="h-full w-full object-fill"
          />
        </motion.div>
        <Image
          src="/catsleep.svg"
          alt=""
          width={996*1.2}
          height={774*1.2}
          priority
          unoptimized
          className="relative z-10 block h-auto w-full"
        />
      </div>

      {children}
    </div>
  );
}
