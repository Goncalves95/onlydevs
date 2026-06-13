import { Resend } from "resend";
import type { Currency } from "@/lib/currency";
import { renderOrderConfirmation, type OrderItem } from "@/lib/emails/order-confirmation";
import { renderMagicLinkEmail } from "@/lib/emails/magic-link";
import { renderWelcomeEmail } from "@/lib/emails/welcome";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    console.log("[resend] initialising — API key present:", !!process.env.RESEND_API_KEY);
    console.log("[resend] FROM:", process.env.RESEND_FROM_EMAIL ?? "(using default noreply@onlydevs.shop)");
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = () =>
  process.env.RESEND_FROM_EMAIL ?? "OnlyDevs <noreply@onlydevs.shop>";

const APP_URL = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "https://onlydevs.shop";

/**
 * Resend SDK never throws — it returns { data, error }.
 * This wrapper checks the error and throws so callers get real stack traces.
 */
async function dispatch(opts: {
  to: string;
  subject: string;
  html: string;
  tag: string;
}): Promise<string> {
  console.log(`[resend] sending "${opts.tag}" to:`, opts.to);
  const { data, error } = await getResend().emails.send({
    from: FROM(),
    to: [opts.to],
    subject: opts.subject,
    html: opts.html,
  });
  if (error) {
    // Resend wraps errors as { name, message, statusCode }
    console.error(`[resend] "${opts.tag}" failed — name:${(error as { name?: string }).name} message:`, (error as { message?: string }).message);
    throw new Error(`Resend error (${opts.tag}): ${(error as { message?: string }).message ?? JSON.stringify(error)}`);
  }
  console.log(`[resend] "${opts.tag}" delivered, id:`, data?.id);
  return data?.id ?? "";
}

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

  return dispatch({
    to,
    subject: `✓ Order confirmed — #${orderId.slice(0, 8).toUpperCase()}`,
    html,
    tag: "order-confirmation",
  });
}

/* ── Magic Link (Sign-in) ───────────────────────────────────────────────── */

interface SendMagicLinkOptions {
  to: string;
  url: string;
}

export async function sendMagicLink(opts: SendMagicLinkOptions) {
  const html = await renderMagicLinkEmail({ url: opts.url, email: opts.to });
  return dispatch({ to: opts.to, subject: "Sign in to OnlyDevs", html, tag: "magic-link" });
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
  return dispatch({ to: opts.to, subject: "Welcome to OnlyDevs 👋", html, tag: "welcome" });
}
