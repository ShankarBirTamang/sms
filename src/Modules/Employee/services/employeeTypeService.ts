import apiRoute from "../../../services/httpService";

export interface EmployeeTypeInterface {
  id: number;
  name: string;
}

export interface AddEmployeeTypeInterface {
  name: string;
}

export interface UpdateEmployeeTypeInterface {
  id: number;
  name: string;
}

export default apiRoute("/employee-types");
