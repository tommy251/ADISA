"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatNGN } from "@/lib/pricing";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false);
  // Card aspect 4:5 to fit portrait product photos
  return (
    <motion.div
      className="group flex flex-col gap-3 border-2 border-black bg-white shadow-[6px_6px_0_#000] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 18,
        delay: (index % 4) * 0.04,
      }}
    >
      <Link
        href={`/shop/${product.slug}`}
        prefetch={false}
        className="relative block aspect-[4/5] overflow-hidden border-b-2 border-black bg-zinc-100"
      >
        <Image
          src={product.imagePath}
          alt={product.name}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute left-3 top-3 border-2 border-black bg-[var(--adisa-clay)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
            Featured
          </span>
        )}
        <button
          type="button"
          aria-label="Save"
          onClick={(e) => { e.preventDefault(); }}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#000] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="flex flex-col gap-2 px-4 py-3">
        <Link href={`/shop/${product.slug}`} prefetch={false}>
          <h3 className="font-head text-base font-semibold leading-snug hover:text-[var(--adisa-clay)]">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {product.description.split(".").slice(0, 1)}.
        </p>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <div className="font-head text-lg font-bold">
              {formatNGN(product.salePrice)}
            </div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground line-through">
              Source ₦{product.sourcePrice.toLocaleString("en-NG")}
            </div>
          </div>
          <Link
            href={`/shop/${product.slug}`}
            prefetch={false}
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--adisa-ink)] text-white shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            onClick={() => setAdded(true)}
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
