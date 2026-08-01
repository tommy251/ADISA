"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ArrowRight, CreditCard, Bitcoin, ShieldCheck, Truck,
  Check, Loader2, AlertCircle, Lock,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { formatNGN } from "@/lib/pricing";
import { deliveryFeeFor, deliveryWindow } from "@/lib/delivery";
import { NG_STATES } from "@/lib/types";

type Method = "card" | "crypto";
type Status = "idle" | "submitting" | "error" | "redirecting";

const EMPTY = {
  fullName: "", email: "", phone: "",
  address: "", city: "", state: "Lagos",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items   = useCart((s) => s.items);
  const clear   = useCart((s) => s.clear);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.unitPrice * i.qty, 0),
    [items]
  );

  const [form, setForm] = useState(EMPTY);
  const [method, setMethod] = useState<Method>("card");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const deliveryFee = items.length > 0 ? deliveryFeeFor(form.state) : 0;
  const total = subtotal + deliveryFee;
  const windowDays = deliveryWindow(form.state);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.fullName.trim()) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email.";
    if (!/^[0-9+\-\s()]{7,}$/.test(form.phone)) return "Enter a valid phone number.";
    if (!form.address.trim()) return "Enter your delivery address.";
    if (!form.city.trim()) return "Enter your city.";
    if (!form.state.trim()) return "Pick your state.";
    if (items.length === 0) return "Your cart is empty.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setStatus("error");
      return;
    }
    setError("");
    setStatus("submitting");

    try {
      const endpoint = method === "card" ? "/api/checkout" : "/api/crypto-checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Checkout failed. Try again.");
      }

      setStatus("redirecting");
      // Both providers return a hosted URL to send the customer to.
      if (data.redirectUrl) {
        clear();
        window.location.href = data.redirectUrl;
        return;
      }
      // Shouldn't happen, but fall back to a confirmation page.
      router.push(`/order/${data.ref ?? "pending"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setStatus("error");
    }
  }

  // ---------- Empty cart guard ----------
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[var(--adisa-bone)]">
        <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-12 text-[var(--adisa-bone)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[var(--adisa-bone)]/80 hover:text-[var(--adisa-gold)]">
              <ArrowLeft className="h-4 w-4" /> Back to cart
            </Link>
            <h1 className="mt-4 font-head text-4xl font-extrabold sm:text-5xl">Checkout</h1>
          </div>
        </section>
        <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
          <h2 className="font-head text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-3 text-sm text-muted-foreground">Pick a few shoes first, then come back to checkout.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000]">
            Browse shoes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--adisa-bone)]">
      {/* header */}
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-12 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[var(--adisa-bone)]/80 hover:text-[var(--adisa-gold)]">
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </Link>
          <h1 className="mt-4 font-head text-4xl font-extrabold sm:text-5xl">Checkout</h1>
          <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">
            Card via Paystack or crypto via Coinbase Commerce. Insured delivery to {form.state}.
          </p>
        </div>
      </section>

      <form onSubmit={onSubmit} className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* ---------- LEFT: details ---------- */}
        <div className="space-y-10">
          {/* contact */}
          <fieldset className="border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
            <legend className="px-2 font-head text-sm uppercase tracking-widest text-[var(--adisa-clay)]">
              Your details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Phone" required>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Email" required full>
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
            </div>
          </fieldset>

          {/* delivery */}
          <fieldset className="border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
            <legend className="px-2 font-head text-sm uppercase tracking-widest text-[var(--adisa-clay)]">
              Delivery address
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street address" required full>
                <textarea
                  rows={2}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="City / Town" required>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="State" required>
                <select
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={inputCls}
                  required
                >
                  {NG_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-[var(--adisa-clay)]" />
              Estimated delivery: <strong>{windowDays.lo}–{windowDays.hi} working days</strong>
              {" "}· fee <strong>{formatNGN(deliveryFee)}</strong>
            </p>
          </fieldset>

          {/* payment method */}
          <fieldset className="border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
            <legend className="px-2 font-head text-sm uppercase tracking-widest text-[var(--adisa-clay)]">
              Payment method
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard
                selected={method === "card"}
                onSelect={() => setMethod("card")}
                icon={<CreditCard className="h-6 w-6" />}
                title="Card (Naira)"
                body="Pay with any Nigerian (or intl.) Naira card via Paystack."
              />
              <MethodCard
                selected={method === "crypto"}
                onSelect={() => setMethod("crypto")}
                icon={<Bitcoin className="h-6 w-6" />}
                title="Crypto"
                body="BTC, ETH or USDC hosted invoice via Coinbase Commerce."
              />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-4 w-4" /> Payments are processed by Paystack or Coinbase Commerce.
              ADISA never sees or stores your card or wallet details.
            </p>
          </fieldset>
        </div>

        {/* ---------- RIGHT: order summary ---------- */}
        <aside className="h-fit border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000] lg:sticky lg:top-24">
          <h2 className="font-head text-xl font-extrabold">Order summary</h2>

          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {items.map((i) => (
              <li key={`${i.slug}-${i.sizeUk}-${i.color}`} className="flex items-center gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-black bg-zinc-100">
                  <Image src={i.imagePath} alt={i.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold leading-tight">{i.name}</div>
                  <div className="text-xs text-muted-foreground">
                    UK {i.sizeUk} · {i.color} · ×{i.qty}
                  </div>
                </div>
                <div className="font-head text-sm font-bold">
                  {formatNGN(i.unitPrice * i.qty)}
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t-2 border-black pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{formatNGN(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery ({form.state})</dt>
              <dd className="font-semibold">{formatNGN(deliveryFee)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-black/20 pt-2">
              <dt className="font-head text-base font-bold">Total</dt>
              <dd className="font-head text-2xl font-extrabold">
                {formatNGN(total)}
              </dd>
            </div>
          </dl>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 flex items-start gap-2 border-2 border-[var(--adisa-clay)] bg-[var(--adisa-clay)]/5 px-3 py-2 text-xs font-medium text-[var(--adisa-clay)]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={status === "submitting" || status === "redirecting"}
            className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head text-lg font-bold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:cursor-wait disabled:opacity-70"
          >
            {status === "submitting" || status === "redirecting" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {status === "redirecting" ? "Redirecting…" : "Preparing payment…"}
              </>
            ) : (
              <>
                {method === "card" ? "Pay with card" : "Pay with crypto"}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--adisa-green)]" />
              Insured delivery to all 36 states + FCT
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[var(--adisa-gold)]" />
              Receipt email sent to you · new-order email sent to ADISA
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

// ---------- small inputs ----------

const inputCls =
  "w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:bg-[var(--adisa-bone)]";

function Field({
  label, required, full, children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`${full ? "sm:col-span-2" : ""} flex flex-col gap-1 text-sm`}>
      <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-[var(--adisa-clay)]">*</span>}
      </span>
      {children}
    </label>
  );
}

function MethodCard({
  selected, onSelect, icon, title, body,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-start gap-3 border-2 p-4 text-left transition ${
        selected
          ? "border-black bg-[var(--adisa-ink)] text-white shadow-[4px_4px_0_#000]"
          : "border-black bg-white hover:bg-zinc-50"
      }`}
    >
      <span className={selected ? "text-[var(--adisa-gold)]" : "text-[var(--adisa-clay)]"}>{icon}</span>
      <span className="flex-1">
        <span className="block font-head font-bold">{title}</span>
        <span className={`mt-0.5 block text-xs ${selected ? "text-white/80" : "text-muted-foreground"}`}>
          {body}
        </span>
      </span>
      <span
        className={`mt-1 inline-flex h-5 w-5 items-center justify-center border-2 ${
          selected ? "border-[var(--adisa-gold)] bg-[var(--adisa-gold)] text-[var(--adisa-ink)]" : "border-black bg-white"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
