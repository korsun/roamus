import maplibregl, { GeoJSONSource, LngLatLike } from 'maplibre-gl'

import { fetchRoute } from './api/fetchRoute'
import { MAX_POINTS_WITH_FREE_API, THUNDERFOREST_API_KEY } from './constants'
import { getRetinaMod } from './getRetinaMod'

export const initMap = () => {
	const map = new maplibregl.Map({
		container: 'map',
		style: {
			version: 8,
			sources: {
				// osm: {
				// 	type: 'raster',
				// 	tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
				// 	tileSize: 256,
				// 	attribution: '&copy; OpenStreetMap Contributors',
				// 	maxzoom: 19
				// },
				cycle: {
					type: 'raster',
					tiles: [`https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${THUNDERFOREST_API_KEY}`],
					attribution: '&copy; OpenCycleMap'
				}
			},
			layers: [
				{
					id: 'cycle',
					type: 'raster',
					source: 'cycle'
				},
			],
		},
		center: [16.424632, 45.750721],
		hash: true,
		zoom: 12
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
	
	const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: []
		}
	}

	map.on('load', function () {
		map.addSource('route', {
			type: 'geojson',
			data: geojson
		})
		map.addLayer({
			id: 'route',
			source: 'route',
			type: 'line',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': 'orange',
				'line-width': 5
			}
		})
	})

	map.on('click', async (e) => {
		const coords: LngLatLike = [e.lngLat.lng, e.lngLat.lat]

		geojson.geometry.coordinates.push(coords)

		if (geojson.geometry.coordinates.length > MAX_POINTS_WITH_FREE_API) {
			return
		}

		const marker = new maplibregl.Marker({ draggable: true })
			.setLngLat(coords)
			.addTo(map)

		marker.on('dragend', () => {
		})

		if (geojson.geometry.coordinates.length < 2) {
			return
		}

		const data = await fetchRoute(geojson.geometry.coordinates)
		console.log(data);
		(map.getSource('route') as GeoJSONSource).setData(data.paths[0].points)
	})
}
