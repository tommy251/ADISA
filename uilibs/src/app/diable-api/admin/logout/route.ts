// ============================================================
//  POST /api/admin/logout
//  Clears the admin session cookie.
// ============================================================

import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
