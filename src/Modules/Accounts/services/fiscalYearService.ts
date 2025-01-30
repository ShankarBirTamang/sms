import apiRoute from "../../../services/httpService";
export interface FiscalYearInterface {
  id?: number;
  rank?: number;
  name: string;
  start_date_en: string;
  start_date_np: string;
  end_date_en: string;
  end_date_np: string;
  is_active: boolean;
  allow_entry: boolean;
}

export interface UpdateFiscalYearInterface extends FiscalYearInterface {
  id: number;
}

export interface ChangeFiscalYearStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/fiscal-years");
