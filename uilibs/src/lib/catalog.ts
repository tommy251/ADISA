// ============================================================
//  ADISA public catalog — storefront data access.
//
//  Reads from Supabase (public/anon client) when configured, so
//  edits made in the admin dashboard show up here immediately.
//  Falls back to the static seed array in ./products when
//  Supabase isn't configured (local/dev-without-DB, previews).
// ============================================================
import { getPublicSupabase, isSupabaseConfigured } from "./supabase";
import {
  PRODUCTS as SEED_PRODUCTS,
  getProductBySlug as getSeedProductBySlug,
  categoryLabel,
} from "./products";
import type { Product } from "./types";

export { categoryLabel };

function rowToProduct(r: Record<string, unknown>): Product {
  return {
    id: String(r.id ?? ""),
    slug: String(r.slug ?? ""),
    name: String(r.name ?? ""),
    brand: String(r.brand ?? "ADISA Select"),
    description: String(r.description ?? ""),
    imagePath: String(r.image_path ?? ""),
    extraImages: Array.isArray(r.extra_images) ? (r.extra_images as string[]) : [],
    sourcePrice: Number(r.source_price ?? 0),
    salePrice: Number(r.sale_price ?? 0),
    currency: "NGN",
    sizesUk: Array.isArray(r.sizes_uk) ? (r.sizes_uk as number[]) : [],
    colors: Array.isArray(r.colors) ? (r.colors as string[]) : [],
    category: (r.category as Product["category"]) ?? "sneakers",
    rating: Number(r.rating ?? 4.6),
    reviews: Number(r.reviews ?? 0),
    isFeatured: Boolean(r.is_featured),
    inStock: r.in_stock !== false,
  };
}

/** All products, live from Supabase when configured. */
export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return SEED_PRODUCTS;
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return SEED_PRODUCTS;
    return data.map(rowToProduct);
  } catch {
    // Network hiccup, Supabase down, etc — never break the storefront.
    return SEED_PRODUCTS;
  }
}

/** Single product by slug, live from Supabase when configured. */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return getSeedProductBySlug(slug);
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) return undefined;
    return rowToProduct(data);
  } catch {
    return getSeedProductBySlug(slug);
  }
}

export async function getFeaturedProducts(n = 8): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isFeatured).slice(0, n);
}

export async function getByCategory(cat: Product["category"]): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === cat);
}
