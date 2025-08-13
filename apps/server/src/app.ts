import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { routes } from '@/routes';
import { errorHandler } from '@/middleware/errorHandler';
import { requestId } from '@/middleware/requestId';
import { logging } from '@/middleware/logging';

dotenv.config();

export const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

const corsOptions = {
  origin: (
    origin?: string,
    cb?: (err: Error | null, result: boolean) => void,
  ) => {
    if (!origin) {
      return cb?.(null, true); // for non-browser requests
    }

    const ok =
      origin === 'https://roamus-client.vercel.app' ||
      /localhost:3000$/i.test(origin);
    cb?.(ok ? null : new Error('CORS blocked'), ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '200kb' }));
app.use(requestId);
app.use(logging);

app.use('/api', routes);

app.get('/', (_, res) => {
  res.send('API is running....');
});

app.use(errorHandler);
