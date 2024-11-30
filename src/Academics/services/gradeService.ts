import create from "../../services/httpService";
import { UpdateAcademicSessionInterface } from "./academicSessionService";

// export interface SectionInterface {
//   name: string;
//   faculty_id: number;
//   room_id: number;
// }

// export interface GradeInterface {
//   name: string;
//   short_name: string;
//   grade_group_id: string;
//   section_type: string;
//   session: UpdateAcademicSessionInterface;
//   sections: SectionInterface[];
// }

interface FacultyInterface {
  id: number;
  name: string;
}

interface SectionInterface {
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
