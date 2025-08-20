import type { Engine, Path } from '@common/schemas/routing';
import { Attribution, ScaleLine, Zoom } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import type { Point } from 'ol/geom';
import {
  Draw,
  defaults as defaultInteractions,
  Modify,
  Snap,
} from 'ol/interaction';
// import OSM from 'ol/source/OSM.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import { useGeographic } from 'ol/proj';
import { Vector as VectorSource, XYZ } from 'ol/source';
import View from 'ol/View';
import { getRetinaMod } from '@/shared/helpers';
import {
  COORDINATES_CHANGE_EVENT,
  EventEmitter,
  type MapEvents,
} from '@/shared/services/emitter';

import {
  endMarkerStyle,
  getCurrentPosition,
  interimMarkerStyle,
  sortMarkersById,
  startMarkerStyle,
} from './helpers';

type InitMapParams = {
  container: HTMLDivElement | undefined;
  styles: Dictionary<string>;
};

export class MapService extends EventEmitter<MapEvents> {
  public map: Map | undefined;
  private markersSource: VectorSource;
  private routeSources: Record<Engine, VectorSource>;
  public route: Path | undefined;

  constructor() {
    super();
    this.markersSource = new VectorSource();
    this.routeSources = {
      openrouteservice: new VectorSource(),
      graphhopper: new VectorSource(),
    };
    this.map = undefined;
    this.route = undefined;
  }

  public initMap = async ({ container, styles }: InitMapParams) => {
    useGeographic();

    const isRetina = Boolean(getRetinaMod());
    const center = await getCurrentPosition();
    const markersLayer = new VectorLayer({
      properties: {
        name: 'markersLayer',
      },
      source: this.markersSource,
      style: startMarkerStyle,
    });
    const openrouteserviceLayer = new VectorLayer({
      properties: {
        name: 'openrouteserviceLayer',
      },
      source: this.routeSources['openrouteservice'],
      style: {
        'stroke-color': 'rgba(255, 0, 0, 0.5)',
        'stroke-width': 5,
      },
    });
    const graphhopperLayer = new VectorLayer({
      properties: {
        name: 'graphhopperLayer',
      },
      source: this.routeSources['graphhopper'],
      style: {
        'stroke-color': 'rgba(0, 0, 255, 0.5)',
        'stroke-width': 5,
      },
    });
    const draw = new Draw({
      source: this.markersSource,
      type: 'Point',
      style: {
        'fill-color': 'none',
      },
      condition: (e) => {
        let shouldBeDrawn = true;

        map.forEachFeatureAtPixel(
          e.pixel,
          () => {
            shouldBeDrawn = false;
          },
          {
            layerFilter: (l) => l === markersLayer,
          },
        );
        return shouldBeDrawn;
      },
    });

    const modify = new Modify({ source: this.markersSource });
    const snap = new Snap({ source: this.markersSource });

    const map = new Map({
      layers: [
        // new TileLayer({
        // 	source: new OSM(),
        // }),
        // new TileLayer({
        // 	source: new XYZ({
        // 		attributions: '&copy; MapTiler',
        // 		url: `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}${getRetinaMod()}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
        // 		tilePixelRatio: isRetina ? 2 : 1,
        // 	}),
        // }),
        new TileLayer({
          source: new XYZ({
            attributions: '&copy; OpenCycleMap',
            url: `https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`,
            tilePixelRatio: isRetina ? 2 : 1,
          }),
        }),
        openrouteserviceLayer,
        graphhopperLayer,
        markersLayer,
      ],
      interactions: defaultInteractions().extend([draw, modify, snap]),
      controls: [
        new ScaleLine({
          className: styles.scaleLine,
        }),
        new Zoom({
          className: styles.zoom,
        }),
        new Attribution(),
      ],
      target: container,
      view: new View({
        center,
        zoom: 15,
      }),
    });

    this.setMarkersRendering();
    modify.on('modifyend', this.calculateRoute);
    this.map = map;

    return map;
  };

  public cleanMap = () => {
    for (const name in this.routeSources) {
      this.routeSources[name as Engine].clear();
    }
    this.markersSource.clear();
  };

  public cleanRoute = (engine: Engine) => {
    this.routeSources[engine].clear();
  };

  public getMarkersSource = () => {
    return this.markersSource;
  };

  public getRouteSource = (engine: Engine) => {
    return this.routeSources[engine];
  };

  private setMarkersRendering() {
    this.markersSource.on('addfeature', (e) => {
      const markers = this.markersSource.getFeatures();

      if (markers.length === 1) {
        e.feature?.setId('marker_start');
      } else {
        e.feature?.setId('marker_end');
        e.feature?.setStyle(endMarkerStyle);
        markers.forEach((m, i) => {
          if (i !== 0 && i !== markers.length - 1) {
            m.setId(`marker_middle_${i}`);
            m.setStyle(interimMarkerStyle);
          }

          if (i === markers.length - 1) {
            m.setId('marker_end');
            m.setStyle(endMarkerStyle);
          }
        });
      }
      this.calculateRoute();
    });
  }

  private calculateRoute = () => {
    const markers = this.markersSource.getFeatures();

    if (markers.length >= 2) {
      const coordinates = markers
        .sort(sortMarkersById)
        .map((f) => (f.getGeometry() as Point).getCoordinates());

      this.emit(COORDINATES_CHANGE_EVENT, coordinates);
    }
  };

  public renderRoute = ({ engine, data }: { engine: Engine; data: Path }) => {
    this.routeSources[engine].clear();
    this.routeSources[engine].addFeatures(
      new GeoJSON().readFeatures(data.points),
    );
  };
}
