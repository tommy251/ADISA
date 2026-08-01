"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatNGN } from "@/lib/pricing";

export default function CartPage() {
  const items  = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear  = useCart((s) => s.clear);

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="min-h-[60vh] bg-[var(--adisa-bone)]">
      {/* header */}
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-12 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-[var(--adisa-bone)]/80 hover:text-[var(--adisa-gold)]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
          <h1 className="mt-4 font-head text-4xl font-extrabold sm:text-5xl">
            Your cart
          </h1>
          <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">
              {itemCount > 0
                ? `${itemCount} item${itemCount === 1 ? "" : "s"} — review and checkout when ready.`
              : "Your cart is empty right now."}
          </p>
        </div>
      </section>

      {/* empty state */}
      {items.length === 0 ? (
        <section className="py-24">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center border-2 border-black bg-white shadow-[6px_6px_0_#000]">
              <ShoppingBag className="h-9 w-9 text-[var(--adisa-clay)]" />
            </div>
            <h2 className="mt-6 font-head text-3xl font-extrabold">No shoes yet</h2>
            <p className="mt-3 text-muted-foreground">
              Browse the catalog and add the ones you love. We deliver to all 36
              states + FCT in 2–5 working days.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
            >
              Browse shoes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
            {/* items list */}
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((i) => (
                  <motion.li
                    key={`${i.slug}-${i.sizeUk}-${i.color}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    className="flex gap-4 border-2 border-black bg-white p-3 shadow-[6px_6px_0_#000] sm:p-4"
                  >
                    <Link
                      href={`/shop/${i.slug}`}
                      className="relative h-28 w-24 shrink-0 overflow-hidden border border-black bg-zinc-100"
                    >
                      <Image
                        src={i.imagePath}
                        alt={i.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/shop/${i.slug}`}
                          className="font-head text-lg font-semibold hover:text-[var(--adisa-clay)]"
                        >
                          {i.name}
                        </Link>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => remove(i.slug, i.sizeUk, i.color)}
                          className="inline-flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-[var(--adisa-clay)] shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-zinc-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                        UK {i.sizeUk} · NG {i.sizeUk + 35} · {i.color}
                      </p>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                        <div className="flex items-center border-2 border-black bg-white">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(i.slug, i.sizeUk, i.color, i.qty - 1)}
                            className="px-3 py-2 hover:bg-zinc-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-10 px-4 text-center font-head text-base font-bold">
                            {i.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(i.slug, i.sizeUk, i.color, i.qty + 1)}
                            className="px-3 py-2 hover:bg-zinc-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-head text-xl font-bold">
                            {formatNGN(i.unitPrice * i.qty)}
                          </div>
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {formatNGN(i.unitPrice)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>

              {/* clear row */}
              <li className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Empty your cart?")) clear();
                  }}
                  className="text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-[var(--adisa-clay)]"
                >
                  Empty cart
                </button>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-[var(--adisa-clay)]"
                >
                  Keep shopping <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>

            {/* summary */}
            <aside className="h-fit border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000] lg:sticky lg:top-24">
              <h2 className="font-head text-xl font-extrabold">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd className="font-semibold">{itemCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-head text-lg font-bold">{formatNGN(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="text-xs">Calculated at checkout</dd>
                </div>
              </dl>

              <div className="mt-5 space-y-2 border-t-2 border-black pt-5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[var(--adisa-clay)]" />
                  Insured delivery to all 36 states + FCT
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--adisa-green)]" />
                  Card (Paystack) or crypto (Coinbase Commerce)
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head text-lg font-bold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
              >
                Checkout now <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You will pick payment method on the next step.
              </p>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}
