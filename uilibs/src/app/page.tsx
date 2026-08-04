import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Tag, Wallet, Star } from "lucide-react";
import { getAllProducts, getFeaturedProducts, getProductBySlug, categoryLabel } from "@/lib/catalog";
import { formatNGN } from "@/lib/pricing";
import { ProductCard } from "@/components/site/ProductCard";
import { AnimateOnView } from "@/components/site/AnimateOnView";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import ShimmerLink from "@/components/site/ShimmerLink";

// Always fetch fresh from Supabase so admin edits show up immediately.
export const dynamic = "force-dynamic";

const HERO_CATEGORIES = ["sneakers", "formal", "boots", "loafers", "sandals", "athletic"] as const;

// Specific shoes for the hero collage, referenced by slug (stable)
// instead of array index (was fragile once data comes from a DB
// whose row order won't match the old hardcoded array order).
const HERO_SLUGS = ["oluwa-runner", "okechukwu-boot", "emeka-brogue"];

const TRUST_ITEMS = [
  "Card & Crypto payments",
  "Insured delivery to all 36 states + FCT",
  "Fair pricing — no hidden markups",
  "Real photos of real shoes",
  "UK ↔ Nigeria sizes shown",
  "Named for Darosa · grace under foot",
];

export default async function HomePage() {
  const all      = await getAllProducts();
  const featured = (await getFeaturedProducts(8));
  const heroProducts = (
    await Promise.all(HERO_SLUGS.map((s) => getProductBySlug(s)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="bg-[var(--adisa-bone)]">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b-2 border-black">
        {/* sticky background gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(194,65,12,0.18), transparent 70%), radial-gradient(40% 30% at 80% 30%, rgba(184,137,60,0.20), transparent 70%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <AnimateOnView>
            <span className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1 font-head text-xs uppercase tracking-widest text-[var(--adisa-clay)] shadow-[3px_3px_0_#000]">
              <Tag className="h-3.5 w-3.5" /> ₦20,000 — ₦35,000 only
            </span>
            <h1 className="mt-6 font-head text-5xl font-extrabold leading-[1.05] font-sans sm:text-6xl lg:text-7xl">
              <span className="block">Men&rsquo;s shoes,</span>
              <span className="adisa-gradient-text">fairly priced,</span>
              <span className="block">for every Nigerian foot.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
              Premium sneakers, formal, boots, loafers & sandals. Same quality
              you see elsewhere at a premium — ADISA brings them to you for
              <strong className="text-foreground"> ₦20k – ₦35k</strong>. Card and
              crypto accepted. Delivery in 2–5 working days.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
              >
                Shop now
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="border-2 border-black bg-white px-6 py-3 font-head font-semibold shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
              >
                Why ADISA?
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-head text-3xl font-extrabold">300+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Curated shoes</div>
              </div>
              <div>
                <div className="font-head text-3xl font-extrabold">36 + FCT</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">States delivered</div>
              </div>
              <div>
                <div className="font-head text-3xl font-extrabold">2</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Ways to pay</div>
              </div>
            </div>
          </AnimateOnView>

          {/* Hero collage of 3 shoes */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:h-[560px]">
            {heroProducts.map((p, i) => (
              <Link
                href={`/shop/${p.slug}`}
                key={p.slug}
                className={`group relative overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0_#000] transition-transform duration-200 hover:-translate-y-1 ${
                  i === 0 ? "row-span-2" : ""
                }`}
              >
                <Image
                  src={p.imagePath}
                  alt={p.name}
                  fill
                  sizes="(max-width:1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="font-head text-sm font-bold text-white">{p.name}</div>
                  <div className="text-xs text-white/80">{formatNGN(p.salePrice)}</div>
                </div>
              </Link>
            ))}
            <ShimmerLink
              href="/shop?category=formal"
              className="mt-auto justify-center"
            >
              See formal shoes →
            </ShimmerLink>
          </div>
        </div>

        {/* Ticker underneath hero */}
        <div className="border-t-2 border-black bg-[var(--adisa-ink)] py-3 text-white">
          <div className="adisa-ticker-track">
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((t, i) => (
              <span
                key={i}
                className="mx-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <Star className="h-3 w-3 text-[var(--adisa-gold)]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="border-b-2 border-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimateOnView>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <AnimatedGradientText className="inline font-head text-sm uppercase tracking-widest">
                  Categories
                </AnimatedGradientText>
                <h2 className="mt-2 font-head text-4xl font-extrabold">There is a shoe for every step</h2>
              </div>
              <Link href="/shop" className="hidden border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_#000] sm:inline-block">
                View all →
              </Link>
            </div>
          </AnimateOnView>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {HERO_CATEGORIES.map((cat) => {
              const sample = all.find((p) => p.category === cat);
              if (!sample) return null;
              return (
                <Link
                  key={cat}
                  href={`/shop?category=${cat}`}
                  className="group flex h-32 flex-col items-center justify-center gap-2 border-2 border-black bg-white shadow-[5px_5px_0_#000] transition hover:-translate-y-1"
                >
                  <Image
                    src={sample.imagePath}
                    alt={categoryLabel(cat)}
                    width={56}
                    height={56}
                    className="rounded border border-black object-cover transition group-hover:scale-110"
                  />
                  <span className="font-head text-sm font-bold uppercase tracking-wide">{categoryLabel(cat)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ FEATURED ============================ */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimateOnView>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-head text-4xl font-extrabold">
                Featured <span className="text-[var(--adisa-clay)]">shoes</span>
              </h2>
              <Link href="/shop" className="text-sm font-semibold uppercase tracking-widest underline underline-offset-4 hover:text-[var(--adisa-clay)]">
                See all
              </Link>
            </div>
          </AnimateOnView>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================ WHY US BANNER ============================ */}
      <section className="border-y-2 border-black bg-[var(--adisa-ink)] py-16 text-[var(--adisa-bone)]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-3">
          {[
            { icon: Tag,   title: "Fair prices",  body: "Quality men's shoes, priced honestly between ₦20k and ₦35k. Card or crypto." },
            { icon: Truck, title: "Nationwide",   body: "Insured delivery to all 36 states + FCT, 2–5 working days." },
            { icon: Wallet, title: "Card & Crypto", body: "Pay with Naira cards through Paystack, or Bitcoin/USDC via Coinbase Commerce." },
          ].map((c, i) => (
            <AnimateOnView key={c.title} delay={i * 0.1}>
              <div className="border-2 border-[var(--adisa-bone)] bg-[var(--adisa-ink)] p-6 shadow-[6px_6px_0_var(--adisa-bone)]">
                <c.icon className="h-7 w-7 text-[var(--adisa-gold)]" />
                <h3 className="mt-4 font-head text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">{c.body}</p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </section>

      {/* ============================ ALL PRODUCTS MARQUEE ============================ */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimateOnView>
            <h2 className="font-head text-4xl font-extrabold">More shoes, more steps</h2>
            <p className="mt-2 text-muted-foreground">A scrolling wall of every shoe we ship right now.</p>
          </AnimateOnView>
        </div>
        <div className="relative mt-10">
          <Marquee pauseOnHover reverse className="[--duration:60s] [--gap:1.5rem]">
            {all.map((p) => (
              <Link
                href={`/shop/${p.slug}`}
                key={p.slug}
                className="md:w-[260px] w-[200px] shrink-0"
              >
                <div className="group border-2 border-black bg-white shadow-[4px_4px_0_#000]">
                  <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-black">
                    <Image
                      src={p.imagePath}
                      alt={p.name}
                      fill
                      sizes="260px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <div className="font-head text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs font-bold">{formatNGN(p.salePrice)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ============================ ABOUT BANNER ============================ */}
      <section className="border-y-2 border-black bg-[var(--adisa-bone)] py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <AnimateOnView>
            <AnimatedGradientText className="inline font-head text-sm uppercase tracking-widest">
              The story
            </AnimatedGradientText>
            <h2 className="mt-3 font-head text-4xl font-extrabold leading-tight">
              Named for a man who gave when he had a lot.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              <em>Àdísà</em> was my grandfather. They called him <strong>Darosa</strong> —
              the one who carried grace. I never met him; I was the last born. But
              his footsteps can still be felt. This shop is a quiet thanks for him,
              and a fair hand to every Nigerian man walking through Sepage, Surulere,
              Abuja or Maiduguri.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-5 py-2 font-head font-semibold text-white shadow-[4px_4px_0_#000]"
            >
              Read the ADISA story <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0_#000]">
              <ShieldCheck className="h-10 w-10 text-[var(--adisa-green)]" />
              <blockquote className="mt-4 font-head text-xl font-semibold leading-snug">
                &ldquo;Carry the silence of grace — Darosa lives in every step.&rdquo;
              </blockquote>
              <p className="mt-3 text-sm text-muted-foreground">— ADISA ·Àdísà·</p>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="bg-[var(--adisa-bone)] py-20 text-center">
        <AnimateOnView>
          <h2 className="mx-auto max-w-2xl font-head text-4xl font-extrabold leading-tight sm:text-5xl">
            A new pair of shoes is one click away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Pick your size in UK or Nigeria format, choose a colour, and check out in
            under two minutes.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-8 py-4 font-head text-lg font-bold text-white shadow-[6px_6px_0_#000] transition active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            Browse all shoes <ArrowRight className="h-5 w-5" />
          </Link>
        </AnimateOnView>
      </section>
    </div>
  );
}
