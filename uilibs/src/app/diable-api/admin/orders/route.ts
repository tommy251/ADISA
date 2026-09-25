// ============================================================
//  /api/admin/orders
//   GET -> list recent orders (newest first)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { listOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const limit = Math.min(
      200,
      Math.max(10, Number(req.nextUrl.searchParams.get("limit")) || 50)
    );
    const items = await listOrders(limit);
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to list orders" },
      { status: 500 }
    );
  }
}
