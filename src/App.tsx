import React, { useEffect } from 'react'
import { initMap } from './helpers/initMap'

import s from './App.module.css'

export const App: React.FC = () => {

	useEffect(() => {
		initMap()
	}, [])

	return <div id='map' className={s.mapContainer} />
}