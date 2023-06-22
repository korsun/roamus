import { useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import { fetchRoute } from '../api/fetchRoute'
import { /* MAPTILER_API_KEY, */ THUNDERFOREST_API_KEY } from '../helpers/constants'
import { getCurrentPosition, getRetinaMod } from '../helpers'

import Map from 'ol/Map'
// import OSM from 'ol/source/OSM.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import View from 'ol/View'
import { useGeographic } from 'ol/proj'
import { Draw, Modify, Snap, defaults as defaultInteractions } from 'ol/interaction'
import GeoJSON from 'ol/format/GeoJSON'
import { ScaleLine, Zoom, Attribution } from 'ol/control'

import s from '../components/Map/Map.module.css'
import { GraphHopperLimitError } from '../services/apiErrors'
import { Point } from 'ol/geom'
import { startMarkerStyle, endMarkerStyle, interimMarkerStyle } from '../helpers/mapMarkerStyles'
import { sortMarkersById } from '../helpers/route'

export const useMap = () => {
	const { setRoute, setError } = useStore()

	useEffect(() => {
		let unsubscribe = () => {}

		(async () => {
			try {
				unsubscribe = await initMap()
			} catch (err) {}
		})()

		return unsubscribe
	}, [])

	const initMap = async () => {
		useGeographic()

		const isRetina = Boolean(getRetinaMod())
		const center = await getCurrentPosition()
		const markersSource = new VectorSource()
		const routeSource = new VectorSource()
		const markersLayer = new VectorLayer({
			source: markersSource,
			style: startMarkerStyle,
		})
		const routeLayer = new VectorLayer({
			source: routeSource,
			style: {
				'fill-color': 'rgba(255, 255, 255, 0.2)',
				'stroke-color': 'red',
				'stroke-width': 5,
			}
		})
		const draw = new Draw({
			source: markersSource,
			type: 'Point',
			style: {
				'fill-color': 'none'
			},
			condition: (e) => {
				let shouldBeDrawn = true

				map.forEachFeatureAtPixel(e.pixel,
					() => shouldBeDrawn = false, {
					layerFilter: (l) => l === markersLayer
				})
				return shouldBeDrawn
			},
		})

		const modify = new Modify({ source: markersSource })
		const snap = new Snap({ source: markersSource })

		const map = new Map({
			layers: [
				// new TileLayer({
				// 	source: new OSM(),
				// }),
				// new TileLayer({
				// 	source: new XYZ({
				// 		attributions: '&copy; MapTiler',
				// 		url: `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}${getRetinaMod()}.png?key=${MAPTILER_API_KEY}`,
				// 		tilePixelRatio: isRetina ? 2 : 1,
				// 	}),
				// }),
				new TileLayer({
					source: new XYZ({
						attributions: '&copy; OpenCycleMap',
						url: `https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${THUNDERFOREST_API_KEY}`,
						tilePixelRatio: isRetina ? 2 : 1,
					}),
				}),
				routeLayer,
				markersLayer,
			],
			interactions: defaultInteractions().extend([draw, modify, snap]),
			controls: [
				new ScaleLine({
					className: s.scaleLine
				}),
				new Zoom({
					className: s.zoom
				}),
				new Attribution()
			],
			target: 'map',
			view: new View({
				center,
				zoom: 15,
			}),
		})

		const unsubscribeFromDistance = useStore.subscribe((state) => state.distance, (distance) => {
			if (distance === 0) {
				routeSource.clear()
				markersSource.clear()
			}
		})

		const renderRoute = async () => {
			const markers = markersSource.getFeatures().sort(sortMarkersById)

			if (markers.length < 2) return

			const coords = markers.map(f => (f.getGeometry() as Point).getCoordinates())

			try {
				const { engine } = useStore.getState()
				const data = await fetchRoute(coords, engine)
				console.log(data)
				if (!data) return

				setRoute(data)
				routeSource.clear()
				routeSource.addFeatures(new GeoJSON().readFeatures(data.points))
			} catch (err) {
				if (err instanceof GraphHopperLimitError) {
					setError(err.message)
				}
			}
		}

		markersSource.on('addfeature', (e) => {
			const markers = markersSource.getFeatures()

			if (markers.length === 1) {
				e.feature?.setId('marker_start')
			} else {
				e.feature?.setId('marker_end')
				e.feature?.setStyle(endMarkerStyle)
				markers.forEach((m, i) => {
					if (i !== 0 && i !== markers.length - 1) {
						m.setId('marker_middle_' + i)
						m.setStyle(interimMarkerStyle)
					}

					if (i === markers.length - 1) {
						m.setId('marker_end')
						m.setStyle(endMarkerStyle)
					}
				})
			}
			renderRoute()
		})
		modify.on('modifyend', renderRoute)

		return unsubscribeFromDistance
	}
}
