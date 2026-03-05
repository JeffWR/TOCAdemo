import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getAppointmentsByPlayer } from '../handlers/appointmentHandler';

const router = Router();

router.get('/', asyncHandler(getAppointmentsByPlayer));

export { router as appointmentsRouter };
