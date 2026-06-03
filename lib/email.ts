import { Resend } from "resend";
import { formatPrice, type Currency } from "@/lib/currency";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface OrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  price: number; // cents
}

interface SendOrderConfirmationOptions {
  to: string;
  orderId: string;
  items: OrderItem[];
  total: number; // cents
  currency: Currency;
  locale: string;
}

export async function sendOrderConfirmation(opts: SendOrderConfirmationOptions) {
  const { to, orderId, items, total, currency, locale } = opts;

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #27272a">${item.productName} — ${item.variantName}</td>
          <td style="padding:8px 0;border-bottom:1px solid #27272a;text-align:center">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #27272a;text-align:right">${formatPrice(item.price * item.quantity, currency)}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0d0d0d;color:#e4e4e7;font-family:monospace;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto">
    <p style="color:#22c55e;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px">$ order --confirmed</p>
    <h1 style="font-size:24px;font-weight:700;margin-bottom:4px">OnlyDevs</h1>
    <p style="color:#a1a1aa;margin-bottom:32px">Your order has been confirmed.</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr style="color:#71717a;font-size:12px;text-transform:uppercase">
          <th style="text-align:left;padding-bottom:8px">Product</th>
          <th style="text-align:center;padding-bottom:8px">Qty</th>
          <th style="text-align:right;padding-bottom:8px">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="display:flex;justify-content:space-between;padding-top:16px;border-top:1px solid #27272a">
      <span style="font-weight:700">Total</span>
      <span style="font-weight:700;color:#22c55e">${formatPrice(total, currency)}</span>
    </div>

    <p style="color:#71717a;font-size:12px;margin-top:32px">
      Order ID: ${orderId}<br>
      Estimated delivery: 3–7 business days via Printful.<br>
      VAT included in price.
    </p>

    <hr style="border:none;border-top:1px solid #27272a;margin:32px 0">
    <p style="color:#52525b;font-size:11px">
      OnlyDevs — Built by devs, for devs.<br>
      You received this email because you placed an order on onlydevs.com.
    </p>
  </div>
</body>
</html>`;

  const result = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "OnlyDevs <noreply@onlydevs.com>",
    to: [to],
    subject: `Order confirmed — ${formatPrice(total, currency)}`,
    html,
  });

  return result;
}
