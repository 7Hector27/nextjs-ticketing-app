import { useState, useEffect } from "react";
import * as jwt from "jwt-decode";

type JwtPayload = {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  name: string;
};

type UserState = {
  userId: string | null;
  email: string | null;
  role: string | null;
  name: string | null;
};

export function useUser() {
  const [user, setUser] = useState<UserState>({
    userId: null,
    email: null,
    role: null,
    name: null,
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      try {
        const decoded = jwt.jwtDecode<JwtPayload>(token);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        });
      } catch (err) {
        console.error("Failed to decode JWT:", err);
      }
    }
  }, []);

  return user;
}
