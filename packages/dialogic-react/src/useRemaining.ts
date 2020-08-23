import { useState, useMemo } from 'react';
import { remaining } from 'dialogic';
import { UseRemaining } from '../index.d';

export const useRemaining: UseRemaining = props => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const identity = {
    id: props.id,
    spawn: props.spawn,
  };
  const exists = !!props.instance.exists(identity);
  useMemo(() => {
    if (exists) {
      remaining({
        ...identity,
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
