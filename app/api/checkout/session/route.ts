import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCachedProduct } from "@/lib/products";
import { parseCurrencyCookie, getDefaultCurrency, CURRENCY_COOKIE, type Currency } from "@/lib/currency";
import { routing, type Locale } from "@/lib/i18n/routing";
import { cookies } from "next/headers";
import type { CartItem } from "@/lib/store/cart";

// EU + CH + UK allowed shipping destinations
const ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    "CH", "LI", "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI",
    "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL",
    "PT", "RO", "SE", "SI", "SK", "GB", "NO", "IS",
  ];

const PRICE_TOLERANCE_CENTS = 5;

interface CheckoutBody {
  items: CartItem[];
  locale: string;
}

export async function POST(req: Request) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const userEmail = session.user.email ?? undefined;

  // ── Parse & basic validation ────────────────────────────────────────────────
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, locale } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const validLocale: Locale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  // Currency: cookie override → locale default
  const cookieStore = await cookies();
  const currency: Currency =
    parseCurrencyCookie(cookieStore.get(CURRENCY_COOKIE)?.value) ??
    getDefaultCurrency(validLocale);

  // ── Server-side price validation ─────────────────────────────────────────────
  const validatedItems: Array<{
    variantId: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPriceCents: number;
  }> = [];

  for (const item of items) {
    if (!item.variantId || !item.productId || item.quantity < 1) {
      return NextResponse.json({ error: `Invalid item: ${item.variantId}` }, { status: 400 });
    }

    const productId = parseInt(item.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: `Invalid product ID: ${item.productId}` }, { status: 400 });
    }

    let realPriceCents: number;
    try {
      const detail = await getCachedProduct(productId);
      if (!detail) throw new Error("Product not found");
      const variant = detail.sync_variants.find((v) => String(v.id) === item.variantId);
      if (!variant) {
        return NextResponse.json({ error: `Variant not found: ${item.variantId}` }, { status: 400 });
      }
      realPriceCents = Math.round(parseFloat(variant.retail_price) * 100);
    } catch {
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unable to validate prices" }, { status: 503 });
      }
      // Dev mock: accept client price
      realPriceCents = item.price;
    }

    if (Math.abs(item.price - realPriceCents) > PRICE_TOLERANCE_CENTS) {
      return NextResponse.json(
        { error: "Price mismatch — please refresh and try again" },
        { status: 409 }
      );
    }

    validatedItems.push({
      variantId: item.variantId,
      productName: item.productName,
      variantName: item.variantName,
      quantity: item.quantity,
      unitPriceCents: realPriceCents,
    });
  }

  const totalCents = validatedItems.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);

  // ── Create PENDING Order in DB first so orderId goes into Stripe metadata ────
  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING",
      currency,
      totalAmount: totalCents,
      items: {
        create: validatedItems.map((i) => ({
          printfulItemId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          price: i.unitPriceCents,
        })),
      },
    },
  });

  // ── Stripe Checkout Session ───────────────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripeCurrency = currency.toLowerCase() as "chf" | "eur";

  const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    stripeCurrency === "chf"
      ? ["card", "twint"]
      : ["card", "sepa_debit", "paypal"];

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: paymentMethodTypes,
    currency: stripeCurrency,
    line_items: validatedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: stripeCurrency,
        unit_amount: item.unitPriceCents,
        product_data: {
          name: item.productName,
          description: item.variantName,
        },
      },
    })),
    customer_email: userEmail,
    shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: stripeCurrency },
          display_name: "Standard Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    metadata: { orderId: order.id, userId, locale: validLocale },
    success_url: `${appUrl}/${validLocale}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/${validLocale}/cart`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
