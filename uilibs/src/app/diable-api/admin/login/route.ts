// ============================================================
//  POST /api/admin/login
//  Verifies shared-secret admin credentials, sets httpOnly
//  HMAC-signed session cookie.
// ============================================================

import { NextResponse } from "next/server";
import {
  adminCredentialsMatch,
  signAdmin,
  setAdminCookie,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json() as { username?: string; password?: string };
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
    }
    const valid = await adminCredentialsMatch(username, password);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }
    const token = await signAdmin();
    await setAdminCookie(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Login failed" },
      { status: 500 }
    );
  }
}
