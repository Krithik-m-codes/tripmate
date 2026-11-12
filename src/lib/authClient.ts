"use client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const client = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3001"),
  plugins: [emailOTPClient()],
});

export interface FormattedUser {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string;
  plan?: "free" | "pro";
  planStatus?: "active" | "past_due" | "canceled";
  isVerified?: boolean;
  [key: string]: any;
}

export interface FormattedSessionData {
  user: FormattedUser;
  session?: any;
  [key: string]: any;
}

export const useSession = (): {
  data: FormattedSessionData | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isPending: boolean;
  error: any;
} => {
  const { data, isPending, error } = client.useSession();
  const status = isPending ? "loading" : data?.user ? "authenticated" : "unauthenticated";

  const formattedData: FormattedSessionData | null = data?.user
    ? {
        ...data,
        user: {
          ...data.user,
          _id: (data.user as any).id || (data.user as any)._id,
          plan: (data.user as any).plan || "free",
          planStatus: (data.user as any).planStatus || "active",
          username: (data.user as any).username || data.user.name,
          avatar: (data.user as any).avatar || data.user.image,
          isVerified: (data.user as any).isVerified || data.user.emailVerified,
        },
      }
    : null;

  return {
    data: formattedData,
    status,
    isPending,
    error,
  };
};

export const signIn = async (
  providerOrCredentials?: string | any,
  options?: any
): Promise<{ data?: any; error?: any; [key: string]: any } | null> => {
  if (providerOrCredentials === "google" || providerOrCredentials === "github") {
    return (await client.signIn.social({
      provider: providerOrCredentials as "google" | "github",
      callbackURL: options?.callbackUrl || "/explore/map",
    })) as any;
  }
  if (providerOrCredentials === "email-otp" || options?.otp) {
    return (await client.signIn.emailOtp({
      email: options?.email || providerOrCredentials?.email,
      otp: options?.otp || providerOrCredentials?.otp,
    })) as any;
  }
  if (providerOrCredentials === "credentials" || options?.email) {
    return (await client.signIn.email({
      email: options?.email || providerOrCredentials?.email,
      password: options?.password || providerOrCredentials?.password,
      callbackURL: options?.callbackUrl || "/explore/map",
    })) as any;
  }
  return null;
};

export const signOut = async (options?: any): Promise<{ data?: any; error?: any; [key: string]: any } | null> => {
  return (await client.signOut({
    fetchOptions: {
      onSuccess: () => {
        if (typeof window !== "undefined") {
          window.location.href = options?.callbackUrl || "/sign-in";
        }
      },
    },
  })) as any;
};

export const { signUp } = client;
