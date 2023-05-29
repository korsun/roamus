import { apiService } from '../../services/apiService'

export const fetchRoute = async (coordinates) =>
	await apiService.post({
		url: 'https://graphhopper.com/api/1/route',
		payload: {
			points: coordinates,
			details: ['road_class', 'surface'],
			vehicle: 'bike',
			points_encoded: false,
			instructions: false,
		}
	})
