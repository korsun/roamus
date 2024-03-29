import { apiService } from '@/services';

import { ProxyServerPayload } from '@common/types';

export const fetchRoute = async (payload: ProxyServerPayload) => {
  return await apiService.post({
    url: 'http://localhost:4000/api/routing',
    payload,
  });
};
