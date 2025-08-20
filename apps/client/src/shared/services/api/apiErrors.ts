export type ErrorDetails = {
  engine: string;
  type: string;
};

export type ErrorResponse = {
  message: string;
  details?: ErrorDetails;
};

export const isErrorResponse = (res: unknown): res is ErrorResponse =>
  typeof res === 'object' && res !== null && 'message' in res;

export class ApiError extends Error {
  status: number;
  details?: ErrorDetails;

  constructor(status: number, message: string, details?: ErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const isGraphHopperLimitError = (error: unknown): error is ApiError => {
  return (
    error instanceof ApiError &&
    'details' in error &&
    error.details !== null &&
    typeof error.details === 'object' &&
    'engine' in error.details &&
    error.details.engine === 'graphhopper' &&
    'type' in error.details &&
    error.details.type === 'limit'
  );
};
