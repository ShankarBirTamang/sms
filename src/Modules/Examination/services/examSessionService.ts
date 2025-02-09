import apiRoute from "../../../services/httpService";
import { AcademicSessionInterface } from "../../Academics/services/academicSessionService";
import { SectionInterface } from "../../Academics/services/gradeService";
// import { UpdateGradeInterface } from "./gradeService";

// export interface ExamInterface {
//   id?: number;
//   name: string;
//   start_date_ad: string;
//   start_date_np: string;
//   end_date_ad: string;
//   end_date_np: string;
//   exam_level : string;
//   // session: UpdateAcademicSessionInterface;
//   session: string;
//   is_completed?: boolean;

// }

interface SessionLevel {
  session_id: number;
  session_name: string;
  level_id: number;
  level_name: string;
}

export interface ExamMarksScheme {
  id: number;
  marks_scheme_id: number;
  name: string;
  short_name: string;
  group: "Theory" | "Practical";
}

export interface ExamSessionInterface {
  id: number;
  name: string;
  start_date: string;
  start_date_np: string;
  end_date: string;
  end_date_np: string;
  result_date?: string;
  result_date_np?: string;
  has_symbol_no: boolean;
  has_registration_no: boolean;
  is_completed: boolean;
  session_level: SessionLevel;
  exam_attributes: ExamAttributes;
  exam_grades: ExamGrade[];
  exam_marks_schemes: ExamMarksScheme[];
}

export interface ExamAttributesInterface {
  id: number;
  name: string;
  html: string;
  background: string;
  signers: Signers[];
}
export interface Signers {
  id: number;
  name: string;
  holder: { id?: number; name?: string };
  signature?: string;
  title: string;
}
interface ExamAttributes {
  admit_card: ExamAttributesInterface;
  mark_sheet: ExamAttributesInterface;
}

export interface ExamGrade {
  exam_grade_id: number;
  grade_id: number;
  grade_name: string;
  grade_short_name: string;
  sections: SectionInterface[];
}

export interface CreateExamInterface {
  name: string;
  start_date: string;
  start_date_np: string;
  end_date: string;
  end_date_np: string;
  result_date?: string;
  result_date_np?: string;
  has_symbol_no: boolean;
  has_registration_no: boolean;
  academic_session_id: number;
  marks_schemes: number[];
  grades: number[];
  is_merged: boolean;
  merged_exams?: number[];
  admit_card_id: number;
  marksheet_id: number;
}

// export interface UpdateExamInterface
//   extends ExamInterface {
//   id: number; // id is required for updates
//   length:number;
// }

// export interface ChangeAcademicSessionStatusInterface {
//   id: number;
// }

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicSessionInterface[];
// }
export default apiRoute("/examination/exams");
