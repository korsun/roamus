import React, { useState } from 'react'
import classNames from 'classnames'

import { useStore } from '../../hooks/useStore'
import { metresToKm, msToTime, ascDescToFixed } from '../../helpers/route'

import { DistanceSvgr, TimeSvgr, AscendSvgr, DescendSvgr } from '../../assets/icons/index.svgr'
import { RouteInfo } from '../RouteInfo/RouteInfo'
import { Error } from '../Error/Error'
import { EngineSelect } from '../EngineSelect/EngineSelect'

import s from './SidePanel.module.css'

export const SidePanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const { distance, time, ascend, descend, error, engine, limits, setEngine, setRoute } = useStore()

	const handleClick = () => {
		setIsCollapsed(!isCollapsed)
	}

	return (
		<div className={classNames(s.container, {
			[s.collapsed]: isCollapsed
		})}>
			<div className={classNames(s.panel, {
				[s.collapsedPanel]: isCollapsed
			})}>
				<section className={s.section}>
					<EngineSelect
						engine={engine}
						setEngine={setEngine}
						limits={limits}
					/>
				</section>
				<section className={classNames(s.section, s.icons)}>
					<RouteInfo
						title='Distance'
						text={metresToKm(distance)}
						icon={<DistanceSvgr size={32} />}
					/>
					<RouteInfo
						title='Time'
						text={msToTime(time)}
						icon={<TimeSvgr size={32} />}
					/>
					<RouteInfo
						title='Ascend'
						text={ascDescToFixed(ascend)}
						icon={<AscendSvgr size={32} />}
					/>
					<RouteInfo
						title='Descend'
						text={ascDescToFixed(descend)}
						icon={<DescendSvgr size={32} />}
					/>
				</section>
				
				{Boolean(distance) && 
				<section className={s.section}>
					<button onClick={() => setRoute({ distance: 0, time: 0, ascend: 0, descend: 0 })}>Clear route</button>
				</section>}
				
				<Error message={error} />
			</div>
			<button
				className={s.collapseButton}
				onClick={handleClick}
			>
				{isCollapsed ? '>' : '<'}
			</button>
		</div>
	)
}