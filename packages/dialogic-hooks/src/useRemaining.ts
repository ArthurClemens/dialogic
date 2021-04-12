import { remaining } from 'dialogic';

import type { SharedUseRemainingProps, UseRemainingProps } from './types';

export const useRemainingShared = ({
  useState,
  useMemo,
  instance,
  id,
  spawn,
  roundToSeconds,
}: SharedUseRemainingProps & UseRemainingProps) => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const identity = {
    id,
    spawn,
  };
  const exists = !!instance.exists(identity);
  useMemo(() => {
    if (exists) {
      remaining({
        ...identity,
        instance,
        roundToSeconds,
        callback: newValue => {
          setValue(newValue);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exists]);

  return [value];
};
