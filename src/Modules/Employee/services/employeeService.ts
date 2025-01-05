import apiRoute from "../../../services/httpService";
import { EmployeeTypeInterface } from "./employeeTypeService";

export interface EmployeeInterface {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  photo: string;
  nickname?: string | null;
  dob_en?: string | null;
  dob_np?: string | null;
  contact?: string | null;
  address?: string | null;
  email?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  nationality?: string | null;
  mother_tongue?: string | null;
  religion?: string | null;
  ethnicity: string;
  is_active: boolean;
  employee_type?: EmployeeTypeInterface;
  class?: {
    grade: string;
    section: string;
    faculty: string;
  };
}

export default apiRoute("/employees");
