import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getProfileByEmail, getProfileById } from '../handlers/profileHandler';

const router = Router();

router.get('/', asyncHandler(getProfileByEmail));
router.get('/:id', asyncHandler(getProfileById));

export { router as profilesRouter };
