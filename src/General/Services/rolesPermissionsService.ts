import apiRoute from "../../services/httpService";

export interface RoleInterface {
  id: number;
  name: string;
}

export const rolesRoute = apiRoute("/roles");
export const permissionsRoute = apiRoute("/permissions");
