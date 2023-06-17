import React from 'react'
import { useMap } from '../../hooks/useMap'

import s from './Map.module.css'

export const Map = () => {
	useMap()

	return (
		<div id='map' className={s.mapContainer} />
	)
}
