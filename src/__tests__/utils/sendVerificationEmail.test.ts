import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

describe("sendVerificationEmail utility", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns error if BREVO_API_KEY or BREVO_SENDER_EMAIL is missing", async () => {
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_SENDER_EMAIL;

    const result = await sendVerificationEmail("test@example.com", "Test User", "123456");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Missing Brevo email configuration");
  });

  it("sends email successfully when configured", async () => {
    process.env.BREVO_API_KEY = "test_api_key";
    process.env.BREVO_SENDER_EMAIL = "noreply@tripmate.vercel.app";

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ messageId: "123" }),
    } as any);

    const result = await sendVerificationEmail("test@example.com", "Test User", "123456");
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "api-key": "test_api_key",
        }),
      })
    );
  });
});
