import apiRoute from "../../services/httpService";
import { SubjectTypeInterface } from "./subjectTypeService";

export interface SubjectInterface {
  id?: number;
  rank?: number;
  name: string;
  subject_type_id?: number;
  subject_type?: SubjectTypeInterface;
  code: string;
  credit_hour: number | null;
  is_active?: boolean;
  is_chooseable: boolean;
  is_section_specific: boolean;
  sections?: number[];
}

export interface changeSubjectStatusInterface {
  id: number;
}

export default apiRoute("/academics/subjects");
