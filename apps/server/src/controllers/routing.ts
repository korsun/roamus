import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as v from 'valibot';
import {
  GraphHopperPayload,
  GraphHopperResponseSchema,
  ORSPayload,
  ORSResponseSchema,
  ProxyServerPayloadSchema,
} from '@common/schemas';

const ABORT_TIMEOUT = 15_000;

/**
 * @desc Map routing between given points
 * @route POST /api/routing/
 */
export const buildRoute = asyncHandler((req: Request, res: Response) => {
  const parsed = v.safeParse(ProxyServerPayloadSchema, req.body);

  if (!parsed.success) {
    res.status(400);
    throw new Error(
      `Invalid payload: expected ${JSON.stringify(ProxyServerPayloadSchema, null, 2)}`,
    );
  }

  let payload: GraphHopperPayload | ORSPayload;
  const { engine, coordinates } = parsed.output;

  let result;

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

      if (!import.meta.env.VITE_GRAPHHOPER_API_KEY) {
        res.status(400);
        throw new Error('Missing GraphHopper API key');
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
            res.status(502);
            const formatted = gh.issues
              .map(
                (i) =>
                  `Expected ${JSON.stringify(i.expected)}, received ${i.received}`,
              )
              .join('\n');

            throw new Error(`GraphHopper: unexpected response.\n${formatted}`);
          }
          return gh.output.paths[0];
        });

      break;

    case 'openrouteservice':
    default:
      payload = {
        coordinates,
        elevation: true,
        instructions: false,
      };

      if (!import.meta.env.VITE_OPENROUTESERVICE_API_KEY) {
        res.status(400);
        throw new Error('Missing OpenRouteService API key');
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
            res.status(502);
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

  result
    .then((data: unknown) => {
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        res.status(504);
        throw new Error('Upstream timeout');
      }

      res.status(502);
      throw new Error(err.message);
    });
});
