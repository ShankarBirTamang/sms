import apiRoute from "../../../services/httpService";
export interface PaymentTypeInterface {
  id?: number;
  name: string;
}

export interface UpdatePaymentTypeInterface extends PaymentTypeInterface {
  id: number;
}

export interface ChangePaymentTypeStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/payment-types");
