import { useEffect, useMemo, useRef, useState } from 'react';
import { Coordinate } from 'ol/coordinate';

import { MapService } from '@/services';
import { fetchRoute } from '@/api';
import { GraphHopperLimitError } from '@/services/api';

import { useStore } from './useStore';

export const useMap = ({ styles }: { styles: Dictionary<string> }) => {
  const mapRef = useRef(null);
  const { setRoute, setError, engine } = useStore();
  const [isMapRendered, setIsMapRendered] = useState(false);
  const { cleanMap, renderRoute, initMap, onEvent } = useMemo(
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
      (state) => state.distance,
      (distance) => {
        if (distance === 0) {
          cleanMap();
        }
      },
    );
  }, [cleanMap, initMap, styles]);

  useEffect(() => {
    const offEvent = onEvent(
      'coordinatesChange',
      async (coordinates: Coordinate[]) => {
        if (!coordinates.length) {
          return;
        }

        const data = await fetchRoute({ engine, coordinates });
        setRoute(data);
        try {
          renderRoute(data);
        } catch (err) {
          if (err instanceof GraphHopperLimitError) {
            setError(err.message);
          }
        }
      },
    );

    return () => offEvent();
  }, [engine, onEvent, renderRoute, setRoute, setError]);

  return {
    mapRef,
    isMapRendered,
  };
};
