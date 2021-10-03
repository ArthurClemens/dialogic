import { remaining } from "dialogic";
import type { UseRemainingProps } from "dialogic-hooks";
import { useMemo, useState } from "react";
import useIsMounted from "react-is-mounted-hook";

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
  const setValue = (value: number | undefined) => {
    if (isMounted()) {
      _setValue(value);
    }
  };

  useMemo(() => {
    if (exists) {
      remaining({
        ...identity,
        instance,
        roundToSeconds,
        callback: (newValue) => {
          setValue(newValue);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exists]);

  return [value];
};
