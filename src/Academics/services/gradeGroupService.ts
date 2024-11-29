import create from "../../services/httpService";

export interface GradeGroupInterface {
  name: string;
  description: string;
}

export interface UpdateGradeGroupInterface extends GradeGroupInterface {
  id: number;
}

export default create("/academics/grade-groups");
