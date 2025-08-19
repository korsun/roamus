// biome-ignore lint/correctness/noUnusedImports: overwriting Request
import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
