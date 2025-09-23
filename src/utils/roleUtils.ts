export const hasRole = (userRoles: string, targetRole: string): boolean => {
  if (!userRoles) return false;
  return userRoles.includes(targetRole);
};

export const hasAnyRole = (
  userRoles: string,
  targetRoles: string[]
): boolean => {
  if (!userRoles) return false;
  return targetRoles.some((role) => userRoles.includes(role));
};

export const getPrimaryRole = (userRoles: string): string => {
  if (!userRoles) return "USER";
  if (userRoles.includes("OWNER")) return "OWNER";
  if (userRoles.includes("ADMIN")) return "ADMIN";
  return "USER";
};

export const formatUserRole = (roles: string): string => {
  if (!roles) return "Người dùng";

  if (roles.includes("OWNER")) {
    return "Chủ sở hữu";
  } else if (roles.includes("ADMIN")) {
    return "Quản trị viên";
  } else {
    return "Người dùng";
  }
};

export const getRoleColor = (roles: string): string => {
  if (!roles) return "bg-blue-100 text-blue-800";

  if (roles.includes("OWNER")) {
    return "bg-red-100 text-red-800";
  } else if (roles.includes("ADMIN")) {
    return "bg-purple-100 text-purple-800";
  } else {
    return "bg-blue-100 text-blue-800";
  }
};
