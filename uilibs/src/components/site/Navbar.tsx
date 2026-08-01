"use client";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Wordmark } from "./Wordmark";
import { useCart } from "@/store/cart";
import { NG_STATES } from "@/lib/types";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=sneakers", label: "Sneakers" },
  { href: "/shop?category=formal", label: "Formal" },
  { href: "/shop?category=boots", label: "Boots" },
  { href: "/shop?category=loafers", label: "Loafers" },
  { href: "/about", label: "Why ADISA" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openDrawer = useCart((s) => s.open);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-[var(--adisa-bone)] backdrop-blur supports-[backdrop-filter]:bg-[var(--adisa-bone)]/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            className="border-2 border-black bg-white p-2 shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none sm:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Wordmark size="sm" />
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium uppercase tracking-wide text-foreground/80 transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden text-sm uppercase tracking-wide text-foreground/60 transition hover:text-foreground md:inline-block"
          >
            Admin
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openDrawer}
            className="relative border-2 border-black bg-white p-2 shadow-[3px_3px_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-black bg-[var(--adisa-clay)] px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-[var(--adisa-bone)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Wordmark size="sm" asLink={false} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="border-2 border-black bg-white p-2 shadow-[3px_3px_0_#000]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-semibold uppercase tracking-wide"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-base font-semibold uppercase tracking-wide text-foreground/60"
              >
                Admin
              </Link>
              <div className="mt-6 border-t-2 border-black pt-4 text-xs text-muted-foreground">
                Free delivery to all {NG_STATES.length} states
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
