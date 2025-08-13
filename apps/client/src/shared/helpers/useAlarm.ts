import { useEffect } from 'react';

import { checkHealth } from '@/services/api';
import { useStore } from '@/services/store/useStore';

const TIMEOUT = 500;
// wake up server which sleeps after 15 min of inactivity on Render
export const useAlarm = () => {
  const { setServerAwake, isServerAwake } = useStore();

  useEffect(() => {
    if (isServerAwake) {
      return;
    }

    Promise.race([
      new Promise((_resolve, reject) => setTimeout(reject, TIMEOUT)),
      checkHealth(),
    ])
      .catch(() => {
        setServerAwake(false);
        return checkHealth();
      })
      .then(
        () => {
          setServerAwake(true);
        },
        () => {
          setServerAwake(false);
        },
      );
  }, [setServerAwake, isServerAwake]);
};
