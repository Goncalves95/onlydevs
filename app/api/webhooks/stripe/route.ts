import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";
import { createOrder as createPrintfulOrder } from "@/lib/printful";
import type Stripe from "stripe";
import type { Currency } from "@/lib/currency";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(paymentIntent);
      break;
    }
    default:
      break;
  }

  return new Response(null, { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { orderId, userId } = session.metadata ?? {};
  if (!orderId || !userId) return;

  // ── 1. Verify order belongs to this user (prevents metadata spoofing) ────────
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, user: { select: { email: true } } },
  });
  if (!order) return;

  // ── 2. Mark order as PAID ─────────────────────────────────────────────────────
  // In Stripe v22, shipping address is under collected_information.shipping_details
  const shippingInfo = session.collected_information?.shipping_details;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      stripePaymentId: typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
      shippingAddress: shippingInfo
        ? {
            name: shippingInfo.name,
            line1: shippingInfo.address?.line1,
            line2: shippingInfo.address?.line2,
            city: shippingInfo.address?.city,
            state: shippingInfo.address?.state,
            postalCode: shippingInfo.address?.postal_code,
            country: shippingInfo.address?.country,
          }
        : undefined,
    },
  });

  // ── 3. Create Printful order ──────────────────────────────────────────────────
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev && shippingInfo?.address) {
    const addr = shippingInfo.address;
    const printfulPayload = {
      external_id: order.id,
      shipping: "STANDARD",
      recipient: {
        name: shippingInfo?.name ?? "",
        address1: addr.line1 ?? "",
        address2: addr.line2 ?? undefined,
        city: addr.city ?? "",
        state_code: addr.state ?? undefined,
        country_code: addr.country ?? "",
        zip: addr.postal_code ?? "",
        email: order.user.email ?? "",
      },
      items: order.items.map((item) => ({
        sync_variant_id: parseInt(item.printfulItemId, 10),
        quantity: item.quantity,
        retail_price: (item.price / 100).toFixed(2),
        currency: order.currency,
      })),
    };

    try {
      const printfulOrder = await createPrintfulOrder(printfulPayload) as { result?: { id?: number } };
      const printfulId = printfulOrder?.result?.id;
      if (printfulId) {
        await prisma.order.update({
          where: { id: order.id },
          data: { printfulOrderId: String(printfulId) },
        });
      }
    } catch {
      // Log without PII
      console.error(`[webhook] Printful order creation failed for order ${orderId}`);
    }
  } else if (isDev) {
    console.log(`[webhook][dev] Printful order skipped for order ${orderId}`);
  }

  // ── 4. Send confirmation email ────────────────────────────────────────────────
  const userEmail = order.user.email;
  if (userEmail) {
    try {
      await sendOrderConfirmation({
        to: userEmail,
        orderId: order.id,
        items: order.items.map((i) => ({
          productName: i.productName,
          variantName: i.variantName ?? "",
          quantity: i.quantity,
          price: i.price,
        })),
        total: order.totalAmount,
        currency: order.currency as Currency,
        locale: session.metadata?.locale ?? "en",
      });
    } catch {
      // Email failure must not fail the webhook — Stripe retries are expensive
      console.error(`[webhook] Email send failed for order ${orderId}`);
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });
  } catch {
    console.error(`[webhook] Failed to cancel order ${orderId}`);
  }
}
