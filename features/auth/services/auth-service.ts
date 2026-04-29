import type { AuthTokens, AuthUser, UserRole } from "@/types/auth";
import { useERPStore } from "@/store/erp-store";

type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

const resolveRoleFromEmail = (email: string): UserRole => {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail.includes("admin") ? "admin" : "staff";
};

export const login = async ({ email, password }: LoginParams): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const role = resolveRoleFromEmail(email);
  const staffRecord = useERPStore.getState().getStaffByEmail(email);

  return {
    user: {
      id: staffRecord?.id ?? crypto.randomUUID(),
      staffId: staffRecord?.id,
      name: staffRecord?.name ?? (role === "admin" ? "Admin User" : "Staff User"),
      email,
      role: staffRecord?.role ?? role,
      isFirstLogin: role === "staff" ? staffRecord?.isFirstLogin ?? true : false,
    },
    tokens: {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    },
  };
};
