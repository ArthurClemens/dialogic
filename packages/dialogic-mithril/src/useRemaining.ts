import { remaining } from "dialogic";
import type { UseRemainingProps } from "dialogic-hooks";
import { useMemo, useState } from "mithril-hooks";

export const useRemaining = ({
  instance,
  id,
  spawn,
  roundToSeconds,
}: UseRemainingProps) => {
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
        callback: (newValue) => {
          setValue(newValue);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exists]);

  return [value];
};
