import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { StructuredItinerary } from "@/schemas/itinerarySchema";

// Register default clean Helvetica styles (built-in to PDF readers for instant rendering)
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#1E293B", // slate-800
  },
  headerBanner: {
    backgroundColor: "#059669", // emerald-600
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: "#D1FAE5", // emerald-100
    marginTop: 3,
  },
  destinationBox: {
    alignItems: "flex-end",
  },
  destinationTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  datesText: {
    fontSize: 10,
    color: "#ECFDF5",
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC", // slate-50
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0", // slate-200
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "column",
  },
  metaLabel: {
    fontSize: 9,
    color: "#64748B", // slate-500
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A", // slate-900
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#047857", // emerald-700
    borderBottomWidth: 1.5,
    borderBottomColor: "#10B981",
    paddingBottom: 4,
    marginTop: 16,
    marginBottom: 10,
  },
  dayBlock: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981", // emerald-500
  },
  dayTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#065F46", // emerald-800
    marginBottom: 6,
  },
  slotRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  slotLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#334155", // slate-700
    width: 65,
  },
  slotText: {
    fontSize: 10,
    color: "#475569", // slate-600
    flex: 1,
    lineHeight: 1.4,
  },
  highlightBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: "#ECFDF5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  highlightText: {
    fontSize: 9,
    color: "#065F46",
    fontFamily: "Helvetica-Oblique",
  },
  tipsContainer: {
    marginTop: 12,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    color: "#10B981",
    width: 15,
  },
  tipText: {
    fontSize: 10,
    color: "#334155",
    flex: 1,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#94A3B8",
  },
});

export interface ItineraryPDFProps {
  destination: string;
  dates?: string;
  budget?: string;
  travelStyle?: string;
  activities?: string[];
  itineraryData: StructuredItinerary | string | string[];
}

export const ItineraryPDF: React.FC<ItineraryPDFProps> = ({
  destination,
  dates = "Flexible Dates",
  budget = "Moderate",
  travelStyle = "Explore",
  activities = [],
  itineraryData,
}) => {
  // Parse lines or structure if it's text
  const isStructured = typeof itineraryData === "object" && !Array.isArray(itineraryData) && "days" in (itineraryData as any);
  const rawText = Array.isArray(itineraryData)
    ? itineraryData.join("\n\n")
    : typeof itineraryData === "string"
    ? itineraryData
    : "";

  // Helper to split plain text into day sections if structured data is not present
  const renderTextSections = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentDayTitle = "";
    let currentDayLines: string[] = [];

    const flushDay = (key: number) => {
      if (!currentDayTitle && currentDayLines.length === 0) return;
      elements.push(
        <View key={`day-${key}`} style={styles.dayBlock} wrap={false}>
          {currentDayTitle ? (
            <Text style={styles.dayTitle}>{currentDayTitle}</Text>
          ) : null}
          {currentDayLines.map((line, idx) => {
            if (!line.trim()) return null;
            if (/^(morning|afternoon|evening):?/i.test(line.trim())) {
              const parts = line.split(":");
              return (
                <View key={idx} style={styles.slotRow}>
                  <Text style={styles.slotLabel}>{parts[0]}:</Text>
                  <Text style={styles.slotText}>{parts.slice(1).join(".").trim() || line}</Text>
                </View>
              );
            }
            if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
              return (
                <View key={idx} style={styles.tipItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.tipText}>{line.replace(/^[-*]\s*/, "")}</Text>
                </View>
              );
            }
            return (
              <Text key={idx} style={[styles.slotText, { marginBottom: 3 }]}>
                {line}
              </Text>
            );
          })}
        </View>
      );
      currentDayLines = [];
    };

    let counter = 0;
    for (const line of lines) {
      if (/^#{1,3}\s*day\s+\d+/i.test(line.trim()) || /^day\s+\d+/i.test(line.trim())) {
        flushDay(counter++);
        currentDayTitle = line.replace(/^#+\s*/, "").trim();
      } else {
        currentDayLines.push(line);
      }
    }
    flushDay(counter++);
    return elements;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <View>
            <Text style={styles.brandTitle}>TripMate AI</Text>
            <Text style={styles.brandSubtitle}>Personalized Travel Itinerary</Text>
          </View>
          <View style={styles.destinationBox}>
            <Text style={styles.destinationTitle}>{destination}</Text>
            <Text style={styles.datesText}>{dates}</Text>
          </View>
        </View>

        {/* Metadata Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Budget Level</Text>
            <Text style={styles.metaValue}>{budget}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Travel Style</Text>
            <Text style={styles.metaValue}>{travelStyle}</Text>
          </View>
          {activities && activities.length > 0 && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Key Interests</Text>
              <Text style={styles.metaValue}>
                {activities.slice(0, 3).join(", ")}
              </Text>
            </View>
          )}
        </View>

        {/* Itinerary Content */}
        <Text style={styles.sectionHeader}>Day-by-Day Schedule</Text>

        {isStructured ? (
          // Render structured itinerary format
          ((itineraryData as StructuredItinerary).days || []).map((day, idx) => {
            const morningActs = (day.activities || []).filter((a) => a.timeSlot === "morning");
            const afternoonActs = (day.activities || []).filter((a) => a.timeSlot === "afternoon");
            const eveningActs = (day.activities || []).filter((a) => a.timeSlot === "evening");
            const hiddenGemAct = (day.activities || []).find((a) => a.isHiddenGem);

            return (
              <View key={idx} style={styles.dayBlock} wrap={false}>
                <Text style={styles.dayTitle}>
                  Day {day.day}: {day.theme} {day.date ? `(${day.date})` : ""}
                </Text>
                {morningActs.length > 0 && (
                  <View style={styles.slotRow}>
                    <Text style={styles.slotLabel}>Morning:</Text>
                    <Text style={styles.slotText}>
                      {morningActs.map((a) => `${a.title}: ${a.description}`).join(" | ")}
                    </Text>
                  </View>
                )}
                {afternoonActs.length > 0 && (
                  <View style={styles.slotRow}>
                    <Text style={styles.slotLabel}>Afternoon:</Text>
                    <Text style={styles.slotText}>
                      {afternoonActs.map((a) => `${a.title}: ${a.description}`).join(" | ")}
                    </Text>
                  </View>
                )}
                {eveningActs.length > 0 && (
                  <View style={styles.slotRow}>
                    <Text style={styles.slotLabel}>Evening:</Text>
                    <Text style={styles.slotText}>
                      {eveningActs.map((a) => `${a.title}: ${a.description}`).join(" | ")}
                    </Text>
                  </View>
                )}
                {hiddenGemAct && (
                  <View style={styles.highlightBox}>
                    <Text style={styles.highlightText}>
                      ✨ Hidden Gem ({hiddenGemAct.title}): {hiddenGemAct.description}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          // Render parsed plain text sections
          renderTextSections(rawText)
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by TripMate AI Travel Planner</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default ItineraryPDF;
