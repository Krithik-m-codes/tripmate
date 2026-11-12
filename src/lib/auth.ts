import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

const dbProxy = {
  collection(modelName: string) {
    const collectionName =
      modelName === "user"
        ? "users"
        : modelName === "session"
          ? "sessions"
          : modelName === "account"
            ? "accounts"
            : modelName === "verification"
              ? "verifications"
              : modelName === "rateLimit"
                ? "rateLimits"
                : modelName;

    return new Proxy(
      {},
      {
        get(_target, propName) {
          if (propName === "aggregate" || propName === "find") {
            return (...args: any[]) => {
              const createCursorProxy = (getRealCursor: () => Promise<any> | any) => {
                return new Proxy(
                  {},
                  {
                    get(_t, cursorPropName) {
                      if (
                        cursorPropName === "toArray" ||
                        cursorPropName === "next" ||
                        cursorPropName === "forEach"
                      ) {
                        return async (...cursorArgs: any[]) => {
                          await dbConnect();
                          const realCursor = await getRealCursor();
                          return await (realCursor as any)[cursorPropName](...cursorArgs);
                        };
                      }
                      return (...chainArgs: any[]) => {
                        return createCursorProxy(async () => {
                          await dbConnect();
                          const realCursor = await getRealCursor();
                          return (realCursor as any)[cursorPropName](...chainArgs);
                        });
                      };
                    },
                  }
                );
              };

              return createCursorProxy(async () => {
                await dbConnect();
                const col = mongoose.connection.db!.collection(collectionName);
                return (col as any)[propName](...args);
              });
            };
          }

          return async (...args: any[]) => {
            await dbConnect();
            const col = mongoose.connection.db!.collection(collectionName);
            const val = (col as any)[propName];
            if (typeof val === "function") {
              return await val.apply(col, args);
            }
            return val;
          };
        },
      }
    );
  },
};

export const auth = betterAuth({
  database: mongodbAdapter(dbProxy as any),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  user: {
    modelName: "users",
    fields: {
      image: "avatar",
      emailVerified: "isVerified",
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        console.log("\n========================================================");
        console.log(`🔐 [BETTER-AUTH OTP GENERATED] Email: ${email} | Type: ${type} | Code: ${otp}`);
        console.log("========================================================\n");

        const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3001";
        try {
          const emailRes = await sendVerificationEmail(email, "Tripmate User", otp, {
            ctaUrl: `${origin}/sign-in`,
            ctaLabel: "Sign in to Tripmate",
          });
          if (!emailRes.success) {
            console.error("❌ Brevo email delivery failed inside sendVerificationOTP:", emailRes);
          }
        } catch (err) {
          console.error("❌ Error sending email in sendVerificationOTP:", err);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET || "default_secret_key_for_tripmate_development_998877",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
});
