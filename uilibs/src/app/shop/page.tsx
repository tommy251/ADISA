import Link from "next/link";
import { getAllProducts, categoryLabel } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { AnimateOnView } from "@/components/site/AnimateOnView";
import type { ProductCategory } from "@/lib/types";
import type { Metadata } from "next";

// Always fetch fresh from Supabase so admin edits show up immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all shoes — ADISA ·Àdísà·",
  description: "Browse all 50+ men's shoes curated by ADISA. Sneakers, formal, boots, loafers and sandals delivered across Nigeria.",
};

const CATEGORIES: ProductCategory[] = [
  "sneakers", "formal", "boots", "loafers", "sandals", "athletic",
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { category, q, sort } = await searchParams;
  const cat = (category as ProductCategory) || undefined;

  let products = (await getAllProducts()).slice();
  if (cat) products = products.filter((p) => p.category === cat);
  if (q) {
    const needle = q.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    );
  }
  switch (sort) {
    case "price-asc":  products.sort((a, b) => a.salePrice - b.salePrice); break;
    case "price-desc": products.sort((a, b) => b.salePrice - a.salePrice); break;
    case "rating":     products.sort((a, b) => b.rating - a.rating); break;
    case "newest":
    default:           products.reverse();
  }

  return (
    <div className="bg-[var(--adisa-bone)]">
      {/* hero strip */}
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-14 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimateOnView>
            <p className="font-head text-xs uppercase tracking-widest text-[var(--adisa-gold)]">{products.length} products</p>
            <h1 className="mt-2 font-head text-4xl font-extrabold sm:text-5xl">
              {cat ? categoryLabel(cat) : "All shoes"}
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
              className={`inline-flex items-center border-2 border-[var(--adisa-bone)] px-3 py-1 text-sm transition ${!cat ? "bg-[var(--adisa-bone)] text-[var(--adisa-ink)]" : "hover:bg-[var(--adisa-bone)]/10"}`}
            >
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/shop?category=${c}`}
                className={`inline-flex items-center border-2 border-[var(--adisa-bone)] px-3 py-1 text-sm transition ${cat === c ? "bg-[var(--adisa-bone)] text-[var(--adisa-ink)]" : "hover:bg-[var(--adisa-bone)]/10"}`}
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
            <Link href={buildSortHref("newest", cat, q)}      className={sort === "newest"      || !sort ? "font-bold underline underline-offset-4" : "hover:underline"}>New</Link>
            <Link href={buildSortHref("price-asc", cat, q)}   className={sort === "price-asc"  ? "font-bold underline underline-offset-4" : "hover:underline"}>₦ ↑</Link>
            <Link href={buildSortHref("price-desc", cat, q)}  className={sort === "price-desc" ? "font-bold underline underline-offset-4" : "hover:underline"}>₦ ↓</Link>
            <Link href={buildSortHref("rating", cat, q)}      className={sort === "rating"     ? "font-bold underline underline-offset-4" : "hover:underline"}>★</Link>
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
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function buildSortHref(sort: string, cat?: string, q?: string) {
  const params = new URLSearchParams();
  if (cat) params.set("category", cat);
  if (q)   params.set("q", q);
  params.set("sort", sort);
  return `/shop?${params.toString()}`;
}
