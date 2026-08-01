// ============================================================
//  POST /api/checkout
//  Initializes a Paystack transaction for a Naira card payment.
//  Saves the order to Supabase (or memory) and returns the
//  Paystack hosted authorization URL for the client to redirect.
// ============================================================

import { NextResponse } from "next/server";
import { initTransaction, isPaystackConfigured } from "@/lib/paystack";
import {
  saveOrder,
  makeOrderRef,
} from "@/lib/orders";
import { deliveryFeeFor } from "@/lib/delivery";
import {
  sendCustomerReceipt,
  sendOwnerNewOrderNotification,
  isEmailConfigured,
} from "@/lib/email";
import type { CartItem, CustomerInfo, Order } from "@/lib/types";

interface Body extends CustomerInfo {
  items: CartItem[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = body.items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
    const deliveryFee = deliveryFeeFor(body.state || "Lagos");
    const total = subtotal + deliveryFee;
    const ref = makeOrderRef("card");

    const order: Order = {
      id: ref,
      ref,
      customerName: body.fullName.trim(),
      customerEmail: body.email.trim(),
      customerPhone: body.phone.trim(),
      deliveryAddress: body.address.trim(),
      deliveryCity: body.city.trim(),
      deliveryState: body.state.trim(),
      items: body.items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: "card",
      paymentStatus: "pending",
      fulfillmentStatus: "new",
      createdAt: new Date().toISOString(),
    };

    // Persist BEFORE redirecting to Paystack — the webhook will
    // later mark this same ref as paid.
    await saveOrder(order);

    // If the store hasn't configured Paystack yet, return a
    // soft-success so the demo flow can still reach the receipt.
    if (!isPaystackConfigured()) {
      // Send emails best-effort, then short-circuit.
      if (isEmailConfigured()) {
        await Promise.allSettled([
          sendCustomerReceipt({ ...order, paymentMethod: "Card (Paystack — test mode)" }),
          sendOwnerNewOrderNotification({ ...order, paymentMethod: "Card (Paystack — test mode)" }),
        ]);
      }
      return NextResponse.json({
        ok: true,
        ref,
        redirectUrl: `/order/${ref}?demo=1`,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const init = await initTransaction({
      email: order.customerEmail,
      amount: total * 100, // kobo
      reference: ref,
      callbackUrl: `${siteUrl}/order/${ref}`,
      metadata: {
        custom_fields: [
          { display_name: "Customer", variable_name: "customer", value: order.customerName },
          { display_name: "Phone", variable_name: "phone", value: order.customerPhone },
          { display_name: "Delivery", variable_name: "delivery",
            value: `${order.deliveryAddress}, ${order.deliveryCity}, ${order.deliveryState}` },
        ],
        order_ref: ref,
      },
    });

    return NextResponse.json({
      ok: true,
      ref,
      redirectUrl: init.authorization_url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
