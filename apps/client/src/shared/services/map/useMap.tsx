import type { Coordinate, Engine } from '@common/schemas/routing';
import { useEffect, useMemo, useRef, useState } from 'react';

import { GraphHopperLimitError, MapService, useStore } from '@/shared/services';
import { fetchRoute } from '@/shared/services/api/apiRoutes';
import { COORDINATES_CHANGE_EVENT } from '@/shared/services/emitter';

export const useMap = ({ styles }: { styles: Dictionary<string> }) => {
  const mapRef = useRef(null);
  const { setPath, setError, routes } = useStore();
  const [isMapRendered, setIsMapRendered] = useState(false);
  const { cleanMap, cleanRoute, renderRoute, initMap, onEvent } = useMemo(
    () => new MapService(),
    [],
  );

  useEffect(() => {
    (async () => {
      const map = await initMap({
        container: mapRef?.current ?? undefined,
        styles,
      });
      map?.once('rendercomplete', () => {
        setIsMapRendered(true);
      });
    })();

    return useStore.subscribe(
      (state) =>
        Object.values(state.routes).some((route) => route.path?.distance),
      (distance) => {
        if (!distance) {
          cleanMap();
        }
      },
    );
  }, [cleanMap, initMap, styles]);

  useEffect(() => {
    const applyRoute = async (coordinates: Coordinate[]) => {
      if (!coordinates.length) {
        return;
      }

      const engines = Object.keys(routes) as Engine[];
      Promise.all(
        engines.map(async (engine) => {
          if (routes[engine].isActive) {
            return {
              engine,
              data: await fetchRoute({
                engine,
                coordinates,
              }),
            };
          }

          return {
            engine,
            data: null,
          };
        }),
      )
        .then(([...results]) =>
          results.forEach((result) => {
            if (!result.data) {
              cleanRoute(result.engine);
              return;
            }
            setPath(result.engine, result.data);
            renderRoute(result);
          }),
        )
        .catch((err) => {
          if (err instanceof GraphHopperLimitError) {
            setError(err.message);
          }
        });
    };
    const offEvent = onEvent(COORDINATES_CHANGE_EVENT, applyRoute);

    return () => offEvent();
  }, [routes, onEvent, renderRoute, setPath, setError, cleanRoute]);

  return {
    mapRef,
    isMapRendered,
  };
};
