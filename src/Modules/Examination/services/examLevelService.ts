import apiRoute from "../../../services/httpService";
import { UpdateExamSessionInterface } from "./examSessionService";

// export interface AcademicLevelInterface {
//   id?: number;
//   name: string;
//   description?: string | null | undefined;
// }

export interface CreateExamLevelInterface {
  name: string;
  description: string;
  academic_sessions?: UpdateExamSessionInterface[];
}

export interface UpdateExamLevelInterface
  extends CreateExamLevelInterface {
  id: number; // id is required for updates
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicLevelInterface[];
// }
export default apiRoute("/academics/academic-levels");
