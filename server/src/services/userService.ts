import {
  UserQueryParams,
  UsersResponse,
} from '../types/user.types';
import {
  buildFilterConditions,
  countUsers,
  fetchFacets,
  fetchUsers,
  mapRowToUser,
} from '../repositories/user.repository';

const ALLOWED_SORT_FIELDS = ['first_name', 'last_name', 'age', 'nationality'] as const;

export class UserService {
  /**
   * Returns a paginated user list with dynamic facets for the active filter set.
   */
  static getUsers(params: UserQueryParams): UsersResponse {
    const sortField = ALLOWED_SORT_FIELDS.includes(params.sortField as (typeof ALLOWED_SORT_FIELDS)[number])
      ? params.sortField!
      : 'first_name';
    const sortOrder = params.sortOrder === 'desc' ? 'DESC' : 'ASC';

    const conditions = buildFilterConditions(params);

    const total = countUsers(conditions);
    const totalPages = Math.ceil(total / params.limit);
    const offset = (params.page - 1) * params.limit;

    const rows = fetchUsers(conditions, sortField, sortOrder, params.limit, offset);
    const data = rows.map(mapRowToUser);

    const facets = fetchFacets(params);

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasMore: params.page < totalPages,
      },
      facets,
    };
  }

  /**
   * Returns only the dynamic facets for the active filter set (no user data).
   */
  static getFacets(params: UserQueryParams): UsersResponse['facets'] {
    return fetchFacets(params);
  }
}
