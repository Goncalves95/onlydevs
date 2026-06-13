import * as React from "react";
import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr, Row, Column,
} from "@react-email/components";
import { render } from "@react-email/render";

export interface ShippedItem {
  productName: string;
  variantName?: string | null;
  quantity: number;
}

interface Props {
  orderId: string;
  items: ShippedItem[];
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  orderUrl: string;
}

function OrderShippedEmail({
  orderId,
  items,
  carrier,
  trackingNumber,
  trackingUrl,
  orderUrl,
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
            <Text style={headerTag}>$ tracking --new</Text>
            <Text style={logo}>OnlyDevs</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={bigEmoji}>📦</Text>
            <Text style={heroTitle}>Your order has shipped!</Text>
            <Text style={heroSub}>
              Order <span style={mono}>#{shortId}</span> is on its way.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Tracking info */}
          <Section style={section}>
            <Text style={sectionLabel}>// tracking.info</Text>

            {carrier && (
              <Row style={infoRow}>
                <Column style={infoLabelCol}>
                  <Text style={infoLabelText}>Carrier</Text>
                </Column>
                <Column>
                  <Text style={infoValue}>{carrier}</Text>
                </Column>
              </Row>
            )}

            {trackingNumber && (
              <Row style={infoRow}>
                <Column style={infoLabelCol}>
                  <Text style={infoLabelText}>Tracking #</Text>
                </Column>
                <Column>
                  <Text style={{ ...infoValue, fontFamily: "monospace", color: "#22c55e" }}>
                    {trackingNumber}
                  </Text>
                </Column>
              </Row>
            )}

            <Text style={deliveryNote}>
              Estimated delivery:{" "}
              <span style={{ color: "#e4e4e7" }}>5–10 business days</span> from shipment date.
            </Text>

            {trackingUrl && (
              <Button style={ctaButton} href={trackingUrl}>
                Track Package →
              </Button>
            )}
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={section}>
            <Text style={sectionLabel}>// order.items</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemText}>
                    {item.productName}
                    {item.variantName && (
                      <span style={{ color: "#71717a" }}> — {item.variantName}</span>
                    )}
                  </Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={{ ...itemText, color: "#71717a" }}>×{item.quantity}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Secondary CTA */}
          <Section style={secondaryCta}>
            <Button style={secondaryButton} href={orderUrl}>
              View order details →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>OnlyDevs — Built by devs, for devs. 🇨🇭</Text>
            <Text style={footerMeta}>
              OnlyDevs · Zürich, Switzerland · You&apos;re receiving this because you have an account with us.{" "}
              <a href={orderUrl.replace(/\/account.*/, "/account/profile")} style={{ color: "#22c55e" }}>
                Manage preferences in your profile.
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderOrderShippedEmail(props: Props): Promise<string> {
  return render(<OrderShippedEmail {...props} />);
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
const bigEmoji: React.CSSProperties = {
  fontSize: "40px",
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
const infoRow: React.CSSProperties = { marginBottom: "8px" };
const infoLabelCol: React.CSSProperties = { width: "100px" };
const infoLabelText: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  margin: 0,
  fontFamily: "monospace",
};
const infoValue: React.CSSProperties = {
  fontSize: "13px",
  color: "#e4e4e7",
  margin: 0,
};
const deliveryNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  margin: "16px 0 20px",
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
const itemRow: React.CSSProperties = {
  borderBottom: "1px solid #1f1f23",
  paddingBottom: "8px",
  marginBottom: "8px",
};
const itemText: React.CSSProperties = {
  fontSize: "13px",
  color: "#e4e4e7",
  margin: 0,
};
const secondaryCta: React.CSSProperties = { padding: "20px 32px", textAlign: "center" };
const secondaryButton: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "#22c55e",
  fontWeight: "700",
  fontSize: "13px",
  padding: "10px 20px",
  borderRadius: "6px",
  border: "1px solid #22c55e",
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
  lineHeight: "1.6",
};
