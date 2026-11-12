import { render } from "@react-email/components";
import { VerificationEmail } from "@/emails/VerificationEmail";

// GET /api/email-preview — renders the Tripmate verification email template as HTML.
// Useful for visual QA without sending a real email.
export async function GET() {
  const html = await render(
    VerificationEmail({ fullName: "Alex Parker", otp: "847203" })
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
