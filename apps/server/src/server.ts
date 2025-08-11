import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { routing } from '@/routes/routing';
import { errorHandler } from '@/middleware/errorMiddleware';

dotenv.config();

const app = express();

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
      /\.vercel\.app$/i.test(origin) ||
      /localhost:3000$/i.test(origin);
    cb?.(ok ? null : new Error('CORS blocked'), ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api', routing);

app.get('/', (_, res) => {
  res.send('API is running....');
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`${'\u001b[1;34m'}Server listening on port ${PORT} 🚀🚀🚀`),
);
