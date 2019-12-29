import { useState, useRef, useEffect } from "react";
import { remaining, Dialogic } from "dialogic";

type UseRemainingFn = ({ instance, roundToSeconds } : { instance: Dialogic.DialogicInstance, roundToSeconds: boolean }) => [number | undefined];

export const useRemaining: UseRemainingFn = props => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const didCancelRef = useRef(false);

  useEffect(
    () => {
      remaining({
        getRemaining: props.instance.getRemaining,
        exists: () => props.instance.exists(),
        roundToSeconds: props.roundToSeconds,
        callback: (newValue) => {
          if (!didCancelRef.current) {
            setValue(newValue)
          }
        },
      });

      return () => {
        didCancelRef.current = true;
      }
    },
    []
  );
  
  return [value];
};
