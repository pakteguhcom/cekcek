"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout, getUser } from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const auth = isAuthenticated();
    setIsLoggedIn(auth);
    setUser(getUser());
    if (!auth) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return { isLoggedIn, user, logout: handleLogout };
}
