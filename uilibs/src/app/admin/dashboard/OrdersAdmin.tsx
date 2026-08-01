"use client";

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { formatNGN } from "@/lib/pricing";
import type { Order } from "@/lib/types";

const FULFILL: Order["fulfillmentStatus"][] = [
  "new", "processing", "shipped", "delivered", "cancelled",
];
const PAYMENT: Order["paymentStatus"][] = ["pending", "paid", "failed"];

export function OrdersAdmin({
  orders, loading, onUpdated,
}: {
  orders: Order[];
  loading: boolean;
  onUpdated: () => void;
}) {
  const [openRef, setOpenRef] = useState<string | null>(null);

  async function patchFulfill(ref: string, status: Order["fulfillmentStatus"]) {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(ref)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfillmentStatus: status }),
    });
    if (res.ok) onUpdated();
  }
  async function patchPayment(ref: string, status: Order["paymentStatus"]) {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(ref)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: status }),
    });
    if (res.ok) onUpdated();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--adisa-clay)]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="rounded border-2 border-black bg-white px-4 py-8 text-center text-sm text-muted-foreground">
        No orders yet. Run a test checkout to see one here.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((o) => {
        const open = openRef === o.ref;
        const created = new Date(o.createdAt).toLocaleString("en-NG", {
          dateStyle: "medium", timeStyle: "short",
        });
        return (
          <div key={o.ref} className="border-2 border-black bg-white shadow-[4px_4px_0_#000]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-mono text-xs">{o.ref}</p>
                <p className="mt-0.5 truncate text-sm font-semibold">
                  {o.customerName} · {o.customerEmail}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{created}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-head font-bold">{formatNGN(o.total)}</span>
                <Badge text={o.paymentStatus} tone={o.paymentStatus === "paid" ? "green" : o.paymentStatus === "failed" ? "clay" : "gold"} />
                <Badge text={o.fulfillmentStatus} tone="ink" />
                <button
                  type="button"
                  onClick={() => setOpenRef(open ? null : o.ref)}
                  aria-label="Toggle details"
                  className="inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#000]"
                >
                  <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {open && (
              <div className="border-t-2 border-black/10 bg-zinc-50 px-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-head text-xs uppercase tracking-widest text-muted-foreground">Delivery</p>
                    <p className="mt-1 text-sm">
                      {o.customerName}<br />
                      {o.deliveryAddress}<br />
                      {o.deliveryCity}, {o.deliveryState}<br />
                      {o.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="font-head text-xs uppercase tracking-widest text-muted-foreground">Items</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {o.items.map((i) => (
                        <li key={`${i.slug}-${i.sizeUk}-${i.color}`} className="flex justify-between">
                          <span>{i.name} · UK {i.sizeUk} · {i.color} ×{i.qty}</span>
                          <span>{formatNGN(i.unitPrice * i.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">
                      Subtotal {formatNGN(o.subtotal)} · Delivery {formatNGN(o.deliveryFee)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-black/10 pt-3">
                  <label className="block text-sm">
                    <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
                      Fulfillment
                    </span>
                    <select
                      value={o.fulfillmentStatus}
                      onChange={(e) => patchFulfill(o.ref, e.target.value as Order["fulfillmentStatus"])}
                      className="mt-1 border-2 border-black bg-white px-2 py-1 text-sm"
                    >
                      {FULFILL.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
                      Payment
                    </span>
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => patchPayment(o.ref, e.target.value as Order["paymentStatus"])}
                      className="mt-1 border-2 border-black bg-white px-2 py-1 text-sm"
                    >
                      {PAYMENT.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Badge({ text, tone }: { text: string; tone: "green" | "gold" | "clay" | "ink" }) {
  const tones = {
    green: "bg-[var(--adisa-green)] text-white",
    gold:  "bg-[var(--adisa-gold)] text-white",
    clay:  "bg-[var(--adisa-clay)] text-white",
    ink:   "bg-[var(--adisa-ink)] text-[var(--adisa-bone)]",
  } as const;
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest ${tones[tone]}`}>
      {text}
    </span>
  );
}
