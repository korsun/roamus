// biome-ignore-all lint/suspicious/noExplicitAny: test mocks
import http from 'node:http';
import type { AddressInfo } from 'node:net';

import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { app } from '../app';
import { errorHandler, HttpError } from '../middleware/errorHandler';

describe('Express Server', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(() => {
    app.get('/__big', (_req, res) => {
      const big = 'x'.repeat(50_000);
      res.type('text/plain').send(big);
    });

    app.get('/__error', () => {
      throw new Error();
    });

    app.get('/__error-502', () => {
      throw new HttpError(502, 'bad 502');
    });
    app.use(errorHandler);

    return new Promise<void>((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('General Check', () => {
    it('should return 200 and a welcome message', async () => {
      const response = await request(baseUrl).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('API is running');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from allowed origins', async () => {
      const response = await request(baseUrl)
        .get('/')
        .set('Origin', 'https://roamus-client.vercel.app');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe(
        'https://roamus-client.vercel.app',
      );
    });

    it('should block requests from disallowed origins', async () => {
      const response = await request(baseUrl)
        .get('/')
        .set('Origin', 'http://unauthorized-origin.com');

      expect(response.status).toBe(500); // CORS error will be caught by error handler
    });

    it('No Origin behaves like non-browser request (no ACAO header)', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('API Routes', () => {
    describe('GET /api/health', () => {
      it('should return 200 status', async () => {
        const response = await request(baseUrl).get('/api/health');
        expect(response.status).toBe(200);
      });
    });

    describe('POST /api/routing', () => {
      const setViteEnv = (key: string, value: string) => {
        (import.meta as any).env = {
          ...import.meta.env,
          [key]: value,
        };
      };

      const orsOk = {
        bbox: [0, 0, 1, 1],
        features: [
          {
            type: 'Feature',
            bbox: [0, 0, 1, 1],
            geometry: {
              type: 'LineString',
              coordinates: [
                [0, 0],
                [1, 1],
              ],
            },
            properties: {
              summary: { distance: 1234, duration: 567 },
              way_points: [0, 1],
              ascent: 10,
              descent: 12,
              segments: [{ distance: 1234, duration: 567 }],
            },
          },
        ],
        metadata: {},
      };

      const makeAbortError = () => {
        const e = new Error('Aborted');
        e.name = 'AbortError';
        return e;
      };

      it('400 — invalid payload', async () => {
        const res = await request(app).post('/api/routing').send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Invalid payload/i);
      });

      it('504 — ORS timeout (AbortError)', async () => {
        setViteEnv('VITE_OPENROUTESERVICE_API_KEY', 'test-key');

        vi.spyOn(globalThis, 'fetch').mockRejectedValue(makeAbortError());

        const res = await request(app)
          .post('/api/routing')
          .send({
            engine: 'openrouteservice',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          });

        expect(res.status).toBe(504);
        expect(res.body.message).toMatch(/Upstream timeout/i);
      });

      it('502 — ORS returns non-conforming schema', async () => {
        setViteEnv('VITE_OPENROUTESERVICE_API_KEY', 'test-key');

        vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        const res = await request(app)
          .post('/api/routing')
          .send({
            engine: 'openrouteservice',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          });

        expect(res.status).toBe(502);
        expect(res.body.message).toMatch(
          /OpenRouteService: unexpected response/i,
        );
      });

      it('502 — ORS returns no features', async () => {
        setViteEnv('VITE_OPENROUTESERVICE_API_KEY', 'test-key');

        vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            bbox: [0, 0, 1, 1],
            features: [],
            metadata: {},
          }),
        });

        const res = await request(app)
          .post('/api/routing')
          .send({
            engine: 'openrouteservice',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          });

        expect(res.status).toBe(502);
        expect(res.body.message).toMatch(/no features found/i);
      });

      it('200 — ORS success maps upstream to response shape', async () => {
        setViteEnv('VITE_OPENROUTESERVICE_API_KEY', 'test-key');

        vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => orsOk,
        });

        const res = await request(app)
          .post('/api/routing')
          .send({
            engine: 'openrouteservice',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          bbox: [0, 0, 1, 1],
          points: expect.objectContaining({
            geometry: expect.any(Object),
            properties: expect.any(Object),
          }),
          distance: 1234,
          time: 567 * 1000,
          ascend: 10,
          descend: 12,
        });
      });

      it('502 — GraphHopper returns non-conforming schema', async () => {
        setViteEnv('VITE_GRAPHHOPER_API_KEY', 'test-gh');

        vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        const res = await request(app)
          .post('/api/routing')
          .send({
            engine: 'graphhopper',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          });

        expect(res.status).toBe(502);
        expect(res.body.message).toMatch(/GraphHopper: unexpected response/i);
      });

      it('504 — GraphHopper limit', async () => {
        setViteEnv('VITE_GRAPHHOPER_API_KEY', 'test-gh');

        vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            message: 'Minutely API limit heavily violated.',
          }),
        });

        const res = await request(app)
          .post('/api/routing')
          .send({
            engine: 'graphhopper',
            coordinates: [
              [0, 0],
              [1, 1],
              [2, 2],
            ],
          });

        expect(res.status).toBe(504);
        expect(res.body.message).toMatch(
          /Minutely API limit heavily violated/i,
        );
        expect(res.body.details.type).toBe('limit');
        expect(res.body.details.engine).toBe('graphhopper');
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(baseUrl).get('/non-existent-route');
      expect(response.status).toBe(404);
    });

    it('returns 500 on thrown nameless error', async () => {
      const res = await request(app).get('/__error');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'Internal Server Error',
        stack: expect.any(String),
        requestId: expect.any(String),
      });
    });

    it('returns 502 on thrown HttpError', async () => {
      const res = await request(app).get('/__error-502');
      expect(res.status).toBe(502);
      expect(res.body).toEqual({
        message: 'bad 502',
        stack: expect.any(String),
        requestId: expect.any(String),
      });
    });
  });

  describe('Middleware', () => {
    it('should include request ID in response headers', async () => {
      const response = await request(baseUrl).get('/');
      expect(response.headers['x-request-id']).toBeDefined();
    });

    it('should parse JSON body with size limit', async () => {
      const largePayload = { data: 'a'.repeat(300 * 1024) }; // 300KB
      const response = await request(baseUrl)
        .post('/api/routing')
        .send(largePayload);

      expect(response.status).toBe(413);
    });

    it('responds gzipped for large payloads', async () => {
      const res = await request(app)
        .get('/__big')
        .set('Accept-Encoding', 'gzip');

      expect(res.status).toBe(200);
      expect(res.headers['content-encoding']).toMatch(/gzip/i);
      expect(res.text.length).toBeGreaterThan(0);
    });
  });
});
