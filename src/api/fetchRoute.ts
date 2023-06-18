import { Coordinate } from 'ol/coordinate'
import { apiService } from '../services/apiService'
import GeoJSON from 'ol/format/GeoJSON'
import { GRAPHHOPER_API_KEY, OPENROUTESERVICE_API_KEY } from '../helpers/constants'
import { Geometry } from 'ol/geom'

export type Engine = 
	| 'graphhopper'
	| 'openrouteservice'

type BBox = [number, number, number, number]

export type Path = {
	distance: number
	weight?: number
	time: number
	transfers?: number
	points_encoded?: boolean
	ascend?: number
	descend?: number
	legs?: unknown[]
	bbox: BBox
	points: GeoJSON
}

// https://docs.graphhopper.com/#section/Map-Data-and-Routing-Profiles/OpenStreetMap
type FetchRouteProfile = 
	| 'car'
	| 'foot'
	| 'bike'

type FetchRouteAvoid =
	| 'motorway'
	| 'trunk'
	| 'ferry'
	| 'tunnel'
	| 'bridge'
	| 'ford'

type FetchRouteCurbsides =
	| 'any'
	| 'left'
	| 'right'

// https://docs.graphhopper.com/#operation/postRoute
type GraphHopperPayload = {
	profile?: FetchRouteProfile
	points: Coordinate[]
	point_hints?: string[]
	snap_preventions?: FetchRouteAvoid[]
	curbsides?: FetchRouteCurbsides[]
	locale?: string
	elevation?: boolean
	details?: string[]
	optimize?: 'true' | 'false' // yep, strings
	instructions?: boolean
	calc_points?: boolean
	debug?: boolean
	points_encoded?: boolean
}

type ORSPayload = {
	coordinates: Coordinate[]
	elevation?: boolean
}

type GraphHopperResponse = {
	hints: {
		'visited_nodes.sum': number
		'visited_nodes.average': number
	},
	info: {
		copyrights: string[]
		took: number
	},
	paths: Path[]
}

type Info = {
	distance: number
	duration: number
}

type ORSResponse = {
	bbox: BBox
	features: {
		bbox: BBox
		geometry: Geometry
		properties: {
			segments: Info[]
			summary: Info
			way_points: number[]
		}
	},
	metadata: unknown
}

export const fetchRoute = async (coordinates: Coordinate[], engine: Engine = 'openrouteservice') => {
	let payload: GraphHopperPayload | ORSPayload

	switch (engine) {
		case 'graphhopper':
			payload = {
				points: coordinates,
				details: ['road_class', 'surface'],
				profile: 'bike',
				points_encoded: false,
				instructions: false,
				optimize: 'true',
			}

			return await apiService.post({
				url: 'https://graphhopper.com/api/1/route',
				payload,
				queryParams: {
					key: GRAPHHOPER_API_KEY,
				}
			})
				.then((data: GraphHopperResponse) => data?.paths?.[0])

		case 'openrouteservice':
		default:
			payload = {
				coordinates,
				elevation: true,
			}
			return await apiService.post({
				url: 'https://api.openrouteservice.org/v2/directions/cycling-road/geojson',
				payload,
				headers: {
					'Authorization': OPENROUTESERVICE_API_KEY,
				},
			})
				.then((data: ORSResponse) => {
					const feature = data?.features?.[0]

					return {
						bbox: data.bbox,
						points: feature,
						distance: feature.properties.summary.distance,
						// ORS sends duration in seconds
						time: feature.properties.summary.duration * 1000,
						ascend: feature.properties.ascent,
						descend: feature.properties.descent,
					}
				})
	}
}
