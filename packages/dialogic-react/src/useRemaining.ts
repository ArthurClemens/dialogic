import { useState, useRef, useEffect } from "react";
import { remaining, Dialogic } from "dialogic";

export type UseRemaining = ({ instance, roundToSeconds } : { instance: Dialogic.DialogicInstance, roundToSeconds: boolean }) => [number | undefined];

export const useRemaining: UseRemaining = props => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const didCancelRef = useRef(false);

  useEffect(
    () => {
      remaining({
        instance: props.instance,
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
