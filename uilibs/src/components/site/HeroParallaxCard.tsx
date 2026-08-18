"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Hero collage card with 3D mouse-tilt and scroll parallax.
 *
 * - Mouse tilt is driven by the parent Tilt wrappern; here we add a
 *   layered translate-z on the image so it floats slightly above the
 *   frame surface ("pop-out" depth cue).
 * - Scroll progress shifts the y axis so the card drifts as the user
 *   scrolls past the hero — immersive without being noisy.
 */
export function HeroParallaxCard({
  href,
  src,
  alt,
  title,
  subtitle,
  isLead = false,
}: {
  href: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  isLead?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Drift up to 20px as the card moves through the viewport.
  const yShift = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <motion.a
      ref={ref}
      href={href}
           className={`group relative block h-full w-full overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0_#000] transition-transform duration-200 hover:-translate-y-1 ${
        isLead ? "row-span-2" : ""
      }`}
      style={{ y: yShift, transformStyle: "preserve-3d" }}
    >
      <div className="relative h-full w-full" style={{ transform: "translateZ(40px)" }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width:1024px) 50vw, 25vw"
          className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="font-head text-sm font-bold text-white">{title}</div>
        <div className="text-xs text-white/80">{subtitle}</div>
      </div>
    </motion.a>
  );
}
