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
  exam_grades: ExamGradeInterface[];
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

export interface ExamSubjectMarksSchemeInterface {
  id: number;
  exam_grade_subject_id: number;
  exam_marks_scheme_id: number;
  exam_marks_scheme_name: string;
  exam_marks_scheme_group: string;
  full_marks: string;
  pass_marks: string;
}

export interface ExamGradeSubjectInterface {
  id: number;
  subject_id: number;
  name: string;
  rank: number;
  status: boolean;
  exam_subject_marks_schemes: ExamSubjectMarksSchemeInterface[];
}

export interface ExamGradeInterface {
  exam_grade_id: number;
  grade_id: number;
  grade_name: string;
  grade_short_name: string;
  exam_grade_subjects: ExamGradeSubjectInterface[];
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

interface Marks {
  fm: number;
  pm: number;
}

export interface CreateExamGradeSubject {
  subjectId: number;
  selected: boolean;
  isMarks: boolean;
  rank: number;
  marks: Record<string, Marks>; // Record<string, Marks> represents an object with string keys and Marks values
}
export interface CreateExamGradeSubject {
  examGradeId: number;
  subjects: CreateExamGradeSubject[];
}

export default apiRoute("/examination/exams");
