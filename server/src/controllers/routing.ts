import { Request, Response } from 'express';
import fetch from 'cross-fetch';
import asyncHandler from 'express-async-handler';
import {
  GraphHopperPayload,
  GraphHopperResponse,
  ORSPayload,
  ORSResponse,
} from '@common/types';

/**
 * @desc Map routing between given points
 * @route POST /api/routing/
 */
export const buildRoute = asyncHandler((req: Request, res: Response) => {
  let payload: GraphHopperPayload | ORSPayload;
  const { engine, coordinates } = req.body;
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

      if (!process.env.GRAPHHOPER_API_KEY) {
        res.status(400);
        throw new Error('Missing GraphHopper API key');
      }

      result = fetch(
        `https://graphhopper.com/api/1/route/?key=${process.env.GRAPHHOPER_API_KEY}`,
        {
          method: 'post',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((raw) => raw.json())
        .then((data: GraphHopperResponse) => data?.paths?.[0]);

      break;

    case 'openrouteservice':
    default:
      payload = {
        coordinates,
        elevation: true,
        instructions: false,
      };

      if (!process.env.OPENROUTESERVICE_API_KEY) {
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
            Authorization: process.env.OPENROUTESERVICE_API_KEY,
          },
        },
      )
        .then((raw) => raw.json())
        .then((data: ORSResponse) => {
          const feature = data?.features?.[0];

          return {
            bbox: data.bbox,
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
    .then((data: ORSResponse | GraphHopperResponse) => {
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      res.status(400);
      throw new Error(err.message);
    });
});
