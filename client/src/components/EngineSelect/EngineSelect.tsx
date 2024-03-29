/**
 * @todo replace with some UI-kit component
 */
import { Store } from '@/hooks'

import s from './EngineSelect.module.css'

export const EngineSelect = ({ engine, setEngine, limits }: Pick<Store, 'engine' | 'setEngine' | 'limits'>) => (
	<>
		<span className={s.selectCaption}>Routing service:</span>
		<div>
			<input type='checkbox' id='openrouteservice' disabled={limits.openrouteservice} onChange={() => setEngine('openrouteservice')} checked={engine === 'openrouteservice'} />
			<label>OpenRouteService</label>
		</div>
		<div>
			<input type='checkbox' id='graphhopper' disabled={limits.graphhopper} onChange={() => setEngine('graphhopper')} checked={engine === 'graphhopper'} />
			<label>GraphHopper</label>
		</div>
	</>
)
