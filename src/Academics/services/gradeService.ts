import create from "../../services/httpService";
import { UpdateAcademicSessionInterface } from "./academicSessionService";

export interface SectionData {
  hasFaculties: boolean;
  sectionType: "standard" | "custom";
  facultySections: { facultyId: number; sections: string[] }[];
  sections: string[];
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

interface GradeInterface {
  name: string;
  grade_group_id: number;
  short_name: string;
  is_active: number;
  has_faculties: number;
  session: UpdateAcademicSessionInterface;
  sections: SectionsInterface;
}

export interface UpdateGradeInterface extends GradeInterface {
  id: number;
}

export default create("/academics/grades");
