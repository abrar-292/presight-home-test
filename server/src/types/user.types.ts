/**
 * Shared TypeScript interfaces for the user domain.
 * Every layer (repository, service, controller) imports types from here.
 */

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

export interface UserQueryParams {
  search?: string;
  nationalities?: string[];
  hobbies?: string[];
  sortField?: 'first_name' | 'last_name' | 'age' | 'nationality';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  facets: {
    topHobbies: FacetCount[];
    topNationalities: FacetCount[];
  };
}

export interface FilterConditions {
  whereClause: string;
  params: (string | number)[];
}
