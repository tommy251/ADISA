"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
import { categoryLabel } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { AnimateOnView } from "@/components/site/AnimateOnView";
import type { ProductCategory } from "@/lib/types";

const CATEGORIES: ProductCategory[] = [
  "sneakers", "formal", "boots", "loafers", "sandals", "athletic",
];

function ShopContent({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const sort = searchParams.get("sort") || "newest";

  // Filter and sort logic (client-side)
  let products = [...initialProducts];
  
  if (category) {
    products = products.filter((p: any) => p.category === category);
  }
  
  if (q) {
    const needle = q.toLowerCase().trim();
    products = products.filter(
      (p: any) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    );
  }

  switch (sort) {
    case "price-asc":  products.sort((a: any, b: any) => a.salePrice - b.salePrice); break;
    case "price-desc": products.sort((a: any, b: any) => b.salePrice - a.salePrice); break;
    case "rating":     products.sort((a: any, b: any) => b.rating - a.rating); break;
    case "newest":
    default:           products.reverse();
  }

  function buildSortHref(newSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="bg-[var(--adisa-bone)]">
      {/* hero strip */}
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-14 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimateOnView>
            <p className="font-head text-xs uppercase tracking-widest text-[var(--adisa-gold)]">{products.length} products</p>
            <h1 className="mt-2 font-head text-4xl font-extrabold sm:text-5xl">
              {category ? categoryLabel(category as ProductCategory) : "All shoes"}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[var(--adisa-bone)]/80">
              Every shoe in our catalog shipped fresh from our suppliers, fairly priced
              and delivered to all 36 states of Nigeria plus the FCT.
            </p>
          </AnimateOnView>

          {/* filters row */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link
              href="/shop"
              className={`inline-flex items-center border-2 border-[var(--adisa-bone)] px-3 py-1 text-sm transition ${!category ? "bg-[var(--adisa-bone)] text-[var(--adisa-ink)]" : "hover:bg-[var(--adisa-bone)]/10"}`}
            >
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/shop?category=${c}`}
                className={`inline-flex items-center border-2 border-[var(--adisa-bone)] px-3 py-1 text-sm transition ${category === c ? "bg-[var(--adisa-bone)] text-[var(--adisa-ink)]" : "hover:bg-[var(--adisa-bone)]/10"}`}
              >
                {categoryLabel(c)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* toolbar: sort + search */}
      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <form className="flex flex-1 max-w-sm items-center border-2 border-black bg-white">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search shoes…"
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="border-l-2 border-black bg-[var(--adisa-ink)] px-4 text-white"
            >
              Go
            </button>
          </form>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort:</span>
            <Link href={buildSortHref("newest")}      className={sort === "newest"      || !sort ? "font-bold underline underline-offset-4" : "hover:underline"}>New</Link>
            <Link href={buildSortHref("price-asc")}   className={sort === "price-asc"  ? "font-bold underline underline-offset-4" : "hover:underline"}>₦ ↑</Link>
            <Link href={buildSortHref("price-desc")}  className={sort === "price-desc" ? "font-bold underline underline-offset-4" : "hover:underline"}>₦ ↓</Link>
            <Link href={buildSortHref("rating")}      className={sort === "rating"     ? "font-bold underline underline-offset-4" : "hover:underline"}>★</Link>
          </div>
        </div>
      </section>

      {/* grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {products.length === 0 ? (
            <div className="border-2 border-black bg-white p-12 text-center shadow-[6px_6px_0_#000]">
              <h3 className="font-head text-2xl font-bold">No matching shoes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different category or search term.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex border-2 border-black bg-[var(--adisa-ink)] px-5 py-2 font-head font-semibold text-white shadow-[4px_4px_0_#000]"
              >
                Reset filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p: any, i: number) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ShopClient({ initialProducts }: { initialProducts: any[] }) {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading shop...</div>}>
      <ShopContent initialProducts={initialProducts} />
    </Suspense>
  );
}