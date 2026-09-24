import { Request } from 'express';
import { UserQueryParams } from '../types/user.types';

const ALLOWED_SORT_FIELDS = ['first_name', 'last_name', 'age', 'nationality'] as const;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses a query param value into a clean string array.
 * Handles: undefined, single string, comma-separated string, or array of strings.
 */
export function parseArrayParam(param: unknown): string[] {
  if (!param) return [];

  if (Array.isArray(param)) {
    return param
      .flatMap((p) => (typeof p === 'string' ? p.split(',') : []))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (typeof param === 'string') {
    return param.split(',').map((s) => s.trim()).filter(Boolean);
  }

  return [];
}

/**
 * Safely parses a query param as a positive integer.
 * Returns the fallback value if the param is missing or not a valid positive integer.
 */
function parsePositiveInt(param: unknown, fallback: number): number {
  if (typeof param !== 'string') return fallback;
  const parsed = parseInt(param, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Parses, validates, and sanitises all user-related query parameters from the request.
 * Guaranteed to return a fully typed, safe UserQueryParams object.
 */
export function parseUserQueryParams(req: Request): UserQueryParams {
  const { query } = req;

  const search =
    typeof query.search === 'string' && query.search.trim()
      ? query.search.trim()
      : undefined;

  // Accept 'nationalities' or shorthand 'nat'
  const nationalities = parseArrayParam(query.nationalities ?? query.nat);

  // Accept 'hobbies' or shorthand 'hob'
  const hobbies = parseArrayParam(query.hobbies ?? query.hob);

  const rawSortField = typeof query.sortField === 'string' ? query.sortField : '';
  const sortField = ALLOWED_SORT_FIELDS.includes(rawSortField as (typeof ALLOWED_SORT_FIELDS)[number])
    ? (rawSortField as UserQueryParams['sortField'])
    : undefined;

  const sortOrder =
    typeof query.sortOrder === 'string' && query.sortOrder.toLowerCase() === 'desc'
      ? 'desc'
      : 'asc';

  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, parsePositiveInt(query.limit, DEFAULT_LIMIT));

  return {
    search,
    nationalities,
    hobbies,
    sortField,
    sortOrder,
    page,
    limit,
  };
}
