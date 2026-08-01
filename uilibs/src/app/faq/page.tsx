import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AnimateOnView } from "@/components/site/AnimateOnView";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — ADISA ·Àdísà·",
  description:
    "Sizing, payments, delivery, returns — everything you need to shop ADISA men's shoes.",
};

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "How do I know my size?",
    a: (
      <p>
        We show UK sizes (e.g. <strong>UK 8</strong>) and the corresponding Nigerian / EU
        size (UK 8 ≈ Nigeria 43) on every product page. As a rough guide: measure the longest
        foot in cm and add 1 cm for comfort. When in doubt, round up half a size.
      </p>
    ),
  },
  {
    q: "What does this conversion chart look like?",
    a: (
      <div className="overflow-x-auto">
        <table className="mt-1 w-full border-2 border-black text-sm">
          <thead className="bg-[var(--adisa-ink)] text-white">
            <tr>
              <th className="px-3 py-2 text-left">UK</th>
              <th className="px-3 py-2 text-left">Nigeria / EU</th>
              <th className="px-3 py-2 text-left">Foot (cm)</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {[6,7,8,9,10,11,12,13].map((uk, i) => (
              <tr key={uk} className={i % 2 ? "bg-zinc-50" : ""}>
                <td className="border-t border-black/20 px-3 py-2 font-bold">{uk}</td>
                <td className="border-t border-black/20 px-3 py-2">{uk + 35}</td>
                <td className="border-t border-black/20 px-3 py-2">{uk * 0.8 + 22.5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    q: "How long will delivery take?",
    a: (
      <p>
        Lagos is 1–3 working days. South-West neighbours 2–4. South-South / South-East
        and the FCT corridor 2–4. North-East and far North-West 4–5 days. The exact fee
        for your state is shown at checkout.
      </p>
    ),
  },
  {
    q: "How do I pay?",
    a: (
      <p>
        Two ways: Naira card through{" "}
        <a className="underline underline-offset-4" href="https://paystack.com" rel="noreferrer" target="_blank">Paystack</a>{" "}
        (any Nigerian or international card), or crypto through{" "}
        <a className="underline underline-offset-4" href="https://www.coinbase.com/commerce" rel="noreferrer" target="_blank">Coinbase Commerce</a>{" "}
        (BTC, ETH, USDC). We never see or store your card or wallet details.
      </p>
    ),
  },
  {
    q: "Can I return a pair?",
    a: (
      <p>
        Yes — 7 days from delivery, unworn, in original packaging, for a full refund of
        the shoe. Delivery fee is non-refundable. Begin a return by emailing your order
        reference to{" "}
        <Link href="/contact" className="underline underline-offset-4">our contact page</Link>.
      </p>
    ),
  },
  {
    q: "Are the shoes authentic?",
    a: (
      <p>
        Sourced directly from the same suppliers selling in other countries. We charge
        the source price we paid, plus a transparent, fair markup. No knock-offs.
      </p>
    ),
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[var(--adisa-bone)]">
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-14 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-head text-4xl font-extrabold sm:text-5xl">FAQ & Sizing</h1>
          <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">
            Sizes, payments, delivery and returns — answered below. Still unsure? Ask us on the{" "}
            <Link href="/contact" className="underline underline-offset-4 text-[var(--adisa-gold)]">contact page</Link>.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <AnimateOnView>
            <Accordion defaultValue={["q-0"]} className="space-y-3">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`q-${i}`}
                  className="border-2 border-black bg-white shadow-[4px_4px_0_#000]"
                >
                  <AccordionTrigger className="px-4 py-3 font-head text-base font-bold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimateOnView>
        </div>
      </section>

      <section className="border-t-2 border-black py-14 text-center">
        <p className="font-head text-sm uppercase tracking-widest text-muted-foreground">
          Still unanswered?
        </p>
        <Link href="/shop" className="mt-4 inline-flex border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000]">
          Back to shop
        </Link>
      </section>
    </div>
  );
}
