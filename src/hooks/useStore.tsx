import { create } from 'zustand'

type Store = {
	distance: number
	time: number
	ascend: number
	descend: number
	error?: string
	setRoute: (store: Store) => void
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
}))
