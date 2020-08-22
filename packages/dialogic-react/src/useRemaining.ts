import { useState, useMemo } from 'react';
import { remaining } from 'dialogic';
import { UseRemaining } from '../index.d';

export const useRemaining: UseRemaining = props => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const exists = !!props.instance.exists();
  useMemo(() => {
    if (exists) {
      remaining({
        instance: props.instance,
        roundToSeconds: props.roundToSeconds,
        callback: newValue => {
          setValue(newValue);
        },
      });
    }
  }, [exists]);

  return [value];
};
