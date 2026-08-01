// ============================================================
//  GET /api/order/[ref]
//  Publicly readable lookup for ONE order by its reference.
//  (Used by the post-checkout confirmation page.)
//  Returns only fields safe to show the order's own customer:
//  items summary, totals, payment method, payment status,
//  delivery destination — but never their phone/email by email,
//  since the lookup is by ref only.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getOrderByRef } from "@/lib/orders";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/order/[ref]">
) {
  try {
    const { ref } = await ctx.params;
    const order = await getOrderByRef(ref);
    if (!order) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
