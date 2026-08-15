"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

/**
 * ADISA intro preloader.
 *
 * Plays once per browser session (gated by sessionStorage key) on first
 * navigation. Center stage carries the ADISA wordmark framed by two rings
 * of shoe images that travel in 3D circular orbits around it.
 *
 * When loading is done the whole panel slides upward off-screen with the
 * curve morph borrowed from info-mdshakeeb's Preloader (downloaded via
 * 21st.dev) — adapted for `motion/react` and re-orchestrated for the
 * ADISA brand voice.
 */

const STORAGE_KEY = "adisa-preloader-played";

// Curated brand tagline — one cycle completes the intro.
const INTRO_MS = 4200;

// Pick one representative image per product folder. We use the static
// catalog first-image paths directly (no client catalog fetch needed —
// these match the seed slugs in products.ts and live in /public/products).
const ORBIT_SLUGS = [
  "adisa-cosy-loafer",
  "adisa-classic-runner",
  "adisa-zosivc-trainer",
  "adisa-dexun-skater",
  "adisa-retro-flats",
  "adisa-versatile-loafer",
  "adisa-wklniag-runner",
  "adisa-cosy-buckle",
  "adisa-textured-sneaker",
  "adisa-allmatch-sneaker",
  "adisa-breathable-runner",
  "adisa-battle-athletic",
];

interface OrbitRingProps {
  // Total image count in this ring.
  count: number;
  // Orbit radius in pixels.
  radius: number;
  // Element pixel size.
  imgSize: number;
  // Duration of a full rotation in seconds.
  durationSec: number;
  // Phase offset (0..1) so rings don't visually start aligned.
  phase?: number;
  // Which set of slug images to render.
  slugSource: string[];
}

function OrbitRing({
  count,
  radius,
  imgSize,
  durationSec,
  phase = 0,
  slugSource,
}: OrbitRingProps) {
  // Evenly space the items angularly, plus the ring's overall phase rotation
  // is driven by one parent keyframe transform — cheap to animate.
  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 top-1/2"
      style={{ transformStyle: "preserve-3d" }}
      initial={{ rotate: phase * 360 }}
      animate={{ rotate: phase * 360 + 360 }}
      transition={{
        duration: durationSec,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const slug = slugSource[i % slugSource.length];
        return (
          // Each orbiting chip is statically placed by transform then counter-
          // rotates against the parent so the actual image stays upright while
          // its position revolves around ADISA — gives the orbital depth feel.
          <div
            key={i}
            className="absolute"
            style={{
              left: -imgSize / 2,
              top: -imgSize / 2,
              width: imgSize,
              height: imgSize,
              transform: `translate3d(${x}px, ${y}px, 0)`,
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{
                duration: durationSec,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-full w-full overflow-hidden border-2 border-white/40 bg-white"
              style={{
                boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
                perspective: "800px",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={`/products/${slug}/01.png`}
                alt=""
                fill
                sizes={`${imgSize}px`}
                className="object-cover"
                priority={false}
              />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

interface AdisaPreloaderProps {
  /** Fired after the exit animation completes — caller may drop preloader. */
  onComplete?: () => void;
  /** Skip gate (force play) — useful for demo pages / replay buttons. */
  forcePlay?: boolean;
}

export default function AdisaPreloader({
  onComplete,
  forcePlay = false,
}: AdisaPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  // Session gate — only play once per browser session.
  useEffect(() => {
    if (forcePlay) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setVisible(false);
    }
  }, [forcePlay]);

  // Track viewport so the closing SVG path scales correctly.
  useEffect(() => {
    if (!visible) return;
    const update = () => setDims({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [visible]);

  // Start the exit a moment before INTRO_MS completes so the slide-up has time.
  useEffect(() => {
    if (!visible) return;
    const t1 = window.setTimeout(() => setExiting(true), INTRO_MS);
    const t2 = window.setTimeout(() => {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
      setVisible(false);
      onComplete?.();
    }, INTRO_MS + 1150);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [visible, onComplete]);

  const closingPath = useMemo(() => {
    if (dims.width === 0) return "";
    return `M0 0 L${dims.width} 0 L${dims.width} ${dims.height} Q${dims.width / 2} ${dims.height + 300} 0 ${dims.height} L0 0`;
  }, [dims]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="adisa-preloader"
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[var(--adisa-ink)]"
          initial={{ y: 0 }}
          animate={{ y: exiting ? "-100vh" : 0 }}
          exit={{ y: "-100vh" }}
          transition={{
            duration: 0.9,
            ease: [0.76, 0, 0.24, 1],
            delay: exiting ? 0.15 : 0,
          }}
        >
          {/* Sticky centre stage — preserves 3D depth for the orbit rings. */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: Math.max(320, Math.min(dims.width * 0.9, 720)),
              height: Math.max(320, Math.min(dims.height * 0.7, 720)),
              transformStyle: "preserve-3d",
              perspective: "1100px",
            }}
          >
            {/* Outer orbit ring — larger, slower, fewer images. */}
            <OrbitRing
              count={6}
              radius={Math.max(180, Math.min(dims.width * 0.32, 320))}
              imgSize={104}
              durationSec={22}
              phase={0.12}
              slugSource={ORBIT_SLUGS.slice(0, 6)}
            />
            {/* Inner orbit ring — smaller, faster. */}
            <OrbitRing
              count={6}
              radius={Math.max(110, Math.min(dims.width * 0.18, 180))}
              imgSize={76}
              durationSec={16}
              phase={0.5}
              slugSource={ORBIT_SLUGS.slice(6)}
            />

            {/* Centre wordmark — fades in then breathes out. */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            >
              <motion.h1
                className="font-head text-6xl font-extrabold tracking-[0.08em] text-[var(--adisa-bone)] sm:text-7xl"
                style={{ textShadow: "0 6px 28px rgba(194,65,12,0.45)" }}
                animate={{ scale: [1, 1.035, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ADISA
              </motion.h1>
              <motion.p
                className="font-head text-xs uppercase tracking-[0.42em] text-[var(--adisa-gold)]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                ·Àdísà·Dàrósà·
              </motion.p>
              <motion.div
                className="mt-3 h-1 w-24 overflow-hidden rounded-full bg-white/15"
                aria-hidden
              >
                <motion.div
                  className="h-full w-full bg-[var(--adisa-clay)]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: INTRO_MS / 1000, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Closing curve panel (motion path). Slides up after fade. */}
          {dims.width > 0 && closingPath && exiting && (
            <svg className="pointer-events-none absolute inset-0 h-[calc(100%+300px)] w-full">
              <motion.path
                d={`M0 0 L${dims.width} 0 L${dims.width} ${dims.height} L0 ${dims.height} L0 0`}
                animate={{ d: closingPath }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                fill="var(--adisa-ink)"
              />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
