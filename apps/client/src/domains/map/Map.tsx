import s from './Map.module.css';
import { useMap } from './useMap';

export const Map = () => {
  const { mapRef } = useMap({ styles: s });

  return <div ref={mapRef} className={s.mapContainer} />;
};
