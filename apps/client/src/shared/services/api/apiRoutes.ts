import { ProxyServerPayload } from '@common/schemas/routing';

import { apiService } from '.';

export const fetchRoute = async (payload: ProxyServerPayload) => {
  return apiService.post({
    url: '/api/routing',
    payload,
  });
};

export const checkHealth = async () => {
  return apiService.get({
    url: '/api/health',
  });
};
