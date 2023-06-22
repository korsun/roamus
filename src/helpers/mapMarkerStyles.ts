import { Icon, Style } from 'ol/style'
import Marker from '../assets/icons/map-marker.svg'

export const startMarkerStyle = new Style({
	image: new Icon({
		anchor: [0.5, 1],
		src: Marker,
		color: '#f05542'
	})
})

export const endMarkerStyle = new Style({
	image: new Icon({
		anchor: [0.5, 1],
		src: Marker,
		color: '#25b39e'
	})
})

export const interimMarkerStyle = new Style({
	image: new Icon({
		anchor: [0.5, 1],
		src: Marker,
		color: '#3939aa'
	})
})
