import {
  GradeInterface,
  SectionInterface,
} from "../../../Academics/services/gradeService";
import apiRoute from "../../../services/httpService";
import { StudentGuardianInterface } from "../../Student/services/studentService";
import { AccountGroupInterface } from "./accountGroupService";
import { DiscountGroupInterface } from "./discountGroupService";
import { ItemInterface } from "./itemService";
import { PaymentGroupInterface } from "./paymentGroupService";

export interface AccountInterface {
  id: number;
  name: string;
  alias?: string | null;
  account_group?: AccountGroupInterface | null;
  opening_balance: number;
  opening_balance_type?: "D" | "C" | null;
  previous_year_balance: number;
  previous_year_balance_type?: "D" | "C" | null;
  address?: string | null;
  country?: string | null;
  pan?: string | null;
  email?: string | null;
  phone?: string | null;
  fax?: string | null;
  transport?: string | null;
  tin?: string | null;
  contact_person?: string | null;
  station?: string | null;
  bank_account_no?: string | null;
  accountable?: {
    id: number;
    type: string;
  } | null;
}

export interface StudentAccountInterface {
  id: number;
  roll_no?: string | number;
  iemis: string | null;
  full_name?: string;
  first_name: string;
  photo: string;
  thumbnail: string;
  contact?: string | null;
  address?: string | null;
  email?: string | null;
  gender?: string | null;
  is_active: boolean;
  guardians?: StudentGuardianInterface[];
  grade?: GradeInterface;
  section?: SectionInterface;
  account?: AccountInterface;
  payment_groups?: PaymentGroupInterface[];
  discount_groups?: DiscountGroupInterface[];
  nonMandatoryFees?: ItemInterface[];
}

export interface CreateStudentAccountInterface {
  id: number;
  opening_balance: number;
  payment_group_id: number;
  discount_group_id: number;
  opening_balance_type?: "D" | "C" | null;
  previous_year_balance: number;
  previous_year_balance_type?: "D" | "C" | null;
  non_mandatory_fee_ids: number[];
}

export default apiRoute("/accounts/masters/accounts");
