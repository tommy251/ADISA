import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-black bg-[var(--adisa-bone)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Wordmark size="md" asLink={false} />
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">
            ADISA — <em>Àdísà</em> — men&rsquo;s shoes, fairly priced. Named
            for Darosa, who carried grace where his feet carried him.
            We ship to every state in Nigeria.
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
            Carry the silence of grace
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/shop"                className="hover:text-[var(--adisa-clay)]">All shoes</Link></li>
            <li><Link href="/shop?category=sneakers" className="hover:text-[var(--adisa-clay)]">Sneakers</Link></li>
            <li><Link href="/shop?category=formal"   className="hover:text-[var(--adisa-clay)]">Formal</Link></li>
            <li><Link href="/shop?category=boots"    className="hover:text-[var(--adisa-clay)]">Boots</Link></li>
            <li><Link href="/shop?category=loafers"  className="hover:text-[var(--adisa-clay)]">Loafers</Link></li>
            <li><Link href="/shop?category=sandals"  className="hover:text-[var(--adisa-clay)]">Sandals</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about"      className="hover:text-[var(--adisa-clay)]">Why ADISA</Link></li>
            <li><Link href="/faq"        className="hover:text-[var(--adisa-clay)]">FAQ & Sizes</Link></li>
            <li><Link href="/contact"    className="hover:text-[var(--adisa-clay)]">Contact</Link></li>
            <li><Link href="/admin"      className="hover:text-[var(--adisa-clay)]">Admin login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-black bg-black px-4 py-4 text-center text-xs text-white/80">
        &copy; {new Date().getFullYear()} ADISA ·Àdísà· — Hand-stitched for Nigeria.
        Prices in Naira. Card payments via Paystack · Crypto via Coinbase Commerce.
      </div>
    </footer>
  );
}
