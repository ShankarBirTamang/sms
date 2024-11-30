import React, { useState, ReactNode } from "react";
import { PermissionContext } from "../hooks/usePermissions";

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<string[]>([]);

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};
