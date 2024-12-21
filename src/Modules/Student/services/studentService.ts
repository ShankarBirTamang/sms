import apiRoute from "../../../services/httpService";

export interface StudentInterface {
  id: number;
  iemis: string | null;
  full_name?: string;
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
}

export default apiRoute("/students");
