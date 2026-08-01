// ============================================================
//  Admin product CRUD helpers.
//
//  Reads always go through the static seed PRODUCTS array (so
//  the storefront works without a database). Writes go to
//  Supabase when configured, otherwise to an in-memory array
//  that shadows the seed (dev only).
// ============================================================

import { isSupabaseConfigured, getAdminSupabase } from "./supabase";
import { PRODUCTS } from "./products";
import type { Product } from "./types";

// Memory mirror for dev-without-DB. Starts from seed list.
const MEMORY: Map<string, Product> = new Map(PRODUCTS.map((p) => [p.slug, p]));

export async function adminListProducts(limit = 200): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return Array.from(MEMORY.values()).slice(0, limit);
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Supabase list failed: ${error.message}`);
  return (data ?? []).map(rowToProduct);
}

export async function adminGetProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return MEMORY.get(slug) ?? null;
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data ? rowToProduct(data) : null;
}

export async function adminUpsertProduct(p: Product): Promise<Product> {
  if (!isSupabaseConfigured()) {
    MEMORY.set(p.slug, p);
    return p;
  }
  const supabase = getAdminSupabase();
  const row = productToRow(p);
  const { data, error } = await supabase
    .from("products")
    .upsert(row, { onConflict: "slug" })
    .select("*")
    .single();
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  return rowToProduct(data);
}

export async function adminDeleteProduct(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    MEMORY.delete(slug);
    return;
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}

// ---------- row conversion ----------

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

function productToRow(p: Product): Record<string, unknown> {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    image_path: p.imagePath,
    extra_images: p.extraImages,
    source_price: p.sourcePrice,
    sale_price: p.salePrice,
    currency: "NGN",
    sizes_uk: p.sizesUk,
    colors: p.colors,
    category: p.category,
    rating: p.rating,
    reviews: p.reviews,
    is_featured: p.isFeatured,
    in_stock: p.inStock,
  };
}
