// ============================================================
//  POST /api/crypto-webhook
//  Coinbase Commerce "Webhook Notifications" — HMAC-SHA256 with
//  the COINBASE_WEBHOOK_SECRET. We accept confirmed/pending events
//  and flip the matching order to "paid".
// ============================================================

import { NextResponse } from "next/server";
import { coinbaseWebhookIsValid } from "@/lib/coinbase";
import { updateOrderPayment } from "@/lib/orders";
import {
  sendCustomerReceipt,
  sendOwnerNewOrderNotification,
  isEmailConfigured,
} from "@/lib/email";

interface CoinbaseEvent {
  id: string;
  type: string;                              // e.g. "charge:confirmed"
  data: {
    code: string;                            // human-readable charge code
    metadata?: { order_ref?: string };
    timeline?: Array<{ status: string }>;
  };
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-cc-webhook-signature");

  if (!process.env.COINBASE_WEBHOOK_SECRET || !process.env.COINBASE_API_KEY) {
    return NextResponse.json({ ok: false, error: "Coinbase not configured" }, { status: 503 });
  }

  if (!coinbaseWebhookIsValid(raw, signature)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  let evt: CoinbaseEvent;
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }

  const ref = evt.data?.metadata?.order_ref ?? evt.data?.code;
  if (!ref) return NextResponse.json({ ok: false, error: "No ref in event" }, { status: 400 });

  // Coinbase events include "charge:confirmed", "charge:pending",
  // "charge:failed", "charge:delayed", "charge:resolved".
  if (evt.type === "charge:failed") {
    await updateOrderPayment(ref, "failed");
    return NextResponse.json({ ok: true, ref, status: "failed" });
  }

  if (evt.type !== "charge:confirmed" && evt.type !== "charge:resolved") {
    // Pending / delayed — keep as pending.
    return NextResponse.json({ ok: true, ref, ignored: evt.type });
  }

  try {
    const order = await updateOrderPayment(ref, "paid");
    if (order && isEmailConfigured()) {
      await Promise.allSettled([
        sendCustomerReceipt({ ...order, paymentMethod: "Crypto (Coinbase Commerce)" }),
        sendOwnerNewOrderNotification({ ...order, paymentMethod: "Crypto (Coinbase Commerce)" }),
      ]);
    }
    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Webhook handler failed" },
      { status: 500 }
    );
  }
}
