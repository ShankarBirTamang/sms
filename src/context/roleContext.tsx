import React, { useState, ReactNode } from "react";
import { RoleContext } from "../hooks/useRoles";

export const RoleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<string[]>([]);

  return (
    <RoleContext.Provider value={{ roles, setRoles }}>
      {children}
    </RoleContext.Provider>
  );
};
