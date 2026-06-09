import * as React from "react";
import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr,
} from "@react-email/components";
import { render } from "@react-email/render";

interface Props {
  url: string;
  email: string;
}

function MagicLinkEmail({ url, email }: Props) {
  const displayUrl = url.length > 60 ? url.slice(0, 60) + "…" : url;

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
            <Text style={headerTag}>$ auth --magic-link</Text>
            <Text style={logo}>OnlyDevs</Text>
          </Section>

          {/* Body */}
          <Section style={section}>
            <Text style={greeting}>Hey, developer 👋</Text>
            <Text style={bodyText}>
              Here&apos;s your sign-in link for <span style={green}>onlydevs.shop</span>.
              Click the button below to authenticate instantly — no password needed.
            </Text>

            <Button style={ctaButton} href={url}>
              Sign in to OnlyDevs
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Terminal-style link preview */}
          <Section style={terminalSection}>
            <Text style={terminalLabel}>// or copy this link</Text>
            <Text style={terminalCode}>
              $ curl -X GET &quot;{displayUrl}&quot;
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Security note */}
          <Section style={section}>
            <Text style={securityNote}>
              🔐 This link expires in <span style={white}>24 hours</span> and can only be used once.
              If you didn&apos;t request this, you can safely ignore this email — your account is secure.
            </Text>
            <Text style={emailNote}>
              Request made for: <span style={{ fontFamily: "monospace", color: "#a1a1aa" }}>{email}</span>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              OnlyDevs — Built by devs, for devs. 🇨🇭
            </Text>
            <Text style={footerMeta}>
              This is a transactional authentication email. You will not receive marketing emails.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderMagicLinkEmail(props: Props): Promise<string> {
  return render(<MagicLinkEmail {...props} />);
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
const section: React.CSSProperties = { padding: "28px 32px" };
const greeting: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#e4e4e7",
  margin: "0 0 12px",
};
const bodyText: React.CSSProperties = {
  fontSize: "14px",
  color: "#a1a1aa",
  lineHeight: "1.6",
  margin: "0 0 24px",
};
const green: React.CSSProperties = { color: "#22c55e" };
const white: React.CSSProperties = { color: "#e4e4e7" };
const ctaButton: React.CSSProperties = {
  backgroundColor: "#22c55e",
  color: "#000000",
  fontWeight: "700",
  fontSize: "15px",
  padding: "14px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  fontFamily: "monospace",
};
const divider: React.CSSProperties = { borderColor: "#27272a", margin: 0 };
const terminalSection: React.CSSProperties = {
  padding: "16px 32px",
  backgroundColor: "#0d0d0d",
};
const terminalLabel: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10px",
  color: "#52525b",
  margin: "0 0 6px",
};
const terminalCode: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "11px",
  color: "#22c55e",
  margin: 0,
  wordBreak: "break-all",
  lineHeight: "1.5",
};
const securityNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  lineHeight: "1.6",
  margin: "0 0 10px",
  padding: "12px 16px",
  backgroundColor: "#1a1a1a",
  borderRadius: "6px",
  borderLeft: "3px solid #3f3f46",
};
const emailNote: React.CSSProperties = {
  fontSize: "12px",
  color: "#52525b",
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
  lineHeight: "1.5",
};
