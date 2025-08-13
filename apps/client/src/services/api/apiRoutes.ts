import { ProxyServerPayload } from '@common/schemas/routing';

import { apiService } from '@/services';

export const fetchRoute = async (payload: ProxyServerPayload) => {
  return apiService.post({
    url: '/api/routing',
    payload,
  });
};
