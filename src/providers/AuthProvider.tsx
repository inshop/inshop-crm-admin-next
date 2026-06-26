"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  canCreate: (entity: string) => boolean;
  canUpdate: (entity: string) => boolean;
  canList: (entity: string) => boolean;
  canDetails: (entity: string) => boolean;
  canDelete: (entity: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  canCreate: () => false,
  canUpdate: () => false,
  canList: () => false,
  canDetails: () => false,
  canDelete: () => false,
});

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const login = (userData: AuthUser) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false;

  const entityRole = (entity: string, action: string) => {
    const prefix =
      entity === "featureFlag"
        ? "FEATURE_FLAG"
        : entity === "apiToken"
          ? "API_TOKEN"
          : entity.toUpperCase();
    return `ROLE_${prefix}_${action}`;
  };

  const canCreate = (entity: string) => hasRole(entityRole(entity, "CREATE"));
  const canUpdate = (entity: string) => hasRole(entityRole(entity, "UPDATE"));
  const canList = (entity: string) => hasRole(entityRole(entity, "LIST"));
  const canDetails = (entity: string) => hasRole(entityRole(entity, "DETAILS"));
  const canDelete = (entity: string) => hasRole(entityRole(entity, "DELETE"));

  return (
    <AuthContext.Provider
      value={{ user, login, logout, hasRole, canCreate, canUpdate, canList, canDetails, canDelete }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
