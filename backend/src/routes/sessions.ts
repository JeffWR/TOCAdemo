import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getSessionsByPlayer, getSessionById } from '../handlers/sessionHandler';

const router = Router();

router.get('/', asyncHandler(getSessionsByPlayer));
router.get('/:id', asyncHandler(getSessionById));

export { router as sessionsRouter };
