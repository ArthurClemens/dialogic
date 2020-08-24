import { remaining } from 'dialogic';
import { UseRemainingProps, SharedUseRemainingProps } from '..';

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
  }, [exists]);

  return [value];
};
