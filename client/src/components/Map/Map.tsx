import { useMap } from '@/hooks';

import s from './Map.module.css';

export const Map = () => {
  const { mapRef } = useMap();

  return <div ref={mapRef} className={s.mapContainer} />;
};
