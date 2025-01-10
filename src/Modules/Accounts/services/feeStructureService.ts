import {
  GradeInterface,
  UpdateGradeInterface,
} from "../../../Academics/services/gradeService";
import apiRoute from "../../../services/httpService";
import { ItemInterface } from "./itemService";
export interface FeeStructureInterface {
  id?: number;
  grade?: GradeInterface;
  fee_structure_details: FeeStructureDetailsInterface[];
}

export interface FeeStructureDetailsInterface {
  id?: number;
  fee_structure?: FeeStructureInterface;
  item: ItemInterface;
  amount: number;
}

export interface CreateFeeStructureInterface {
  grade_id: number;
  fee_structure_details: {
    item_id: number;
    amount: string;
  }[];
}

export interface UpdateFeeStructureInterface {
  id: number;
  fee_structure_details: {
    id: number;
    item_id: number;
    amount: number;
  }[];
}

export interface StructureInterface {
  grade: UpdateGradeInterface;
  structureDetails: {
    item: ItemInterface;
    amount: number;
  }[];
}

export default apiRoute("/accounts/masters/fee-structures");
