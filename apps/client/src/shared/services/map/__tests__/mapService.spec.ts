import type { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import type { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { COORDINATES_CHANGE_EVENT } from '../../emitter';
import {
  DEFAULT_POSITION_COORDS,
  endMarkerStyle,
  interimMarkerStyle,
} from '../helpers';
import { MapService } from '../mapService';

describe('MapService', () => {
  let mapService: MapService;

  beforeAll(() => {
    // for ol internal modules
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }
      unobserve() {
        // do nothing
      }
      disconnect() {
        // do nothing
      }
    };
  });

  beforeEach(() => {
    mapService = new MapService();
  });

  describe('constructor', () => {
    it('initializes properties correctly', () => {
      expect(mapService.map).toBeUndefined();
      expect(mapService.route).toBeUndefined();
      expect(mapService['markersSource']).toBeInstanceOf(VectorSource);
      expect(mapService['routeSources']['graphhopper']).toBeInstanceOf(
        VectorSource,
      );
    });
  });

  describe('initMap', () => {
    const container = document.createElement('div');
    const styles = { scaleLine: 'scale-line', zoom: 'zoom' };

    it('initializes map with correct parameters', async () => {
      const map = await mapService.initMap({ container, styles });

      expect(map).toBeDefined();
      expect(map.getTarget()).toBe(container);
      expect(map.getView().getCenter()).toEqual(DEFAULT_POSITION_COORDS);
    });

    it('on add feature renders markers giving them proper ids and emits coordinates', async () => {
      const map = await mapService.initMap({ container, styles });
      const markersLayer = map
        .getLayers()
        .getArray()
        .find(
          (l) => l.getProperties().name === 'markersLayer',
        ) as VectorLayer<VectorSource>;
      const source = markersLayer.getSource() as VectorSource;

      expect(source.getFeatures().length).toBe(0);

      source.addFeature(new Feature({ geometry: new Point([0, 0]) }));

      expect(source.getFeatures()[0].getId()).toBe('marker_start');

      source.addFeature(new Feature({ geometry: new Point([1, 1]) }));
      source.addFeature(new Feature({ geometry: new Point([2, 2]) }));

      const features = source.getFeatures();

      expect(features.length).toBe(3);

      // it will work only if we add features consecutively. Don't do it with addFeatures()
      expect(features[0].getId()).toBe('marker_start');
      expect(features[1].getId()).toBe('marker_middle_1');
      expect(features[1].getStyle()).toBe(interimMarkerStyle);
      expect(features[2].getId()).toBe('marker_end');
      expect(features[2].getStyle()).toBe(endMarkerStyle);

      // biome-ignore lint/suspicious/noTsIgnore: doesn't see a type of inherited method
      // @ts-ignore
      mapService.onEvent(
        COORDINATES_CHANGE_EVENT,
        (coordinates: Coordinate[]) => {
          expect(coordinates).toEqual([
            [0, 0],
            [1, 1],
          ]);
        },
      );
    });
  });

  describe('renderRoute method', () => {
    it('should clear existing routes and add new ones from the provided data', () => {
      const mockClear = vi.fn();
      const mockAddFeatures = vi.fn();
      VectorSource.prototype.clear = mockClear;
      VectorSource.prototype.addFeatures = mockAddFeatures;

      const mockData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [0, 0],
                [1, 1],
              ],
            },
          },
        ],
      };
      mapService.renderRoute({
        engine: 'graphhopper',
        data: { points: mockData },
      });

      expect(mockClear).toHaveBeenCalledTimes(1);
    });
  });
});
