"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { ItineraryPDFProps } from "./ItineraryPDF";

// Dynamically import PDFDownloadLink with ssr: false so it never crashes Next.js server rendering
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button size="sm" variant="outline" disabled className="gap-1.5 text-xs h-8">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        Preparing PDF...
      </Button>
    ),
  }
);

// We also dynamically import ItineraryPDF
const ItineraryPDF = dynamic(() => import("./ItineraryPDF"), { ssr: false });

interface PDFDownloadButtonProps extends ItineraryPDFProps {
  fileName?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  destination,
  dates,
  budget,
  travelStyle,
  activities,
  itineraryData,
  fileName,
  className,
  variant = "outline",
  size = "sm",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size={size} variant={variant} disabled className={className}>
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 mr-1.5" />
        PDF
      </Button>
    );
  }

  const cleanDestination = destination ? destination.replace(/[^a-zA-Z0-9-_]/g, "_") : "Trip";
  const defaultFileName = `${cleanDestination}_TripMate_Itinerary.pdf`;

  return (
    <PDFDownloadLink
      document={
        <ItineraryPDF
          destination={destination}
          dates={dates}
          budget={budget}
          travelStyle={travelStyle}
          activities={activities}
          itineraryData={itineraryData}
        /> as any
      }
      fileName={fileName || defaultFileName}
      className="inline-block"
    >
      {({ blob, url, loading, error }: any) => (
        <Button
          size={size}
          variant={variant}
          disabled={loading}
          className={className}
          title="Download printable branded PDF itinerary"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 mr-1.5" />
          ) : (
            <Download className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
          )}
          {loading ? "Generating..." : "Export PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
