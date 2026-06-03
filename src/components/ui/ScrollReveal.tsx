"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
}

export default function ScrollReveal({ children, delay = 0, direction = "up", blur = false }: ScrollRevealProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: false, amount: 0.1 }}
      style={{ willChange: "opacity, transform" }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.22, 1, 0.36, 1], // Cinematic Apple-style easing
      }}
    >
      {children}
    </motion.div>
  );
}
