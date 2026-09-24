export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FacetCount {
  value: string;
  count: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UsersResponse {
  data: User[];
  pagination: PaginationMeta;
  facets: {
    topHobbies: FacetCount[];
    topNationalities: FacetCount[];
  };
}

export type SortField = 'first_name' | 'last_name' | 'age' | 'nationality';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  nationalities: string[];
  hobbies: string[];
  sortField: SortField;
  sortOrder: SortOrder;
}
