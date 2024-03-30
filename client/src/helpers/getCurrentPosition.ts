import { DEFAULT_POSITION_COORDS } from './constants';

const getGeolocationPromisified = function (options?: PositionOptions) {
  return new Promise(function (
    resolve: PositionCallback,
    reject: PositionErrorCallback,
  ) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export const getCurrentPosition = async () => {
  let currentPosition = DEFAULT_POSITION_COORDS;

  try {
    const { coords } = await getGeolocationPromisified();
    currentPosition = [coords.longitude, coords.latitude];
  } catch (err) {
    /**
     * @todo log
     */
    console.error(err);
  }

  return currentPosition;
};
