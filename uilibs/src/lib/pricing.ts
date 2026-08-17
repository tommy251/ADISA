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
export function convertToAdisaPrice(source: number): number {
  // Clamp to the ADISA source band (₦0 – ₦18,000) so the sale price
  // always lands in the fair‑price window of ₦20,000 – ₦35,000.
  const s = Math.min(source, 18000);

  if (s >= 9001) {
    // Mid band: source ₦10,001 – ₦18,000  ⇒  sale ₦30,000 – ₦35,000
    const pct = (s - 9001) / (18000 - 9001);
    const wobble = (Math.abs(Math.sin(s)) - 0.5) * 2500;
    let p = 30000 + pct * 5000 + wobble;
    p = Math.max(30000, Math.min(35000, p));
    return Math.round(p / 500) * 500;
  } else {
    // Low band: source ₦0 – ₦9,000  ⇒  sale ₦20,000 – ₦25,000
    const pct = s / 9000;
    const wobble = (Math.abs(Math.sin(s)) - 0.5) * 2500;
    let p = 20000 + pct * 5000 + wobble;
    p = Math.max(20000, Math.min(25000, p));
    return Math.round(p / 500) * 500;
  }
}

export function formatNGN(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}