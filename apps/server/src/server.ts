import http from 'http';

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

const app = express();
app.disable('x-powered-by');
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

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
server.setTimeout(30_000);
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;

const shutdown = () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`${'\u001b[1;34m'}Server listening on port ${PORT} 🚀🚀🚀`),
);
