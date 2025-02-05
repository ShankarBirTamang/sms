import apiRoute from "../../../services/httpService";
import { SectionInterface } from "./gradeService";
import { SubjectTypeInterface } from "./subjectTypeService";

export interface SubjectInterface {
  id: number;
  rank?: number;
  name: string;
  subject_type_id?: number;
  subject_type?: SubjectTypeInterface;
  code: string;
  credit_hour: number | null;
  is_active?: boolean;
  is_chooseable: boolean;
  is_section_specific: boolean;
  sections?: SectionInterface[];
  teachers?: {
    id: number;
    name: string;
    sections?: {
      id: string;
      name: string;
    }[];
  }[];
}

export interface EditSubjectInterface extends SubjectInterface {
  id: number;
}

export interface UpdateSubjectInterface {
  id: number;
  rank?: number;
  name: string;
  subject_type_id?: number;
  subject_type?: SubjectTypeInterface;
  code: string;
  credit_hour: number | null;
  is_active?: boolean;
  is_chooseable: boolean;
  is_section_specific: boolean;
  teachers?: {
    id: number;
    name: string;
    sections?: {
      id: string;
      name: string;
    }[];
  }[];
}

export interface changeSubjectStatusInterface {
  id: number;
}

export interface UpdateRankProps {
  grade_id: number;
  onSave: () => void;
  subjects: SubjectInterface[];
}

export interface UpdateRankData {
  subjects: UpdateRankDataProps[];
}

export interface UpdateRankDataProps {
  subjectId: number;
  name: string;
  rank: string;
}

export default apiRoute("/academics/subjects");
