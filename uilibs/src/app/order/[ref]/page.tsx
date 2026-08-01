// ============================================================
//  /order/[ref]
//  Post-checkout confirmation page. Reads ref from the URL,
//  loads the order client-side via /api/order/[ref], and polls
//  until the webhook has marked payment_status=paid (or stays
//  pending). Reads ?demo=1 to skip polling in dev mode.
// ============================================================

import OrderConfirmationClient from "@/components/site/OrderConfirmationClient";

export default async function OrderPage({
  params,
  searchParams,
}: PageProps<"/order/[ref]">) {
  const { ref } = await params;
  const sp = await searchParams;
  const demo = sp?.demo === "1" || sp?.demo === "true";
  return <OrderConfirmationClient refPromise={Promise.resolve({ ref, demo })} />;
}
