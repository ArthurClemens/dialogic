import React, { useState, FunctionComponent } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

type RemainingProps = {
  getRemaining: () => number;
}

export const Remaining: FunctionComponent<RemainingProps> = props => {
  const [displayValue, setDisplayValue] = useState();

  useAnimationFrame(() => {
    const remaining = props.getRemaining();
    if (remaining !== 0 && displayValue !== remaining) {
      setDisplayValue(Math.max(remaining, 0));
    } else {
      setDisplayValue(undefined);
    }
  });

  return (
    <span>
      {displayValue === undefined
        ? "0"
        : displayValue.toString()}
    </span>
  );

};
