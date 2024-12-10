import apiRoute from "../../services/httpService";
import { UpdateAcademicSessionInterface } from "./academicSessionService";

// export interface AcademicLevelInterface {
//   id?: number;
//   name: string;
//   description?: string | null | undefined;
// }

export interface CreateAcademicLevelInterface {
  name: string;
  description: string;
  academic_sessions?: UpdateAcademicSessionInterface[];
}

export interface UpdateAcademicLevelInterface
  extends CreateAcademicLevelInterface {
  id: number; // id is required for updates
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicLevelInterface[];
// }
export default apiRoute("/academics/academic-levels");
