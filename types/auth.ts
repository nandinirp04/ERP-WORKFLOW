export type UserRole = "admin" | "staff" | "manager" | "viewer" | string;

export type AuthUser = {
  id: string;
  staffId?: string;
  name: string;
  email: string;
  role: UserRole;
  isFirstLogin?: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};
