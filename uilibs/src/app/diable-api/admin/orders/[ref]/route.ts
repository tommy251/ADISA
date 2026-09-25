// ============================================================
//  /api/admin/orders/[ref]
//   PATCH -> update fulfillment_status (new|processing|shipped|delivered|cancelled)
//           and/or payment_status
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { isSupabaseConfigured, getAdminSupabase } from "@/lib/supabase";

const FULFILL = ["new", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT = ["pending", "paid", "failed"] as const;

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/orders/[ref]">
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { ref } = await ctx.params;
    const body = (await req.json()) as {
      fulfillmentStatus?: (typeof FULFILL)[number];
      paymentStatus?: (typeof PAYMENT)[number];
    };

    const patch: Record<string, unknown> = {};
    if (body.fulfillmentStatus) {
      if (!FULFILL.includes(body.fulfillmentStatus)) {
        return NextResponse.json({ ok: false, error: "Bad fulfillment status" }, { status: 400 });
      }
      patch.fulfillment_status = body.fulfillmentStatus;
    }
    if (body.paymentStatus) {
      if (!PAYMENT.includes(body.paymentStatus)) {
        return NextResponse.json({ ok: false, error: "Bad payment status" }, { status: 400 });
      }
      patch.payment_status = body.paymentStatus;
      if (body.paymentStatus === "paid") patch.paid_at = new Date().toISOString();
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "Nothing to update" }, { status: 400 });
    }

    // Memory-mode fallback: nothing meaningful to persist (the order is
    // already in MEMORY/Supabase via saveOrder). For demo, just acknowledge.
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, ref, ...patch, devNote: "in-memory mode" });
    }

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("orders")
      .update(patch)
      .eq("ref", ref)
      .select("*")
      .single();
    if (error) {
      return NextResponse.json(
        { ok: false, error: `Supabase update failed: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, ref, order: data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to update order" },
      { status: 500 }
    );
  }
}
