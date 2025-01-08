import apiRoute from "../../../services/httpService";
export interface TaxCategory {
  id?: number;
  name: string;
  type: "Goods" | "Service";
  zero_tax_type: "Exempt" | "Zero Rated" | "Tax Paid";
  rate_local: number;
  rate_imp_exp: number;
  tax_on_mrp: boolean;
  calculated_tax_on?: number;
  tax_on_mrp_mode?: "Inclusive";
  created_at: string;
  updated_at: string;
}

export default apiRoute("/accounts/masters/fiscal-years");
