import maplibregl, { GeoJSONSource, LngLatLike } from 'maplibre-gl'

import { fetchRoute } from './api/fetchRoute'
import { MAX_POINTS_WITH_FREE_API, THUNDERFOREST_API_KEY } from './constants'
import { getRetinaMod } from './getRetinaMod'
import { getCurrentPosition } from './getCurrentPosition'

export const initMap = async () => {
	const map = new maplibregl.Map({
		container: 'map',
		style: {
			version: 8,
			sources: {
				cycle: {
					type: 'raster',
					tiles: [`https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${THUNDERFOREST_API_KEY}`],
					attribution: '&copy; OpenCycleMap',
					tileSize: 512
				},
				// hillshading: {
				// 	type: 'raster',
				// 	tiles: ['https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=ldgujGplx520Q0a3WG1f'],
				// 	attribution: 'MapTiler'
				// },
				// trails: {
				// 	type: 'raster',
				// 	tiles: ['https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png'],
				// 	attribution: 'WaymarkedTrails',
				// 	tileSize: 512
				// }
			},
			layers: [
				{
					id: 'cycle',
					type: 'raster',
					source: 'cycle'
				},
				// {
				// 	id: 'hillshading',
				// 	type: 'raster',
				// 	source: 'hillshading'
				// },
				// {
				// 	id: 'trails',
				// 	type: 'raster',
				// 	source: 'trails'
				// }
			],
		},
		center: await getCurrentPosition(),
		hash: true,
		zoom: 13
	})
	map.addControl(
		new maplibregl.NavigationControl({
			visualizePitch: true,
			showZoom: true,
			showCompass: true
		})
	)
	map.addControl(new maplibregl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true
	}))
	
	const geojson: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features: []
	}

	const linestring: GeoJSON.Feature<GeoJSON.LineString> = {
		type: 'Feature',
		properties: {
			name: 'route'
		},
		geometry: {
			type: 'LineString',
			coordinates: []
		}
	}

	map.on('load', function () {
		map.addSource('geojson', {
			type: 'geojson',
			data: geojson
		})
		map.addLayer({
			id: 'points',
			type: 'circle',
			source: 'geojson',
			paint: {
				'circle-radius': 10,
				'circle-color': '#000'
			},
			filter: ['in', '$type', 'Point']
		})
		map.addLayer({
			id: 'route',
			source: 'geojson',
			type: 'line',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': 'orange',
				'line-width': 5
			},
			filter: ['in', '$type', 'LineString']
		})
	})

	map.on('click', async (e) => {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['points']
		})

		if (geojson.features.length > 1) geojson.features.pop()

		const coords: LngLatLike = [e.lngLat.lng, e.lngLat.lat];

		if (features.length) {
			var id = features[0].properties.id
			geojson.features = geojson.features.filter(function (point) {
				return point.properties?.id !== id
			});
		} else {
			const point: GeoJSON.Feature<GeoJSON.Point> = {
				type: 'Feature',
				properties: {
					id: String(new Date().getTime())
				},
				geometry: {
					type: 'Point',
					coordinates: coords
				}
			}

			geojson.features.push(point)
		}

		(map.getSource('geojson') as GeoJSONSource).setData(geojson)
		
		if (geojson.features.length > MAX_POINTS_WITH_FREE_API) {
			return
		}

		if (geojson.features.length < 2) {
			return
		}

		// @ts-ignore
		const allCoords = geojson.features.map((point) => point.geometry.coordinates)

		const data = await fetchRoute(allCoords)
		console.log(data)
		linestring.geometry = data.paths[0].points
		geojson.features.push(linestring);
		console.log(geojson);
		(map.getSource('geojson') as GeoJSONSource).setData(geojson)
	})
}
