import apiRoute from "../../services/httpService";
import { UpdateGradeInterface } from "./gradeService";

export interface AcademicSessionInterface {
  id?: number;
  name: string;
  start_date: string;
  start_date_np: string;
  end_date: string;
  end_date_np: string;
  academic_level_id: number;
  academic_level?: string;
  is_active?: boolean;
  grades?: UpdateGradeInterface[];
}

export interface UpdateAcademicSessionInterface
  extends AcademicSessionInterface {
  id: number; // id is required for updates
}

export interface ChangeAcademicSessionStatusInterface {
  id: number;
}

export interface SessionLevel {
  session_id : number;
  session_name : string;
  level_id : number;
  level_name: string;
}


// export interface AcademicLevelsResponse {
//   data: UpdateAcademicSessionInterface[];
// }
export default apiRoute("/academics/academic-sessions");
