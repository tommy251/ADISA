"use client";
import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  className?: string;
}

export function AnimateOnView({
  children,
  delay = 0,
  y = 24,
  x = 0,
  once = true,
  className,
}: Props) {
  const t: Transition = { type: "spring", stiffness: 90, damping: 16, delay };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={t}
    >
      {children}
    </motion.div>
  );
}
