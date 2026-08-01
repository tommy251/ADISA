"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Package, Banknote, TrendingUp, LogOut,
  Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { formatNGN } from "@/lib/pricing";
import type { Order, Product } from "@/lib/types";
import { ProductsAdmin } from "./ProductsAdmin";
import { OrdersAdmin } from "./OrdersAdmin";

type Tab = "overview" | "orders" | "products";

interface Stats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  revenue: number;
  products: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [err, setErr] = useState("");

  // ---------- auth guard ----------
  useEffect(() => {
    // Quickly hit a protected endpoint to test the cookie.
    fetch("/api/admin/orders?limit=1")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/admin");
          return null;
        }
        setReady(true);
        return null;
      })
      .catch(() => router.replace("/admin"));
  }, [router]);

  // ---------- orders ----------
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/orders?limit=100");
      const data = await res.json();
      if (data.ok) setOrders(data.items);
      else setErr(data.error || "Failed to load orders");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // ---------- products ----------
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.ok) setProducts(data.items);
      else setErr(data.error || "Failed to load products");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ---------- auth guard + initial load ----------
  // Hits a protected endpoint, then kicks off the data loads. All
  // setState happens in async callbacks (after `await`) so React's
  // `set-state-in-effect` lint stays happy.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/orders?limit=1")
      .then(async (r) => {
        if (cancelled) return;
        if (r.status === 401) {
          router.replace("/admin");
          return;
        }
        setReady(true);
        await Promise.all([loadOrders(), loadProducts()]);
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin");
      });
    return () => { cancelled = true; };
  }, [router, loadOrders, loadProducts]);

  // ---------- stats ----------
  const stats: Stats = {
    totalOrders: orders.length,
    paidOrders: orders.filter((o) => o.paymentStatus === "paid").length,
    pendingOrders: orders.filter((o) => o.paymentStatus === "pending").length,
    revenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((n, o) => n + o.total, 0),
    products: products.length,
  };

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  }

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--adisa-bone)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--adisa-clay)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--adisa-bone)]">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b-2 border-black bg-[var(--adisa-ink)] text-[var(--adisa-bone)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-head text-lg font-extrabold tracking-widest">
              ADISA <span className="text-[var(--adisa-gold)]">·admin·</span>
            </Link>
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-[var(--adisa-bone)]/60">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden text-xs uppercase tracking-widest text-[var(--adisa-bone)]/70 hover:text-[var(--adisa-gold)] sm:inline-block"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 border-2 border-[var(--adisa-bone)] px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-[var(--adisa-bone)] hover:text-[var(--adisa-ink)]"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* tab bar */}
      <nav className="border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
          <TabButton label="Overview" active={tab === "overview"} onClick={() => setTab("overview")} />
          <TabButton label={`Orders${stats.totalOrders ? ` (${stats.totalOrders})` : ""}`} active={tab === "orders"} onClick={() => setTab("orders")} />
          <TabButton label={`Products${stats.products ? ` (${stats.products})` : ""}`} active={tab === "products"} onClick={() => setTab("products")} />
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {err && (
          <div className="mb-6 flex items-start gap-2 border-2 border-[var(--adisa-clay)] bg-[var(--adisa-clay)]/5 px-3 py-2 text-sm text-[var(--adisa-clay)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {err}
          </div>
        )}

        {tab === "overview" && (
          <Overview stats={stats} orders={orders} products={products} />
        )}

        {tab === "orders" && (
          <div className="flex items-center justify-between pb-3">
            <h2 className="font-head text-2xl font-extrabold">Orders</h2>
            <button
              type="button"
              onClick={loadOrders}
              disabled={loadingOrders}
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest shadow-[3px_3px_0_#000] disabled:opacity-60"
            >
              <RefreshCw className={`h-3 w-3 ${loadingOrders ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        )}
        {tab === "orders" && (
          <OrdersAdmin
            orders={orders}
            loading={loadingOrders}
            onUpdated={loadOrders}
          />
        )}

        {tab === "products" && (
          <>
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-head text-2xl font-extrabold">Products</h2>
              <button
                type="button"
                onClick={loadProducts}
                disabled={loadingProducts}
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest shadow-[3px_3px_0_#000] disabled:opacity-60"
              >
                <RefreshCw className={`h-3 w-3 ${loadingProducts ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
            <ProductsAdmin
              products={products}
              loading={loadingProducts}
              onSaved={loadProducts}
            />
          </>
        )}
      </main>
    </div>
  );
}

function TabButton({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-[3px] px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-[var(--adisa-clay)] text-[var(--adisa-ink)]"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Overview({
  stats, orders, products,
}: { stats: Stats; orders: Order[]; products: Product[] }) {
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const lowStock = products.filter((p) => !p.inStock).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Total orders"
          value={String(stats.totalOrders)}
          tone="ink"
        />
        <StatCard
          icon={<Banknote className="h-5 w-5" />}
          label="Paid revenue"
          value={formatNGN(stats.revenue)}
          tone="green"
          sub={`${stats.paidOrders} paid · ${stats.pendingOrders} pending`}
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Products"
          value={String(stats.products)}
          tone="clay"
          sub={lowStock > 0 ? `${lowStock} out of stock` : "all in stock"}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Avg. order"
          value={stats.paidOrders ? formatNGN(Math.round(stats.revenue / stats.paidOrders)) : "—"}
          tone="gold"
        />
      </div>

      <div className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000]">
        <h3 className="font-head text-lg font-extrabold">Recent orders</h3>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No orders yet. Make a test checkout to see them appear here.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10 text-sm">
            {recent.map((o) => (
              <li key={o.ref} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="font-mono text-xs">{o.ref}</span>
                <span className="font-semibold">{formatNGN(o.total)}</span>
                <span className="text-xs text-muted-foreground">{o.customerName}</span>
                <Badge
                  text={o.paymentStatus === "paid" ? "Paid" : "Pending"}
                  tone={o.paymentStatus === "paid" ? "green" : "gold"}
                />
                <Badge text={o.fulfillmentStatus} tone="ink" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, sub, tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone: "ink" | "green" | "clay" | "gold";
}) {
  const tones = {
    ink:   "bg-[var(--adisa-ink)] text-[var(--adisa-bone)]",
    green: "bg-white border-2 border-black shadow-[4px_4px_0_#000]",
    clay:  "bg-[var(--adisa-clay)] text-white border-2 border-black shadow-[4px_4px_0_#000]",
    gold:  "bg-[var(--adisa-gold)] text-white border-2 border-black shadow-[4px_4px_0_#000]",
  } as const;
  return (
    <div className={`p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest opacity-80">{label}</span>
        <span className="opacity-90">{icon}</span>
      </div>
      <p className="mt-2 font-head text-2xl font-extrabold">{value}</p>
      {sub && <p className="mt-1 text-xs opacity-80">{sub}</p>}
    </div>
  );
}

function Badge({ text, tone }: { text: string; tone: "green" | "gold" | "ink" }) {
  const tones = {
    green: "bg-[var(--adisa-green)] text-white",
    gold:  "bg-[var(--adisa-gold)] text-white",
    ink:   "bg-[var(--adisa-ink)] text-[var(--adisa-bone)]",
  } as const;
  const t = tones[tone];
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest ${t}`}>
      {text}
    </span>
  );
}
