import apiRoute from "../../../services/httpService";
export interface TaxCategoryInterface {
  id: number;
  name: string;
  type: "Goods" | "Service";
  zero_tax_type?: "Exempt" | "Zero Rated" | "Tax Paid";
  rate_local: number;
  rate_imp_exp?: number;
  tax_on_mrp?: boolean;
  calculated_tax_on?: number | null;
  tax_on_mrp_mode?: "Inclusive" | null;
}

export interface CreateTaxCategoryInterface {
  name: string;
  type: "Goods" | "Service";
  zero_tax_type: "Exempt" | "Zero Rated" | "Tax Paid";
  rate_local: number;
  rate_imp_exp?: number;
  tax_on_mrp?: boolean;
  calculated_tax_on?: number | null;
  tax_on_mrp_mode?: "Inclusive" | null;
}

export interface UpdateTaxCategoryInterface {
  id: number;
  name: string;
  type: "Goods" | "Service";
  zero_tax_type?: "Exempt" | "Zero Rated" | "Tax Paid";
  rate_local: number;
  rate_imp_exp?: number;
  tax_on_mrp?: boolean;
  calculated_tax_on?: number | null;
  tax_on_mrp_mode?: "Inclusive" | null;
}

export default apiRoute("/accounts/masters/tax-categories");
