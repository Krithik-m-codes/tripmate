import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

type SendEmailRequest = {
  email?: string;
  fullName?: string;
  verifyCode?: string;
  ctaUrl?: string;
  ctaLabel?: string;
};

export async function POST(request: Request) {
  try {
    const { email, fullName, verifyCode, ctaUrl, ctaLabel } =
      (await request.json()) as SendEmailRequest;

    if (!email || !fullName || !verifyCode) {
      const response: ApiResponse = {
        success: false,
        message: "Missing required fields",
        data: null,
      };

      return Response.json(response, { status: 400 });
    }

    const result = await sendVerificationEmail(email, fullName, verifyCode, {
      ctaUrl,
      ctaLabel,
    });
    return Response.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Failed to send verification email",
      data: error,
    };

    return Response.json(response, { status: 500 });
  }
}
