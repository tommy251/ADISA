import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Truck, Wallet, Star } from "lucide-react";
import { AnimateOnView } from "@/components/site/AnimateOnView";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export const metadata: Metadata = {
  title: "Why ADISA? — The story behind the shoes",
  description:
    "ADISA ·Àdísà· is named for Darosa, a Yoruba man who carried grace. We sell premium men's shoes fairly priced for every Nigerian foot.",
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--adisa-bone)]">
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-16 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <AnimateOnView>
            <AnimatedGradientText className="inline font-head text-sm uppercase tracking-widest">
              The story
            </AnimatedGradientText>
            <h1 className="mt-3 font-head text-5xl font-extrabold leading-tight sm:text-6xl">
              Named for a man who gave when he had a lot.
            </h1>
            <p className="mt-5 text-base text-[var(--adisa-bone)]/80">
              <em>Àdísà</em> was my grandfather. They called him <strong>Darosa</strong> — the one
              who carried grace. I never met him; I was the last born. But his footsteps are
              still felt in Sepage, the village that raised him. This shop is a small, quiet
              thanks to a man who gave freely — and a fair hand to every Nigerian man walking
              through Surulere, Abuja, Maiduguri and everywhere foot carries him.
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Fair prices always",
              body: "We show source prices (₦8k–18k) next to ours (₦20k–35k). No ₦100,000 hidden markup — just what's fair." },
            { icon: Truck, title: "Delivered, insured",
              body: "Insured courier to every state in Nigeria + FCT, 2–5 working days, signature on delivery." },
            { icon: Wallet, title: "Card or crypto",
              body: "Pay with Naira card via Paystack, or with BTC / ETH / USDC through Coinbase Commerce." },
          ].map((c, i) => (
            <AnimateOnView key={c.title} delay={i * 0.08}>
              <div className="h-full border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
                <c.icon className="h-8 w-8 text-[var(--adisa-clay)]" />
                <h3 className="mt-4 font-head text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="border-y-2 border-black bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Star className="mx-auto h-8 w-8 text-[var(--adisa-gold)]" />
          <blockquote className="mt-6 font-head text-2xl font-bold leading-snug sm:text-3xl">
            “Carry the silence of grace — Darosa lives in every step.”
          </blockquote>
          <p className="mt-4 text-sm uppercase tracking-widest text-muted-foreground">
            — ADISA ·Àdísà·
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <AnimateOnView>
          <h2 className="font-head text-3xl font-extrabold">Find a pair that earns your step.</h2>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-8 py-4 font-head text-lg font-bold text-white shadow-[6px_6px_0_#000] transition active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            Browse shoes <ArrowRight className="h-5 w-5" />
          </Link>
        </AnimateOnView>
      </section>
    </div>
  );
}
