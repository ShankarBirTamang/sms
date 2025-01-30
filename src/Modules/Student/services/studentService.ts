import {
  GradeInterface,
  SectionInterface,
} from "../../../Academics/services/gradeService";
import apiRoute from "../../../services/httpService";

export interface StudentInterface {
  id: number;
  roll_no?: string | number;
  iemis: string | null;
  full_name?: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
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
  email?: string | null;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  mother_tongue?: string;
  religion?: string;
  ethnicity?: string;
  photo?: File; // Assuming the photo is uploaded as a file
  permanent_country_id?: number;
  permanent_province_id?: number;
  permanent_district_id?: number;
  permanent_municipality_id?: number;
  permanent_ward_no?: number;
  permanent_street_address?: string;
  current_country_id?: number;
  current_province_id?: number;
  current_district_id?: number;
  current_municipality_id?: number;
  current_ward_no?: number;
  current_street_address?: string;
}

export interface StudentGuardianInterface {
  id?: number;
  name: string;
  relation: string;
  contact: string;
  email?: string;
  address?: string;
  occupation?: string;
  education?: string;
}

export default apiRoute("/students");
