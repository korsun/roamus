import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Engine, Path } from '@common/schemas/routing';

export type Route = {
  path?: Path;
  hasLimits: boolean;
  isActive: boolean;
  error?: string;
};

export type Store = {
  routes: Record<Engine, Route>;
  setPath: (engine: Engine, path: Path | undefined) => void;
  setError: (err: string) => void;
  setActiveEngines: (engine: Engine) => void;
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
    setError: (error) =>
      set(({ routes }) => ({
        routes: {
          ...routes,
          openrouteservice: {
            ...routes.openrouteservice,
            isActive: true,
          },
          graphhopper: {
            ...routes.graphhopper,
            isActive: false,
            hasLimits: true,
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
  })),
);
