import apiRoute from "../../../services/httpService";

export interface MarksSchemeInterface {
  id: number;
  name: string;
  short_name: string;
  group: "Theory" | "Practical";
}

export interface CreateMarksSchemeInterface {
  name: string;
  short_name: string;
  group: "Theory" | "Practical";
}

export interface UpdateMarksSchemeInterface {
  id: number;
  name: string;
  short_name: string;
  group: "Theory" | "Practical";
}

export interface ChangeMarksSchemeStatusInterface {
  id: number;
}
export default apiRoute("/examination/marks-schemes");
