// ============================================================
//  ADISA pricing policy
//
//  Source prices (across other countries) come in ranges like
//  ₦8,000 - ₦18,000. Nigerian sellers ramp these up to ₦45,000 -
//  ₦100,000. ADISA sells at a fair, transparent markup instead:
//
//    source ₦8k - ₦9k        ->   sale  ₦20,000 - ₦25,000   (low band)
//    source ₦10k - ₦18k      ->   sale  ₦30,000 - ₦35,000   (mid band)
//
//  The price is deterministic and stable for each source price
//  so receipts and admin tools always agree.
// ============================================================

const BANDS = [
  { min: 0,        max: 7000,    sale: 15000 }, // tiny items / accessories fallback
  { min: 7000,     max: 9000,    sale: 22500 }, // low band center
  { min: 9001,     max: 18000,   sale: 32500 }, // mid band center
  { min: 18001,    max: 30000,   sale: 42000 }, // premium band
  { min: 30001,    max: 999_999, sale: 55000 }, // ultra-premium
] as const;

// Distribute across a band so the catalog shows variety rather than
// a single fixed price for every item in a band.
export function convertToAdisaPrice(source: number): number {
  const band = BANDS.find((b) => source >= b.min && source <= b.max);
  if (!band) return 22500;

  // Even distribution inside the band +/- ~2,000
  const span = band.max - band.min;
  const pct = span === 0 ? 0.5 : (source - band.min) / span;
  const wobble = (Math.abs(Math.sin(source)) - 0.5) * 4000; // stable pseudo-random
  const saleWindow = source >= 7000 && source <= 9000
    ? { lo: 20000, hi: 25000 }
    : source > 9000 && source <= 18000
      ? { lo: 30000, hi: 35000 }
      : { lo: band.sale - 2500, hi: band.sale + 2500 };
  let p = saleWindow.lo + pct * (saleWindow.hi - saleWindow.lo) + wobble;
  // Clamp inside the legal sale window
  p = Math.max(saleWindow.lo, Math.min(saleWindow.hi, p));
  // Snap to nearest ₦500
  return Math.round(p / 500) * 500;
}

export function formatNGN(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}
