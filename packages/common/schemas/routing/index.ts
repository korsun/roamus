import * as v from 'valibot';

const EngineSchema = v.union([
  v.literal('graphhopper'),
  v.literal('openrouteservice'),
]);
export type Engine = v.InferOutput<typeof EngineSchema>;

export const CoordinateSchema = v.looseTuple([v.number(), v.number()]);
export type Coordinate = v.InferOutput<typeof CoordinateSchema>;

export const BBoxSchema = v.array(v.number());

export const GeoJSONLikeSchema = v.looseObject({
  type: v.union([
    v.literal('LineString'),
    v.literal('Point'),
    v.literal('Polygon'),
    v.literal('MultiLineString'),
    v.literal('MultiPoint'),
    v.literal('MultiPolygon'),
  ]),
  coordinates: v.array(CoordinateSchema),
});

export const PathSchema = v.looseObject({
  distance: v.number(),
  weight: v.optional(v.number()),
  time: v.number(),
  transfers: v.optional(v.number()),
  points_encoded: v.optional(v.boolean()),
  ascend: v.optional(v.number()),
  descend: v.optional(v.number()),
  legs: v.optional(v.array(v.unknown())),
  bbox: BBoxSchema,
  points: GeoJSONLikeSchema,
});
export type Path = v.InferOutput<typeof PathSchema>;

// https://docs.graphhopper.com/#section/Map-Data-and-Routing-Profiles/OpenStreetMap
const FetchRouteProfileSchema = v.union([
  v.literal('car'),
  v.literal('foot'),
  v.literal('bike'),
]);

const FetchRouteAvoidSchema = v.union([
  v.literal('motorway'),
  v.literal('trunk'),
  v.literal('ferry'),
  v.literal('tunnel'),
  v.literal('bridge'),
  v.literal('ford'),
]);

const FetchRouteCurbsidesSchema = v.union([
  v.literal('any'),
  v.literal('left'),
  v.literal('right'),
]);

// https://docs.graphhopper.com/#operation/postRoute
export const GraphHopperPayloadSchema = v.looseObject({
  profile: v.optional(FetchRouteProfileSchema),
  points: v.array(CoordinateSchema),
  point_hints: v.optional(v.array(v.string())),
  snap_preventions: v.optional(v.array(FetchRouteAvoidSchema)),
  curbsides: v.optional(v.array(FetchRouteCurbsidesSchema)),
  locale: v.optional(v.string()),
  elevation: v.optional(v.boolean()),
  details: v.optional(v.array(v.string())),
  optimize: v.optional(v.union([v.literal('true'), v.literal('false')])), // yep, strings
  instructions: v.optional(v.boolean()),
  calc_points: v.optional(v.boolean()),
  debug: v.optional(v.boolean()),
  points_encoded: v.optional(v.boolean()),
});
export type GraphHopperPayload = v.InferOutput<typeof GraphHopperPayloadSchema>;

export const ORSPayloadSchema = v.looseObject({
  coordinates: v.array(CoordinateSchema),
  elevation: v.optional(v.boolean()),
});
export type ORSPayload = v.InferOutput<typeof ORSPayloadSchema>;

export const GraphHopperResponseSchema = v.looseObject({
  hints: v.looseObject({
    'visited_nodes.sum': v.number(),
    'visited_nodes.average': v.number(),
  }),
  info: v.looseObject({
    copyrights: v.array(v.string()),
    took: v.number(),
  }),
  paths: v.array(PathSchema),
});
export type GraphHopperResponse = v.InferOutput<
  typeof GraphHopperResponseSchema
>;

const InfoSchema = v.looseObject({
  distance: v.number(),
  duration: v.number(),
});

export const ORSResponseSchema = v.looseObject({
  bbox: BBoxSchema,
  features: v.array(
    v.looseObject({
      type: v.literal('Feature'),
      bbox: BBoxSchema,
      geometry: GeoJSONLikeSchema,
      properties: v.looseObject({
        segments: v.optional(v.array(InfoSchema)),
        summary: InfoSchema,
        way_points: v.array(v.number()),
        ascent: v.optional(v.number()),
        descent: v.optional(v.number()),
      }),
    }),
  ),
  metadata: v.unknown(),
});
export type ORSResponse = v.InferOutput<typeof ORSResponseSchema>;

export const ProxyServerPayloadSchema = v.looseObject({
  engine: EngineSchema,
  coordinates: v.array(CoordinateSchema),
});
export type ProxyServerPayload = v.InferOutput<typeof ProxyServerPayloadSchema>;

export type ProxyServerResponse = Path;
