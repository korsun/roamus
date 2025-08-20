import type { Engine, Path } from '@common/schemas/routing';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type Route = {
  path?: Path;
  hasLimits: boolean;
  isActive: boolean;
  error?: string;
};

export type Store = {
  routes: Record<Engine, Route>;
  setPath: (engine: Engine, path: Path | undefined) => void;
  setGraphhopperLimits: (hasLimits: boolean, error?: string) => void;
  setActiveEngines: (engine: Engine) => void;
  isServerAwake: boolean | undefined;
  setServerAwake: (isAwake: boolean) => void;
};

export const useStore = create<Store>()(
  subscribeWithSelector((set) => ({
    routes: {
      openrouteservice: {
        hasLimits: false,
        isActive: true,
      },
      graphhopper: {
        hasLimits: false,
        isActive: true,
      },
    },
    setPath: (engine, path) =>
      set(({ routes }) => ({
        routes: {
          ...routes,
          [engine]: {
            ...routes[engine],
            path,
          },
        },
      })),
    setGraphhopperLimits: (hasLimits, error) =>
      set(({ routes }) => ({
        routes: {
          ...routes,
          openrouteservice: {
            ...routes.openrouteservice,
            isActive: hasLimits,
          },
          graphhopper: {
            ...routes.graphhopper,
            isActive: !hasLimits,
            hasLimits,
            error,
          },
        },
      })),
    setActiveEngines: (engine) =>
      set(({ routes }) => ({
        routes: {
          ...routes,
          [engine]: {
            ...routes[engine],
            isActive: !routes[engine].isActive,
          },
        },
      })),
    isServerAwake: undefined,
    setServerAwake: (isAwake) => set({ isServerAwake: isAwake }),
  })),
);
