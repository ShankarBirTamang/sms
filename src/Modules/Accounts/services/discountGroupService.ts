import apiRoute from "../../../services/httpService";
import { PaymentGroupInterface } from "./paymentGroupService";
export interface DiscountGroupInterface {
  id?: number;
  name: string;
  percentage: number;
  amount: number;
  payment_group?: PaymentGroupInterface;
}

export interface UpdateDiscountGroupInterface extends DiscountGroupInterface {
  id: number;
}

export interface ChangeDiscountGroupStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/discount-groups");
