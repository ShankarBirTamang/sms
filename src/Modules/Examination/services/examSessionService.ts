import { UpdateAcademicSessionInterface } from "../../../Academics/services/academicSessionService";
import apiRoute from "../../../services/httpService";
// import { UpdateGradeInterface } from "./gradeService";

export interface ExamInterface {
  id?: number;
  name: string;
  start_date_ad: string;
  start_date_np: string;
  end_date_ad: string;
  end_date_np: string;
  exam_level : string;
  // session: UpdateAcademicSessionInterface;
  session: string;
  is_completed?: boolean;
  
}

export interface UpdateExamInterface
  extends ExamInterface {
  id: number; // id is required for updates
  length:number;
}

export interface ChangeAcademicSessionStatusInterface {
  id: number;
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicSessionInterface[];
// }
export default apiRoute("/academics/academic-sessions");
