import { Coordinate } from 'ol/coordinate'
import { apiService } from '../services/apiService'
import GeoJSON from 'ol/format/GeoJSON'

type Path = {
	distance: number
	weight: number
	time: number
	transfers: number
	points_encoded: boolean
	ascend: number
	descend: number
	legs: unknown[]
	bbox: [number, number, number, number]
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
type FetchRoutePayload = {
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

type FetchRouteResponse = {
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

export const fetchRoute = async (coordinates: Coordinate[]) => {
	const payload: FetchRoutePayload = {
		points: coordinates,
		details: ['road_class', 'surface'],
		profile: 'bike',
		points_encoded: false,
		instructions: false,
		optimize: 'true',
	}

	return await apiService.post({
		url: 'https://graphhopper.com/api/1/route',
		payload
	})
		.then((data: FetchRouteResponse) => data.paths[0])
}
