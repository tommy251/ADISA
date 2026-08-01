// ============================================================
//  ADISA shared-secret admin auth (no third-party auth dep).
//
//  Valid for the simple storefront admin dashboard:
//    POST /api/admin/login  -> sets httpOnly cookie "adisa_admin"
//    other /api/admin/*     -> requires a valid cookie
//
//  You can swap this out for Supabase Auth later by changing
//  `verifyAdmin` to check the Supabase session instead.
// ============================================================

import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "adisa_admin_token";
const COOKIE_TTL = 60 * 60 * 24 * 7; // 7 days

function adminSecret(): string {
  const s = process.env.ADMIN_PASSWORD ?? "change-me-please";
  const u = process.env.ADMIN_USERNAME ?? "admin";
  return `${u}:${s}`;
}

export async function signAdmin(): Promise<string> {
  const exp = Date.now() + COOKIE_TTL * 1000;
  const payload = String(exp);
  const sig = crypto
    .createHmac("sha256", adminSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export async function verifyAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const exp = Number(payload);
  if (!exp || exp < Date.now()) return false;

  const expected = crypto
    .createHmac("sha256", adminSecret())
    .update(payload)
    .digest("hex");
  // Constant-time compare.
  if (expected.length !== sig.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function setAdminCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_TTL,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function adminCookieName(): string {
  return COOKIE_NAME;
}

// A tiny request-time guard for "give me a 401 if not admin".
export async function requireAdmin(): Promise<Response | null> {
  const ok = await verifyAdmin();
  if (ok) return null;
  return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

export async function adminCredentialsMatch(user: string, pass: string): Promise<boolean> {
  const u = process.env.ADMIN_USERNAME ?? "admin";
  const p = process.env.ADMIN_PASSWORD ?? "change-me-please";
  if (!user || !pass) return false;
  if (user.length !== u.length || pass.length !== p.length) return false;
  // Constant-time-ish compare.
  let m = 0;
  for (let i = 0; i < Math.max(user.length, u.length); i++) {
    m |= (user.charCodeAt(i) ?? 0) ^ (u.charCodeAt(i) ?? 0);
    m |= (pass.charCodeAt(i) ?? 0) ^ (p.charCodeAt(i) ?? 0);
  }
  return m === 0;
}
