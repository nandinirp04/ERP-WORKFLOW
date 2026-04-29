export const normalizeRole = (role: string | null | undefined): string => {
  return role?.trim().toLowerCase() ?? "";
};

export const isAdmin = (role: string | null | undefined): boolean => {
  return normalizeRole(role) === "admin";
};

export const isStaff = (role: string | null | undefined): boolean => {
  return normalizeRole(role) === "staff";
};

export const isAdminOrStaff = (role: string | null | undefined): boolean => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "admin" || normalizedRole === "staff";
};
