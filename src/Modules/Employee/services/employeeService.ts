import apiRoute from "../../../services/httpService";
import { AddressInterface } from "../../Student/services/studentService";
import { EmployeeTypeInterface } from "./employeeTypeService";

export interface EmployeeInterface {
  id: number;
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  allow_login: boolean;
  role?: string;
  photo: string;
  nickname?: string;
  dob_en?: string;
  dob_np?: string;
  contact?: string;
  permanent_address?: AddressInterface;
  current_address?: AddressInterface;
  email?: string;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  mother_tongue?: string;
  religion?: string;
  ethnicity: string;
  is_active: boolean;
  employee_type: EmployeeTypeInterface;
  class?: {
    grade: string;
    section: string;
    faculty: string;
    full_grade: string;
  };
}

export interface AddEmployeeInterface {
  first_name: string;
  middle_name?: string;
  last_name: string;
  type: string;
  allowLogin: boolean;
  email?: string;
  password?: string;
  role?: string;
  nickname?: string;
  dob_en?: string; // Date of birth in English format
  don_np?: string; // Date of birth in Nepali format
  photo?: Base64URLString; // Assuming the photo is uploaded as a file
  contact?: string;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  mother_tongue?: string;
  religion?: string;
  ethnicity?: string;
  permanent_country_id?: number;
  permanent_province_id?: number;
  permanent_district_id?: number;
  permanent_municipality_id?: number;
  permanent_ward_no?: string;
  permanent_street_address?: string;
  current_country_id?: number;
  current_province_id?: number;
  current_district_id?: number;
  current_municipality_id?: number;
  current_ward_no?: string;
  current_street_address?: string;
}

export interface EditEmployeeInterface {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  type: string;
  allowLogin: boolean;
  email?: string;
  password?: string;
  role?: string;
  nickname?: string;
  dob_en?: string; // Date of birth in English format
  don_np?: string; // Date of birth in Nepali format
  photo?: Base64URLString; // Assuming the photo is uploaded as a file
  contact?: string;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  mother_tongue?: string;
  religion?: string;
  ethnicity?: string;
  permanent_country_id?: number;
  permanent_province_id?: number;
  permanent_district_id?: number;
  permanent_municipality_id?: number;
  permanent_ward_no?: string;
  permanent_street_address?: string;
  current_country_id?: number;
  current_province_id?: number;
  current_district_id?: number;
  current_municipality_id?: number;
  current_ward_no?: string;
  current_street_address?: string;
}

export default apiRoute("/employees");
