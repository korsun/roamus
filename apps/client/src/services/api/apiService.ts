import { Path } from '@common/schemas';

import { GraphHopperLimitError } from './apiErrors';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Params = {
  url: string;
  payload?: Dictionary<unknown>;
  queryParams?: Dictionary<string>;
  headers?: Dictionary<string>;
};

const makeRequest =
  (method: Method) =>
  async ({ url, payload, queryParams, headers }: Params): Promise<Path> => {
    try {
      const enrichedHeaders = { ...headers };
      const query = new URLSearchParams(queryParams).toString();
      const slash = url.endsWith('/') ? '' : '/';
      const questionMark = query ? '?' : '';
      const urlToFetch = `${url}${slash}${questionMark}${query}`;

      const options: RequestInit = {
        method,
        headers: enrichedHeaders,
      };

      if (method === 'GET') {
        // smth
      } else {
        options.body = JSON.stringify(payload);
        enrichedHeaders['Content-Type'] = 'application/json';
      }

      const response = await fetch(urlToFetch, options);

      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // For non-JSON responses, use the response text
        responseData = await response.text();
      }

      if (!response.ok && responseData) {
        if (urlToFetch.includes('graphhopper')) {
          throw new GraphHopperLimitError(
            responseData.message,
            response.status,
          );
        }

        throw new Error(responseData.message);
      }

      return await responseData;
    } catch (error) {
      /**
       * @todo normal logging
       */
      console.error(error);
      throw error;
    }
  };

export const apiService = {
  get: makeRequest('GET'),
  post: makeRequest('POST'),
};
