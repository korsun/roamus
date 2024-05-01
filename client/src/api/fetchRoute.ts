import { ProxyServerPayload } from '@common/types';

import { apiService } from '@/services';

export const fetchRoute = async (payload: ProxyServerPayload) => {
  return apiService.post({
    url: `${process.env.API_BASE_URL}/api/routing`,
    payload,
  });
};
