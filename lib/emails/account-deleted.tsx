import * as React from "react";
import {
  Html, Head, Body, Container, Section,
  Text, Hr, Row, Column,
} from "@react-email/components";
import { render } from "@react-email/render";

function AccountDeletedEmail() {
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
            <Text style={headerTag}>$ account --delete --permanent</Text>
            <Text style={logo}>OnlyDevs</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={heroTitle}>Account Deleted</Text>
            <Text style={heroSub}>
              Your OnlyDevs account and personal data have been permanently deleted,
              as requested. This action cannot be undone.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What was deleted */}
          <Section style={section}>
            <Text style={sectionLabel}>// data.deleted</Text>
            {[
              "Profile information (name, email address, profile photo)",
              "Saved shipping addresses",
              "Authentication sessions (Google login, magic-link tokens)",
              "Password hash",
            ].map((item) => (
              <Row key={item} style={listRow}>
                <Column style={bullet}>
                  <Text style={bulletText}>✕</Text>
                </Column>
                <Column>
                  <Text style={listText}>{item}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* What was kept */}
          <Section style={keptSection}>
            <Text style={sectionLabel}>// data.retained (legal requirement)</Text>
            <Row style={listRow}>
              <Column style={bullet}>
                <Text style={{ ...bulletText, color: "#a1a1aa" }}>i</Text>
              </Column>
              <Column>
                <Text style={listText}>
                  <span style={{ color: "#e4e4e7" }}>Order records (anonymised)</span> — required under Swiss
                  tax and accounting law (10-year retention). Your name and email
                  have been replaced with anonymous placeholders; the financial
                  records themselves are kept for compliance purposes only.
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Emergency contact */}
          <Section style={alertSection}>
            <Text style={alertText}>
              If this wasn&apos;t you, contact us immediately:
            </Text>
            <Text style={alertEmail}>
              <a href="mailto:onlydevs.shop@gmail.com" style={{ color: "#ef4444" }}>
                onlydevs.shop@gmail.com
              </a>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>OnlyDevs — Built by devs, for devs. 🇨🇭</Text>
            <Text style={footerMeta}>
              OnlyDevs · Zürich, Switzerland · This is an automated confirmation
              of your account deletion request.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderAccountDeletedEmail(): Promise<string> {
  return render(<AccountDeletedEmail />);
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
  color: "#ef4444",
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
};
const heroTitle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: "0 0 12px",
};
const heroSub: React.CSSProperties = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: 0,
  lineHeight: "1.6",
};
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
const listRow: React.CSSProperties = { marginBottom: "10px" };
const bullet: React.CSSProperties = { width: "24px", verticalAlign: "top" };
const bulletText: React.CSSProperties = {
  fontSize: "12px",
  color: "#ef4444",
  fontFamily: "monospace",
  fontWeight: "700",
  margin: 0,
  paddingTop: "1px",
};
const listText: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: 0,
  lineHeight: "1.5",
};
const keptSection: React.CSSProperties = {
  padding: "20px 32px",
  backgroundColor: "#0d0d0d",
};
const alertSection: React.CSSProperties = {
  padding: "20px 32px",
  backgroundColor: "#1a0e0e",
  borderTop: "1px solid #7f1d1d",
  borderBottom: "1px solid #7f1d1d",
};
const alertText: React.CSSProperties = {
  fontSize: "13px",
  color: "#fca5a5",
  margin: "0 0 6px",
};
const alertEmail: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "700",
  margin: 0,
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
