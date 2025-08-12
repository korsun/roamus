import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.get('x-request-id') || randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};
