// ============================================================
//  POST /api/crypto-checkout
//  Creates a Coinbase Commerce charge and returns the hosted
//  invoice URL. Saves the order row first; the webhook will flip
//  payment_status to "paid" once the buyer pays on-chain.
// ============================================================

import { NextResponse } from "next/server";
import { createCharge, isCryptoConfigured } from "@/lib/coinbase";
import { saveOrder, makeOrderRef } from "@/lib/orders";
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
    const ref = makeOrderRef("crypto");

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
      paymentMethod: "crypto",
      paymentStatus: "pending",
      fulfillmentStatus: "new",
      createdAt: new Date().toISOString(),
    };

    await saveOrder(order);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Soft-success when Coinbase isn't wired up yet (dev mode).
    if (!isCryptoConfigured()) {
      if (isEmailConfigured()) {
        await Promise.allSettled([
          sendCustomerReceipt({ ...order, paymentMethod: "Crypto (Coinbase — test mode)" }),
          sendOwnerNewOrderNotification({ ...order, paymentMethod: "Crypto (Coinbase — test mode)" }),
        ]);
      }
      return NextResponse.json({
        ok: true,
        ref,
        redirectUrl: `/order/${ref}?demo=1`,
      });
    }

    const itemNames = body.items.map((i) => i.name).join(", ");
    const charge = await createCharge({
      name: `ADISA order ${ref}`,
      description: `${itemNames} (delivered to ${body.state})`,
      localPrice: { amount: String(total), currency: "NGN" },
      pricingType: "fixed_price",
      metadata: { order_ref: ref, customer_email: order.customerEmail },
      redirectUrl: `${siteUrl}/order/${ref}`,
      cancelUrl: `${siteUrl}/cart`,
    });

    return NextResponse.json({
      ok: true,
      ref,
      redirectUrl: charge.hosted_url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Crypto checkout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
