import maplibregl, { MapMouseEvent, GeoJSONSource, LngLatLike } from 'maplibre-gl'

import { fetchRoute } from './api/fetchRoute'
import { MAX_POINTS_WITH_FREE_API, MAPTILER_API_KEY } from './constants'
import { getRetinaMod } from './getRetinaMod'
import { getCurrentPosition } from './getCurrentPosition'

export const initMap = async () => {
	const map = new maplibregl.Map({
		container: 'map',
		style: {
			version: 8,
			sources: {
				// cycle: {
				// 	type: 'raster',
				// 	tiles: [`https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${THUNDERFOREST_API_KEY}`],
				// 	attribution: '&copy; OpenCycleMap',
				// 	tileSize: 512
				// },
				maptiler: {
					type: 'raster',
					tiles: [`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}${getRetinaMod()}.png?key=${MAPTILER_API_KEY}`],
					attribution: '&copy; MapTiler',
					tileSize: 512
				},
				// hillshading: {
				// 	type: 'raster',
				// 	tiles: [`https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=${MAPTILER_API_KEY}`],
				// 	attribution: 'MapTiler'
				// },
				trails: {
					type: 'raster',
					tiles: ['https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png'],
					attribution: 'WaymarkedTrails',
					tileSize: 256
				}
			},
			layers: [
				// {
				// 	id: 'cycle',
				// 	type: 'raster',
				// 	source: 'cycle'
				// },
				{
					id: 'maptiler',
					type: 'raster',
					source: 'maptiler'
				},
				// {
				// 	id: 'hillshading',
				// 	type: 'raster',
				// 	source: 'hillshading'
				// },
				{
					id: 'trails',
					type: 'raster',
					source: 'trails'
				}
			]
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
			id: 'route'
		},
		geometry: {
			type: 'LineString',
			coordinates: []
		}
	}

	map.on('load', () => {
		map.addSource('geojson', {
			type: 'geojson',
			data: geojson
		})
		map.addLayer({
			id: 'points',
			type: 'circle',
			source: 'geojson',
			paint: {
				'circle-radius': 5,
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

	let featId = ''
	let move = false

	const onMove = (e: MapMouseEvent) => {
		move = true
		console.log('move')
		const point = geojson.features.find((p) => p.properties?.id === featId)
		
		if (point) {
			// @ts-ignore
			point.geometry.coordinates = [e.lngLat.lng, e.lngLat.lat];
			(map.getSource('geojson') as GeoJSONSource).setData(geojson)
		}
	}

	const unbind = () => {
		console.log('unbind')
		map.off('mousemove', onMove)
		featId = ''
	}

	const onUp = async (e: MapMouseEvent) => {
		console.log('up')
		
		if (geojson.features.length > 1) geojson.features.pop()

		if (!move) {
			if (featId) {
				geojson.features = geojson.features.filter((point) => point.properties?.id !== featId)
			} else {
				const coords: LngLatLike = [e.lngLat.lng, e.lngLat.lat]
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
		}

		if (geojson.features.length > MAX_POINTS_WITH_FREE_API) {
			return
		}

		(map.getSource('geojson') as GeoJSONSource).setData(geojson)

		if (geojson.features.length < 2) {
			return
		}

		const allCoords = geojson.features
			.filter((feature) => feature.geometry.type === 'Point')
			// @ts-ignore
			.map(item => item.geometry.coordinates)

		if (allCoords.length < 2) return

		const data = await fetchRoute(allCoords)
		console.log(data)
		linestring.geometry = data.paths[0].points
		geojson.features.push(linestring);
		(map.getSource('geojson') as GeoJSONSource).setData(geojson)
		move = false
	}

	map.on('mousedown', (e: MapMouseEvent) => {
		e.preventDefault()
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['points']
		})
		console.log('feats', features)
		featId = features[0]?.properties.id

		map.on('mousemove', onMove)
		map.on('mouseup', onUp)
		map.once('mouseup', unbind)
	})

	// https://github.com/mapbox/mapbox-gl-js/issues/1695
	// hack for rachety zoom (integers only)
	map.on('moveend', () => {
		const zoom = Math.round(map.getZoom())
		if (zoom !== map.getZoom()) {
			map.setZoom(zoom)
		}
	})
}
