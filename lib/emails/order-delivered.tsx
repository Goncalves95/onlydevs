import * as React from "react";
import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr, Row, Column,
} from "@react-email/components";
import { render } from "@react-email/render";

interface DeliveredItem {
  productName: string;
  variantName?: string | null;
  quantity: number;
}

interface Props {
  orderId: string;
  items: DeliveredItem[];
  shopUrl: string;
}

function OrderDeliveredEmail({ orderId, items, shopUrl }: Props) {
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
            <Text style={headerTag}>$ delivery --completed</Text>
            <Text style={logo}>OnlyDevs</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={bigEmoji}>✅</Text>
            <Text style={heroTitle}>Delivered!</Text>
            <Text style={heroSub}>
              Order <span style={mono}>#{shortId}</span> has arrived.
            </Text>
            <Text style={loveNote}>We hope you love it! 🚀</Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={section}>
            <Text style={sectionLabel}>// what.you.got</Text>
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

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={shopUrl}>
              Shop more →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Support note */}
          <Section style={supportSection}>
            <Text style={supportText}>
              Questions or issues with your order? Reply to this email or contact{" "}
              <a href="mailto:onlydevs.shop@gmail.com" style={{ color: "#22c55e" }}>
                onlydevs.shop@gmail.com
              </a>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>OnlyDevs — Built by devs, for devs. 🇨🇭</Text>
            <Text style={footerMeta}>
              OnlyDevs · Zürich, Switzerland · You&apos;re receiving this because you have an account with us.{" "}
              <a href={`${shopUrl.replace(/\/products.*/, "")}/account/profile`} style={{ color: "#22c55e" }}>
                Manage preferences in your profile.
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderOrderDeliveredEmail(props: Props): Promise<string> {
  return render(<OrderDeliveredEmail {...props} />);
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
  fontSize: "26px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: "0 0 8px",
};
const heroSub: React.CSSProperties = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: "0 0 8px",
};
const loveNote: React.CSSProperties = {
  fontSize: "15px",
  color: "#e4e4e7",
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
const itemText: React.CSSProperties = {
  fontSize: "13px",
  color: "#e4e4e7",
  margin: 0,
};
const ctaSection: React.CSSProperties = { padding: "24px 32px", textAlign: "center" };
const ctaButton: React.CSSProperties = {
  backgroundColor: "#22c55e",
  color: "#000000",
  fontWeight: "700",
  fontSize: "15px",
  padding: "14px 32px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  fontFamily: "monospace",
};
const supportSection: React.CSSProperties = { padding: "16px 32px", backgroundColor: "#0d0d0d" };
const supportText: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  margin: 0,
  lineHeight: "1.6",
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
