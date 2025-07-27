import GeoJSON from 'ol/format/GeoJSON';
import { Geometry } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

export type Engine = 'graphhopper' | 'openrouteservice';

type BBox = [number, number, number, number];

export type Path = {
  distance: number;
  weight?: number;
  time: number;
  transfers?: number;
  points_encoded?: boolean;
  ascend?: number;
  descend?: number;
  legs?: unknown[];
  bbox: BBox;
  points: GeoJSON;
};

// https://docs.graphhopper.com/#section/Map-Data-and-Routing-Profiles/OpenStreetMap
type FetchRouteProfile = 'car' | 'foot' | 'bike';

type FetchRouteAvoid =
  | 'motorway'
  | 'trunk'
  | 'ferry'
  | 'tunnel'
  | 'bridge'
  | 'ford';

type FetchRouteCurbsides = 'any' | 'left' | 'right';

// https://docs.graphhopper.com/#operation/postRoute
export type GraphHopperPayload = {
  profile?: FetchRouteProfile;
  points: Coordinate[];
  point_hints?: string[];
  snap_preventions?: FetchRouteAvoid[];
  curbsides?: FetchRouteCurbsides[];
  locale?: string;
  elevation?: boolean;
  details?: string[];
  optimize?: 'true' | 'false'; // yep, strings
  instructions?: boolean;
  calc_points?: boolean;
  debug?: boolean;
  points_encoded?: boolean;
};

export type ORSPayload = {
  coordinates: Coordinate[];
  elevation?: boolean;
};

export type GraphHopperResponse = {
  hints: {
    'visited_nodes.sum': number;
    'visited_nodes.average': number;
  };
  info: {
    copyrights: string[];
    took: number;
  };
  paths: Path[];
};

type Info = {
  distance: number;
  duration: number;
};

export type ORSResponse = {
  bbox: BBox;
  features: {
    bbox: BBox;
    geometry: Geometry;
    properties: {
      segments: Info[];
      summary: Info;
      way_points: number[];
      ascent?: number;
      descent?: number;
    };
  }[];
  metadata: unknown;
};

export type ProxyServerPayload = {
  engine: Engine;
  coordinates: Coordinate[];
};

export type ProxyServerResponse = Path;

export const isGraphHopperResponse = (
  data: unknown,
): data is GraphHopperResponse => {
  return typeof data === 'object' && data !== null && 'paths' in data;
};

export const isORSResponse = (data: unknown): data is ORSResponse => {
  return typeof data === 'object' && data !== null && 'features' in data;
};
