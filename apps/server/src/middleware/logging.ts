import { IncomingMessage } from 'http';

import { type Request } from 'express';
import morgan from 'morgan';

interface MorganRequest extends IncomingMessage {
  path?: string;
  originalUrl?: string;
  url?: string;
}

morgan.token('id', (req: Request) => req.id || '-');

const format =
  process.env.NODE_ENV === 'production'
    ? ':id :method :url :status :response-time ms - :res[content-length]'
    : 'dev';

export const logging = morgan(format, {
  skip: (req: MorganRequest) => {
    const path = req.path || req.originalUrl || req.url || '/';
    return path === '/api/health';
  },
});
