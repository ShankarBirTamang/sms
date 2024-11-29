// export interface AcademicLevelInterface {
//   id: number;
//   name: string;
//   description: string | null;
// }

export interface PaginationAndSearch {
  search?: string | "";
  currentPage?: number;
  itemsPerPage?: number | null;
}

// export interface AcademicSessionInterface {
//   id: number;
//   name: string;
//   start_date: string;
//   start_date_np: string;
//   end_date: string;
//   end_date_np: string;
//   academic_level_id: number;
//   academic_level: string;
// }

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
