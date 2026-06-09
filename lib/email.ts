import { Resend } from "resend";
import type { Currency } from "@/lib/currency";
import { renderOrderConfirmation, type OrderItem } from "@/lib/emails/order-confirmation";
import { renderMagicLinkEmail } from "@/lib/emails/magic-link";
import { renderWelcomeEmail } from "@/lib/emails/welcome";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = () =>
  process.env.RESEND_FROM_EMAIL ?? "OnlyDevs <noreply@onlydevs.shop>";

const APP_URL = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "https://onlydevs.shop";

/* ── Order Confirmation ─────────────────────────────────────────────────── */

export type { OrderItem };

interface SendOrderConfirmationOptions {
  to: string;
  orderId: string;
  items: OrderItem[];
  subtotal?: number;
  total: number;
  currency: Currency;
  shippingAddress?: {
    name?: string | null;
    line1?: string | null;
    city?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  locale: string;
}

export async function sendOrderConfirmation(opts: SendOrderConfirmationOptions) {
  const { to, orderId, items, total, currency, shippingAddress, locale } = opts;
  const subtotal = opts.subtotal ?? total;

  const html = await renderOrderConfirmation({
    orderId,
    items,
    subtotal,
    total,
    currency,
    shippingAddress,
    locale,
    trackOrderUrl: `${APP_URL()}/${locale}/account/orders`,
  });

  return getResend().emails.send({
    from: FROM(),
    to: [to],
    subject: `✓ Order confirmed — #${orderId.slice(0, 8).toUpperCase()}`,
    html,
  });
}

/* ── Magic Link (Sign-in) ───────────────────────────────────────────────── */

interface SendMagicLinkOptions {
  to: string;
  url: string;
}

export async function sendMagicLink(opts: SendMagicLinkOptions) {
  const html = await renderMagicLinkEmail({ url: opts.url, email: opts.to });

  return getResend().emails.send({
    from: FROM(),
    to: [opts.to],
    subject: "Sign in to OnlyDevs",
    html,
  });
}

/* ── Welcome Email ──────────────────────────────────────────────────────── */

interface SendWelcomeEmailOptions {
  to: string;
  name: string;
}

export async function sendWelcomeEmail(opts: SendWelcomeEmailOptions) {
  const base = APP_URL();
  const html = await renderWelcomeEmail({
    name: opts.name,
    shopUrl: `${base}/en/products`,
    ordersUrl: `${base}/en/account/orders`,
  });

  return getResend().emails.send({
    from: FROM(),
    to: [opts.to],
    subject: "Welcome to OnlyDevs 👋",
    html,
  });
}
