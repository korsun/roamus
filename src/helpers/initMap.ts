import { fetchRoute } from '../api/fetchRoute'
import { MAX_POINTS_WITH_FREE_API, MAPTILER_API_KEY, THUNDERFOREST_API_KEY } from './constants'
import { getRetinaMod } from './getRetinaMod'
import { getCurrentPosition } from './getCurrentPosition'

import Map from 'ol/Map'
// import OSM from 'ol/source/OSM.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import View from 'ol/View.js'
import { useGeographic } from 'ol/proj.js'
import { Draw, Modify, Snap, Select, defaults as defaultInteractions } from 'ol/interaction.js'
import Point from 'ol/geom/Point.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Icon, Style } from 'ol/style'
import { ScaleLine, Zoom, Attribution } from 'ol/control.js'

import s from '../App.module.css'

export const initMap = async (setRoute) => {
	useGeographic()
	
	const isRetina = Boolean(getRetinaMod())
	const center = await getCurrentPosition()
	const markersSource = new VectorSource()
	const routeSource = new VectorSource()
	const markersLayer = new VectorLayer({
		source: markersSource,
		style: new Style({
			image: new Icon({
				anchor: [0.5, 1],
				src: 'https://raw.githubusercontent.com/maptiler/openlayers-samples/main/default-marker/marker-icon.png',
			})
		})
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
		condition: (e) => {
			let shouldBeDrawn = true

			map.forEachFeatureAtPixel(e.pixel,
				() => shouldBeDrawn = false,
				{
					layerFilter: (l) => l === markersLayer
				})
			return shouldBeDrawn
		},
	})
	const select = new Select()
	const modify = new Modify({ source: markersSource })
	const snap = new Snap({ source: markersSource })

	const map = new Map({
		layers: [
			// new TileLayer({
			// 	source: new OSM(),
			// }),
			new TileLayer({
				source: new XYZ({
					attributions: '&copy; MapTiler',
					url: `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}${getRetinaMod()}.png?key=${MAPTILER_API_KEY}`,
					tilePixelRatio: isRetina ? 2 : 1,
				}),
			}),
			new TileLayer({
				source: new XYZ({
					attributions: '&copy; OpenCycleMap',
					url: `https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${THUNDERFOREST_API_KEY}`,
					tilePixelRatio: isRetina ? 2 : 1,
				}),
			}),
			markersLayer,
			routeLayer,
		],
		interactions: defaultInteractions().extend([draw, modify, snap, select]),
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

	const renderRoute = async () => {
		const features = markersSource.getFeatures()

		if (features.length < 2 || features.length > MAX_POINTS_WITH_FREE_API) return

		const coords = features.map(f => (f.getGeometry() as Point).getCoordinates())
		const data = await fetchRoute(coords)
		console.log(data)
		if (!data) return
		
		setRoute(data)
		routeSource.clear()
		routeSource.addFeatures(new GeoJSON().readFeatures(data.points))
	}

	markersSource.on('addfeature', () => {
		renderRoute()
	})

	modify.on('modifyend', () => {
		renderRoute()
	})
}
