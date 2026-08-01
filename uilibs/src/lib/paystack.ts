// ============================================================
//  Paystack helpers — server only.
//  Docs: https://paystack.com/docs/api/transaction
// ============================================================

import crypto from "node:crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey(): string {
  const k = process.env.PAYSTACK_SECRET_KEY;
  if (!k) throw new Error("PAYSTACK_SECRET_KEY missing in .env.local");
  return k;
}

export async function initTransaction(payload: {
  email: string;
  amount: number; // in kobos (₦ * 100)
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{
  status: boolean;
  authorization_url: string;
  access_token?: string;
  reference: string;
}> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.status) {
    throw new Error(`Paystack init failed: ${data.message ?? res.statusText}`);
  }
  return data.data;
}

export async function verifyTransaction(reference: string): Promise<{
  status: "success" | "failed" | "pending";
  amount: number;
  gateway_response: string;
  customer: { email: string };
}> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } }
  );
  const data = await res.json();
  if (!data.status) {
    throw new Error(`Paystack verify failed: ${data.message ?? res.statusText}`);
  }
  return data.data;
}

export function paystackSignatureIsValid(
  body: string,
  signature: string | null
): boolean {
  // Paystack signs with HMAC-SHA512 of the raw body using the secret key.
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha512", secretKey())
    .update(body)
    .digest("hex");
  return expected === signature;
}

export function isPaystackConfigured(): boolean {
  const k = process.env.PAYSTACK_SECRET_KEY;
  if (!k) return false;
  // Real Paystack secret keys:
  //   live -> sk_live_<32 hex/alnum chars>
  //   test -> sk_test_<32 hex/alnum chars>
  if (!/^sk_(live|test)_[A-Za-z0-9]{20,}$/.test(k)) return false;
  return true;
}
