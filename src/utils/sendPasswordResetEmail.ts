import "server-only";
import { render } from "@react-email/components";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendPasswordResetEmail = async (
  email: string,
  fullName: string,
  resetUrl: string
): Promise<ApiResponse> => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Tripmate";
  const replyTo = process.env.BREVO_REPLY_TO;

  if (!apiKey || !senderEmail) {
    return {
      success: false,
      message: "Missing Brevo email configuration (BREVO_API_KEY / BREVO_SENDER_EMAIL)",
      data: null,
    };
  }

  const htmlContent = await render(PasswordResetEmail({ fullName, resetUrl }));

  const payload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email, name: fullName }],
    subject: "Reset your Tripmate password",
    htmlContent,
    ...(replyTo ? { replyTo: { email: replyTo } } : {}),
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: "Brevo rejected the email request",
        data: errorText,
      };
    }

    return { success: true, message: "Password reset email sent", data: null };
  } catch (error) {
    return {
      success: false,
      message: "Network error sending password reset email",
      data: (error as Error).message,
    };
  }
};
