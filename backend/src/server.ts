import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { profilesRouter } from './routes/profiles';
import { sessionsRouter } from './routes/sessions';
import { appointmentsRouter } from './routes/appointments';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

const corsOrigin = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';
if (corsOrigin === '*') {
  throw new Error('CORS_ORIGIN must not be a wildcard — set it to the frontend origin');
}

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use('/api/profiles', profilesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/appointments', appointmentsRouter);

// Error middleware must be registered last — Express routes errors to it via next(err)
app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console -- startup message is intentional server logging
  console.info(`Backend running on http://localhost:${PORT}`);
});

export { app };
