// lib/auth.ts
import { getUserByEmail, verifyPassword } from "./admin-db";

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
}

export function checkRole(userRole: string, requiredRole: string) {
  if (requiredRole === "SUPER_ADMIN") {
    return userRole === "SUPER_ADMIN";
  }
  if (requiredRole === "ADMIN") {
    return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  }
  return false;
}

export function isAdmin(userRole: string) {
  return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
}

export function isSuperAdmin(userRole: string) {
  return userRole === "SUPER_ADMIN";
}

