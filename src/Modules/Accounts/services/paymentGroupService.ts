import apiRoute from "../../../services/httpService";
export interface PaymentGroupInterface {
  id?: number;
  name: string;
}

export interface UpdatePaymentGroupInterface extends PaymentGroupInterface {
  id: number;
}

export interface ChangePaymentGroupStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/payment-groups");
