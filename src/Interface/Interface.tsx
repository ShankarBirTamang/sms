export interface MenuItem {
  title: string;
  icon: string;
  route: string;
}
export interface PaginationAndSearch {
  search?: string | "";
  currentPage?: number;
  itemsPerPage?: number | null;
}

export interface ApiResponseInterface<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface ValidationErrors {
  [key: string]: string[];
}

export interface ApiCreateUpdateResponse {
  message: string;
  errors?: ValidationErrors;
}

export interface ApiResponse<T> {
  data: T;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
