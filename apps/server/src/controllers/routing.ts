import {
  GraphHopperErrorResponseSchema,
  type GraphHopperPayload,
  GraphHopperResponseSchema,
  GraphHopperSuccessResponseSchema,
  type ORSPayload,
  ORSResponseSchema,
  ProxyServerPayloadSchema,
} from '@common/schemas';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as v from 'valibot';

import { HttpError } from '../middleware/errorHandler';

const ABORT_TIMEOUT = 15_000;

/**
 * @desc Map routing between given points
 * @route POST /api/routing/
 */
export const buildRoute = asyncHandler((req: Request, res: Response) => {
  const parsed = v.safeParse(ProxyServerPayloadSchema, req.body);

  if (!parsed.success) {
    throw new HttpError(
      400,
      `Invalid payload: expected ${JSON.stringify(ProxyServerPayloadSchema, null, 2)}`,
    );
  }

  let payload: GraphHopperPayload | ORSPayload;
  const { engine, coordinates } = parsed.output;

  let result: Promise<unknown>;

  switch (engine) {
    case 'graphhopper':
      payload = {
        points: coordinates,
        // details: ['road_class', 'surface'],
        profile: 'bike',
        points_encoded: false,
        instructions: false,
        optimize: 'false',
      };

      if (!import.meta.env.VITE_GRAPHHOPER_API_KEY?.trim()) {
        throw new HttpError(400, 'Missing GraphHopper API key');
      }

      result = fetch(
        `https://graphhopper.com/api/1/route/?key=${import.meta.env.VITE_GRAPHHOPER_API_KEY}`,
        {
          method: 'post',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(ABORT_TIMEOUT),
        },
      )
        .then((raw) => raw.json())
        .then((json: unknown) => {
          const gh = v.safeParse(GraphHopperResponseSchema, json);

          if (!gh.success) {
            const formatted = gh.issues
              .map(
                (i) =>
                  `Expected ${JSON.stringify(i.expected)}, received ${i.received}`,
              )
              .join('\n');
            throw new Error(`GraphHopper: unexpected response.\n${formatted}`);
          }

          if (v.is(GraphHopperSuccessResponseSchema, gh.output)) {
            return gh.output.paths[0];
          }

          if (v.is(GraphHopperErrorResponseSchema, gh.output)) {
            // API warning from GH (e.g., rate limit)
            throw new HttpError(504, gh.output.message, {
              engine,
              type: 'limit',
            });
          }

          throw new Error('GraphHopper: unexpected response format');
        });

      break;

    case 'openrouteservice':
    default:
      payload = {
        coordinates,
        elevation: true,
        instructions: false,
      };

      if (!import.meta.env.VITE_OPENROUTESERVICE_API_KEY?.trim()) {
        throw new HttpError(400, 'Missing OpenRouteService API key');
      }

      result = fetch(
        'https://api.openrouteservice.org/v2/directions/cycling-road/geojson',
        {
          method: 'post',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            Authorization: import.meta.env.VITE_OPENROUTESERVICE_API_KEY,
          },
          signal: AbortSignal.timeout(ABORT_TIMEOUT),
        },
      )
        .then((raw) => raw.json())
        .then((json: unknown) => {
          const ors = v.safeParse(ORSResponseSchema, json);

          if (!ors.success) {
            const formatted = ors.issues
              .map(
                (i) =>
                  `Expected ${JSON.stringify(i.expected)}, received ${i.received}`,
              )
              .join('\n');

            throw new Error(
              `OpenRouteService: unexpected response.\n${formatted}`,
            );
          }
          const feature = ors.output.features?.[0];

          if (!feature) {
            throw new Error('OpenRouteService: no features found');
          }

          return {
            bbox: ors.output.bbox,
            points: feature,
            distance: feature.properties.summary.distance,
            // ORS sends duration in seconds
            time: feature.properties.summary.duration * 1000,
            ascend: feature.properties.ascent,
            descend: feature.properties.descent,
          };
        });
  }

  return result
    .then((data: unknown) => {
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      if (err instanceof HttpError) {
        throw err;
      }

      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        throw new HttpError(504, 'Upstream timeout');
      }

      throw new HttpError(502, err.message);
    });
});
