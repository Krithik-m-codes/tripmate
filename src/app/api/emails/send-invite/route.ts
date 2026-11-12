import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authSession";
import { render } from "@react-email/components";
import OrganizationInviteEmail from "@/emails/OrganizationInviteEmail";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientEmail, recipientName, organizationName, role = "Editor" } = body;

    if (!recipientEmail || !organizationName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (recipientEmail, organizationName)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "Tripmate Workspaces";

    if (!apiKey || !senderEmail) {
      return NextResponse.json(
        { success: false, message: "Brevo SMTP API not configured" },
        { status: 503 }
      );
    }

    const htmlContent = await render(
      OrganizationInviteEmail({
        recipientName: recipientName || recipientEmail.split("@")[0],
        inviterName: session.user.name || session.user.email,
        organizationName,
        role,
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
        to: [{ email: recipientEmail, name: recipientName || recipientEmail }],
        subject: `Invitation to join workspace "${organizationName}" on Tripmate`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ success: false, message: "Brevo API error", error: err }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "Invitation email sent successfully" });
  } catch (error) {
    console.error("send-invite error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send invitation", error: (error as Error).message },
      { status: 500 }
    );
  }
}
