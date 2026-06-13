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
  hasRole: (role: string) => boolean;
  canCreate: (entity: string) => boolean;
  canUpdate: (entity: string) => boolean;
  canList: (entity: string) => boolean;
  canDetails: (entity: string) => boolean;
  canDelete: (entity: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
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

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false;

  const entityRole = (entity: string, action: string) =>
    `ROLE_${entity.toUpperCase()}_${action}`;

  const canCreate = (entity: string) => hasRole(entityRole(entity, "CREATE"));
  const canUpdate = (entity: string) => hasRole(entityRole(entity, "UPDATE"));
  const canList = (entity: string) => hasRole(entityRole(entity, "LIST"));
  const canDetails = (entity: string) => hasRole(entityRole(entity, "DETAILS"));
  const canDelete = (entity: string) => hasRole(entityRole(entity, "DELETE"));

  return (
    <AuthContext.Provider
      value={{ user, hasRole, canCreate, canUpdate, canList, canDetails, canDelete }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
