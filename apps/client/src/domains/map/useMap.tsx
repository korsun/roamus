import type { Coordinate } from '@common/schemas/routing';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MapService, useStore } from '@/shared/services';
import { fetchRoute } from '@/shared/services/api/apiRoutes';
import { COORDINATES_CHANGE_EVENT } from '@/shared/services/emitter';
import { applyRoute } from './helpers';

export const useMap = ({ styles }: { styles: Dictionary<string> }) => {
  const mapRef = useRef(null);
  const { setPath, routes, setGraphhopperLimits } = useStore();
  const [isMapRendered, setIsMapRendered] = useState(false);
  const {
    cleanMap,
    cleanRoute,
    renderRoute,
    initMap,
    onEvent,
    getMarkersSource,
  } = useMemo(() => new MapService(), []);

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
    const offEvent = onEvent(
      COORDINATES_CHANGE_EVENT,
      (coordinates: Coordinate[]) =>
        applyRoute({
          coordinates,
          getMarkersSource,
          routes,
          setGraphhopperLimits,
          cleanRoute,
          setPath,
          renderRoute,
          fetchRoute,
        }),
    );

    return () => offEvent();
  }, [
    routes,
    onEvent,
    getMarkersSource,
    setGraphhopperLimits,
    cleanRoute,
    setPath,
    renderRoute,
  ]);

  return {
    mapRef,
    isMapRendered,
  };
};
