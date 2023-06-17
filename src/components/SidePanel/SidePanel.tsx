import React, { useState } from 'react'
import classNames from 'classnames'

import { useStore } from '../../hooks/useStore'
import { metresToKm, msToTime, ascDescToFixed } from '../../helpers/route'

import { DistanceSvgr, TimeSvgr, AscendSvgr, DescendSvgr } from '../../assets/icons/index.svgr'
import { RouteInfo } from '../RouteInfo/RouteInfo'

import s from './SidePanel.module.css'

export const SidePanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const { distance, time, ascend, descend } = useStore()

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
				<section className={s.icons}>
					<RouteInfo
						title='Distance'
						text={metresToKm(distance)}
						icon={<DistanceSvgr />}
					/>
					<RouteInfo
						title='Time'
						text={msToTime(time)}
						icon={<TimeSvgr />}
					/>
					<RouteInfo
						title='Ascend'
						text={ascDescToFixed(ascend)}
						icon={<AscendSvgr />}
					/>
					<RouteInfo
						title='Descend'
						text={ascDescToFixed(descend)}
						icon={<DescendSvgr />}
					/>
				</section>
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