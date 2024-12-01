import { createContext, useContext } from "react";

type PermissionContextType = {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
};

export const PermissionContext = createContext<
  PermissionContextType | undefined
>(undefined);

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("useRoles must be used within a RoleProvider");
  }
  return context;
};
