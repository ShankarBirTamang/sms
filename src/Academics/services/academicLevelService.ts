import apiRoute from "../../services/httpService";

// export interface AcademicLevelInterface {
//   id?: number;
//   name: string;
//   description?: string | null | undefined;
// }

export interface CreateAcademicLevelInterface {
  name: string;
  description: string;
}

export interface UpdateAcademicLevelInterface
  extends CreateAcademicLevelInterface {
  id: number; // id is required for updates
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicLevelInterface[];
// }
export default apiRoute("/academics/academic-levels");
