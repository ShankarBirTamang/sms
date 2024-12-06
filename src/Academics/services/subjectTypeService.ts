import apiRoute from "../../services/httpService";

export interface SubjectTypeInterface {
  id?: number;
  name: string;
  marking_scheme: "grade" | "marks";
  is_marks_added: boolean;
  is_active?: boolean;
}

export interface UpdateSubjectTypeInterface extends SubjectTypeInterface {
  id: number;
}

export interface ChangeSubjectTypeStatusInterface {
  id: number;
}

export default apiRoute("/academics/subject-types");
