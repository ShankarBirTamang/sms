import apiRoute from "../../services/httpService";

export interface AcademicSessionInterface {
  name: string;
  start_date: string;
  start_date_np: string;
  end_date: string;
  end_date_np: string;
  academic_level_id: number;
  academic_level?: string;
}

export interface UpdateAcademicSessionInterface
  extends AcademicSessionInterface {
  id: number; // id is required for updates
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicSessionInterface[];
// }
export default apiRoute("/academics/academic-sessions");
