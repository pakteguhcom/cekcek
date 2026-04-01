"use client";

export const AUTH_KEY = "pakteguh_auth";
export const VALID_EMAIL = "admin@pakteguh.com";
export const VALID_PASSWORD = "@Pakteguh123";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login(email: string, password: string): boolean {
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem("pakteguh_user", email);
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("pakteguh_user");
}

export function getUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pakteguh_user");
}
