import { Dialogic, remaining } from 'dialogic';

import type { TUseMemo, TUseState } from './types';

type SharedUseRemainingProps = {
  useMemo: TUseMemo;
  useState: TUseState;
};

type UseRemainingProps = {
  instance: Dialogic.DialogicInstance;
  id?: string;
  spawn?: string;
  roundToSeconds?: boolean;
};

export const sharedUseRemaining = ({
  useState,
  useMemo,
}: SharedUseRemainingProps) => (props: UseRemainingProps) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exists]);

  return [value];
};
