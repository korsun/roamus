import crypto from 'crypto';

import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { requestId } from '@/middleware/requestId';

// Mock the crypto module
vi.mock('crypto', () => ({
  default: {
    randomUUID: vi.fn(),
  },
}));

const mk = () => {
  const req = {
    get: vi.fn().mockReturnValue(undefined),
    id: undefined,
  } as unknown as Request;

  const res = {
    setHeader: vi.fn(),
  } as unknown as Response;

  const next = vi.fn() as unknown as NextFunction;

  return { req, res, next };
};

describe('requestId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('takes id from header', () => {
    const { req, res, next } = mk();
    // Using type assertion for testing purposes
    const mockGet = vi.fn().mockReturnValue('abc-123');
    req.get = mockGet as any;

    requestId(req, res, next);

    expect(req.id).toBe('abc-123');
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'abc-123');
    expect(next).toHaveBeenCalled();
  });

  it('generates id when header is missing', () => {
    const { req, res, next } = mk();
    const mockUuid = '123e4567-e89b-12d3-a456-426614174000';

    (crypto.randomUUID as any).mockReturnValue(mockUuid);

    requestId(req, res, next);

    expect(crypto.randomUUID).toHaveBeenCalled();
    expect(req.id).toBe(mockUuid);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', mockUuid);
    expect(next).toHaveBeenCalled();
  });
});
