import apiRoute from "../../services/httpService";

export interface FacultyInterface {
  name: string;
  code: string;
  description: string;
}

export interface UpdateFacultyInterface extends FacultyInterface {
  id: number;
}

export default apiRoute("/academics/faculties");
