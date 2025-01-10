import apiRoute from "../../../services/httpService";
import { AccountGroupInterface } from "./accountGroupService";
import { ItemGroupInterface } from "./itemGroupService";
export interface ItemInterface {
  id?: number;
  name: string;
  description?: string;
  billing_cycle: "Monthly" | "Quarterly" | "Yearly" | "One-time";
  is_mandatory: boolean;
  item_group?: ItemGroupInterface;
  account_group?: AccountGroupInterface;
}

export interface CreateItemInterface {
  id?: number;
  name: string;
  description?: string;
  billing_cycle: "Monthly" | "Quarterly" | "Yearly" | "One-time";
  is_mandatory: boolean;
  item_group_id?: number;
  account_group_id?: number;
}

export interface UpdateItemInterface extends CreateItemInterface {
  id: number;
}

export interface ChangeItemStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/items");
