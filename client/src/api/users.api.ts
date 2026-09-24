import { API_BASE_URL } from "../config/env";
import { FilterState, UsersResponse } from "../types";

const PAGE_SIZE = 25;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Query builder
// ---------------------------------------------------------------------------

function buildUsersParams(filters: FilterState, page: number): URLSearchParams {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.nationalities.length > 0) {
    params.set("nationalities", filters.nationalities.join(","));
  }
  if (filters.hobbies.length > 0) {
    params.set("hobbies", filters.hobbies.join(","));
  }
  if (filters.sortField) {
    params.set("sortField", filters.sortField);
  }
  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }

  return params;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchUsers(filters: FilterState, page: number, signal?: AbortSignal): Promise<UsersResponse> {
  const params = buildUsersParams(filters, page);
  const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`, { signal });

  if (!res.ok) {
    throw new ApiError(`Failed to fetch users (HTTP ${res.status})`, res.status);
  }

  return res.json() as Promise<UsersResponse>;
}
