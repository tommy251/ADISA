"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** When true, show a Featured badge in the top-left corner of the frame. */
  featured?: boolean;
  /** Auto-slide interval in milliseconds. Set 0 to disable. Default 4500ms. */
  intervalMs?: number;
  /** Optional className applied to the outer frame. */
  className?: string;
}

export function ImageCarousel({
  images,
  alt,
  featured = false,
  intervalMs = 4500,
  className = "",
}: ImageCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const activeImg = images[active] ?? images[0];

  const go = useCallback(
    (n: number) => {
      const idx = (((n % count) + count) % count);
      setActive(idx);
    },
    [count],
  );
  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback(() => go(active - 1), [active, go]);

  // Auto-slide — pauses on hover/focus/touch or when explicitly toggled off.
  useEffect(() => {
    if (!intervalMs || count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, count, paused]);

  // Keyboard navigation when the frame has focus.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { go(active - 1); }
      else if (e.key === "ArrowRight") { go(active + 1); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [active, go]);

  if (count === 0) return null;

  return (
    <div
      ref={frameRef}
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) {
          if (dx < 0) next();
          else prev();
        }
        touchStartX.current = null;
        setPaused(false);
      }}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt} image gallery`}
    >
      {/* Main frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0_#000]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={activeImg}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, duration: 0.4 }}
          >
            <Image
              src={activeImg}
              alt={`${alt} - image ${active + 1} of ${count}`}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Featured badge */}
        {featured && (
          <span className="absolute left-4 top-4 z-10 border-2 border-black bg-[var(--adisa-clay)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Featured
          </span>
        )}

        {/* Counter */}
        {count > 1 && (
          <span className="absolute right-4 top-4 z-10 border-2 border-black bg-white/90 px-2 py-0.5 font-head text-xs font-bold tabular-nums">
            {active + 1} / {count}
          </span>
        )}

        {/* Arrows — only if multi-image */}
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-zinc-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-zinc-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Play/Pause toggle */}
        {count > 1 && intervalMs > 0 && (
          <button
            type="button"
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
            onClick={() => setPaused((p) => !p)}
            className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-zinc-100"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Thumbnail strip — only if more than 1 image */}
      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 border-black transition ${
                i === active
                  ? "shadow-[3px_3px_0_#000] ring-2 ring-[var(--adisa-clay)] ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
