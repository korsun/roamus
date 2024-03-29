import { ProxyServerPayload } from '@common/types';

import { apiService } from '@/services';

export const fetchRoute = async (payload: ProxyServerPayload) => {
  return apiService.post({
    url: 'http://localhost:4000/api/routing',
    payload,
  });
};
