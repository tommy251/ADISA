"use client";

import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { categoryLabel } from "@/lib/products";
import type { Product, ProductCategory } from "@/lib/types";

/**
 * Categories strip — for each category, auto-scrolls EVERY image
 * (imagePath + extraImages) of EVERY product in that category, in one
 * big horizontal Marquee. Images use object-contain so different sizes
 * and shapes stay immersive instead of getting cropped.
 */
export function CategoryOrbitsStrip({
  products,
  categories,
}: {
  products: Product[];
  categories: ProductCategory[];
}) {
  return (
    <div className="space-y-10">
      {categories.map((cat, catIdx) => {
        // All images (imagePath + extraImages) of every product in this category, flattened.
        const allImgs = products
          .filter((p) => p.category === cat)
          .flatMap((p) => [p.imagePath, ...p.extraImages]);

        if (allImgs.length === 0) return null;

        // Reverse every other row so adjacent categories scroll opposite ways.
        const reverse = catIdx % 2 === 1;

        return (
          <div key={cat}>
            <Link
              href={`/shop?category=${cat}`}
              className="group flex items-baseline justify-between gap-4 px-4 sm:px-6"
            >
              <h3 className="font-head text-2xl font-extrabold sm:text-3xl">
                <span className="text-[var(--adisa-clay)]">#</span>{" "}
                {labelFor(cat)}
              </h3>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-[var(--adisa-clay)]">
                See all →
              </span>
            </Link>
            <div className="relative mt-3">
              {/* Edge fades for immersion. */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--adisa-bone)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--adisa-bone)] to-transparent" />
              <Marquee
                pauseOnHover
                reverse={reverse}
                className="[--duration:55s] [--gap:0.75rem]"
              >
                {allImgs.map((src, i) => (
                  <Link
                    key={`${cat}-${src}-${i}`}
                    href={`/shop?category=${cat}`}
                    className="group relative h-40 w-40 shrink-0 overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0_#000] transition-transform duration-200 hover:-translate-y-1"
                  >
                    <Image
                      src={src}
                      alt={`${labelFor(cat)} style ${i + 1}`}
                      fill
                      sizes="160px"
                      // object-contain preserves every image's natural shape instead of cropping.
                      className="object-contain p-1"
                    />
                  </Link>
                ))}
              </Marquee>
            </div>
          </div>
        );
      })}
    </div>
  );
}
