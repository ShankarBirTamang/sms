import apiRoute from "../../services/httpService";
import { UpdateAcademicSessionInterface } from "./academicSessionService";

export interface SectionData {
  hasFaculties: boolean;
  sectionType: "standard" | "custom";
  facultySections: { facultyId: number; sections: string[] }[];
  sections: string[];
}
export interface AddSectionInterface {
  onSectionDataChange: (data: SectionData, isValid: boolean) => void;
}
export interface EditSectionInterface {
  editData: UpdateGradeInterface;
  onSectionDataChange: (
    data: EditSectionDataInterface,
    isValid: boolean
  ) => void;
}

export interface EditSectionData {
  id: number | 0;
  name: string;
}

export interface EditSectionDataInterface {
  hasFaculties: boolean;
  sectionType: "standard" | "custom";
  facultySections:
    | { facultyId: number; sections: EditSectionInterface[] }[]
    | null;
  sections: EditSectionInterface[] | null;
}

export interface AddGradeInterface extends SectionData {
  academic_session_id: number;
  grade_group_id: number;
  name: string;
  short_name: string;
}
interface FacultyInterface {
  id: number;
  name: string;
}

export interface SectionInterface {
  id: number;
  name: string;
  grade_id: number;
  grade_name: string;
  type: string | null;
  is_active: number;
  faculty: FacultyInterface;
}

interface SectionsInterface {
  [key: string]: SectionInterface[];
}

export interface GradeInterface {
  id?: number;
  name: string;
  grade_group_id: number;
  short_name: string;
  is_active: number;
  has_faculties: boolean;
  section_type: "standard" | "custom";
  session: UpdateAcademicSessionInterface;
  sections: SectionsInterface;
}

export interface UpdateGradeInterface {
  length: number;
  id: number;
  name: string;
  grade_group_id: number;
  short_name: string;
  is_active: number;
  has_faculties: number;
  total_students?: number;
  section_type: "standard" | "custom";
  session: UpdateAcademicSessionInterface;
  sections: SectionsInterface;
}

export interface SingleGradeInterface {
  id: number;
}

export default apiRoute("/academics/grades");
