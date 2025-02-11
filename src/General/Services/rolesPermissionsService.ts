import apiRoute from "../../services/httpService";

export interface RoleInterface {
  id: number;
  name: string;
}

export interface PermissionInterface {
  id: number;
  name: string;
}

export const rolesRoute = apiRoute("/general/roles");
export const permissionsRoute = apiRoute("/general/permissions");
