import { useEffect, useMemo, useRef, useState } from 'react';
import { Coordinate } from 'ol/coordinate';
import { Engine } from '@common/types';

import { GraphHopperLimitError, MapService } from '@/services';
import { fetchRoute } from '@/api';

import { useStore } from './useStore';

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

      Promise.all(
        (Object.keys(routes) as Engine[]).map(async (engine) => {
          if (routes[engine].isActive) {
            return {
              engine,
              data: await fetchRoute({
                engine,
                coordinates,
              }),
            };
          }

          cleanRoute(engine);
          return null;
        }),
      )
        .then(([...results]) =>
          results.forEach((result) => {
            if (!result) {
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
    const offEvent = onEvent('coordinatesChange', applyRoute);

    return () => offEvent();
  }, [routes, onEvent, renderRoute, setPath, setError, cleanRoute]);

  return {
    mapRef,
    isMapRendered,
  };
};
