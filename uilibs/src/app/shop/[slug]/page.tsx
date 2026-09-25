import { notFound } from "next/navigation";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";
import { getProductBySlug, getByCategory, getAllProducts } from "@/lib/catalog";
import { formatNGN } from "@/lib/pricing";
import ProductDetailClient from "@/components/site/ProductDetailClient";

// 1. Tell Next.js to generate a static page for every product slug at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product: Product) => ({
    slug: product.slug,
  }));
}

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

// 2. REMOVED "export const dynamic = 'force-dynamic'" 
// Static export requires pages to be statically generated.

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

  return <ProductDetailClient productPromise={Promise.resolve({ product, related })} />;
}