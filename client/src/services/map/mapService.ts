import Map from 'ol/Map';
// import OSM from 'ol/source/OSM.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import View from 'ol/View';
import { useGeographic } from 'ol/proj';
import {
  Draw,
  Modify,
  Snap,
  defaults as defaultInteractions,
} from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';
import { Attribution, ScaleLine, Zoom } from 'ol/control';
import { Point } from 'ol/geom';
import { Path } from '@common/types';

import {
  EventEmitter,
  ROUTE_LINE_STYLES,
  endMarkerStyle,
  getCurrentPosition,
  getRetinaMod,
  interimMarkerStyle,
  sortMarkersById,
  startMarkerStyle,
} from '@/helpers';

type InitMapParams = {
  container: HTMLDivElement | undefined;
  styles: Dictionary<string>;
};

export class MapService extends EventEmitter {
  public map: Map | undefined;
  private markersSource: VectorSource;
  private routeSource: VectorSource;
  public route: Path | undefined;

  constructor() {
    super();
    this.markersSource = new VectorSource();
    this.routeSource = new VectorSource();
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
    const routeLayer = new VectorLayer({
      properties: {
        name: 'routeLayer',
      },
      source: this.routeSource,
      style: ROUTE_LINE_STYLES,
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
        // 		url: `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}${getRetinaMod()}.png?key=${process.env.MAPTILER_API_KEY}`,
        // 		tilePixelRatio: isRetina ? 2 : 1,
        // 	}),
        // }),
        new TileLayer({
          source: new XYZ({
            attributions: '&copy; OpenCycleMap',
            url: `https://tile.thunderforest.com/cycle/{z}/{x}/{y}${getRetinaMod()}.png?apikey=${process.env.THUNDERFOREST_API_KEY}`,
            tilePixelRatio: isRetina ? 2 : 1,
          }),
        }),
        routeLayer,
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

  public cleanMap() {
    this.routeSource.clear();
    this.markersSource.clear();
  }

  public getMarkersSource() {
    return this.markersSource;
  }

  public getRouteSource() {
    return this.routeSource;
  }

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
            m.setId('marker_middle_' + i);
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

      this.emit('coordinatesChange', coordinates);
    }
  };

  public renderRoute = (data: Path) => {
    this.routeSource.clear();
    this.routeSource.addFeatures(new GeoJSON().readFeatures(data.points));
  };
}
