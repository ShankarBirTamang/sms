import apiRoute from "../../../services/httpService";
export interface AccountGroupInterface {
  id?: number;
  name: string;
  alias?: string;
  is_default: boolean;
  parent?: AccountGroupInterface;
  children?: AccountGroupInterface[];
}

export interface CreateAccountGroupInterface {
  id?: number;
  name: string;
  alias?: string;
  parent_id?: number;
}

export interface UpdateAccountGroupInterface
  extends CreateAccountGroupInterface {
  id: number;
}

export interface ChangeAccountGroupStatusInteface {
  id: number;
}

export default apiRoute("/accounts/masters/account-groups");
