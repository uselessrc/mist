import {useCallback, useRef} from 'react';

export const useThrottleCallback = <T extends (...args: any[]) => any>(
  cb: T,
  ms: number,
  deps: any[],
): T => {
  const moveThrottleTimer = useRef(0);

  return useCallback(
    (...args: any[]) => {
      if (moveThrottleTimer.current) {
        return;
      }

      let ret = cb(...args);

      moveThrottleTimer.current = setTimeout(() => {
        moveThrottleTimer.current = 0;
      }, ms);

      return ret;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cb, ms, ...deps],
  ) as T;
};
