import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProductBySlug, getByCategory } from "@/lib/products";
import { formatNGN } from "@/lib/pricing";
import ProductDetailClient from "@/components/site/ProductDetailClient";

// Prerender one landing page per shoe slug at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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

export default async function ProductPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // related: same category, excluding this item
  const related = getByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return <ProductDetailClient productPromise={Promise.resolve({ product, related })} />;
}
