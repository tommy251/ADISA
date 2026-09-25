import { getAllProducts } from "@/lib/catalog";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";

// Always fetch fresh from Supabase at build time so it's baked into the static HTML.
export const metadata: Metadata = {
  title: "Shop all shoes — ADISA ·Àdísà·",
  description: "Browse all 50+ men's shoes curated by ADISA. Sneakers, formal, boots, loafers and sandals delivered across Nigeria.",
};

export default async function ShopPage() {
  // Fetch all products once during the build
  const products = await getAllProducts();
  
  // Pass them to the client component for interactive filtering
  return <ShopClient initialProducts={products} />;
}