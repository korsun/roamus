/**
 * @todo replace with some UI-kit component
 */
import React from 'react'

import { Engine } from '../../api/fetchRoute'
import { Store } from '../../hooks/useStore'

import s from './EngineSelect.module.css'

export const EngineSelect = ({ engine, setEngine, limits }: Pick<Store, 'engine' | 'setEngine' | 'limits'>) => (
	<>
		<span className={s.selectCaption}>Routing service:</span>
		<select value={engine} onChange={(e) => setEngine(e.target.value as Engine)}>
			<option value='openrouteservice' disabled={limits.openrouteservice}>OpenRouteService</option>
			<option value='graphhopper' disabled={limits.graphhopper}>GraphHopper</option>
		</select>
	</>
)