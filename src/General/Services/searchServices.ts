import { StudentGuardianInterface } from "../../Modules/Student/services/studentService";

interface Student {
  id: number;
  photo: string;
  full_name: string;
  first_name: string;
  grade: string;
  faculty: string;
  section: string;
  guardians: StudentGuardianInterface[];
}

interface ClassDetails {
  grade: string | null;
  section: string | null;
  faculty: string | null;
  full_grade: string;
}

interface Employee {
  id: number;
  photo: string;
  full_name: string;
  first_name: string;
  class: ClassDetails;
  type: string; // e.g., 'Teacher', 'Principal', 'Staff'
  contact: string;
  section: string;
}

export interface SearchData {
  Student: Student[];
  Employee: Employee[];
}
