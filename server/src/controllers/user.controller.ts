import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { parseUserQueryParams } from '../validations/userQuery.validation';

/**
 * GET /api/users
 * Returns paginated users + dynamic facets for the active filter set.
 */
export function getUsers(req: Request, res: Response, next: NextFunction): void {
  try {
    const params = parseUserQueryParams(req);
    const result = UserService.getUsers(params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/facets
 * Returns only top-20 facets for the active filter set (no user data).
 */
export function getFacets(req: Request, res: Response, next: NextFunction): void {
  try {
    const params = parseUserQueryParams(req);
    const facets = UserService.getFacets(params);
    res.json(facets);
  } catch (err) {
    next(err);
  }
}
