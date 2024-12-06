import apiRoute from "../../services/httpService";

export interface FacultyInterface {
  name: string;
  code: string;
  description: string;
  is_default?: boolean;
}

export interface UpdateFacultyInterface extends FacultyInterface {
  id: number;
}

export interface ChangeFacultyStatusInterface {
  id: number;
}

export default apiRoute("/academics/faculties");
