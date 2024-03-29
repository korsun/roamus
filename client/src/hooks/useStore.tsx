import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Engine, Path } from '@common/types';

export type Store = {
  distance: number;
  time: number;
  ascend: number;
  descend: number;
  error?: string;
  engine: Engine;
  limits: {
    openrouteservice: boolean;
    graphhopper: boolean;
  };
  setRoute: (
    path: Pick<Path, 'distance' | 'time' | 'ascend' | 'descend'>,
  ) => void;
  setError: (err: string) => void;
  setEngine: (engine: Engine) => void;
};

export const useStore = create<Store>()(
  subscribeWithSelector((set) => ({
    distance: 0,
    time: 0,
    ascend: 0,
    descend: 0,
    error: undefined,
    engine: 'openrouteservice',
    limits: {
      openrouteservice: false,
      graphhopper: false,
    },
    setRoute: ({ distance, time, ascend, descend }) =>
      set(() => ({
        distance,
        time,
        ascend,
        descend,
        error: undefined,
      })),
    setError: (error) =>
      set(({ limits }) => ({
        error,
        engine: 'openrouteservice',
        limits: {
          ...limits,
          graphhopper: true,
        },
      })),
    setEngine: (engine) =>
      set(() => ({
        engine,
        error: undefined,
      })),
  })),
);
