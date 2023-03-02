import { remaining } from 'dialogic';
import type { UseRemainingProps } from 'dialogic-hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function useIsMounted(): () => boolean {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return useCallback(() => ref.current, [ref]);
}

export const useRemaining = ({
  instance,
  id,
  spawn,
  roundToSeconds,
}: UseRemainingProps) => {
  const isMounted = useIsMounted();
  const [value, _setValue] = useState<number | undefined>(undefined);
  const identity = {
    id,
    spawn,
  };
  const exists = !!instance.exists(identity);
  const setValue = (newValue: number | undefined) => {
    if (isMounted()) {
      _setValue(newValue);
    }
  };

  useMemo(() => {
    if (exists) {
      remaining({
        ...identity,
        instance,
        roundToSeconds,
        callback: (newValue: number | undefined) => {
          setValue(newValue);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exists]);

  return [value];
};
