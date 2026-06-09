import * as React from "react";
import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr, Row, Column,
} from "@react-email/components";
import { render } from "@react-email/render";

interface Props {
  name: string;
  shopUrl: string;
  ordersUrl: string;
}

function WelcomeEmail({ name, shopUrl, ordersUrl }: Props) {
  const displayName = name.trim() || "developer";

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
            <Text style={headerTag}>$ git clone your-dev-journey</Text>
            <Text style={logo}>OnlyDevs</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={heroTitle}>
              Welcome, {displayName}! 🎉
            </Text>
            <Text style={heroSub}>
              Your account is ready. Time to shop like a developer.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What you can do */}
          <Section style={section}>
            <Text style={sectionLabel}>// what.you.can.do</Text>

            <Row style={featureRow}>
              <Column style={featureIcon}>
                <Text style={iconText}>🛍️</Text>
              </Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Browse products</Text>
                <Text style={featureDesc}>
                  Hoodies, tees, stickers, mugs — all made on demand. No deadstock.
                </Text>
              </Column>
            </Row>

            <Row style={featureRow}>
              <Column style={featureIcon}>
                <Text style={iconText}>📦</Text>
              </Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Track your orders</Text>
                <Text style={featureDesc}>
                  Every order with a tracking number and status updates in your account.
                </Text>
              </Column>
            </Row>

            <Row style={featureRow}>
              <Column style={featureIcon}>
                <Text style={iconText}>👤</Text>
              </Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Manage your account</Text>
                <Text style={featureDesc}>
                  Update your profile, download your data, or delete your account — it&apos;s your data.
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={shopUrl}>
              Start Shopping →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Dev joke */}
          <Section style={jokeSection}>
            <Text style={jokeLabel}>// daily.standup</Text>
            <Text style={jokeText}>
              &quot;Yesterday: ordered a hoodie. Today: waiting for shipping. Blockers: my credit card.&quot;
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              OnlyDevs — Built by devs, for devs. 🇨🇭
            </Text>
            <Text style={footerMeta}>
              You received this welcome email because you created an account on onlydevs.shop.
              <br />
              Manage your account:{" "}
              <a href={ordersUrl} style={{ color: "#22c55e" }}>
                onlydevs.shop/account
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderWelcomeEmail(props: Props): Promise<string> {
  return render(<WelcomeEmail {...props} />);
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
const heroTitle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: "0 0 10px",
};
const heroSub: React.CSSProperties = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: 0,
};
const divider: React.CSSProperties = { borderColor: "#27272a", margin: 0 };
const section: React.CSSProperties = { padding: "24px 32px" };
const sectionLabel: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10px",
  color: "#52525b",
  letterSpacing: "0.08em",
  margin: "0 0 16px",
};
const featureRow: React.CSSProperties = { marginBottom: "16px" };
const featureIcon: React.CSSProperties = { width: "40px", verticalAlign: "top" };
const iconText: React.CSSProperties = { fontSize: "20px", margin: 0, lineHeight: "1.2" };
const featureContent: React.CSSProperties = { verticalAlign: "top" };
const featureTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: "0 0 3px",
};
const featureDesc: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  margin: 0,
  lineHeight: "1.5",
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
const jokeSection: React.CSSProperties = {
  padding: "16px 32px",
  backgroundColor: "#0d0d0d",
};
const jokeLabel: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10px",
  color: "#52525b",
  margin: "0 0 6px",
};
const jokeText: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "12px",
  color: "#3f3f46",
  margin: 0,
  fontStyle: "italic",
  lineHeight: "1.5",
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
