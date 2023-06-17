import { useEffect } from 'react'
import { initMap } from '../helpers/initMap'
import { useStore } from '../hooks/useStore'

export const useMap = () => {
	const { setRoute } = useStore()

	useEffect(() => {
		initMap(setRoute)
	}, [])
}
