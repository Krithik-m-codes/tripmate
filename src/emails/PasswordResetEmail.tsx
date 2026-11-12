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

interface PasswordResetEmailProps {
  fullName?: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  fullName = "Traveler",
  resetUrl,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Tripmate password</Preview>
    <Body style={main}>
      <Container style={container}>
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

        <Section style={heroBand}>
          <Text style={heroText}>Reset your password in minutes.</Text>
        </Section>

        <Section style={card}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={greeting}>Hi {fullName},</Text>
          <Text style={body}>
            We received a request to reset your Tripmate password. Click the button below to set a
            new password. This link expires in
            <strong> 24 hours</strong>.
          </Text>

          <Button href={resetUrl} style={cta}>
            Reset my password
          </Button>

          <Text style={hint}>
            If you did not request a password reset, you can safely ignore this email.
          </Text>
        </Section>

        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Tripmate. All rights reserved.
          </Text>
          <Text style={footerSub}>
            You received this email because you have a Tripmate account.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

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
  marginBottom: "18px",
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
  margin: 0,
};
