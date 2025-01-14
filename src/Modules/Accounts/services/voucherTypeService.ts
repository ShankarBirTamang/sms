import apiRoute from "../../../services/httpService";
export interface VoucherTypeInterface {
  id?: number;
  name: string;
  description: string;
}

export interface UpdateVoucherTypeInterface extends VoucherTypeInterface {
  id: number;
}

export interface ChangeVoucherTypeStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/voucher-types");
