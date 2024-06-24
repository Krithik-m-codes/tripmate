import { ApiResponse } from "@/types/ApiResponse";
import emailjs from "@emailjs/browser";

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  verifyCode: string
): Promise<ApiResponse> => {
  const templateParams = {
    to_name: fullName,
    otp: verifyCode,
    to_email: email,
  };

  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
    console.log("EmailJS response:", response);
    if (!response) {
      return {
        success: false,
        message: "Failed to send email due to an error in EmailJS",
        data: null,
      };
    }

    return {
      success: true,
      message: "Email sent successfully",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email due to an error in EmailJS",
      data: error,
    };
  }
};
