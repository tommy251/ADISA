"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Truck, Mail } from "lucide-react";
import { formatNGN } from "@/lib/pricing";
import type { Order } from "@/lib/types";

type Phase = "loading" | "paid" | "pending" | "demo" | "missing" | "error";

export default function OrderConfirmationPage({
  refPromise,
}: {
  refPromise: Promise<{ ref: string; demo?: boolean }>;
}) {
  const { ref, demo } = use(refPromise);
  const [order, setOrder] = useState<Order | null>(null);
  const [phase, setPhase] = useState<Phase>(() => (demo ? "demo" : "loading"));

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      while (!cancelled) {
        attempts += 1;
        try {
          const res = await fetch(`/api/order/${ref}`);
          if (res.ok) {
            const data = (await res.json()) as { ok: boolean; order?: Order };
            if (data.ok && data.order) {
              if (!cancelled) {
                setOrder(data.order);
                setPhase(data.order.paymentStatus === "paid" ? "paid" : "pending");
              }
              return;
            }
          } else if (attempts >= 1 && !cancelled) {
            setPhase("missing");
            return;
          }
        } catch {
          if (attempts >= 1 && !cancelled) {
            setPhase("error");
            return;
          }
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
    }

    if (demo) {
      // Best-effort fetch of any in-memory order record for the summary panel.
      fetch(`/api/order/${ref}`)
        .then(async (r) => {
          if (!r.ok) return null;
          const d = (await r.json()) as { ok: boolean; order?: Order };
          if (d.ok && d.order && !cancelled) setOrder(d.order);
          return null;
        })
        .catch(() => {});
      return () => { cancelled = true; };
    }

    poll();
    return () => { cancelled = true; };
  }, [ref, demo]);

  return (
    <div className="min-h-[70vh] bg-[var(--adisa-bone)]">
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-12 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-head text-4xl font-extrabold sm:text-5xl">Order confirmed</h1>
          <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">
            Your reference is <strong className="tracking-widest">{ref}</strong>
            {demo && <em> · demo mode (no live gateway)</em>}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {phase === "loading" && (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Clock className="h-7 w-7 animate-pulse" />
            <p>Looking up your order…</p>
          </div>
        )}

        {phase === "demo" && (
          <Banner
            tone="gold"
            icon={<Mail className="h-5 w-5" />}
            title="Demo mode"
            body={
              "Paystack / Coinbase Commerce aren't wired up yet, so this order " +
              "was created as pending. Receipt + owner emails would normally send here."
            }
          />
        )}

        {phase === "pending" && (
          <Banner
            tone="clay"
            icon={<Clock className="h-5 w-5" />}
            title="Awaiting payment confirmation"
            body="We're waiting for your payment gateway to confirm. This usually takes a few seconds."
          />
        )}

        {phase === "missing" && (
          <Banner
            tone="clay"
            icon={<AlertCircle className="h-5 w-5" />}
            title="Order not found"
            body="We couldn't find that order. If you just paid, give it a moment and refresh."
          />
        )}

        {phase === "error" && (
          <Banner
            tone="clay"
            icon={<AlertCircle className="h-5 w-5" />}
            title="Lookup failed"
            body="Something went wrong reaching the server. Try again in a moment."
          />
        )}

        {phase === "paid" && (
          <Banner
            tone="green"
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Payment received"
            body="We've sent a receipt to your email. ADISA has also been notified and your shoes are being prepared."
          />
        )}

        {/* Order detail table if we have it */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]"
          >
            <h2 className="font-head text-xl font-extrabold">Summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {order.items.map((i) => (
                <li key={`${i.slug}-${i.sizeUk}-${i.color}`} className="flex justify-between">
                  <span>
                    {i.name} · UK {i.sizeUk} · {i.color} ×{i.qty}
                  </span>
                  <span className="font-semibold">{formatNGN(i.unitPrice * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t-2 border-black pt-4 text-sm">
              <Row label="Subtotal" value={formatNGN(order.subtotal)} />
              <Row label="Delivery" value={formatNGN(order.deliveryFee)} />
              <Row label="Total" value={formatNGN(order.total)} strong />
              <Row label="Payment" value={order.paymentMethod === "card" ? "Card (Paystack)" : "Crypto (Coinbase)"} />
              <Row
                label="Payment status"
                value={order.paymentStatus === "paid" ? "Paid" : "Pending"}
              />
            </dl>

            <div className="mt-5 border-t-2 border-black pt-4 text-sm">
              <p className="font-head text-xs uppercase tracking-widest text-muted-foreground">
                Deliver to
              </p>
              <p className="mt-1">
                {order.customerName}<br />
                {order.deliveryAddress}<br />
                {order.deliveryCity}, {order.deliveryState}<br />
                {order.customerPhone}
              </p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000]"
          >
            Keep shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-4 w-4 text-[var(--adisa-clay)]" />
            Delivery in 2–5 working days
          </p>
        </div>
      </div>
    </div>
  );
}

function Banner({
  tone, icon, title, body,
}: {
  tone: "green" | "clay" | "gold";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const tones = {
    green: { border: "border-[var(--adisa-green)]", bg: "bg-[var(--adisa-green)]/5", color: "text-[var(--adisa-green)]" },
    clay:  { border: "border-[var(--adisa-clay)]",  bg: "bg-[var(--adisa-clay)]/5",  color: "text-[var(--adisa-clay)]"  },
    gold:  { border: "border-[var(--adisa-gold)]",  bg: "bg-[var(--adisa-gold)]/5",  color: "text-[var(--adisa-gold)]"  },
  } as const;
  const t = tones[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 border-2 ${t.border} ${t.bg} p-5`}
    >
      <span className={t.color}>{icon}</span>
      <div>
        <p className={`font-head text-lg font-bold ${t.color}`}>{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </motion.div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={strong ? "font-head text-lg font-extrabold" : "font-semibold"}>{value}</dd>
    </div>
  );
}
