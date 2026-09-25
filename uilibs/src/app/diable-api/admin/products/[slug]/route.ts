// ============================================================
//  /api/admin/products/[slug]
//   PATCH  -> upsert by slug (same shape as POST /products)
//   DELETE -> remove by slug
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { adminDeleteProduct, adminUpsertProduct } from "@/lib/admin-products";
import type { Product, ProductCategory } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/products/[slug]">
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await ctx.params;
    const body = (await req.json()) as Partial<Product>;
    if (body.slug && body.slug !== slug) {
      return NextResponse.json(
        { ok: false, error: "Slug in body must match URL" },
        { status: 400 }
      );
    }

    const clean: Product = {
      id: body.id ?? slug,
      slug,
      name: (body.name ?? slug).trim(),
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
      { ok: false, error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/products/[slug]">
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await ctx.params;
    await adminDeleteProduct(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
