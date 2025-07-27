import { ProxyServerPayload } from '@common/types';

import { apiService } from '@/services';

export const fetchRoute = async (payload: ProxyServerPayload) => {
  return apiService.post({
    url: `${import.meta.env.VITE_API_BASE_URL}/api/routing`,
    payload,
  });
};
