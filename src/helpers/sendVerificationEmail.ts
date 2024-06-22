import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// This function sends a verification email to the user with the verification code.
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // try to send the email
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "TripMate Verification Email 🚀 ",
      react: VerificationEmail({ username, verifyCode }),
    });

    if (error) {
      console.error("Error sending verification email:");
      console.error(error);
      return {
        success: false,
        message: "Failed to send verification email. Please try again later.",
        data: null,
      };
    }
    // return a success response if the email is sent successfully
    return {
      success: true,
      message: "Verification email sent successfully.",
      data: data,
    };
  } catch (emailError) {
    console.error("Error sending verification email:");
    console.error(emailError);
    return {
      success: false,
      message: "Failed to send verification email. Please try again later.",
      data: null,
    };
  }
}
