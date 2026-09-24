import { Router } from 'express';
import { getUsers, getFacets } from '../controllers/user.controller';

const router = Router();

/**
 * Routes for /api/users.
 * No logic here — wiring only.
 */
router.get('/facets', getFacets);
router.get('/', getUsers);

export default router;
