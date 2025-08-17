import { FeatureLike } from 'ol/Feature';

export const sortMarkersById = (a: FeatureLike, b: FeatureLike) => {
  const aId = a.getId();
  const bId = b.getId();

  if (!aId || !bId) return 0;

  if (aId > bId) {
    return -1;
  }

  if (aId < bId) {
    return 1;
  }

  return 0;
};
