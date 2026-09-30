"use client";

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { formatNGN } from "@/lib/pricing";
import { getPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";

const FULFILL = ["new", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT = ["pending", "paid", "failed"];

export function OrdersAdmin({
  orders, loading, onUpdated,
}: {
  orders: any[];
  loading: boolean;
  onUpdated: () => void;
}) {
  const [openRef, setOpenRef] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function patchFulfill(ref: string, status: string) {
    if (!isSupabaseConfigured()) {
      alert("Supabase is not configured");
      return;
    }
    setUpdating(ref);
    try {
      const supabase = getPublicSupabase();
      const { error } = await supabase
        .from("orders")
        .update({ fulfillment_status: status })
        .eq("ref", ref);
      if (error) throw error;
      onUpdated();
    } catch (e: any) {
      alert(e.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  async function patchPayment(ref: string, status: string) {
    if (!isSupabaseConfigured()) {
      alert("Supabase is not configured");
      return;
    }
    setUpdating(ref);
    try {
      const supabase = getPublicSupabase();
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: status })
        .eq("ref", ref);
      if (error) throw error;
      onUpdated();
    } catch (e: any) {
      alert(e.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  // Safely get a date string from the order (handles both camelCase and snake_case)
  function getOrderDate(o: any): string {
    const dateStr = o.created_at || o.createdAt || o.date || "";
    if (!dateStr) return "Unknown date";
    try {
      return new Date(dateStr).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Invalid date";
    }
  }

  // Safely get a value, handling both camelCase and snake_case
  function getVal(o: any, camel: string, snake: string): any {
    return o[camel] !== undefined ? o[camel] : o[snake];
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
        const ref = o.ref || "";
        const open = openRef === ref;
        const created = getOrderDate(o);
        const customerName = getVal(o, "customerName", "customer_name") || "Unknown";
        const customerEmail = getVal(o, "customerEmail", "customer_email") || "";
        const customerPhone = getVal(o, "customerPhone", "customer_phone") || "";
        const deliveryAddress = getVal(o, "deliveryAddress", "delivery_address") || "";
        const deliveryCity = getVal(o, "deliveryCity", "delivery_city") || "";
        const deliveryState = getVal(o, "deliveryState", "delivery_state") || "";
        const paymentStatus = getVal(o, "paymentStatus", "payment_status") || "pending";
        const fulfillmentStatus = getVal(o, "fulfillmentStatus", "fulfillment_status") || "new";
        const total = Number(getVal(o, "total", "total")) || 0;
        const subtotal = Number(getVal(o, "subtotal", "subtotal")) || 0;
        const deliveryFee = Number(getVal(o, "deliveryFee", "delivery_fee")) || 0;
        const items = getVal(o, "items", "items") || [];

        return (
          <div key={ref} className="border-2 border-black bg-white shadow-[4px_4px_0_#000]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-mono text-xs">{ref}</p>
                <p className="mt-0.5 truncate text-sm font-semibold">
                  {customerName} · {customerEmail}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{created}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-head font-bold">{formatNGN(total)}</span>
                <Badge text={paymentStatus} tone={paymentStatus === "paid" ? "green" : paymentStatus === "failed" ? "clay" : "gold"} />
                <Badge text={fulfillmentStatus} tone="ink" />
                <button
                  type="button"
                  onClick={() => setOpenRef(open ? null : ref)}
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
                      {customerName}<br />
                      {deliveryAddress}<br />
                      {deliveryCity}, {deliveryState}<br />
                      {customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="font-head text-xs uppercase tracking-widest text-muted-foreground">Items</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {Array.isArray(items) && items.map((i: any, idx: number) => (
                        <li key={`${i.slug || idx}-${i.sizeUk || ""}-${i.color || ""}`} className="flex justify-between">
                          <span>{i.name || "Item"} · UK {i.sizeUk || "?"} · {i.color || "?"} ×{i.qty || 1}</span>
                          <span>{formatNGN((Number(i.unitPrice) || 0) * (Number(i.qty) || 1))}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">
                      Subtotal {formatNGN(subtotal)} · Delivery {formatNGN(deliveryFee)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-black/10 pt-3">
                  <label className="block text-sm">
                    <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
                      Fulfillment
                    </span>
                    <select
                      value={fulfillmentStatus}
                      onChange={(e) => patchFulfill(ref, e.target.value)}
                      disabled={updating === ref}
                      className="mt-1 border-2 border-black bg-white px-2 py-1 text-sm disabled:opacity-60"
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
                      value={paymentStatus}
                      onChange={(e) => patchPayment(ref, e.target.value)}
                      disabled={updating === ref}
                      className="mt-1 border-2 border-black bg-white px-2 py-1 text-sm disabled:opacity-60"
                    >
                      {PAYMENT.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  {updating === ref && (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--adisa-clay)]" />
                  )}
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