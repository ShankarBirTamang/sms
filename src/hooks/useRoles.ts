import { createContext, useContext } from "react";

type RoleContextType = {
  roles: string[];
  setRoles: (roles: string[]) => void;
};

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);

export const useRoles = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoles must be used within a RoleProvider");
  }
  return context;
};
