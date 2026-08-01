// ============================================================
//  ADISA order persistence.
//
//  When Supabase IS configured (NEXT_PUBLIC_SUPABASE_URL +
//  SUPABASE_SERVICE_ROLE_KEY), orders are saved to the orders
//  table via the admin (service-role) client.
//
//  When Supabase is NOT configured, orders are kept in an
//  in-memory array on this server instance. This lets the dev
//  server run end-to-end without a live database. The array
//  survives across hot-reloads inside the Node process only.
// ============================================================

import { isSupabaseConfigured, getAdminSupabase } from "./supabase";
import type { Order } from "./types";

// In-memory fallback (dev only).
const MEMORY: Map<string, Order> = new Map();

interface OrderRow {
  ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  items: unknown;            // JSON-serialisable array
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "card" | "crypto";
  payment_status: "pending" | "paid" | "failed";
  fulfillment_status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  paid_at?: string | null;
  created_at: string;
}

export async function saveOrder(order: Order): Promise<void> {
  if (!isSupabaseConfigured()) {
    MEMORY.set(order.ref, order);
    return;
  }
  const supabase = getAdminSupabase();
  const row: OrderRow = {
    ref: order.ref,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    delivery_address: order.deliveryAddress,
    delivery_city: order.deliveryCity,
    delivery_state: order.deliveryState,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    fulfillment_status: order.fulfillmentStatus,
    paid_at: order.paidAt ?? null,
    created_at: order.createdAt,
  };
  const { error } = await supabase.from("orders").insert(row);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}

export async function updateOrderPayment(
  ref: string,
  status: "pending" | "paid" | "failed"
): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    const o = MEMORY.get(ref);
    if (!o) return null;
    o.paymentStatus = status;
    if (status === "paid") o.paidAt = new Date().toISOString();
    MEMORY.set(ref, o);
    return o;
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("ref", ref)
    .select("*")
    .single();
  if (error) throw new Error(`Supabase update failed: ${error.message}`);
  return rowToOrder(data);
}

export async function getOrderByRef(ref: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return MEMORY.get(ref) ?? null;
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("ref", ref)
    .single();
  if (error) return null;
  return rowToOrder(data);
}

export async function listOrders(limit = 50): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return Array.from(MEMORY.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    ).slice(0, limit);
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Supabase list failed: ${error.message}`);
  return (data ?? []).map(rowToOrder);
}

// ---------- helpers ----------

function rowToOrder(r: Record<string, unknown>): Order {
  return {
    id: String(r.id ?? ""),
    ref: String(r.ref ?? ""),
    customerName: String(r.customer_name ?? ""),
    customerEmail: String(r.customer_email ?? ""),
    customerPhone: String(r.customer_phone ?? ""),
    deliveryAddress: String(r.delivery_address ?? ""),
    deliveryCity: String(r.delivery_city ?? ""),
    deliveryState: String(r.delivery_state ?? ""),
    items: Array.isArray(r.items) ? (r.items as Order["items"]) : [],
    subtotal: Number(r.subtotal ?? 0),
    deliveryFee: Number(r.delivery_fee ?? 0),
    total: Number(r.total ?? 0),
    paymentMethod: (r.payment_method === "crypto" ? "crypto" : "card") as Order["paymentMethod"],
    paymentStatus: (r.payment_status as Order["paymentStatus"]) ?? "pending",
    fulfillmentStatus: (r.fulfillment_status as Order["fulfillmentStatus"]) ?? "new",
    paidAt: r.paid_at ? String(r.paid_at) : undefined,
    createdAt: String(r.created_at ?? new Date().toISOString()),
  };
}

// ---------- ref generator ----------

export function makeOrderRef(method: "card" | "crypto"): string {
  const prefix = method === "card" ? "ADK" : "ADC";
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${t}-${r}`;
}
