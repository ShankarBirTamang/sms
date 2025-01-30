import apiRoute from "../../../services/httpService";
export interface ItemGroupInterface {
  id?: number;
  name: string;
  alias?: string;
  is_default: boolean;
  parent?: ItemGroupInterface;
  children?: ItemGroupInterface[];
}

export interface CreateItemGroupInterface {
  id?: number;
  name: string;
  alias?: string;
  parent_id?: number;
}

export interface UpdateItemGroupInterface extends CreateItemGroupInterface {
  id: number;
}

export interface ChangeItemGroupStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/item-groups");
