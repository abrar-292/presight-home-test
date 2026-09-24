import db from '../db/database';
import { FacetCount, FilterConditions, User, UserQueryParams } from '../types/user.types';

// ---------------------------------------------------------------------------
// Internal raw DB row types
// ---------------------------------------------------------------------------

interface UserRow {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies_csv: string | null;
}

// ---------------------------------------------------------------------------
// Filter builder
// ---------------------------------------------------------------------------

/**
 * Builds a reusable WHERE clause and its bound parameters from query params.
 * This is the single place where filtering SQL lives.
 */
export function buildFilterConditions(params: Pick<UserQueryParams, 'search' | 'nationalities' | 'hobbies'>): FilterConditions {
  const whereClauses: string[] = ['1=1'];
  const sqlParams: (string | number)[] = [];

  // 1. Full-name text search (first_name, last_name, or combined)
  if (params.search) {
    const term = `%${params.search}%`;
    whereClauses.push(`(
      u.first_name LIKE ? OR
      u.last_name  LIKE ? OR
      (u.first_name || ' ' || u.last_name) LIKE ?
    )`);
    sqlParams.push(term, term, term);
  }

  // 2. Nationality filter — OR logic (user matches any selected nationality)
  if (params.nationalities && params.nationalities.length > 0) {
    const validNats = params.nationalities.filter((n) => n.trim());
    if (validNats.length > 0) {
      const placeholders = validNats.map(() => '?').join(', ');
      whereClauses.push(`u.nationality IN (${placeholders})`);
      sqlParams.push(...validNats);
    }
  }

  // 3. Hobbies filter — AND logic (user must have ALL selected hobbies)
  if (params.hobbies && params.hobbies.length > 0) {
    const validHobbies = params.hobbies.filter((h) => h.trim());
    if (validHobbies.length > 0) {
      const placeholders = validHobbies.map(() => 'LOWER(?)').join(', ');
      whereClauses.push(`u.id IN (
        SELECT uh.user_id
        FROM user_hobbies uh
        JOIN hobbies h ON uh.hobby_id = h.id
        WHERE LOWER(h.name) IN (${placeholders})
        GROUP BY uh.user_id
        HAVING COUNT(DISTINCT uh.hobby_id) = ?
      )`);
      sqlParams.push(...validHobbies, validHobbies.length);
    }
  }

  return {
    whereClause: whereClauses.join(' AND '),
    params: sqlParams,
  };
}

// ---------------------------------------------------------------------------
// Query functions
// ---------------------------------------------------------------------------

/**
 * Returns the total count of users matching the given filter conditions.
 */
export function countUsers(conditions: FilterConditions): number {
  const sql = `SELECT COUNT(*) AS total FROM users u WHERE ${conditions.whereClause}`;
  const row = db.prepare(sql).get(...conditions.params) as { total: number };
  return row?.total ?? 0;
}

/**
 * Fetches a page of raw user rows matching the given filter conditions.
 */
export function fetchUsers(
  conditions: FilterConditions,
  sortField: string,
  sortOrder: 'ASC' | 'DESC',
  limit: number,
  offset: number,
): UserRow[] {
  const sql = `
    SELECT
      u.id,
      u.avatar,
      u.first_name,
      u.last_name,
      u.age,
      u.nationality,
      (
        SELECT GROUP_CONCAT(h.name, '|||')
        FROM user_hobbies uh
        JOIN hobbies h ON uh.hobby_id = h.id
        WHERE uh.user_id = u.id
      ) AS hobbies_csv
    FROM users u
    WHERE ${conditions.whereClause}
    ORDER BY u.${sortField} ${sortOrder}, u.id ASC
    LIMIT ? OFFSET ?
  `;

  return db.prepare(sql).all(...conditions.params, limit, offset) as UserRow[];
}

/**
 * Maps a raw DB row to a typed User domain object.
 */
export function mapRowToUser(row: UserRow): User {
  return {
    id: row.id,
    avatar: row.avatar,
    first_name: row.first_name,
    last_name: row.last_name,
    age: row.age,
    nationality: row.nationality,
    hobbies: row.hobbies_csv ? row.hobbies_csv.split('|||') : [],
  };
}

/**
 * Computes top-20 nationality and hobby facets scoped to the active filters.
 *
 * Nationality facets exclude the nationality filter itself (so users can keep
 * adding nationalities via OR selection). Hobby facets respect all filters.
 */
export function fetchFacets(params: UserQueryParams): {
  topHobbies: FacetCount[];
  topNationalities: FacetCount[];
} {
  // Nationality facet: scoped to search + hobbies only (excludes nationality filter)
  const natConditions = buildFilterConditions({
    search: params.search,
    hobbies: params.hobbies,
  });

  const nationalitiesSql = `
    SELECT u.nationality AS value, COUNT(*) AS count
    FROM users u
    WHERE ${natConditions.whereClause}
    GROUP BY u.nationality
    ORDER BY count DESC, u.nationality ASC
    LIMIT 20
  `;
  const topNationalities = db
    .prepare(nationalitiesSql)
    .all(...natConditions.params) as FacetCount[];

  // Hobby facet: scoped to all active filters
  const allConditions = buildFilterConditions(params);
  const hobbiesSql = `
    SELECT h.name AS value, COUNT(DISTINCT uh.user_id) AS count
    FROM user_hobbies uh
    JOIN hobbies h ON uh.hobby_id = h.id
    JOIN users u ON uh.user_id = u.id
    WHERE ${allConditions.whereClause}
    GROUP BY h.id, h.name
    ORDER BY count DESC, h.name ASC
    LIMIT 20
  `;
  const topHobbies = db
    .prepare(hobbiesSql)
    .all(...allConditions.params) as FacetCount[];

  return { topHobbies, topNationalities };
}
