import * as React from "react";
import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr, Row, Column,
} from "@react-email/components";
import { render } from "@react-email/render";
import type { Currency } from "@/lib/currency";
import { formatPrice } from "@/lib/currency";

export interface OrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  price: number; // cents
}

interface Props {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
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
  trackOrderUrl: string;
}

function OrderConfirmationEmail({
  orderId,
  items,
  subtotal,
  total,
  currency,
  shippingAddress,
  trackOrderUrl,
}: Props) {
  const shortId = orderId.slice(0, 8).toUpperCase();

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
      </Head>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={headerTag}>$ order --confirmed</Text>
            <Text style={logo}>OnlyDevs</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={checkmark}>✓</Text>
            <Text style={heroTitle}>Your order is confirmed</Text>
            <Text style={heroSub}>
              Order <span style={mono}>#{shortId}</span> is being prepared by Printful.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={section}>
            <Text style={sectionLabel}>// order.items</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemName}>
                  <Text style={itemText}>
                    {item.productName}
                    <span style={{ color: "#71717a" }}> — {item.variantName}</span>
                  </Text>
                </Column>
                <Column style={itemQty}>
                  <Text style={{ ...itemText, textAlign: "center", color: "#71717a" }}>
                    ×{item.quantity}
                  </Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={{ ...itemText, textAlign: "right" }}>
                    {formatPrice(item.price * item.quantity, currency)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Totals */}
          <Section style={section}>
            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Subtotal</Text></Column>
              <Column><Text style={totalValue}>{formatPrice(subtotal, currency)}</Text></Column>
            </Row>
            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Shipping</Text></Column>
              <Column><Text style={{ ...totalValue, color: "#71717a" }}>Calculated by Printful</Text></Column>
            </Row>
            <Row style={{ ...totalRow, borderTop: "1px solid #27272a", paddingTop: "12px", marginTop: "8px" }}>
              <Column><Text style={{ ...totalLabel, fontWeight: "700", color: "#e4e4e7" }}>Total</Text></Column>
              <Column><Text style={{ ...totalValue, color: "#22c55e", fontWeight: "700" }}>{formatPrice(total, currency)}</Text></Column>
            </Row>
            <Text style={vatNote}>VAT included</Text>
          </Section>

          <Hr style={divider} />

          {/* Shipping address */}
          {shippingAddress && (
            <>
              <Section style={section}>
                <Text style={sectionLabel}>// shipping.address</Text>
                <Text style={addressText}>
                  {shippingAddress.name && <>{shippingAddress.name}<br /></>}
                  {shippingAddress.line1 && <>{shippingAddress.line1}<br /></>}
                  {(shippingAddress.postalCode || shippingAddress.city) && (
                    <>{[shippingAddress.postalCode, shippingAddress.city].filter(Boolean).join(" ")}<br /></>
                  )}
                  {shippingAddress.country}
                </Text>
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Delivery + CTA */}
          <Section style={section}>
            <Text style={deliveryText}>
              Estimated delivery: <span style={{ color: "#e4e4e7" }}>5–10 business days</span>
            </Text>
            <Button style={ctaButton} href={trackOrderUrl}>
              Track your order →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              OnlyDevs — Built by devs, for devs. 🇨🇭
            </Text>
            <Text style={footerMeta}>
              You received this email because you placed an order on onlydevs.shop.
              This is a transactional email — no marketing, no spam.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderOrderConfirmation(props: Props): Promise<string> {
  return render(<OrderConfirmationEmail {...props} />);
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const body: React.CSSProperties = {
  backgroundColor: "#0d0d0d",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "24px 0",
};
const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#111111",
  border: "1px solid #27272a",
  borderRadius: "8px",
  overflow: "hidden",
};
const header: React.CSSProperties = {
  backgroundColor: "#0d0d0d",
  borderBottom: "1px solid #27272a",
  padding: "20px 32px",
};
const headerTag: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "11px",
  color: "#22c55e",
  margin: "0 0 4px",
  letterSpacing: "0.05em",
};
const logo: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "22px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: 0,
};
const heroSection: React.CSSProperties = {
  padding: "32px 32px 24px",
  textAlign: "center",
};
const checkmark: React.CSSProperties = {
  fontSize: "40px",
  color: "#22c55e",
  margin: "0 0 12px",
  lineHeight: 1,
};
const heroTitle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: "0 0 8px",
};
const heroSub: React.CSSProperties = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: 0,
};
const mono: React.CSSProperties = { fontFamily: "monospace", color: "#22c55e" };
const divider: React.CSSProperties = { borderColor: "#27272a", margin: 0 };
const section: React.CSSProperties = { padding: "20px 32px" };
const sectionLabel: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10px",
  color: "#52525b",
  letterSpacing: "0.08em",
  margin: "0 0 12px",
  textTransform: "uppercase",
};
const itemRow: React.CSSProperties = {
  borderBottom: "1px solid #1f1f23",
  paddingBottom: "8px",
  marginBottom: "8px",
};
const itemName: React.CSSProperties = { width: "60%" };
const itemQty: React.CSSProperties = { width: "15%", textAlign: "center" };
const itemPrice: React.CSSProperties = { width: "25%", textAlign: "right" };
const itemText: React.CSSProperties = {
  fontSize: "13px",
  color: "#e4e4e7",
  margin: 0,
};
const totalRow: React.CSSProperties = { marginBottom: "4px" };
const totalLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: 0,
};
const totalValue: React.CSSProperties = {
  fontSize: "13px",
  color: "#e4e4e7",
  margin: 0,
  textAlign: "right",
};
const vatNote: React.CSSProperties = {
  fontSize: "11px",
  color: "#52525b",
  fontFamily: "monospace",
  margin: "8px 0 0",
};
const addressText: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  lineHeight: "1.6",
  margin: 0,
};
const deliveryText: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  margin: "0 0 20px",
};
const ctaButton: React.CSSProperties = {
  backgroundColor: "#22c55e",
  color: "#000000",
  fontWeight: "700",
  fontSize: "14px",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  fontFamily: "monospace",
};
const footer: React.CSSProperties = { padding: "20px 32px" };
const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  margin: "0 0 8px",
};
const footerMeta: React.CSSProperties = {
  fontSize: "11px",
  color: "#3f3f46",
  margin: 0,
  lineHeight: "1.5",
};
