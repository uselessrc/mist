import {useMemo} from 'react';

export const useMistId = (): string => {
  const id = useMemo(
    () => `mist_${Date.now()}_${Math.round(Math.random() * 100)}`,
    [],
  );

  return id;
};
