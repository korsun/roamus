// biome-ignore lint/correctness/noUnusedImports: overwriting Request
import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
  type Dictionary<T> = Record<string, T>;
  // biome-ignore lint/suspicious/noExplicitAny: we need it
  type AnyFunction = (...args: any[]) => any;
}
