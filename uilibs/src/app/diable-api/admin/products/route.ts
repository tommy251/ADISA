// ============================================================
//  /api/admin/products
//   GET    -> list all products (admin)
//   POST   -> upsert a single product
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { adminListProducts, adminUpsertProduct } from "@/lib/admin-products";
import type { Product, ProductCategory } from "@/lib/types";

const CATEGORIES: ProductCategory[] = [
  "sneakers", "formal", "boots", "loafers", "sandals", "athletic",
];

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await adminListProducts();
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to list" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<Product>;
    if (!body || !body.slug || !body.name) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    if (body.category && !CATEGORIES.includes(body.category)) {
      return NextResponse.json({ ok: false, error: "Invalid category" }, { status: 400 });
    }

    const clean: Product = {
      id: body.id ?? body.slug,
      slug: body.slug.trim(),
      name: body.name.trim(),
      brand: body.brand ?? "ADISA Select",
      description: body.description ?? "",
      imagePath: body.imagePath ?? "",
      extraImages: body.extraImages ?? [],
      sourcePrice: Number(body.sourcePrice ?? 0),
      salePrice: Number(body.salePrice ?? 0),
      currency: "NGN",
      sizesUk: Array.isArray(body.sizesUk) ? body.sizesUk : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      category: (body.category as ProductCategory) ?? "sneakers",
      rating: body.rating ?? 4.6,
      reviews: body.reviews ?? 0,
      isFeatured: Boolean(body.isFeatured),
      inStock: body.inStock !== false,
    };

    const saved = await adminUpsertProduct(clean);
    return NextResponse.json({ ok: true, product: saved });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500 }
    );
  }
}
