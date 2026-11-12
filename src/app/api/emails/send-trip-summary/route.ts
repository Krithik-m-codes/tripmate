import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authSession";
import { render } from "@react-email/components";
import TripSummaryEmail from "@/emails/TripSummaryEmail";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      destination,
      durationText,
      budget,
      travelStyle,
      highlights,
      itinerarySummary,
      recipientEmail = session.user.email,
      recipientName = session.user.name || "Traveler",
    } = body;

    if (!destination) {
      return NextResponse.json({ success: false, message: "Missing destination" }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "Tripmate AI";

    if (!apiKey || !senderEmail) {
      return NextResponse.json(
        { success: false, message: "Brevo SMTP API not configured" },
        { status: 503 }
      );
    }

    const htmlContent = await render(
      TripSummaryEmail({
        recipientName,
        destination,
        durationText,
        budget,
        travelStyle,
        highlights,
        itinerarySummary,
      })
    );

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: recipientEmail, name: recipientName }],
        subject: `Trip Summary: ${destination} (${durationText || "Itinerary"})`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ success: false, message: "Brevo API error", error: err }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "Trip summary email sent successfully" });
  } catch (error) {
    console.error("send-trip-summary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email", error: (error as Error).message },
      { status: 500 }
    );
  }
}
