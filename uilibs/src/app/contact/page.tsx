"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { AnimateOnView } from "@/components/site/AnimateOnView";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send");
      setStatus("ok");
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to send");
      setStatus("error");
    }
  }

  const inputCls = "w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:bg-[var(--adisa-bone)]";

  return (
    <div className="bg-[var(--adisa-bone)]">
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-14 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-head text-4xl font-extrabold sm:text-5xl">Talk to us</h1>
          <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">
            Sizes, returns, wholesale or just a kind word — write us below.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_300px]">
          {/* form */}
          <form
            onSubmit={submit}
            className="border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Name *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${inputCls} mt-1`}
                />
              </label>
              <label className="block text-sm">
                <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Email *</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`${inputCls} mt-1`}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Subject</span>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={`${inputCls} mt-1`}
                  placeholder="Refund / sizing / wholesale / press"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Message *</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputCls} mt-1`}
                />
              </label>
            </div>

            {status === "error" && err && (
              <p className="mt-4 flex items-start gap-2 border-2 border-[var(--adisa-clay)] bg-[var(--adisa-clay)]/5 px-3 py-2 text-sm text-[var(--adisa-clay)]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {err}
              </p>
            )}
            {status === "ok" && (
              <p className="mt-4 flex items-start gap-2 border-2 border-[var(--adisa-green)] bg-[var(--adisa-green)]/5 px-3 py-2 text-sm text-[var(--adisa-green)]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Thanks — we answer within 24 hours.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000] disabled:opacity-70"
            >
              {status === "sending" ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
              ) : (
                <>Send message <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* aside */}
          <AnimateOnView>
            <aside className="space-y-4">
              <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]">
                <Mail className="h-6 w-6 text-[var(--adisa-clay)]" />
                <p className="mt-3 font-head text-sm uppercase tracking-widest">Email</p>
                <p className="mt-1 text-sm">hello@adisa.shoes</p>
              </div>
              <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]">
                <Phone className="h-6 w-6 text-[var(--adisa-clay)]" />
                <p className="mt-3 font-head text-sm uppercase tracking-widest">Phone / WhatsApp</p>
                <p className="mt-1 text-sm">+234 800 000 0000</p>
              </div>
              <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]">
                <MapPin className="h-6 w-6 text-[var(--adisa-clay)]" />
                <p className="mt-3 font-head text-sm uppercase tracking-widest">Based in</p>
                <p className="mt-1 text-sm">Lagos, Nigeria · delivering nationwide</p>
              </div>
              <Link
                href="/faq"
                className="block border-2 border-black bg-[var(--adisa-ink)] p-5 text-center font-head font-semibold text-white shadow-[4px_4px_0_#000]"
              >
                Read the FAQ
              </Link>
            </aside>
          </AnimateOnView>
        </div>
      </section>
    </div>
  );
}
