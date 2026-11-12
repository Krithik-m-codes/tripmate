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

interface TripSummaryEmailProps {
  recipientName?: string;
  destination?: string;
  durationText?: string;
  budget?: string;
  travelStyle?: string;
  highlights?: string[];
  itinerarySummary?: string;
  viewUrl?: string;
}

export const TripSummaryEmail = ({
  recipientName = "Traveler",
  destination = "Kyoto, Japan",
  durationText = "5 Days",
  budget = "Mid-range",
  travelStyle = "Balanced",
  highlights = ["Fushimi Inari Shrine at sunrise", "Arashiyama Bamboo Grove", "Gion evening walk & street food"],
  itinerarySummary = "Day 1: Arrival & Historic Higashiyama\nDay 2: Sacred Gates & Bamboo Forests\nDay 3: Tea Ceremonies & Modern Kyoto",
  viewUrl = "https://tripmate.vercel.app/dashboard",
}: TripSummaryEmailProps) => (
  <Html>
    <Head />
    <Preview>Your custom Tripmate itinerary for {destination} ({durationText})</Preview>
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
          <Text style={heroText}>Plan smarter, travel calmer.</Text>
        </Section>

        {/* Main card */}
        <Section style={card}>
          <Heading style={h1}>Your Trip to {destination}</Heading>
          <Text style={greeting}>Hi {recipientName},</Text>
          <Text style={body}>
            Here is your AI-curated travel itinerary for <strong>{destination}</strong>. We designed this based on your preference for a <strong>{travelStyle}</strong> pace with a <strong>{budget}</strong> budget.
          </Text>

          {/* Stats Box */}
          <Section style={statsBox}>
            <Text style={statsLine}><strong>Destination:</strong> {destination}</Text>
            <Text style={statsLine}><strong>Duration:</strong> {durationText}</Text>
            <Text style={statsLine}><strong>Style:</strong> {travelStyle} · {budget}</Text>
          </Section>

          <Heading style={h2}>Top Highlights</Heading>
          <ul style={listStyle}>
            {highlights.map((item, idx) => (
              <li key={idx} style={listItem}>{item}</li>
            ))}
          </ul>

          <Heading style={h2}>Quick Overview</Heading>
          <Text style={summaryBlock}>{itinerarySummary}</Text>

          {viewUrl ? (
            <Button href={viewUrl} style={cta}>
              View Full Interactive Itinerary & Map
            </Button>
          ) : null}

          <Text style={hint}>
            You can modify, share, or download this itinerary anytime directly from your Tripmate workspace.
          </Text>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Tripmate. All rights reserved.
          </Text>
          <Text style={footerSub}>
            Sent by Tripmate AI Travel Assistant · tripmate.vercel.app
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default TripSummaryEmail;

// Styles
const main: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};
const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "540px",
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
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 16px",
};
const h2: React.CSSProperties = {
  color: "#065f46",
  fontSize: "16px",
  fontWeight: 600,
  margin: "20px 0 10px",
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
  margin: "0 0 20px",
};
const statsBox: React.CSSProperties = {
  backgroundColor: "#f8fdfa",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "20px",
};
const statsLine: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "14px",
  margin: "4px 0",
};
const listStyle: React.CSSProperties = {
  paddingLeft: "20px",
  margin: "0 0 20px",
  color: "#374151",
};
const listItem: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "6px",
};
const summaryBlock: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  borderRadius: "10px",
  padding: "14px 16px",
  color: "#4b5563",
  fontSize: "13px",
  lineHeight: "1.6",
  whiteSpace: "pre-line" as const,
  marginBottom: "24px",
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
