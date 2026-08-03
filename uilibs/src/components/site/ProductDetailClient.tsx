"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatNGN, convertToAdisaPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS } from "@/lib/products";

export default function ProductDetailClient({
  productPromise,
}: {
  productPromise: Promise<{ product: Product; related: Product[] }>;
}) {
  const { product, related } = use(productPromise);

  const [sizeUk, setSizeUk] = useState<number>(product.sizesUk[Math.floor(product.sizesUk.length / 2)] ?? product.sizesUk[0]);
  const [color,  setColor]  = useState<string>(product.colors[0] ?? "");
  const [qty,    setQty]    = useState<number>(1);
  const [added, setAdded]   = useState<boolean>(false);

  const add = useCart((s) => s.add);

  function onAdd() {
    add({
      slug: product.slug,
      name: product.name,
      imagePath: product.imagePath,
      sizeUk,
      color,
      qty,
      unitPrice: product.salePrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="bg-[var(--adisa-bone)]">
      {/* breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>

      {/* main */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* image */}
          <motion.div
            className="relative aspect-[4/5] overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0_#000]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          >
            <Image
              src={product.imagePath}
              alt={product.name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.isFeatured && (
              <span className="absolute left-4 top-4 border-2 border-black bg-[var(--adisa-clay)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Featured
              </span>
            )}
          </motion.div>

          {/* info */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.06 }}
          >
            <p className="font-head text-xs uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-2 font-head text-4xl font-extrabold sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-[var(--adisa-gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-40"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-head text-4xl font-extrabold">
                {formatNGN(product.salePrice)}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-widest text-[var(--adisa-green)]">
              Fair price · card and crypto accepted
            </p>

            <p className="mt-6 text-base leading-7 text-muted-foreground">
              {product.description}
            </p>

            {/* colors */}
            {product.colors.length > 0 && (
              <div className="mt-8">
                <p className="font-head text-sm uppercase tracking-widest">Colour</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`border-2 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                        color === c
                          ? "border-black bg-[var(--adisa-ink)] text-white shadow-[3px_3px_0_#000]"
                          : "border-black bg-white hover:bg-zinc-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* sizes */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="font-head text-sm uppercase tracking-widest">Size (UK)</p>
                <p className="text-xs text-muted-foreground">UK ↔ Nigeria size table</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizesUk.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeUk(s)}
                    className={`flex h-12 min-w-12 items-center justify-center border-2 px-3 text-sm font-bold transition ${
                      sizeUk === s
                        ? "border-black bg-[var(--adisa-clay)] text-white shadow-[3px_3px_0_#000]"
                        : "border-black bg-white hover:bg-zinc-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Picked <strong>UK {sizeUk}</strong> ={" "}
                <strong>Nigeria {sizeUk + 35}</strong>
              </p>
            </div>

            {/* qty + add */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border-2 border-black bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-lg" aria-label="Decrease">−</button>
                <span className="px-4 font-head text-lg font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="px-3 py-2 text-lg" aria-label="Increase">+</button>
              </div>
              <button
                type="button"
                onClick={onAdd}
                className="flex flex-1 items-center justify-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head text-lg font-bold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="h-5 w-5 text-[var(--adisa-gold)]" /> Added to cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="inline-flex items-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" /> Add to cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* trust row */}
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="border-2 border-black bg-white p-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--adisa-clay)]" /> 2–5 day delivery
              </div>
              <div className="border-2 border-black bg-white p-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[var(--adisa-green)]" /> Insured shipping
              </div>
              <div className="border-2 border-black bg-white p-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-[var(--adisa-gold)]" /> {product.rating.toFixed(1)} rating
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href="/cart"
                className="border-2 border-black bg-white px-5 py-2 text-sm font-semibold shadow-[3px_3px_0_#000] hover:bg-zinc-50"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                className="border-2 border-black bg-white px-5 py-2 text-sm font-semibold shadow-[3px_3px_0_#000] hover:bg-zinc-50"
              >
                Checkout now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================ details ============================ */}
      <section className="mt-16 border-t-2 border-black bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-head text-3xl font-extrabold">The details</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-head text-sm uppercase tracking-widest text-[var(--adisa-clay)]">About this shoe</h3>
              <p className="mt-2 text-base leading-7 text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Each ADISA shoe is sourced directly and shipped insured.
                We mark up what is fair, not what is greedy.
              </p>
            </div>

            <div>
              <h3 className="font-head text-sm uppercase tracking-widest text-[var(--adisa-clay)]">UK ↔ Nigeria size chart</h3>
              <table className="mt-2 w-full border-2 border-black text-sm">
                <thead className="bg-[var(--adisa-ink)] text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">UK</th>
                    <th className="px-3 py-2 text-left">Nigeria / EU</th>
                  </tr>
                </thead>
                <tbody>
                  {[6,7,8,9,10,11,12,13].map((uk) => (
                    <tr
                      key={uk}
                      className={uk === sizeUk ? "bg-[var(--adisa-bone)]" : "odd:bg-white even:bg-zinc-50"}
                    >
                      <td className="border-t border-black/30 px-3 py-2 font-bold">
                        {uk} {uk === sizeUk && <span className="text-[var(--adisa-clay)]"> ← selected</span>}
                      </td>
                      <td className="border-t border-black/30 px-3 py-2">{uk + 35}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ related ============================ */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-head text-3xl font-extrabold">Pair it with</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
