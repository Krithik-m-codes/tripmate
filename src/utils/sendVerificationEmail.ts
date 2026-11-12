import "server-only";
import { render } from "@react-email/components";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  verifyCode: string,
  options?: { ctaUrl?: string; ctaLabel?: string }
): Promise<ApiResponse> => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Tripmate";
  const replyTo = process.env.BREVO_REPLY_TO;

  if (!apiKey || !senderEmail) {
    console.warn("Brevo email configuration missing (BREVO_API_KEY or BREVO_SENDER_EMAIL)");
    return {
      success: false,
      message: "Missing Brevo email configuration (BREVO_API_KEY / BREVO_SENDER_EMAIL)",
      data: null,
    };
  }

  // Render our branded template — no Brevo template ID required
  const htmlContent = await render(
    VerificationEmail({
      fullName,
      otp: verifyCode,
      ctaUrl: options?.ctaUrl,
      ctaLabel: options?.ctaLabel,
    })
  );

  const payload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email, name: fullName }],
    subject: `${verifyCode} is your Tripmate verification code`,
    htmlContent,
    ...(replyTo ? { replyTo: { email: replyTo } } : {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo rejected email request:", { status: response.status, errorText });
      return {
        success: false,
        message: "Brevo rejected the email request",
        data: errorText,
      };
    }

    const responseData = await response.json().catch(() => null);
    return { success: true, message: "Verification email sent", data: responseData };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Network error sending verification email:", error);
    return {
      success: false,
      message: "Network error sending verification email",
      data: (error as Error).message,
    };
  }
};
