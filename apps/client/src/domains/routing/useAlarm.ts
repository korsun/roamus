import { useEffect } from 'react';

import { checkHealth } from '@/shared/services/api';
import { useStore } from '@/shared/services/store';

const TIMEOUT = 500;
// wake up server which sleeps after 15 min of inactivity on Render
export const useAlarm = () => {
  const { setServerAwake, isServerAwake } = useStore();

  useEffect(() => {
    if (isServerAwake) {
      return;
    }

    let isCancelled = false;

    Promise.race([
      new Promise((_resolve, reject) => setTimeout(reject, TIMEOUT)),
      checkHealth(),
    ])
      .catch(() => {
        if (isCancelled) {
          return;
        }
        setServerAwake(false);
        return checkHealth();
      })
      .then(
        () => {
          if (isCancelled) {
            return;
          }
          setServerAwake(true);
        },
        () => {
          if (isCancelled) {
            return;
          }
          setServerAwake(false);
        },
      );

    return () => {
      isCancelled = true;
    };
  }, [setServerAwake, isServerAwake]);
};
