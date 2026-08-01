"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatNGN } from "@/lib/pricing";

export function CartDrawer() {
  const isOpen   = useCart((s) => s.isOpen);
  const close     = useCart((s) => s.close);
  const remove    = useCart((s) => s.remove);
  const setQty    = useCart((s) => s.setQty);
  const items     = useCart((s) => s.items);

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l-2 border-black bg-[var(--adisa-bone)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
          >
            <div className="flex items-center justify-between border-b-2 border-black px-6 py-4">
              <div className="flex items-center gap-2 font-head text-xl font-bold">
                <ShoppingBag className="h-5 w-5" /> Your Cart
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={close}
                className="border-2 border-black bg-white p-2 shadow-[3px_3px_0_#000]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-muted-foreground">Your cart is empty.</p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="border-2 border-black bg-[var(--adisa-ink)] px-6 py-2 text-white shadow-[3px_3px_0_#000]"
                  >
                    Browse shoes
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((i) => (
                    <li
                      key={`${i.slug}-${i.sizeUk}-${i.color}`}
                      className="flex gap-3 border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000]"
                    >
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-black">
                        <Image src={i.imagePath} alt={i.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/shop/${i.slug}`} onClick={close} className="text-sm font-semibold hover:text-[var(--adisa-clay)]">
                            {i.name}
                          </Link>
                          <button
                            type="button"
                            aria-label="Remove"
                            onClick={() => remove(i.slug, i.sizeUk, i.color)}
                            className="text-xs text-muted-foreground underline hover:text-[var(--adisa-clay)]"
                          >
                            remove
                          </button>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          UK {i.sizeUk} / NG {i.sizeUk + 35} &middot; {i.color}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border-2 border-black">
                            <button
                              type="button"
                              aria-label="Decrease"
                              onClick={() => setQty(i.slug, i.sizeUk, i.color, i.qty - 1)}
                              className="px-2 py-1 hover:bg-zinc-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm font-semibold">{i.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase"
                              onClick={() => setQty(i.slug, i.sizeUk, i.color, i.qty + 1)}
                              className="px-2 py-1 hover:bg-zinc-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-sm font-bold">{formatNGN(i.unitPrice * i.qty)}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t-2 border-black px-6 py-4">
                <div className="flex items-center justify-between font-head text-lg font-bold">
                  <span>Subtotal</span>
                  <span>{formatNGN(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Delivery fee added at checkout (depends on state)
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="mt-4 block w-full border-2 border-black bg-[var(--adisa-ink)] py-3 text-center text-white shadow-[4px_4px_0_#000] transition active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={close}
                  className="mt-2 block w-full py-2 text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
