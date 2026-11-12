import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export interface ServerSessionUser {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string;
  plan?: "free" | "pro";
  planStatus?: string;
  isVerified?: boolean;
  [key: string]: any;
}

export interface ServerSessionData {
  user: ServerSessionUser;
  session?: any;
  [key: string]: any;
}

export const getAuthSession = async (): Promise<ServerSessionData | null> => {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    if (!session || !session.user) return null;
    return {
      user: {
        ...session.user,
        _id: (session.user as any).id || (session.user as any)._id,
        plan: (session.user as any).plan || "free",
        planStatus: (session.user as any).planStatus || "active",
        username: (session.user as any).username || session.user.name,
        avatar: (session.user as any).avatar || session.user.image,
        isVerified: (session.user as any).isVerified || session.user.emailVerified,
      },
      session: session.session,
    };
  } catch (error) {
    return null;
  }
};

export const getSessionUserId = (session: any): string | null => {
  if (!session?.user) return null;
  return session.user._id || session.user.id ? String(session.user._id || session.user.id) : null;
};
