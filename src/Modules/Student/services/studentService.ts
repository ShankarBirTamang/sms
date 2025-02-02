import {
  GradeInterface,
  SectionInterface,
} from "../../../Academics/services/gradeService";
import apiRoute from "../../../services/httpService";
export interface AddressInterface {
  id: number;
  type: string;
  country: string;
  country_id: number;
  province: string;
  province_id: number;
  district: string;
  district_id: number;
  municipality: string;
  municipality_id: number;
  ward_no: string;
  street_address: string;
  full_address: string;
}
export interface StudentInterface {
  id: number;
  roll_no?: string | number;
  iemis: string;
  full_name?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  photo: string;
  thumbnail?: string;
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
  guardians?: StudentGuardianInterface[];
  grade?: GradeInterface;
  section?: SectionInterface;
}

export interface AddStudentInterface {
  first_name: string;
  middle_name?: string;
  last_name: string;
  session_id: number;
  grade_id: number;
  section_id: number;
  nickname?: string;
  iemis?: string;
  dob_en?: string; // Date of birth in English format
  don_np?: string; // Date of birth in Nepali format
  contact?: string;
  email?: string;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  mother_tongue?: string;
  religion?: string;
  ethnicity?: string;
  photo?: Base64URLString; // Assuming the photo is uploaded as a file
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

export interface EditStudentInterface {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  nickname?: string;
  iemis?: string;
  dob_en?: string; // Date of birth in English format
  don_np?: string; // Date of birth in Nepali format
  contact?: string;
  email?: string;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  mother_tongue?: string;
  religion?: string;
  ethnicity?: string;
  photo?: Base64URLString; // Assuming the photo is uploaded as a file
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

export interface StudentGuardianInterface {
  id: number;
  name: string;
  type: "parent" | "guardian";
  relation: string;
  contact: string;
  email?: string;
  address?: string;
  occupation?: string;
  education?: string;
  photo?: string;
}

export interface AddStudentGuardianInterface {
  name: string;
  relation: string;
  type: "parent" | "guardian";
  contact: string;
  email?: string;
  address: string;
  occupation?: string;
  education?: string;
  photo?: Base64URLString;
  student_id: number;
}

export interface EditStudentGuardianInterface {
  id: number;
  name: string;
  type: "parent" | "guardian";
  relation: string;
  contact: string;
  email?: string;
  address: string;
  occupation?: string;
  education?: string;
  photo?: Base64URLString;
}
export default apiRoute("/students");
