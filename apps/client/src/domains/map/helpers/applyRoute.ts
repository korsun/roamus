import type { Coordinate, Engine, Path } from '@common/schemas/routing';
import { logError } from '@/shared/helpers';
import { isGraphHopperLimitError } from '@/shared/services/api/apiErrors';

type ApplyRouteParams = {
  coordinates: Coordinate[];
  getMarkersSource: () => { getFeatures: AnyFunction };
  routes: Record<string, { isActive: boolean }>;
  setGraphhopperLimits: (hasLimits: boolean, error?: string) => void;
  cleanRoute: (engine: Engine) => void;
  setPath: (engine: Engine, data: Path) => void;
  renderRoute: (result: { engine: Engine; data: Path }) => void;
  fetchRoute: (params: {
    engine: Engine;
    coordinates: Coordinate[];
  }) => Promise<Path>;
};

const GRAPHHOPPER_LIMIT = 5;

export const applyRoute = async ({
  coordinates,
  getMarkersSource,
  routes,
  setGraphhopperLimits,
  cleanRoute,
  setPath,
  renderRoute,
  fetchRoute,
}: ApplyRouteParams) => {
  if (!coordinates.length) {
    return;
  }

  const markers = getMarkersSource().getFeatures();
  const isGraphHopperLimit =
    markers.length > GRAPHHOPPER_LIMIT && routes.graphhopper.isActive;

  if (isGraphHopperLimit) {
    setGraphhopperLimits(
      true,
      `Free GraphHopper engine allows maximum ${GRAPHHOPPER_LIMIT} markers`,
    );
  }

  const engines = Object.keys(routes) as Engine[];

  try {
    const results = await Promise.all(
      engines.map(async (engine) => {
        if (
          routes[engine].isActive &&
          !(engine === 'graphhopper' && isGraphHopperLimit)
        ) {
          try {
            const data = await fetchRoute({
              engine,
              coordinates,
            });

            return {
              engine,
              data,
            };
          } catch (err) {
            if (isGraphHopperLimitError(err)) {
              setGraphhopperLimits(true, err.message);
            }
          }
        }

        return {
          engine,
          data: null,
        };
      }),
    );

    for (const result of results) {
      if (!result.data) {
        cleanRoute(result.engine);
        continue;
      }
      setPath(result.engine, result.data);
      renderRoute(result);
    }
  } catch (error) {
    logError(error);
  }
};
