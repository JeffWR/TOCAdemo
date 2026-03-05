import express from 'express';
import cors from 'cors';
import { profilesRouter } from './routes/profiles';
import { sessionsRouter } from './routes/sessions';
import { appointmentsRouter } from './routes/appointments';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/profiles', profilesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/appointments', appointmentsRouter);

// Error middleware must be registered last — Express routes errors to it via next(err)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Backend running on http://localhost:${PORT}`);
});

export { app };
