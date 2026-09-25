// ============================================================
//  POST /api/contact
//  Sends the contact form to the OWNER_EMAIL via the configured
//  SMTP transport. Soft-fails silently if SMTP isn't configured
//  (so the dev environments still return a success).
// ============================================================

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isEmailConfigured } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string; email?: string; subject?: string; message?: string;
    };
    if (!body?.name || !body?.email || !body?.message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // Soft-pass when SMTP isn't wired up.
    if (!isEmailConfigured()) {
      return NextResponse.json({
        ok: true,
        devNote: "SMTP not configured — message not actually sent",
      });
    }

    const owner = process.env.OWNER_EMAIL!;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transport.sendMail({
      from: process.env.SMTP_USER!,
      to: owner,
      replyTo: body.email,
      subject: `[ADISA contact] ${body.subject || "(no subject)"}`,
      text: `From: ${body.name} <${body.email}>\n\n${body.message}`,
      html: `
        <div style="font-family:Arial;max-width:560px;margin:auto">
          <h2 style="background:#0b0b0b;color:#fff;padding:16px">New contact message</h2>
          <p><b>From:</b> ${body.name} <${body.email}></p>
          <p><b>Subject:</b> ${body.subject || "(no subject)"}</p>
          <hr style="border:none;border-top:1px solid #ddd">
          <p style="white-space:pre-wrap">${(body.message || "").replace(/</g, "<")}</p>
        </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to send" },
      { status: 500 }
    );
  }
}
