import { useState, useRef, useEffect } from 'react';
import { remaining } from 'dialogic';
import { UseRemaining } from '../index.d';

export const useRemaining: UseRemaining = props => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const didCancelRef = useRef(false);

  useEffect(() => {
    remaining({
      instance: props.instance,
      roundToSeconds: props.roundToSeconds,
      callback: newValue => {
        if (!didCancelRef.current) {
          setValue(newValue);
        }
      },
    });

    return () => {
      didCancelRef.current = true;
    };
  }, []);

  return [value];
};
