import { GRAPHHOPER_API_KEY } from '../helpers/constants'

type Method =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'

type Params = {
	url: string,
	payload?: Dictionary<unknown>,
	queryParams?: Dictionary<string>,
	headers?: Dictionary<string>,
}

const makeRequest = (method: Method) => async ({ url, payload, queryParams, headers }: Params) => {
	try {
		const enrichedHeaders = { ...headers }
		const query = new URLSearchParams({
			key: GRAPHHOPER_API_KEY,
			...queryParams
		}).toString()
		const slash = url.endsWith('/') ? '' : '/'
		const urlToFetch = `${url}${slash}?${query}`

		const options: RequestInit = {
			method,
			headers: enrichedHeaders,
		}

		if (method === 'GET') {
			// smth
		} else {
			options.body = JSON.stringify(payload)
			enrichedHeaders['Content-Type'] = 'application/json'
		}

		const response = await fetch(urlToFetch, options)
		const json = await response.json()

		if (!response.ok) {
			throw new Error(json.message)
		}

		return await json
	} catch (error) {
		/**
		 * @todo normal logging
		 */
		console.error(error)
		throw error
	}
}

export const apiService = {
	get: makeRequest('GET'),
	post: makeRequest('POST'),
}