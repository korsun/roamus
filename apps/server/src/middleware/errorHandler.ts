import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const isHttpError = (e: unknown): e is HttpError =>
  e instanceof HttpError ||
  (typeof e === 'object' && e !== null && 'status' in e);

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (!(error instanceof Error)) {
    return res.status(500).json({
      message: 'Internal Server Error',
      stack: undefined,
      requestId: req.id,
    });
  }

  const status = isHttpError(error)
    ? error.status
    : res.statusCode >= 400
      ? res.statusCode
      : 500;

  res.status(status).json({
    message: error.message || 'Internal Server Error',
    stack: error.stack,
    requestId: req.id,
  });
};
