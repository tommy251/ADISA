import { notFound } from "next/navigation";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";
import { getProductBySlug, getByCategory } from "@/lib/catalog";
import { formatNGN } from "@/lib/pricing";
import ProductDetailClient from "@/components/site/ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found — ADISA" };

  return {
    title: `${product.name} — ${formatNGN(product.salePrice)} | ADISA`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ADISA`,
      description: product.description,
      images: [{ url: product.imagePath }],
    },
  };
}

// Always fetch fresh from Supabase so admin edits (and newly added
// products) show up immediately without needing a rebuild.
export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // related: same category, excluding this item
  const related = (await getByCategory(product.category)) as Product[];
  if (!related) notFound();

  return <ProductDetailClient productPromise={Promise.resolve({ product, related })} />;
}