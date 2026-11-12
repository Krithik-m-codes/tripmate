import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrganizationInviteEmailProps {
  recipientName?: string;
  inviterName?: string;
  organizationName?: string;
  role?: string;
  joinUrl?: string;
}

export const OrganizationInviteEmail = ({
  recipientName = "Traveler",
  inviterName = "A Tripmate User",
  organizationName = "Summer Europe Trip 2026",
  role = "Editor",
  joinUrl = "https://tripmate.vercel.app/dashboard",
}: OrganizationInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>You are invited to join {organizationName} on Tripmate</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://tripmate.vercel.app/tripmate-logo.png"
            width="48"
            height="48"
            alt="Tripmate"
            style={logo}
          />
          <Text style={brand}>TRIPMATE</Text>
        </Section>

        {/* Hero strip */}
        <Section style={heroBand}>
          <Text style={heroText}>Collaborative travel planning made simple.</Text>
        </Section>

        {/* Main card */}
        <Section style={card}>
          <Heading style={h1}>Join {organizationName}</Heading>
          <Text style={greeting}>Hi {recipientName},</Text>
          <Text style={body}>
            <strong>{inviterName}</strong> has invited you to collaborate on the travel workspace <strong>{organizationName}</strong> as an <strong>{role}</strong>.
          </Text>

          <Section style={infoBox}>
            <Text style={infoLine}><strong>Workspace:</strong> {organizationName}</Text>
            <Text style={infoLine}><strong>Assigned Role:</strong> {role}</Text>
            <Text style={infoLine}><strong>What you can do:</strong> Co-create AI itineraries, save places to interactive maps, and track travel budgets together.</Text>
          </Section>

          {joinUrl ? (
            <Button href={joinUrl} style={cta}>
              Accept Invitation & Open Workspace
            </Button>
          ) : null}

          <Text style={hint}>
            If you don&apos;t have a Tripmate account yet, clicking the button above will let you register in seconds.
          </Text>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Tripmate. All rights reserved.
          </Text>
          <Text style={footerSub}>
            Sent by Tripmate Collaborative Workspace Engine · tripmate.vercel.app
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrganizationInviteEmail;

// Styles
const main: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};
const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "520px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 32px rgba(5, 150, 105, 0.10)",
};
const header: React.CSSProperties = {
  backgroundColor: "#064e3b",
  padding: "24px 32px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};
const logo: React.CSSProperties = {
  borderRadius: "50%",
  display: "inline-block",
  verticalAlign: "middle",
};
const brand: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: "12px",
  color: "#d1fae5",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "0.18em",
};
const heroBand: React.CSSProperties = {
  backgroundColor: "#059669",
  padding: "10px 32px",
};
const heroText: React.CSSProperties = {
  color: "#ecfdf5",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.05em",
  margin: 0,
};
const card: React.CSSProperties = {
  padding: "36px 32px 28px",
};
const h1: React.CSSProperties = {
  color: "#064e3b",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 16px",
};
const greeting: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "15px",
  margin: "0 0 8px",
};
const body: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 24px",
};
const infoBox: React.CSSProperties = {
  backgroundColor: "#f8fdfa",
  border: "1.5px solid #bbf7d0",
  borderRadius: "12px",
  padding: "18px 18px",
  marginBottom: "24px",
};
const infoLine: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "6px 0",
};
const cta: React.CSSProperties = {
  backgroundColor: "#059669",
  borderRadius: "10px",
  color: "#ffffff",
  display: "block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "14px 28px",
  textDecoration: "none",
  textAlign: "center" as const,
  marginBottom: "24px",
};
const hint: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: 0,
};
const hr: React.CSSProperties = {
  borderColor: "#d1fae5",
  margin: "0",
};
const footer: React.CSSProperties = {
  padding: "20px 32px",
  textAlign: "center" as const,
};
const footerText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0 0 4px",
};
const footerSub: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "11px",
  margin: "0",
};
