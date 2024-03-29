const getGeolocationPromisified = function (options?: PositionOptions) {
	return new Promise(function (resolve: PositionCallback, reject: PositionErrorCallback) {
		navigator.geolocation.getCurrentPosition(resolve, reject, options)
	})
}

export const getCurrentPosition = async () => {
	let currentPosition = [16.424632, 45.750721]

	try {
		const { coords } = await getGeolocationPromisified()
		currentPosition = [coords.longitude, coords.latitude]
	} catch (err) {
		/**
		 * @todo log
		 */
		console.error(err)
	}

	return currentPosition
}
