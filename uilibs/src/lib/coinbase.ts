// ============================================================
//  Coinbase Commerce helpers — server only.
//  Docs: https://docs.cloud.coinbase.com/commerce-onchain/reference
// ============================================================

import crypto from "node:crypto";

const COINBASE_BASE = "https://api.commerce.coinbase.com";

function apiKey(): string {
  const k = process.env.COINBASE_API_KEY;
  if (!k) throw new Error("COINBASE_API_KEY missing in .env.local");
  return k;
}

export interface CoinbaseCharge {
  id: string;
  code: string;
  hosted_url: string;
  addresses: Record<string, { address: string }>;
  pricing: Record<string, { amount: string; currency: string }>;
  timeline: Array<{ status: string; time: string }>;
}

export async function createCharge(payload: {
  name: string;
  description: string;
  localPrice: { amount: string; currency: string };
  pricingType: "fixed_price";
  metadata: Record<string, string>;
  redirectUrl: string;
  cancelUrl: string;
}): Promise<CoinbaseCharge> {
  const res = await fetch(`${COINBASE_BASE}/charges`, {
    method: "POST",
    headers: {
      "X-CC-Api-Key": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.data) {
    throw new Error(`Coinbase charge failed: ${data.error?.message ?? res.statusText}`);
  }
  return data.data;
}

export async function getCharge(code: string): Promise<CoinbaseCharge | null> {
  const res = await fetch(
    `${COINBASE_BASE}/charges/${encodeURIComponent(code)}`,
    { headers: { "X-CC-Api-Key": apiKey() } }
  );
  const data = await res.json();
  return data.data ?? null;
}

export function coinbaseWebhookIsValid(
  body: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  const secret = process.env.COINBASE_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export function isCryptoConfigured(): boolean {
  const k = process.env.COINBASE_API_KEY;
  if (!k) return false;
  // Coinbase Commerce API keys are UUIDv4 strings.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(k);
}
