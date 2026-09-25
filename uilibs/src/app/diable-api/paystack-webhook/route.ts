// ============================================================
//  POST /api/paystack-webhook
//  Verifies HMAC-SHA512 signature from Paystack, then flips the
//  matching order to "paid" and sends both receipt + owner emails.
// ============================================================

import { NextResponse } from "next/server";
import { paystackSignatureIsValid, verifyTransaction } from "@/lib/paystack";
import { updateOrderPayment } from "@/lib/orders";
import {
  sendCustomerReceipt,
  sendOwnerNewOrderNotification,
  isEmailConfigured,
} from "@/lib/email";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // If secrets aren't set, we can't verify — refuse silently.
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ ok: false, error: "Paystack not configured" }, { status: 503 });
  }

  if (!paystackSignatureIsValid(raw, signature)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; data: { reference: string; status: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }

  // We only act on successful charge. Refunds / failures could be
  // handled later by checking event.event.
  if (event.event !== "charge.success") {
    return NextResponse.json({ ok: true, ignored: event.event });
  }

  const ref = event.data.reference;
  try {
    // Belt-and-braces: verify with Paystack directly.
    const verified = await verifyTransaction(ref);
    if (verified.status !== "success") {
      await updateOrderPayment(ref, "failed");
      return NextResponse.json({ ok: true, verified: "failed" });
    }

    const order = await updateOrderPayment(ref, "paid");
    if (order && isEmailConfigured()) {
      await Promise.allSettled([
        sendCustomerReceipt({ ...order, paymentMethod: "Card (Paystack)" }),
        sendOwnerNewOrderNotification({ ...order, paymentMethod: "Card (Paystack)" }),
      ]);
    }
    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
