import apiRoute from "../../services/httpService";

export interface GradeGroupInterface {
  name: string;
  description: string;
}

export interface UpdateGradeGroupInterface extends GradeGroupInterface {
  id: number;
}

export default apiRoute("/academics/grade-groups");
