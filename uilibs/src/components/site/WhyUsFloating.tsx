"use client";

import { motion } from "motion/react";
import { Tag, Truck, Wallet } from "lucide-react";
import { Tilt } from "@/components/ui/tilt";
import { AnimateOnView } from "@/components/site/AnimateOnView";

const ITEMS = [
  { icon: Tag,    title: "Fair prices",    body: "Quality men's shoes, priced honestly between ₦20k and ₦35k. Card or crypto." },
  { icon: Truck,  title: "Nationwide",     body: "Insured delivery to all 36 states + FCT, 2–5 working days." },
  { icon: Wallet, title: "Card & Crypto",   body: "Pay with Naira cards through Paystack, or Bitcoin/USDC via Coinbase Commerce." },
];

export function WhyUsFloating() {
  return (
    <div
      className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-3"
      style={{ perspective: "1000px" }}
    >
      {ITEMS.map((c, i) => (
        <AnimateOnView key={c.title} delay={i * 0.1}>
          <Tilt rotationFactor={10} isRevese springOptions={{ stiffness: 100, damping: 15 }}>
            <motion.div
              className="border-2 border-[var(--adisa-bone)] bg-[var(--adisa-ink)] p-6 shadow-[6px_6px_0_var(--adisa-bone)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "translateZ(30px)" }}>
                <c.icon className="h-7 w-7 text-[var(--adisa-gold)]" />
                <h3 className="mt-4 font-head text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">{c.body}</p>
              </div>
            </motion.div>
          </Tilt>
        </AnimateOnView>
      ))}
    </div>
  );
}
