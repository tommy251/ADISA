// ============================================================
//  ADISA email — receipts to the customer, new-order
//  notifications to the owner. SMTP transport via nodemailer.
// ============================================================

import nodemailer from "nodemailer";

// Placeholder strings from .env.local.example / .env.local that
// should NOT trigger the email path.
function looksLikePlaceholder(v: string | undefined): boolean {
  if (!v) return true;
  const n = v.toLowerCase().trim();
  if (/^(placeholder|change-?me|youre|sample|fake|demo|xxxx|todo|fixme|xxxxxxxxxxxxxxxx)/i.test(n)) return true;
  if (/_{5,}|x{5,}/.test(v)) return true;
  if (n.includes("placeholder")) return true;
  // The example addresses in .env.local.example:
  if (n === "you@example.com" || n === "you@gmail.com" || n === "owner@example.com") return true;
  // A real email contains an @ with at least one dot in the domain.
  if (n.includes("@") && !/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(n)) return true;
  return false;
}

function isSmtpHostLike(h: string | undefined): boolean {
  if (!h || looksLikePlaceholder(h)) return false;
  // Real SMTP hosts look like "smtp.provider.tld" or "mail.tld".
  return /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(h);
}

function isEmailLike(e: string | undefined): boolean {
  if (!e || looksLikePlaceholder(e)) return false;
  return /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(e);
}

function transport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP credentials missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local");
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function isEmailConfigured(): boolean {
  return (
    isSmtpHostLike(process.env.SMTP_HOST) &&
    !looksLikePlaceholder(process.env.SMTP_USER) &&
    !looksLikePlaceholder(process.env.SMTP_PASS) &&
    isEmailLike(process.env.OWNER_EMAIL)
  );
}

export async function sendOwnerNewOrderNotification(order: {
  ref: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  items: Array<{ name: string; sizeUk: number; color: string; qty: number; unitPrice: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}) {
  const owner = process.env.OWNER_EMAIL;
  if (!owner) throw new Error("OWNER_EMAIL not set");
  const rows = order.items
    .map(
      (i) =>
        `<tr>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.name}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">UK ${i.sizeUk} / NG ${i.sizeUk + 35}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.color}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.qty}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">₦${i.unitPrice.toLocaleString("en-NG")}</td>
         </tr>`
    )
    .join("");
  const html = `
    <div style="font-family:Arial;max-width:680px;margin:auto">
      <div style="background:#0a0a0a;color:#fff;padding:24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;font-size:20px">New ADISA order: ${order.ref}</h2>
      </div>
      <div style="padding:20px 24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <p><b>Customer:</b> ${order.customerName}<br>
           <b>Email:</b> ${order.customerEmail}<br>
           <b>Phone:</b> ${order.customerPhone}</p>
        <p><b>Deliver to:</b><br>${order.deliveryAddress}<br>${order.deliveryCity}, ${order.deliveryState}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead>
            <tr>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Item</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Size</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Colour</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Qty</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Unit price</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p><b>Subtotal:</b> ₦${order.subtotal.toLocaleString("en-NG")}<br>
           <b>Delivery:</b> ₦${order.deliveryFee.toLocaleString("en-NG")}<br>
           <b>Total:</b> ₦${order.total.toLocaleString("en-NG")}<br>
           <b>Payment:</b> ${order.paymentMethod}</p>
        <p style="margin-top:24px">
          <a href="${siteUrl()}/admin/dashboard"
             style="background:#0a0a0a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px">
            Open admin dashboard
          </a>
        </p>
      </div>
    </div>`;
  await transport().sendMail({
    from: process.env.SMTP_USER,
    to: owner,
    subject: `New ADISA order: ${order.ref}`,
    html,
  });
}

export async function sendCustomerReceipt(order: {
  ref: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  items: Array<{ name: string; sizeUk: number; color: string; qty: number; unitPrice: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}) {
  const rows = order.items
    .map(
      (i) =>
        `<tr>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.name}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">UK ${i.sizeUk}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.color}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.qty}</td>
           <td style="padding:6px 8px;border-bottom:1px solid #eee">₦${i.unitPrice.toLocaleString("en-NG")}</td>
         </tr>`
    )
    .join("");
  const html = `
    <div style="font-family:Arial;max-width:680px;margin:auto">
      <div style="background:#0a0a0a;color:#fff;padding:24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;font-size:22px;letter-spacing:2px">ADISA ·Àdísà·</h2>
        <p style="margin:6px 0 0;color:#ddd">Your order is confirmed. Thank you!</p>
      </div>
      <div style="padding:20px 24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <p>Hi ${order.customerName},</p>
        <p>We've received your order <b>${order.ref}</b>. Your shoes are being prepared and will be on their way soon.</p>
        <h4 style="margin-top:18px">Order summary</h4>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead>
            <tr>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Item</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Size</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Colour</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Qty</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc">Unit price</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p><b>Subtotal:</b> ₦${order.subtotal.toLocaleString("en-NG")}<br>
           <b>Delivery:</b> ₦${order.deliveryFee.toLocaleString("en-NG")}<br>
           <b>Total paid:</b> ₦${order.total.toLocaleString("en-NG")}<br>
           <b>Payment:</b> ${order.paymentMethod}</p>
        <h4 style="margin-top:18px">Delivery details</h4>
        <p>${order.customerName}<br>${order.deliveryAddress}<br>${order.deliveryCity}, ${order.deliveryState}<br>${order.customerPhone}</p>
        <p style="margin-top:24px;color:#777">
          Carry the silence of grace — Darosa lives in every step.<br>
          — ADISA
        </p>
      </div>
    </div>`;
  await transport().sendMail({
    from: process.env.SMTP_USER,
    to: order.customerEmail,
    subject: `ADISA — Receipt ${order.ref}`,
    html,
  });
}
