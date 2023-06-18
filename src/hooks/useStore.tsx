import { create } from 'zustand'

import { Path } from '../api/fetchRoute'

type Store = {
	distance: number
	time: number
	ascend: number
	descend: number
	error?: string
	setRoute: (path: Path) => void
	setError: (err: string) => void
}

export const useStore = create<Store>()((set) => ({
	distance: 0,
	time: 0,
	ascend: 0,
	descend: 0,
	error: undefined,
	setRoute: ({ distance, time, ascend, descend }) => set(() => ({
		distance,
		time,
		ascend,
		descend,
	})),
	setError: (error) => set(() => ({
		error
	})),
}))
